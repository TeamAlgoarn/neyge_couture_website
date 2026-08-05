import pytest
from pydantic import ValidationError
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest, ProductResponse, PublicProductResponse


def test_product_addons_schema_defaults():
    # Verify default values for add-ons are False / 0.0
    payload = {
        "name": "Kanjeevaram Silk Saree",
        "price": 15000.0,
        "stock": 10,
    }
    req = ProductCreateRequest(**payload)
    assert req.has_fall is False
    assert req.fall_price == 0.0
    assert req.has_in_skirt is False
    assert req.in_skirt_price == 0.0


def test_product_addons_schema_valid_values():
    payload = {
        "name": "Banarasi Silk Saree",
        "price": 18000.0,
        "stock": 5,
        "has_fall": True,
        "fall_price": 500.0,
        "has_in_skirt": True,
        "in_skirt_price": 800.0,
    }
    req = ProductCreateRequest(**payload)
    assert req.has_fall is True
    assert req.fall_price == 500.0
    assert req.has_in_skirt is True
    assert req.in_skirt_price == 800.0


def test_product_addons_negative_price_validation():
    # Negative fall_price should fail validation
    with pytest.raises(ValidationError) as exc_info:
        ProductCreateRequest(
            name="Test Saree",
            price=5000.0,
            has_fall=True,
            fall_price=-150.0,
        )
    assert "fall_price" in str(exc_info.value)

    # Negative in_skirt_price should fail validation
    with pytest.raises(ValidationError) as exc_info:
        ProductCreateRequest(
            name="Test Saree",
            price=5000.0,
            has_in_skirt=True,
            in_skirt_price=-200.0,
        )
    assert "in_skirt_price" in str(exc_info.value)


def test_product_update_addons_negative_price_validation():
    # Update request negative price validation
    with pytest.raises(ValidationError) as exc_info:
        ProductUpdateRequest(fall_price=-50.0)
    assert "fall_price" in str(exc_info.value)

    with pytest.raises(ValidationError) as exc_info:
        ProductUpdateRequest(in_skirt_price=-100.0)
    assert "in_skirt_price" in str(exc_info.value)


def test_product_response_includes_addons():
    resp_data = {
        "id": "prod-101",
        "name": "Chanderi Saree",
        "slug": "chanderi-saree",
        "price": 8500.0,
        "images": ["img1.jpg"],
        "occasion": ["Festive"],
        "stock": 4,
        "is_featured": True,
        "is_active": True,
        "tags": ["silk"],
        "has_fall": True,
        "fall_price": 350.0,
        "has_in_skirt": True,
        "in_skirt_price": 600.0,
        "created_at": "2026-01-01T00:00:00Z",
        "updated_at": "2026-01-01T00:00:00Z",
    }
    res = ProductResponse(**resp_data)
    assert res.has_fall is True
    assert res.fall_price == 350.0
    assert res.has_in_skirt is True
    assert res.in_skirt_price == 600.0


def test_public_product_response_includes_addons():
    pub_data = {
        "id": "prod-102",
        "name": "Tussar Silk Saree",
        "slug": "tussar-silk-saree",
        "price": 9500.0,
        "images": ["img1.jpg"],
        "has_fall": True,
        "fall_price": 400.0,
        "has_in_skirt": False,
        "in_skirt_price": 0.0,
    }
    pub_res = PublicProductResponse(**pub_data)
    assert pub_res.has_fall is True
    assert pub_res.fall_price == 400.0
    assert pub_res.has_in_skirt is False
    assert pub_res.in_skirt_price == 0.0


# ─────────────────────────────────────────────────────────────────────────────
# API-Level Endpoint Tests (Create / Update / Get Add-ons)
# ─────────────────────────────────────────────────────────────────────────────
from fastapi.testclient import TestClient
from app.main import app
from app.core.dependencies import require_admin
from app.repositories.product_repository import ProductRepository

client = TestClient(app)


def test_api_get_product_by_slug_includes_addons(monkeypatch):
    sample_prod = {
        "id": "prod-201",
        "name": "Sambalpuri Silk Saree",
        "slug": "sambalpuri-silk-saree",
        "price": 12000.0,
        "discount_price": None,
        "thumbnail": "thumb.jpg",
        "images": ["thumb.jpg"],
        "short_description": "Beautiful handloom saree",
        "fabric": "Silk",
        "technique": "Ikat",
        "origin": "Odisha",
        "color": "Blue",
        "occasion": ["Festive"],
        "artisan": None,
        "stock": 3,
        "is_featured": True,
        "is_active": True,
        "tags": ["ikat"],
        "has_fall": True,
        "fall_price": 450.0,
        "has_in_skirt": True,
        "in_skirt_price": 700.0,
        "collection_id": None,
    }

    monkeypatch.setattr(ProductRepository, "get_by_slug", staticmethod(lambda s: sample_prod))

    response = client.get("/api/v1/products/slug/sambalpuri-silk-saree")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["has_fall"] is True
    assert data["fall_price"] == 450.0
    assert data["has_in_skirt"] is True
    assert data["in_skirt_price"] == 700.0


def test_api_create_product_with_addons(monkeypatch):
    app.dependency_overrides[require_admin] = lambda: {"profile": {"role": "admin"}}

    def mock_create(payload):
        return {
            "id": "prod-202",
            **payload,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z",
        }

    monkeypatch.setattr(ProductRepository, "exists_by_slug", staticmethod(lambda s, exclude_id=None: False))
    monkeypatch.setattr(ProductRepository, "create", staticmethod(mock_create))

    payload = {
        "name": "Paithani Silk Saree",
        "price": 25000.0,
        "stock": 2,
        "has_fall": True,
        "fall_price": 500.0,
        "has_in_skirt": True,
        "in_skirt_price": 750.0,
    }

    response = client.post("/api/v1/products", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["has_fall"] is True
    assert data["fall_price"] == 500.0
    assert data["has_in_skirt"] is True
    assert data["in_skirt_price"] == 750.0


def test_api_update_product_addons(monkeypatch):
    app.dependency_overrides[require_admin] = lambda: {"profile": {"role": "admin"}}

    existing = {
        "id": "prod-203",
        "name": "Chanderi Cotton Saree",
        "slug": "chanderi-cotton-saree",
        "price": 6000.0,
        "stock": 5,
        "is_active": True,
        "has_fall": False,
        "fall_price": 0.0,
        "has_in_skirt": False,
        "in_skirt_price": 0.0,
    }

    def mock_update(pid, payload):
        updated = {**existing, **payload}
        return updated

    monkeypatch.setattr(ProductRepository, "get_by_id", staticmethod(lambda pid: existing))
    monkeypatch.setattr(ProductRepository, "exists_by_slug", staticmethod(lambda s, exclude_id=None: False))
    monkeypatch.setattr(ProductRepository, "update", staticmethod(mock_update))

    update_payload = {
        "has_fall": True,
        "fall_price": 300.0,
        "has_in_skirt": True,
        "in_skirt_price": 500.0,
    }

    response = client.put("/api/v1/products/prod-203", json=update_payload)
    app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["has_fall"] is True
    assert data["fall_price"] == 300.0
    assert data["has_in_skirt"] is True
    assert data["in_skirt_price"] == 500.0