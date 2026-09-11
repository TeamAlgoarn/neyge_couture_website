from datetime import datetime
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.v1 import payments, whatsapp
from app.core.dependencies import get_current_user
from app.main import app
from app.schemas.auth import WhatsAppPreferenceRequest
from app.services.auth_service import AuthService
from app.services.payment_service import PaymentService


client = TestClient(app)


def customer_user(whatsapp_opt_in=None):
    profile = {
        "id": "customer-1",
        "role": "user",
        "is_active": True,
        "name": "Ananya",
        "phone": "+91 98765 43210",
    }
    if whatsapp_opt_in is not None:
        profile["whatsapp_opt_in"] = whatsapp_opt_in
    return {
        "auth": {"id": "customer-1"},
        "profile": profile,
        "access_token": "synthetic-customer-token",
    }


def admin_user():
    return {
        "auth": {"id": "admin-1"},
        "profile": {"id": "admin-1", "role": "admin", "is_active": True},
        "access_token": "synthetic-admin-token",
    }


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


class FakeProfileUpdateQuery:
    def __init__(self):
        self.payload = None
        self.matched_id = None

    def update(self, payload):
        self.payload = payload
        return self

    def eq(self, field, value):
        assert field == "id"
        self.matched_id = value
        return self

    def execute(self):
        return SimpleNamespace(data=[{"id": self.matched_id, **self.payload}])


class FakeProfileUpdateClient:
    def __init__(self):
        self.query = FakeProfileUpdateQuery()

    def table(self, table_name):
        assert table_name == "profiles"
        return self.query


def test_profile_migrations_default_existing_and_new_users_to_false():
    migration_paths = [
        Path("migrations/006_add_whatsapp_consent_to_profiles.sql"),
        Path("migrations/preview/002_add_whatsapp_consent_to_profiles.sql"),
    ]

    for migration_path in migration_paths:
        sql = migration_path.read_text(encoding="utf-8")
        assert "whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE" in sql
        assert "SET whatsapp_opt_in = FALSE" in sql
        assert "checkout" in sql and "profile" in sql and "admin_import" in sql


def test_customer_can_opt_in_with_timestamp_and_source(monkeypatch):
    fake_client = FakeProfileUpdateClient()
    monkeypatch.setattr("app.services.auth_service.get_supabase_admin", lambda: fake_client)

    result = AuthService.update_whatsapp_preference(
        WhatsAppPreferenceRequest(whatsapp_opt_in=True, source="profile"),
        customer_user(False),
    )

    assert fake_client.query.matched_id == "customer-1"
    assert result["whatsapp_opt_in"] is True
    assert result["whatsapp_opt_in_source"] == "profile"
    assert datetime.fromisoformat(result["whatsapp_opt_in_at"]).tzinfo is not None


def test_customer_can_revoke_consent_and_metadata_is_cleared(monkeypatch):
    fake_client = FakeProfileUpdateClient()
    monkeypatch.setattr("app.services.auth_service.get_supabase_admin", lambda: fake_client)

    result = AuthService.update_whatsapp_preference(
        WhatsAppPreferenceRequest(whatsapp_opt_in=False, source="checkout"),
        customer_user(True),
    )

    assert result["whatsapp_opt_in"] is False
    assert result["whatsapp_opt_in_at"] is None
    assert result["whatsapp_opt_in_source"] is None


def test_repeated_opt_in_preserves_original_audit_metadata():
    current_user = customer_user(True)
    current_user["profile"].update(
        {
            "whatsapp_opt_in_at": "2026-09-11T08:00:00+00:00",
            "whatsapp_opt_in_source": "profile",
        }
    )

    result = AuthService.update_whatsapp_preference(
        WhatsAppPreferenceRequest(whatsapp_opt_in=True, source="checkout"),
        current_user,
    )

    assert result["whatsapp_opt_in_at"] == "2026-09-11T08:00:00+00:00"
    assert result["whatsapp_opt_in_source"] == "profile"


def test_preference_endpoint_updates_only_authenticated_profile(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: customer_user(False)
    fake_client = FakeProfileUpdateClient()
    monkeypatch.setattr("app.services.auth_service.get_supabase_admin", lambda: fake_client)

    response = client.patch(
        "/api/v1/auth/preferences",
        json={"whatsapp_opt_in": True, "source": "checkout"},
    )

    assert response.status_code == 200
    assert fake_client.query.matched_id == "customer-1"


def test_preference_endpoint_rejects_attempt_to_target_another_user():
    app.dependency_overrides[get_current_user] = lambda: customer_user(False)

    response = client.patch(
        "/api/v1/auth/preferences",
        json={
            "whatsapp_opt_in": True,
            "source": "profile",
            "user_id": "another-user",
        },
    )

    assert response.status_code == 422


@pytest.mark.parametrize("invalid_source", ["marketing", "admin_import", "unknown"])
def test_customer_preference_endpoint_rejects_invalid_source(invalid_source):
    app.dependency_overrides[get_current_user] = lambda: customer_user(False)

    response = client.patch(
        "/api/v1/auth/preferences",
        json={"whatsapp_opt_in": True, "source": invalid_source},
    )

    assert response.status_code == 422


def test_preference_endpoint_requires_a_real_boolean():
    app.dependency_overrides[get_current_user] = lambda: customer_user(False)

    response = client.patch(
        "/api/v1/auth/preferences",
        json={"whatsapp_opt_in": "yes", "source": "profile"},
    )

    assert response.status_code == 422


@pytest.mark.parametrize("opt_in", [False, True])
def test_checkout_order_creation_is_independent_of_whatsapp_consent(monkeypatch, opt_in):
    app.dependency_overrides[get_current_user] = lambda: customer_user(opt_in)
    creator = MagicMock(return_value={"razorpay_order_id": "order_test_1"})
    monkeypatch.setattr(PaymentService, "create_payment_order", creator)

    response = client.post(
        "/api/v1/orders/create",
        json={
            "shipping_address": {
                "full_name": "Ananya",
                "phone": "+91 98765 43210",
                "line1": "123 Test Street",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postal_code": "560001",
                "country": "India",
            }
        },
    )

    assert response.status_code == 201
    creator.assert_called_once()


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


def _verify_payload():
    return {
        "razorpay_order_id": "order_test_1",
        "razorpay_payment_id": "pay_test_1",
        "razorpay_signature": "synthetic-signature",
    }


@pytest.mark.parametrize("opt_in", [None, False])
def test_payment_success_skips_whatsapp_without_explicit_consent(monkeypatch, opt_in):
    app.dependency_overrides[get_current_user] = lambda: customer_user(opt_in)
    _mock_successful_payment(monkeypatch)
    sender = AsyncMock()
    monkeypatch.setattr(payments, "send_order_confirmation_template", sender)

    response = client.post("/api/v1/payments/verify", json=_verify_payload())

    assert response.status_code == 200
    assert response.json()["data"]["payment_status"] == "paid"
    sender.assert_not_awaited()


def test_payment_success_attempts_whatsapp_for_explicit_opt_in(monkeypatch):
    app.dependency_overrides[get_current_user] = lambda: customer_user(True)
    _mock_successful_payment(monkeypatch)
    sender = AsyncMock(return_value={"status": "ok"})
    monkeypatch.setattr(payments, "send_order_confirmation_template", sender)

    response = client.post("/api/v1/payments/verify", json=_verify_payload())

    assert response.status_code == 200
    sender.assert_awaited_once()


def _profile_query(profile):
    query = MagicMock()
    query.select.return_value = query
    query.eq.return_value = query
    query.limit.return_value = query
    query.execute.return_value = SimpleNamespace(data=[profile] if profile else [])
    client_mock = MagicMock()
    client_mock.table.return_value = query
    return client_mock


def _enable_whatsapp_templates(monkeypatch):
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_ENABLED", True)
    monkeypatch.setattr(
        whatsapp.settings, "WHATSAPP_ORDER_CONFIRMATION_TEMPLATE", "order_confirmation"
    )
    monkeypatch.setattr(
        whatsapp.settings, "WHATSAPP_SHIPPING_UPDATE_TEMPLATE", "shipping_update"
    )
    monkeypatch.setattr(whatsapp.settings, "WHATSAPP_TEMPLATE_LANGUAGE", "en_US")


def test_shipping_notification_is_blocked_without_stored_consent(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    _enable_whatsapp_templates(monkeypatch)
    monkeypatch.setattr(
        whatsapp.OrderRepository,
        "get_by_id",
        staticmethod(
            lambda _order_id: {
                "id": "order-1",
                "user_id": "customer-1",
                "tracking_number": "track-1",
            }
        ),
    )
    monkeypatch.setattr(
        whatsapp,
        "get_supabase_admin",
        lambda: _profile_query(
            {
                "id": "customer-1",
                "name": "Ananya",
                "phone": "+91 98765 43210",
                "whatsapp_opt_in": False,
            }
        ),
    )
    sender = AsyncMock()
    monkeypatch.setattr(whatsapp, "send_shipping_update_template", sender)

    response = client.post(
        "/api/v1/whatsapp/send-shipping-notification",
        params={"order_id": "order-1"},
    )

    assert response.status_code == 409
    assert response.json()["message"] == (
        "Customer has not opted in to WhatsApp order notifications"
    )
    sender.assert_not_awaited()


def test_admin_shipping_uses_stored_phone_and_tracking_data(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    _enable_whatsapp_templates(monkeypatch)
    monkeypatch.setattr(
        whatsapp.OrderRepository,
        "get_by_id",
        staticmethod(
            lambda _order_id: {
                "id": "order-1",
                "user_id": "customer-1",
                "tracking_number": "stored-track-1",
            }
        ),
    )
    monkeypatch.setattr(
        whatsapp,
        "get_supabase_admin",
        lambda: _profile_query(
            {
                "id": "customer-1",
                "name": "Ananya",
                "phone": "+91 98765 43210",
                "whatsapp_opt_in": True,
            }
        ),
    )
    sender = AsyncMock(return_value={"status": "ok"})
    monkeypatch.setattr(whatsapp, "send_shipping_update_template", sender)

    response = client.post(
        "/api/v1/whatsapp/send-shipping-notification",
        params={
            "order_id": "order-1",
            "phone": "0000000000",
            "tracking_id": "caller-track",
        },
    )

    assert response.status_code == 200
    sender.assert_awaited_once_with(
        phone="919876543210",
        customer_name="Ananya",
        order_id="order-1",
        tracking_id="stored-track-1",
    )


def test_admin_order_confirmation_cannot_override_stored_phone_or_amount(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    _enable_whatsapp_templates(monkeypatch)
    monkeypatch.setattr(
        whatsapp.OrderRepository,
        "get_by_id",
        staticmethod(
            lambda _order_id: {
                "id": "order-1",
                "user_id": "customer-1",
                "total_amount": 2499.0,
            }
        ),
    )
    monkeypatch.setattr(
        whatsapp,
        "get_supabase_admin",
        lambda: _profile_query(
            {
                "id": "customer-1",
                "name": "Ananya",
                "phone": "+91 98765 43210",
                "whatsapp_opt_in": True,
            }
        ),
    )
    sender = AsyncMock(return_value={"status": "ok"})
    monkeypatch.setattr(whatsapp, "send_order_confirmation_template", sender)

    response = client.post(
        "/api/v1/whatsapp/send-order-confirmation",
        params={
            "order_id": "order-1",
            "phone": "0000000000",
            "amount": "0.01",
        },
    )

    assert response.status_code == 200
    sender.assert_awaited_once_with(
        phone="919876543210",
        customer_name="Ananya",
        order_id="order-1",
        amount="2499.00",
    )


def test_phone_normalization_does_not_guess_country_code():
    assert whatsapp.normalize_whatsapp_phone("+91 (98765) 43210") == "919876543210"

    with pytest.raises(whatsapp.WhatsAppPhoneValidationError):
        whatsapp.normalize_whatsapp_phone("not-a-phone")


def test_legacy_profile_fails_closed_in_notification_context(monkeypatch):
    monkeypatch.setattr(
        whatsapp.OrderRepository,
        "get_by_id",
        staticmethod(lambda _order_id: {"id": "order-1", "user_id": "customer-1"}),
    )
    monkeypatch.setattr(
        whatsapp,
        "get_supabase_admin",
        lambda: _profile_query(
            {"id": "customer-1", "phone": "919876543210"}
        ),
    )

    with pytest.raises(HTTPException) as exc_info:
        whatsapp._resolve_order_notification_context("order-1")

    assert exc_info.value.status_code == 409
