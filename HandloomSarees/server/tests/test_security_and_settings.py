import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.api.v1 import chatbot
from app.core.config import Settings
from app.core.dependencies import get_current_user
from app.main import app
from app.services.product_service import ProductService


client = TestClient(app)


def settings_kwargs(**overrides):
    values = {
        "APP_ENV": "development",
        "DEBUG": "release",
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "service-role-placeholder",
        "SUPABASE_ANON_KEY": "anon-placeholder",
        "JWT_SECRET": "jwt-placeholder",
        "RAZORPAY_KEY_ID": "rzp_test_placeholder",
        "RAZORPAY_KEY_SECRET": "razorpay-placeholder",
        "CLOUDINARY_CLOUD_NAME": "cloud",
        "CLOUDINARY_API_KEY": "cloud-key",
        "CLOUDINARY_API_SECRET": "cloud-secret",
    }
    values.update(overrides)
    return values


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


def customer_user():
    return {
        "auth": {"id": "customer-1"},
        "profile": {"id": "customer-1", "role": "user", "is_active": True},
        "access_token": "test-token",
    }


def admin_user():
    return {
        "auth": {"id": "admin-1"},
        "profile": {"id": "admin-1", "role": "admin", "is_active": True},
        "access_token": "test-token",
    }


class FakeChatbotService:
    def get_leads(self, **_filters):
        return []


def product_payload():
    return {
        "name": "Test Saree",
        "price": 1000,
        "images": [],
        "fabric": ["Silk"],
        "color": ["Red"],
        "occasion": ["Festive"],
        "stock": 3,
    }


def test_debug_release_string_is_parsed_as_false():
    settings = Settings(**settings_kwargs())

    assert settings.DEBUG is False


def test_cors_origins_parse_comma_separated_values():
    settings = Settings(
        **settings_kwargs(
            CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
        )
    )

    assert settings.CORS_ORIGINS == [
        "http://localhost:5173",
        "http://localhost:3000",
    ]


def test_cors_origins_reject_wildcard():
    with pytest.raises(ValidationError):
        Settings(**settings_kwargs(CORS_ORIGINS="*"))


def test_production_requires_integration_secrets():
    with pytest.raises(ValidationError) as exc:
        Settings(**settings_kwargs(APP_ENV="production"))

    assert "Missing required production environment variables" in str(exc.value)


def test_chatbot_leads_require_token():
    response = client.get("/api/v1/chatbot/leads")

    assert response.status_code == 401


def test_chatbot_leads_reject_customer_token():
    app.dependency_overrides[get_current_user] = customer_user

    response = client.get("/api/v1/chatbot/leads")

    assert response.status_code == 403


def test_chatbot_leads_allow_admin_token():
    app.dependency_overrides[get_current_user] = admin_user
    app.dependency_overrides[chatbot.get_chatbot_service] = FakeChatbotService

    response = client.get("/api/v1/chatbot/leads")

    assert response.status_code == 200
    assert response.json()["data"] == []


def test_admin_product_create_requires_token():
    response = client.post("/api/v1/products", json=product_payload())

    assert response.status_code == 401


def test_admin_product_create_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user

    response = client.post("/api/v1/products", json=product_payload())

    assert response.status_code == 403


def test_admin_product_create_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        ProductService,
        "create",
        staticmethod(lambda payload: {"id": "product-1", **payload.model_dump()}),
    )

    response = client.post("/api/v1/products", json=product_payload())

    assert response.status_code == 201
    assert response.json()["data"]["id"] == "product-1"
