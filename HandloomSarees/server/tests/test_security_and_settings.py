import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.api.v1 import chatbot
from app.core.config import Settings
from app.core.dependencies import get_current_user
from app.main import app
from app.services.product_service import ProductService
from app.services.collection_service import CollectionService
from app.services.festive_collection_service import FestiveCollectionService
from app.services.order_service import OrderService
from app.services.booking_service import BookingService
from app.services.upload_service import UploadService
from app.api.v1 import whatsapp
from app.api.v1 import instagram


client = TestClient(app)


def settings_kwargs(**overrides):
    values = {
        "APP_ENV": "development",
        "DEBUG": "release",
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "service-role-placeholder",
        "SUPABASE_ANON_KEY": "anon-placeholder",
        "SUPABASE_DB_SCHEMA": "public",
        "SUPABASE_STORAGE_BUCKET": "",
        "JWT_SECRET": "jwt-placeholder",
        "PAYMENTS_ENABLED": True,
        "RAZORPAY_ENABLED": True,
        "RAZORPAY_KEY_ID": "rzp_test_placeholder",
        "RAZORPAY_KEY_SECRET": "razorpay-placeholder",
        "RAZORPAY_WEBHOOK_SECRET": "webhook-placeholder",
        "CLOUDINARY_CLOUD_NAME": "cloud",
        "CLOUDINARY_API_KEY": "cloud-key",
        "CLOUDINARY_API_SECRET": "cloud-secret",
        "WHATSAPP_ENABLED": False,
        "INSTAGRAM_ENABLED": False,
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


class FakeChatbotServiceUpdateStatus:
    def update_status(self, lead_id, status):
        return {"id": lead_id, "status": status}


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


def collection_payload():
    return {
        "name": "Test Collection",
        "slug": "test-collection",
        "description": "Test description",
        "is_active": True,
        "featured": False,
        "category": "Wedding",
    }


def festive_collection_payload():
    return {
        "name": "Festive 2026",
        "slug": "festive-2026",
        "description": "A grand festive collection",
        "popup_enabled": True,
        "popup_message": "Grand Sale!",
        "is_active": True,
        "product_ids": [],
    }


async def mock_upload_temp_product_image(file):
    return {"url": "http://example.com/product.jpg"}


async def mock_upload_product_image(product_id, file):
    return {"product_id": product_id, "image_url": "http://example.com/product.jpg"}


async def mock_upload_temp_collection_image(file):
    return {"url": "http://example.com/collection.jpg"}


async def mock_upload_temp_festive_image(file):
    return {"url": "http://example.com/festive.jpg"}


async def mock_send_whatsapp_message(to, message):
    return {"status": "ok"}


async def mock_send_instagram_reply(recipient_id, message):
    return {"status": "ok"}


def test_debug_release_string_is_parsed_as_false():
    settings = Settings(_env_file=None, **settings_kwargs())

    assert settings.DEBUG is False


def test_cors_origins_parse_comma_separated_values():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
        )
    )

    assert settings.CORS_ORIGINS == [
        "http://localhost:5173",
        "http://localhost:3000",
    ]


def test_cors_origins_parse_json_style_list_string():
    settings = Settings(
        **settings_kwargs(
            CORS_ORIGINS='["http://localhost:5173", "http://localhost:3000"]'
        )
    )

    assert settings.CORS_ORIGINS == [
        "http://localhost:5173",
        "http://localhost:3000",
    ]


def test_cors_origins_parse_actual_list_input():
    settings = Settings(
        **settings_kwargs(
            CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
        )
    )

    assert settings.CORS_ORIGINS == [
        "http://localhost:5173",
        "http://localhost:3000",
    ]


def test_cors_origins_reject_empty_value():
    with pytest.raises(ValidationError):
        Settings(**settings_kwargs(CORS_ORIGINS=""))

    with pytest.raises(ValidationError):
        Settings(**settings_kwargs(CORS_ORIGINS=[]))


def test_cors_origins_parse_whitespace_around_comma_separated_values():
    settings = Settings(
        **settings_kwargs(
            CORS_ORIGINS=" http://localhost:5173 , http://localhost:3000 "
        )
    )

    assert settings.CORS_ORIGINS == [
        "http://localhost:5173",
        "http://localhost:3000",
    ]


def test_cors_origins_reject_wildcard():
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **settings_kwargs(CORS_ORIGINS="*"))


def test_production_requires_integration_secrets():
    with pytest.raises(ValidationError) as exc:
        Settings(**settings_kwargs(
            APP_ENV="production",
            SUPABASE_URL="",
            SUPABASE_SERVICE_ROLE_KEY="",
            SUPABASE_ANON_KEY="",
            JWT_SECRET="",
            RAZORPAY_KEY_ID="",
            RAZORPAY_KEY_SECRET="",
        ))

    assert "Missing required production environment variables" in str(exc.value)


def test_production_allows_disabled_integrations_without_provider_secrets():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            APP_ENV="production",
            PAYMENTS_ENABLED=False,
            RAZORPAY_ENABLED=False,
            RAZORPAY_KEY_ID="",
            RAZORPAY_KEY_SECRET="",
            RAZORPAY_WEBHOOK_SECRET="",
            WHATSAPP_ENABLED=False,
            WHATSAPP_PHONE_NUMBER_ID="",
            WHATSAPP_BUSINESS_ACCOUNT_ID="",
            WHATSAPP_ACCESS_TOKEN="",
            WHATSAPP_WEBHOOK_VERIFY_TOKEN="",
            WHATSAPP_APP_SECRET="",
            INSTAGRAM_ENABLED=False,
            INSTAGRAM_BUSINESS_ACCOUNT_ID="",
            INSTAGRAM_ACCESS_TOKEN="",
            INSTAGRAM_APP_ID="",
            INSTAGRAM_APP_SECRET="",
            INSTAGRAM_WEBHOOK_VERIFY_TOKEN="",
        ),
    )

    assert settings.PAYMENTS_ENABLED is False
    assert settings.RAZORPAY_ENABLED is False
    assert settings.WHATSAPP_ENABLED is False
    assert settings.INSTAGRAM_ENABLED is False


def test_staging_allows_checkout_with_razorpay_test_credentials():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            APP_ENV="staging",
            SUPABASE_DB_SCHEMA="preview",
            PAYMENTS_ENABLED=True,
            RAZORPAY_ENABLED=True,
            RAZORPAY_KEY_ID="rzp_test_validkey",
            RAZORPAY_KEY_SECRET="test-secret",
            RAZORPAY_WEBHOOK_SECRET="test-webhook-secret",
        ),
    )

    assert settings.APP_ENV == "staging"
    assert settings.SUPABASE_DB_SCHEMA == "preview"
    assert settings.PAYMENTS_ENABLED is True
    assert settings.RAZORPAY_ENABLED is True


def test_staging_requires_preview_supabase_schema():
    with pytest.raises(ValidationError) as exc:
        Settings(
            _env_file=None,
            **settings_kwargs(
                APP_ENV="staging",
                SUPABASE_DB_SCHEMA="public",
            ),
        )

    assert "APP_ENV=staging requires SUPABASE_DB_SCHEMA=preview" in str(exc.value)


def test_staging_with_preview_supabase_schema_passes():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            APP_ENV="staging",
            SUPABASE_DB_SCHEMA="preview",
        ),
    )

    assert settings.APP_ENV == "staging"
    assert settings.SUPABASE_DB_SCHEMA == "preview"


def test_production_requires_public_supabase_schema():
    with pytest.raises(ValidationError) as exc:
        Settings(
            _env_file=None,
            **settings_kwargs(
                APP_ENV="production",
                SUPABASE_DB_SCHEMA="preview",
            ),
        )

    assert "APP_ENV=production requires SUPABASE_DB_SCHEMA=public" in str(exc.value)


def test_production_with_public_supabase_schema_passes():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            APP_ENV="production",
            SUPABASE_DB_SCHEMA="public",
        ),
    )

    assert settings.APP_ENV == "production"
    assert settings.SUPABASE_DB_SCHEMA == "public"


def test_supabase_schema_name_rejects_unsafe_values():
    with pytest.raises(ValidationError):
        Settings(
            _env_file=None,
            **settings_kwargs(SUPABASE_DB_SCHEMA="preview;drop schema public"),
        )

    with pytest.raises(ValidationError):
        Settings(_env_file=None, **settings_kwargs(SUPABASE_DB_SCHEMA="1preview"))


def test_production_allows_razorpay_reconciliation_only_with_credentials():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            APP_ENV="production",
            PAYMENTS_ENABLED=False,
            RAZORPAY_ENABLED=True,
            RAZORPAY_KEY_ID="rzp_test_reconcile",
            RAZORPAY_KEY_SECRET="test-secret",
            RAZORPAY_WEBHOOK_SECRET="test-webhook-secret",
        ),
    )

    assert settings.PAYMENTS_ENABLED is False
    assert settings.RAZORPAY_ENABLED is True


def test_production_rejects_checkout_without_razorpay_enabled():
    with pytest.raises(ValidationError) as exc:
        Settings(
            _env_file=None,
            **settings_kwargs(
                APP_ENV="production",
                PAYMENTS_ENABLED=True,
                RAZORPAY_ENABLED=False,
                RAZORPAY_KEY_ID="",
                RAZORPAY_KEY_SECRET="",
                RAZORPAY_WEBHOOK_SECRET="",
            ),
        )

    assert "PAYMENTS_ENABLED=true requires RAZORPAY_ENABLED=true" in str(exc.value)


def test_production_rejects_enabled_razorpay_without_credentials():
    with pytest.raises(ValidationError) as exc:
        Settings(
            _env_file=None,
            **settings_kwargs(
                APP_ENV="production",
                PAYMENTS_ENABLED=True,
                RAZORPAY_ENABLED=True,
                RAZORPAY_KEY_ID="",
                RAZORPAY_KEY_SECRET="",
                RAZORPAY_WEBHOOK_SECRET="",
            ),
        )

    assert "Missing required production environment variables" in str(exc.value)
    assert "RAZORPAY_KEY_ID" in str(exc.value)


def test_feature_flags_parse_boolean_strings():
    settings = Settings(
        _env_file=None,
        **settings_kwargs(
            PAYMENTS_ENABLED="off",
            RAZORPAY_ENABLED="disabled",
            WHATSAPP_ENABLED="false",
            INSTAGRAM_ENABLED="0",
        ),
    )

    assert settings.PAYMENTS_ENABLED is False
    assert settings.RAZORPAY_ENABLED is False
    assert settings.WHATSAPP_ENABLED is False
    assert settings.INSTAGRAM_ENABLED is False


# ── Chatbot Lead Auth Tests ──────────────────────────────────────────────────

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


# ── Product Create Auth Tests ─────────────────────────────────────────────────

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


# ── Product Update & Delete Auth Tests ────────────────────────────────────────

def test_admin_product_update_requires_token():
    response = client.put("/api/v1/products/prod-1", json={"name": "Updated Saree"})
    assert response.status_code == 401


def test_admin_product_update_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.put("/api/v1/products/prod-1", json={"name": "Updated Saree"})
    assert response.status_code == 403


def test_admin_product_update_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        ProductService,
        "update",
        staticmethod(lambda product_id, payload: {"id": product_id, **payload.model_dump(exclude_unset=True)}),
    )
    response = client.put("/api/v1/products/prod-1", json={"name": "Updated Saree"})
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "prod-1"


def test_admin_product_delete_requires_token():
    response = client.delete("/api/v1/products/prod-1")
    assert response.status_code == 401


def test_admin_product_delete_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.delete("/api/v1/products/prod-1")
    assert response.status_code == 403


def test_admin_product_delete_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        ProductService,
        "soft_delete",
        staticmethod(lambda product_id: {"id": product_id, "is_active": False}),
    )
    response = client.delete("/api/v1/products/prod-1")
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "prod-1"


# ── Collection CRUD Auth Tests ────────────────────────────────────────────────

def test_admin_collection_create_requires_token():
    response = client.post("/api/v1/collections", json=collection_payload())
    assert response.status_code == 401


def test_admin_collection_create_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/collections", json=collection_payload())
    assert response.status_code == 403


def test_admin_collection_create_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        CollectionService,
        "create",
        staticmethod(lambda payload: {"id": "col-123", **payload.model_dump()}),
    )
    response = client.post("/api/v1/collections", json=collection_payload())
    assert response.status_code == 201
    assert response.json()["data"]["id"] == "col-123"


def test_admin_collection_update_requires_token():
    response = client.put("/api/v1/collections/col-123", json={"name": "New Name"})
    assert response.status_code == 401


def test_admin_collection_update_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.put("/api/v1/collections/col-123", json={"name": "New Name"})
    assert response.status_code == 403


def test_admin_collection_update_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        CollectionService,
        "update",
        staticmethod(lambda collection_id, payload: {"id": collection_id, "name": payload.name}),
    )
    response = client.put("/api/v1/collections/col-123", json={"name": "New Name"})
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "col-123"


def test_admin_collection_delete_requires_token():
    response = client.delete("/api/v1/collections/col-123")
    assert response.status_code == 401


def test_admin_collection_delete_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.delete("/api/v1/collections/col-123")
    assert response.status_code == 403


def test_admin_collection_delete_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        CollectionService,
        "soft_delete",
        staticmethod(lambda collection_id: {"id": collection_id, "is_active": False}),
    )
    response = client.delete("/api/v1/collections/col-123")
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "col-123"


# ── Festive Collection Admin Auth Tests ──────────────────────────────────────

def test_admin_festive_create_requires_token():
    response = client.post("/api/v1/admin/festive-collections", json=festive_collection_payload())
    assert response.status_code == 401


def test_admin_festive_create_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/admin/festive-collections", json=festive_collection_payload())
    assert response.status_code == 403


def test_admin_festive_create_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        FestiveCollectionService,
        "create_festive_collection",
        lambda self, data: {"id": "fc-123", **data},
    )
    response = client.post("/api/v1/admin/festive-collections", json=festive_collection_payload())
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "fc-123"


def test_admin_festive_list_requires_token():
    response = client.get("/api/v1/admin/festive-collections")
    assert response.status_code == 401


def test_admin_festive_list_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.get("/api/v1/admin/festive-collections")
    assert response.status_code == 403


def test_admin_festive_list_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        FestiveCollectionService,
        "list_festive_collections",
        lambda self: [],
    )
    response = client.get("/api/v1/admin/festive-collections")
    assert response.status_code == 200
    assert response.json()["data"] == []


def test_admin_festive_get_requires_token():
    response = client.get("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 401


def test_admin_festive_get_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.get("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 403


def test_admin_festive_get_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        FestiveCollectionService,
        "get_festive_collection",
        lambda self, festive_id: {"id": festive_id, "name": "Festive"},
    )
    response = client.get("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "fc-123"


def test_admin_festive_update_requires_token():
    response = client.put("/api/v1/admin/festive-collections/fc-123", json={"name": "New festive"})
    assert response.status_code == 401


def test_admin_festive_update_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.put("/api/v1/admin/festive-collections/fc-123", json={"name": "New festive"})
    assert response.status_code == 403


def test_admin_festive_update_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        FestiveCollectionService,
        "update_festive_collection",
        lambda self, festive_id, data: {"id": festive_id, "name": data.get("name")},
    )
    response = client.put("/api/v1/admin/festive-collections/fc-123", json={"name": "New festive"})
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "fc-123"


def test_admin_festive_delete_requires_token():
    response = client.delete("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 401


def test_admin_festive_delete_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.delete("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 403


def test_admin_festive_delete_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        FestiveCollectionService,
        "delete_festive_collection",
        lambda self, festive_id: True,
    )
    response = client.delete("/api/v1/admin/festive-collections/fc-123")
    assert response.status_code == 200
    assert response.json()["message"] == "Festive collection deleted"


# ── Orders Admin Auth Tests ───────────────────────────────────────────────────

def test_admin_list_orders_requires_token():
    response = client.get("/api/v1/orders/admin/all")
    assert response.status_code == 401


def test_admin_list_orders_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.get("/api/v1/orders/admin/all")
    assert response.status_code == 403


def test_admin_list_orders_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        OrderService,
        "list_all_orders",
        staticmethod(lambda: []),
    )
    response = client.get("/api/v1/orders/admin/all")
    assert response.status_code == 200
    assert response.json()["data"] == []


def test_admin_get_order_requires_token():
    response = client.get("/api/v1/orders/admin/order-123")
    assert response.status_code == 401


def test_admin_get_order_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.get("/api/v1/orders/admin/order-123")
    assert response.status_code == 403


def test_admin_get_order_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        OrderService,
        "get_admin_order_by_id",
        staticmethod(lambda order_id: {"id": order_id}),
    )
    response = client.get("/api/v1/orders/admin/order-123")
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "order-123"


# ── Uploads Auth Tests ────────────────────────────────────────────────────────

def test_admin_upload_product_image_temp_requires_token():
    response = client.post("/api/v1/uploads/product-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 401


def test_admin_upload_product_image_temp_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/uploads/product-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 403


def test_admin_upload_product_image_temp_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(UploadService, "upload_temp_product_image", mock_upload_temp_product_image)
    response = client.post("/api/v1/uploads/product-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 201


def test_admin_upload_product_image_requires_token():
    response = client.post("/api/v1/uploads/products/prod-1/image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 401


def test_admin_upload_product_image_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/uploads/products/prod-1/image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 403


def test_admin_upload_product_image_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(UploadService, "upload_product_image", mock_upload_product_image)
    response = client.post("/api/v1/uploads/products/prod-1/image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 201


def test_admin_upload_collection_image_temp_requires_token():
    response = client.post("/api/v1/uploads/collection-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 401


def test_admin_upload_collection_image_temp_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/uploads/collection-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 403


def test_admin_upload_collection_image_temp_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(UploadService, "upload_temp_collection_image", mock_upload_temp_collection_image)
    response = client.post("/api/v1/uploads/collection-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 201


def test_admin_upload_festive_image_temp_requires_token():
    response = client.post("/api/v1/uploads/festive-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 401


def test_admin_upload_festive_image_temp_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/uploads/festive-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 403


def test_admin_upload_festive_image_temp_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(UploadService, "upload_temp_festive_image", mock_upload_temp_festive_image)
    response = client.post("/api/v1/uploads/festive-image", files={"file": ("test.png", b"fake", "image/png")})
    assert response.status_code == 201


# ── Chatbot Lead Status Auth Tests ───────────────────────────────────────────

def test_admin_update_chatbot_lead_status_requires_token():
    response = client.patch("/api/v1/chatbot/leads/lead-1/status", json={"status": "contacted"})
    assert response.status_code == 401


def test_admin_update_chatbot_lead_status_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.patch("/api/v1/chatbot/leads/lead-1/status", json={"status": "contacted"})
    assert response.status_code == 403


def test_admin_update_chatbot_lead_status_allows_admin_token():
    app.dependency_overrides[get_current_user] = admin_user
    app.dependency_overrides[chatbot.get_chatbot_service] = FakeChatbotServiceUpdateStatus
    response = client.patch("/api/v1/chatbot/leads/lead-1/status", json={"status": "contacted"})
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "lead-1"
    assert response.json()["data"]["status"] == "contacted"


# ── Video Booking Auth Tests ─────────────────────────────────────────────────

def test_admin_list_video_bookings_requires_token():
    response = client.get("/api/v1/video-bookings")
    assert response.status_code == 401


def test_admin_list_video_bookings_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.get("/api/v1/video-bookings")
    assert response.status_code == 403


def test_admin_list_video_bookings_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(BookingService, "list_all", staticmethod(lambda: []))
    response = client.get("/api/v1/video-bookings")
    assert response.status_code == 200
    assert response.json()["data"] == []


def test_admin_update_video_booking_status_requires_token():
    response = client.patch("/api/v1/video-bookings/book-1/status", json={"status": "confirmed"})
    assert response.status_code == 401


def test_admin_update_video_booking_status_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.patch("/api/v1/video-bookings/book-1/status", json={"status": "confirmed"})
    assert response.status_code == 403


def test_admin_update_video_booking_status_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        BookingService,
        "update_booking_status",
        staticmethod(lambda booking_id, status: {"id": booking_id, "status": status}),
    )
    response = client.patch("/api/v1/video-bookings/book-1/status", json={"status": "confirmed"})
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "confirmed"


# ── WhatsApp Messaging Auth Tests ────────────────────────────────────────────

def test_admin_whatsapp_order_confirmation_requires_token():
    response = client.post("/api/v1/whatsapp/send-order-confirmation", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "amount": "1000",
    })
    assert response.status_code == 401


def test_admin_whatsapp_order_confirmation_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/whatsapp/send-order-confirmation", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "amount": "1000",
    })
    assert response.status_code == 403


def test_admin_whatsapp_order_confirmation_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(whatsapp, "send_whatsapp_message", mock_send_whatsapp_message)
    response = client.post("/api/v1/whatsapp/send-order-confirmation", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "amount": "1000",
    })
    assert response.status_code == 200


def test_admin_whatsapp_shipping_notification_requires_token():
    response = client.post("/api/v1/whatsapp/send-shipping-notification", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "tracking_id": "track-1",
    })
    assert response.status_code == 401


def test_admin_whatsapp_shipping_notification_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/whatsapp/send-shipping-notification", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "tracking_id": "track-1",
    })
    assert response.status_code == 403


def test_admin_whatsapp_shipping_notification_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(whatsapp, "send_whatsapp_message", mock_send_whatsapp_message)
    response = client.post("/api/v1/whatsapp/send-shipping-notification", params={
        "phone": "1234567890",
        "order_id": "ord-1",
        "customer_name": "John",
        "tracking_id": "track-1",
    })
    assert response.status_code == 200


# ── Instagram Messaging Auth Tests ───────────────────────────────────────────

def test_admin_instagram_send_message_requires_token():
    response = client.post("/api/v1/instagram/send-message", params={
        "recipient_id": "inst-1",
        "message": "Hello",
    })
    assert response.status_code == 401


def test_admin_instagram_send_message_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.post("/api/v1/instagram/send-message", params={
        "recipient_id": "inst-1",
        "message": "Hello",
    })
    assert response.status_code == 403


def test_admin_instagram_send_message_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(instagram, "send_instagram_reply", mock_send_instagram_reply)
    response = client.post("/api/v1/instagram/send-message", params={
        "recipient_id": "inst-1",
        "message": "Hello",
    })
    assert response.status_code == 200


# ── Order Status Update Tests ────────────────────────────────────────────────

def test_admin_update_order_status_requires_token():
    response = client.patch("/api/v1/orders/admin/order-123/status", json={"order_status": "processing"})
    assert response.status_code == 401


def test_admin_update_order_status_rejects_customer_token():
    app.dependency_overrides[get_current_user] = customer_user
    response = client.patch("/api/v1/orders/admin/order-123/status", json={"order_status": "processing"})
    assert response.status_code == 403


def test_admin_update_order_status_allows_admin_token(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        OrderService,
        "update_order_status",
        staticmethod(lambda order_id, payload: {"id": order_id, "order_status": payload.order_status}),
    )
    response = client.patch("/api/v1/orders/admin/order-123/status", json={"order_status": "processing"})
    assert response.status_code == 200
    assert response.json()["data"]["id"] == "order-123"
    assert response.json()["data"]["order_status"] == "processing"


def test_admin_update_order_status_with_tracking(monkeypatch):
    app.dependency_overrides[get_current_user] = admin_user
    monkeypatch.setattr(
        OrderService,
        "update_order_status",
        staticmethod(lambda order_id, payload: {
            "id": order_id,
            "order_status": payload.order_status,
            "courier_name": payload.courier_name,
            "tracking_number": payload.tracking_number,
        }),
    )
    response = client.patch("/api/v1/orders/admin/order-123/status", json={
        "order_status": "shipped",
        "courier_name": "FedEx",
        "tracking_number": "1234567890",
    })
    assert response.status_code == 200
    assert response.json()["data"]["order_status"] == "shipped"
    assert response.json()["data"]["courier_name"] == "FedEx"
    assert response.json()["data"]["tracking_number"] == "1234567890"
