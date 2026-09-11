import asyncio
import hashlib
import hmac
import json
import logging
from unittest.mock import AsyncMock, MagicMock

import httpx
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.api.v1 import instagram, orders, payments, whatsapp
from app.core.config import Settings
from app.core.dependencies import get_current_user
from app.main import app


client = TestClient(app)


def customer_user(whatsapp_opt_in=None):
    user = {
        "auth": {"id": "customer-1"},
        "profile": {
            "id": "customer-1",
            "role": "user",
            "is_active": True,
            "name": "Primary Name",
            "full_name": "Legacy Name",
            "phone": "919876543210",
        },
        "access_token": "synthetic-customer-token",
    }
    if whatsapp_opt_in is not None:
        user["profile"]["whatsapp_opt_in"] = whatsapp_opt_in
    return user


def admin_user():
    return {
        "auth": {"id": "admin-1"},
        "profile": {"id": "admin-1", "role": "admin", "is_active": True},
        "access_token": "synthetic-admin-token",
    }


def shipping_address():
    return {
        "full_name": "Primary Name",
        "phone": "919876543210",
        "line1": "123 Test Street",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560001",
        "country": "India",
    }


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


def test_order_create_does_not_send_whatsapp(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    monkeypatch.setattr(
        orders.PaymentService,
        "create_payment_order",
        staticmethod(lambda **_kwargs: {"razorpay_order_id": "order_test_1"}),
    )
    text_sender = AsyncMock()
    template_sender = AsyncMock()
    monkeypatch.setattr(whatsapp, "send_whatsapp_message", text_sender)
    monkeypatch.setattr(whatsapp, "send_order_confirmation_template", template_sender)

    response = client.post(
        "/api/v1/orders/create",
        json={"shipping_address": shipping_address()},
    )

    assert response.status_code == 201
    text_sender.assert_not_awaited()
    template_sender.assert_not_awaited()


def _mock_successful_payment(monkeypatch):
    monkeypatch.setattr(
        payments.PaymentService,
        "verify_payment_and_finalize",
        staticmethod(
            lambda **_kwargs: {
                "id": "order-1",
                "payment_status": "paid",
                "total_amount": 2499.0,
            }
        ),
    )


def _verify_payment_request():
    return {
        "razorpay_order_id": "order_test_1",
        "razorpay_payment_id": "pay_test_1",
        "razorpay_signature": "synthetic-signature",
    }


def test_successful_payment_attempts_template_confirmation(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: customer_user(True)
    _mock_successful_payment(monkeypatch)
    sender = AsyncMock(return_value={"messages": [{"id": "wamid.1"}]})
    monkeypatch.setattr(payments, "send_order_confirmation_template", sender)

    response = client.post("/api/v1/payments/verify", json=_verify_payment_request())

    assert response.status_code == 200
    assert response.json()["data"]["payment_status"] == "paid"
    sender.assert_awaited_once_with(
        phone="919876543210",
        customer_name="Primary Name",
        order_id="order-1",
        amount="2499.00",
    )


def test_whatsapp_failure_does_not_fail_payment(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: customer_user(True)
    _mock_successful_payment(monkeypatch)
    monkeypatch.setattr(
        payments,
        "send_order_confirmation_template",
        AsyncMock(side_effect=whatsapp.WhatsAppProviderError("safe failure")),
    )

    response = client.post("/api/v1/payments/verify", json=_verify_payment_request())

    assert response.status_code == 200
    assert response.json()["data"]["payment_status"] == "paid"


def test_missing_automatic_template_is_non_blocking(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: customer_user(True)
    _mock_successful_payment(monkeypatch)
    monkeypatch.setattr(payments, "send_order_confirmation_template", AsyncMock(
        side_effect=whatsapp.WhatsAppTemplateConfigurationError("not configured")
    ))

    response = client.post("/api/v1/payments/verify", json=_verify_payment_request())

    assert response.status_code == 200
    assert response.json()["data"]["payment_status"] == "paid"


def test_order_confirmation_template_parameter_order(monkeypatch):
    sender = AsyncMock(return_value={"messages": [{"id": "wamid.1"}]})
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_ENABLED", True)
    monkeypatch.setattr(
        whatsapp.settings,
        "WHATSAPP_ORDER_CONFIRMATION_TEMPLATE",
        "order_confirmation",
    )
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_TEMPLATE_LANGUAGE", "en_US")
    monkeypatch.setattr(whatsapp, "send_template_message", sender)

    asyncio.run(
        whatsapp.send_order_confirmation_template(
            "919876543210", "Ananya", "order-1", "2499.00"
        )
    )

    sender.assert_awaited_once_with(
        to="919876543210",
        template_name="order_confirmation",
        language="en_US",
        components=[
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": "Ananya"},
                    {"type": "text", "text": "order-1"},
                    {"type": "text", "text": "2499.00"},
                ],
            }
        ],
    )


def test_shipping_template_parameter_order(monkeypatch):
    sender = AsyncMock(return_value={"messages": [{"id": "wamid.2"}]})
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_ENABLED", True)
    monkeypatch.setattr(
        whatsapp.settings,
        "WHATSAPP_SHIPPING_UPDATE_TEMPLATE",
        "shipping_update",
    )
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_TEMPLATE_LANGUAGE", "en_US")
    monkeypatch.setattr(whatsapp, "send_template_message", sender)

    asyncio.run(
        whatsapp.send_shipping_update_template(
            "919876543210", "Ananya", "order-1", "tracking-1"
        )
    )

    sender.assert_awaited_once_with(
        to="919876543210",
        template_name="shipping_update",
        language="en_US",
        components=[
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": "Ananya"},
                    {"type": "text", "text": "order-1"},
                    {"type": "text", "text": "tracking-1"},
                ],
            }
        ],
    )


def test_admin_order_confirmation_reports_missing_template(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_ORDER_CONFIRMATION_TEMPLATE", "")

    response = client.post(
        "/api/v1/whatsapp/send-order-confirmation",
        params={
            "order_id": "order-1",
        },
    )

    assert response.status_code == 503
    assert response.json()["message"] == (
        "WHATSAPP_ORDER_CONFIRMATION_TEMPLATE is not configured"
    )


def test_admin_shipping_reports_missing_template(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_SHIPPING_UPDATE_TEMPLATE", "")

    response = client.post(
        "/api/v1/whatsapp/send-shipping-notification",
        params={
            "order_id": "order-1",
        },
    )

    assert response.status_code == 503
    assert response.json()["message"] == (
        "WHATSAPP_SHIPPING_UPDATE_TEMPLATE is not configured"
    )


def test_enabled_production_whatsapp_requires_approved_templates():
    with pytest.raises(ValidationError) as exc:
        Settings(
            _env_file=None,
            APP_ENV="production",
            DEBUG=False,
            SUPABASE_URL="https://example.supabase.co",
            SUPABASE_SERVICE_ROLE_KEY="synthetic-service-role",
            SUPABASE_ANON_KEY="synthetic-anon",
            SUPABASE_DB_SCHEMA="public",
            JWT_SECRET="synthetic-jwt",
            CLOUDINARY_CLOUD_NAME="synthetic-cloud",
            CLOUDINARY_API_KEY="synthetic-cloud-key",
            CLOUDINARY_API_SECRET="synthetic-cloud-secret",
            PAYMENTS_ENABLED=False,
            RAZORPAY_ENABLED=False,
            WHATSAPP_ENABLED=True,
            WHATSAPP_PHONE_NUMBER_ID="synthetic-phone-id",
            WHATSAPP_BUSINESS_ACCOUNT_ID="synthetic-business-id",
            WHATSAPP_ACCESS_TOKEN="synthetic-whatsapp-token",
            WHATSAPP_WEBHOOK_VERIFY_TOKEN="synthetic-whatsapp-verify-token",
            WHATSAPP_APP_SECRET="synthetic-whatsapp-app-secret",
            WHATSAPP_ORDER_CONFIRMATION_TEMPLATE="",
            WHATSAPP_SHIPPING_UPDATE_TEMPLATE="",
            WHATSAPP_TEMPLATE_LANGUAGE="en_US",
            INSTAGRAM_ENABLED=False,
        )

    error = str(exc.value)
    assert "WHATSAPP_ORDER_CONFIRMATION_TEMPLATE" in error
    assert "WHATSAPP_SHIPPING_UPDATE_TEMPLATE" in error


class FakeMetaResponse:
    def __init__(self, payload=None, status_code=200):
        self._payload = payload or {"data": []}
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            request = httpx.Request("GET", "https://graph.instagram.com/v25.0/test")
            response = httpx.Response(
                self.status_code,
                request=request,
                content=b"provider-internal-payload",
            )
            raise httpx.HTTPStatusError("provider failure", request=request, response=response)

    def json(self):
        return self._payload


class FakeAsyncClient:
    def __init__(self, response, calls, **_kwargs):
        self.response = response
        self.calls = calls

    async def __aenter__(self):
        return self

    async def __aexit__(self, *_args):
        return None

    async def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        return self.response

    async def post(self, url, **kwargs):
        return await self.request("POST", url, **kwargs)


def test_whatsapp_provider_error_does_not_leak_token_or_body(monkeypatch, caplog):
    calls = []
    response = FakeMetaResponse(status_code=500)
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_ENABLED", True)
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_API_VERSION", "v25.0")
    monkeypatch.setattr(
        whatsapp.settings,
        "WHATSAPP_PHONE_NUMBER_ID",
        "synthetic-phone-id",
    )
    monkeypatch.setattr(
        whatsapp.settings,
        "WHATSAPP_ACCESS_TOKEN",
        "synthetic-whatsapp-token",
    )
    monkeypatch.setattr(
        whatsapp.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(response, calls, **kwargs),
    )

    with caplog.at_level(logging.WARNING), pytest.raises(
        whatsapp.WhatsAppProviderError
    ) as exc:
        asyncio.run(whatsapp.send_whatsapp_message("919876543210", "Hello"))

    combined_output = caplog.text + str(exc.value)
    assert "synthetic-whatsapp-token" not in combined_output
    assert "provider-internal-payload" not in combined_output


def test_instagram_graph_requests_use_instagram_host_and_bearer_token(monkeypatch):
    calls = []
    response = FakeMetaResponse({"recipient_id": "customer-instagram-id"})
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_ENABLED", True)
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_API_VERSION", "v25.0")
    monkeypatch.setattr(
        instagram.settings,
        "INSTAGRAM_BUSINESS_ACCOUNT_ID",
        "instagram-business-id",
    )
    monkeypatch.setattr(
        instagram.settings,
        "INSTAGRAM_ACCESS_TOKEN",
        "synthetic-instagram-token",
    )
    monkeypatch.setattr(
        instagram.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(response, calls, **kwargs),
    )

    asyncio.run(instagram.send_instagram_reply("customer-instagram-id", "Hello"))

    method, url, kwargs = calls[0]
    assert method == "POST"
    assert url == (
        "https://graph.instagram.com/v25.0/instagram-business-id/messages"
    )
    assert "graph.facebook.com" not in url
    assert kwargs["headers"]["Authorization"] == "Bearer synthetic-instagram-token"
    assert "access_token" not in (kwargs.get("params") or {})


def test_instagram_media_uses_login_api_without_query_token(monkeypatch):
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_ENABLED", True)
    monkeypatch.setattr(
        instagram.settings,
        "INSTAGRAM_BUSINESS_ACCOUNT_ID",
        "instagram-business-id",
    )
    api_request = AsyncMock(return_value={"data": [{"id": "media-1"}]})
    monkeypatch.setattr(instagram, "_instagram_api_request", api_request)

    response = client.get("/api/v1/instagram/media?limit=3")

    assert response.status_code == 200
    assert response.json()["data"] == [{"id": "media-1"}]
    api_request.assert_awaited_once_with(
        "GET",
        "instagram-business-id/media",
        params={
            "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
            "limit": 3,
        },
    )


def test_instagram_disabled_media_is_safe(monkeypatch):
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_ENABLED", False)
    api_request = AsyncMock()
    monkeypatch.setattr(instagram, "_instagram_api_request", api_request)

    response = client.get("/api/v1/instagram/media")

    assert response.status_code == 200
    assert response.json() == {"success": True, "data": []}
    api_request.assert_not_awaited()


def test_instagram_echo_dm_is_not_replied_to(monkeypatch):
    secret = "synthetic-instagram-app-secret"
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_ENABLED", True)
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_APP_SECRET", secret)
    monkeypatch.setattr(
        instagram.settings,
        "INSTAGRAM_BUSINESS_ACCOUNT_ID",
        "instagram-business-id",
    )
    sender = AsyncMock()
    repository = MagicMock()
    monkeypatch.setattr(instagram, "send_instagram_reply", sender)
    monkeypatch.setattr(instagram, "PaymentRepository", repository)
    payload = {
        "object": "instagram",
        "entry": [
            {
                "id": "instagram-business-id",
                "messaging": [
                    {
                        "sender": {"id": "instagram-business-id"},
                        "message": {
                            "mid": "echo-1",
                            "text": "Outbound echo",
                            "is_echo": True,
                        },
                    }
                ],
            }
        ],
    }
    body = json.dumps(payload).encode()
    signature = "sha256=" + hmac.new(
        secret.encode(), body, hashlib.sha256
    ).hexdigest()

    response = client.post(
        "/api/v1/instagram/webhook",
        content=body,
        headers={"Content-Type": "application/json", "X-Hub-Signature-256": signature},
    )

    assert response.status_code == 200
    sender.assert_not_awaited()
    repository.reserve_webhook_event.assert_not_called()


def test_instagram_provider_error_does_not_leak_token_or_body(monkeypatch, caplog):
    calls = []
    response = FakeMetaResponse(status_code=500)
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_API_VERSION", "v25.0")
    monkeypatch.setattr(
        instagram.settings,
        "INSTAGRAM_ACCESS_TOKEN",
        "synthetic-instagram-token",
    )
    monkeypatch.setattr(
        instagram.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(response, calls, **kwargs),
    )

    with caplog.at_level(logging.WARNING), pytest.raises(
        instagram.InstagramProviderError
    ) as exc:
        asyncio.run(instagram._instagram_api_request("GET", "test"))

    combined_output = caplog.text + str(exc.value)
    assert "synthetic-instagram-token" not in combined_output
    assert "provider-internal-payload" not in combined_output


def test_comment_auto_reply_remains_disabled(monkeypatch):
    secret = "synthetic-instagram-app-secret"
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_ENABLED", True)
    monkeypatch.setattr(instagram.settings, "INSTAGRAM_APP_SECRET", secret)
    repository = MagicMock()
    repository.reserve_webhook_event.return_value = True
    reply = AsyncMock()
    monkeypatch.setattr(instagram, "PaymentRepository", repository)
    monkeypatch.setattr(instagram, "reply_to_comment", reply)
    payload = {
        "object": "instagram",
        "entry": [
            {
                "id": "instagram-business-id",
                "field": "comments",
                "value": {"id": "comment-1", "text": "Beautiful"},
            }
        ],
    }
    body = json.dumps(payload).encode()
    signature = "sha256=" + hmac.new(
        secret.encode(), body, hashlib.sha256
    ).hexdigest()

    response = client.post(
        "/api/v1/instagram/webhook",
        content=body,
        headers={"Content-Type": "application/json", "X-Hub-Signature-256": signature},
    )

    assert response.status_code == 200
    reply.assert_not_awaited()
    repository.mark_webhook_event_processed.assert_called_once_with(
        "instagram:comment:comment-1"
    )
