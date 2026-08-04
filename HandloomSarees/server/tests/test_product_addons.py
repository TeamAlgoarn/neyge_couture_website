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
