import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.services.cart_service import CartService
from app.services.payment_service import PaymentService

client = TestClient(app)


def customer_user():
    return {
        "auth": {"id": "user-addon-1"},
        "profile": {"id": "user-addon-1", "role": "user", "is_active": True},
        "access_token": "test-token",
    }


def sample_saree():
    return {
        "id": "saree-101",
        "name": "Kanjivaram Pure Silk Saree",
        "slug": "kanjivaram-pure-silk-saree",
        "price": 10000.0,
        "discount_price": 9000.0,
        "stock": 10,
        "is_active": True,
        "has_fall": True,
        "fall_price": 250.0,
        "has_in_skirt": True,
        "in_skirt_price": 450.0,
    }


# ─────────────────────────────────────────────────────────────────────────────
# 1. Unit Tests for _process_addons & Fallbacks
# ─────────────────────────────────────────────────────────────────────────────

def test_process_addons_valid():
    product = sample_saree()
    addons_snapshot, addons_total = CartService._process_addons(
        product, ["fall", "in_skirt"]
    )

    assert len(addons_snapshot) == 2
    assert addons_total == 700.0
    addon_ids = [a["id"] for a in addons_snapshot]
    assert "fall" in addon_ids
    assert "in_skirt" in addon_ids


def test_process_addons_no_unsafe_fallbacks():
    # When has_fall / has_in_skirt are missing/False, do NOT default to True
    product_no_addons = {
        "id": "prod_bare",
        "name": "Plain Silk Saree",
        "price": 5000.0,
    }
    with pytest.raises(HTTPException) as exc_info:
        CartService._process_addons(product_no_addons, ["fall"])
    assert exc_info.value.status_code == 400
    assert "Fall add-on is not available" in exc_info.value.detail

    with pytest.raises(HTTPException) as exc_info:
        CartService._process_addons(product_no_addons, ["in_skirt"])
    assert exc_info.value.status_code == 400
    assert "In-skirt add-on is not available" in exc_info.value.detail


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
    product = sample_saree()
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


# ─────────────────────────────────────────────────────────────────────────────
# 2. Integration API Tests for Cart Add / Update / Remove / Line Identity
# ─────────────────────────────────────────────────────────────────────────────

def test_api_add_to_cart_with_addons(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_cart = {"id": "cart-addon-1", "user_id": "user-addon-1"}
    created_items = []

    def mock_create_item(payload):
        item = {
            "id": f"item-{len(created_items)+1}",
            **payload,
        }
        created_items.append(item)
        return item

    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(ProductRepository, "get_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(lambda cid: created_items))
    monkeypatch.setattr(CartRepository, "create_cart_item", staticmethod(mock_create_item))

    # Add item with both fall and in_skirt add-ons
    res = client.post("/api/v1/cart/add", json={
        "product_id": "saree-101",
        "quantity": 1,
        "selected_addons": ["fall", "in_skirt"],
    })

    assert res.status_code == 200
    data = res.json()["data"]
    assert data["subtotal"] == 9700.0  # 9000 discount price + 250 fall + 450 in_skirt
    assert len(data["items"]) == 1
    assert data["items"][0]["unit_price"] == 9700.0
    assert data["items"][0]["addons_total"] == 700.0


def test_cart_line_identity_distinct_addon_rows(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_cart = {"id": "cart-addon-2", "user_id": "user-addon-1"}
    items_db = []

    def mock_create(payload):
        item = {"id": f"item-{len(items_db)+1}", **payload}
        items_db.append(item)
        return item

    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(ProductRepository, "get_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(lambda cid: items_db))
    monkeypatch.setattr(CartRepository, "create_cart_item", staticmethod(mock_create))

    # Add Saree with Fall only
    client.post("/api/v1/cart/add", json={
        "product_id": "saree-101",
        "quantity": 1,
        "selected_addons": ["fall"],
    })

    # Add SAME Saree with In-Skirt only -> should create a separate cart line item
    client.post("/api/v1/cart/add", json={
        "product_id": "saree-101",
        "quantity": 1,
        "selected_addons": ["in_skirt"],
    })

    assert len(items_db) == 2
    assert items_db[0]["selected_addons"][0]["id"] == "fall"
    assert items_db[1]["selected_addons"][0]["id"] == "in_skirt"


def test_cart_line_identity_quantity_update_and_remove(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_cart = {"id": "cart-addon-3", "user_id": "user-addon-1"}
    items_db = [
        {
            "id": "item-line-1",
            "cart_id": "cart-addon-3",
            "product_id": "saree-101",
            "quantity": 1,
            "product_price": 9000.0,
            "unit_price": 9250.0,
            "selected_addons": [{"id": "fall", "name": "Fall & Pico", "price": 250.0}],
            "addons_total": 250.0,
        },
        {
            "id": "item-line-2",
            "cart_id": "cart-addon-3",
            "product_id": "saree-101",
            "quantity": 1,
            "product_price": 9000.0,
            "unit_price": 9450.0,
            "selected_addons": [{"id": "in_skirt", "name": "Matching In-Skirt", "price": 450.0}],
            "addons_total": 450.0,
        },
    ]

    def mock_get_by_id(cid, item_id):
        for item in items_db:
            if item["id"] == item_id:
                return item
        return None

    def mock_update(item_id, payload):
        for item in items_db:
            if item["id"] == item_id:
                item.update(payload)
                return item
        return None

    def mock_delete_by_id(cid, item_id):
        nonlocal items_db
        items_db = [i for i in items_db if i["id"] != item_id]

    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(ProductRepository, "get_by_id", staticmethod(lambda pid: sample_saree()))
    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(lambda cid: items_db))
    monkeypatch.setattr(CartRepository, "get_cart_item_by_id", staticmethod(mock_get_by_id))
    monkeypatch.setattr(CartRepository, "update_cart_item", staticmethod(mock_update))
    monkeypatch.setattr(CartRepository, "delete_cart_item_by_id", staticmethod(mock_delete_by_id))

    # Update item-line-2 quantity to 3 using cart_item_id
    res = client.post("/api/v1/cart/update", json={
        "cart_item_id": "item-line-2",
        "quantity": 3,
    })
    assert res.status_code == 200
    # item-line-1 remains qty 1, item-line-2 becomes qty 3
    assert items_db[0]["quantity"] == 1
    assert items_db[1]["quantity"] == 3

    # Remove item-line-1 specifically using cart_item_id
    res_rem = client.post("/api/v1/cart/remove", json={
        "cart_item_id": "item-line-1",
    })
    assert res_rem.status_code == 200
    assert len(items_db) == 1
    assert items_db[0]["id"] == "item-line-2"


# ─────────────────────────────────────────────────────────────────────────────
# 3. Checkout Snapshot & Re-validation Tests
# ─────────────────────────────────────────────────────────────────────────────

def test_checkout_snapshot_revalidates_addon_prices(monkeypatch):
    # Customer added saree with Fall when fall_price was 250.0
    mock_cart = {"id": "cart-chk-1", "user_id": "user-addon-1"}
    stale_cart_items = [
        {
            "id": "item-chk-1",
            "cart_id": "cart-chk-1",
            "product_id": "saree-101",
            "quantity": 2,
            "product_price": 9000.0,
            "unit_price": 9250.0,
            "selected_addons": [{"id": "fall", "name": "Fall & Pico", "price": 250.0}],
            "addons_total": 250.0,
        }
    ]

    # Admin updated product in DB before checkout: fall_price changed to 300.0
    updated_db_saree = sample_saree()
    updated_db_saree["fall_price"] = 300.0

    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(lambda cid: stale_cart_items))
    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: updated_db_saree))

    snapshot = PaymentService._build_checkout_snapshot(
        user_id="user-addon-1",
        shipping_address={"full_name": "Jane Doe", "address_line1": "123 Main St", "city": "Bengaluru", "state": "Karnataka", "pincode": "560001", "phone": "9876543210"},
    )

    # Revalidation must use current DB fall_price of 300.0 (unit_price = 9000 + 300 = 9300.0)
    assert snapshot["items"][0]["addons_total"] == 300.0
    assert snapshot["items"][0]["unit_price"] == 9300.0
    assert snapshot["total_amount"] == 18600.0  # 9300 * 2


def test_checkout_snapshot_rejects_disabled_addons(monkeypatch):
    # Customer added saree with Fall, but admin disabled has_fall = False before checkout
    mock_cart = {"id": "cart-chk-2", "user_id": "user-addon-1"}
    cart_items = [
        {
            "id": "item-chk-2",
            "cart_id": "cart-chk-2",
            "product_id": "saree-101",
            "quantity": 1,
            "selected_addons": [{"id": "fall", "name": "Fall & Pico", "price": 250.0}],
        }
    ]

    disabled_fall_saree = sample_saree()
    disabled_fall_saree["has_fall"] = False  # Disabled by admin

    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(lambda cid: cart_items))
    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: disabled_fall_saree))

    with pytest.raises(HTTPException) as exc_info:
        PaymentService._build_checkout_snapshot(
            user_id="user-addon-1",
            shipping_address={"full_name": "Jane Doe"},
        )

    assert exc_info.value.status_code == 400
    assert "Fall add-on is not available" in exc_info.value.detail
