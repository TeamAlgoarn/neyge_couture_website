import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.core.dependencies import get_current_user
from app.main import app
from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.services.cart_service import CartService

client = TestClient(app)


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


def sample_product():
    return {
        "id": "prod-1",
        "name": "Kanjeevaram Silk Saree",
        "price": 12000.0,
        "discount_price": 10500.0,
        "stock": 5,
        "is_active": True,
    }


def test_update_cart_quantity_requires_token():
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": 2})
    assert response.status_code == 401


def test_update_cart_quantity_validates_positive_quantity():
    app.dependency_overrides[get_current_user] = customer_user

    # Zero quantity
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": 0})
    assert response.status_code == 422

    # Negative quantity
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": -2})
    assert response.status_code == 422


def test_update_cart_quantity_insufficient_stock(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: sample_product()))

    # Target quantity 10 exceeds available stock 5
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": 10})
    assert response.status_code == 400
    assert "insufficient stock" in response.text.lower()


def test_update_cart_quantity_success_increment_and_decrement(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_cart = {"id": "cart-1", "user_id": "customer-1"}
    mock_cart_item = {
        "id": "item-1",
        "cart_id": "cart-1",
        "product_id": "prod-1",
        "quantity": 1,
        "unit_price": 10500.0,
    }

    monkeypatch.setattr(ProductRepository, "get_active_by_id", staticmethod(lambda pid: sample_product()))
    monkeypatch.setattr(ProductRepository, "get_by_id", staticmethod(lambda pid: sample_product()))
    monkeypatch.setattr(CartRepository, "get_or_create_cart", staticmethod(lambda uid: mock_cart))
    monkeypatch.setattr(CartRepository, "get_cart_item", staticmethod(lambda cid, pid: mock_cart_item))

    updated_quantity_holder = {"qty": 1}

    def mock_update_item(item_id, payload):
        updated_quantity_holder["qty"] = payload["quantity"]
        mock_cart_item["quantity"] = payload["quantity"]
        return mock_cart_item

    def mock_get_items(cid):
        return [{**mock_cart_item, "quantity": updated_quantity_holder["qty"]}]

    monkeypatch.setattr(CartRepository, "update_cart_item", staticmethod(mock_update_item))
    monkeypatch.setattr(CartRepository, "get_cart_items", staticmethod(mock_get_items))

    # Test increment to 3
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": 3})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["total_items"] == 3
    assert response.json()["data"]["subtotal"] == 31500.0

    # Test decrement to 2
    response = client.post("/api/v1/cart/update", json={"product_id": "prod-1", "quantity": 2})
    assert response.status_code == 200
    assert response.json()["data"]["total_items"] == 2
    assert response.json()["data"]["subtotal"] == 21000.0
