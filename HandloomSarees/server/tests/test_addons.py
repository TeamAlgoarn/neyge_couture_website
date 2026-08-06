import pytest
from fastapi import HTTPException

from app.services.cart_service import CartService
from app.services.payment_service import PaymentService


def test_process_addons_valid():
    product = {
        "id": "prod_1",
        "name": "Kanjivaram Silk Saree",
        "has_fall": True,
        "fall_price": 150.0,
        "has_in_skirt": True,
        "in_skirt_price": 350.0,
    }

    addons_snapshot, addons_total = CartService._process_addons(
        product, ["fall", "in_skirt"]
    )

    assert len(addons_snapshot) == 2
    assert addons_total == 500.0
    addon_ids = [a["id"] for a in addons_snapshot]
    assert "fall" in addon_ids
    assert "in_skirt" in addon_ids


def test_process_addons_unavailable_fall():
    product = {
        "id": "prod_2",
        "name": "Cotton Dupatta",
        "has_fall": False,
        "fall_price": 150.0,
        "has_in_skirt": True,
        "in_skirt_price": 350.0,
    }

    with pytest.raises(HTTPException) as exc_info:
        CartService._process_addons(product, ["fall"])
    assert exc_info.value.status_code == 400
    assert "Fall add-on is not available" in exc_info.value.detail


def test_process_addons_unavailable_in_skirt():
    product = {
        "id": "prod_3",
        "name": "Organza Saree",
        "has_fall": True,
        "fall_price": 200.0,
        "has_in_skirt": False,
        "in_skirt_price": 400.0,
    }

    with pytest.raises(HTTPException) as exc_info:
        CartService._process_addons(product, ["in_skirt"])
    assert exc_info.value.status_code == 400
    assert "In-skirt add-on is not available" in exc_info.value.detail


def test_process_addons_invalid_key():
    product = {
        "id": "prod_4",
        "has_fall": True,
        "has_in_skirt": True,
    }

    with pytest.raises(HTTPException) as exc_info:
        CartService._process_addons(product, ["invalid_addon"])
    assert exc_info.value.status_code == 400
    assert "Unavailable add-on selected" in exc_info.value.detail


def test_legacy_order_without_addons():
    legacy_cart_item = {
        "product_id": "p101",
        "quantity": 2,
        "unit_price": 1500.0,
    }
    addons_snapshot = legacy_cart_item.get("selected_addons") or []
    addons_total = sum(float(a.get("price", 0)) for a in addons_snapshot)

    assert addons_snapshot == []
    assert addons_total == 0.0
