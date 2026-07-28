import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.core.dependencies import get_current_user
from app.main import app
from app.repositories.address_repository import AddressRepository
from app.services.address_service import AddressService

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


def second_customer_user():
    return {
        "auth": {"id": "customer-2"},
        "profile": {"id": "customer-2", "role": "user", "is_active": True},
        "access_token": "test-token-2",
    }


def sample_address_payload():
    return {
        "full_name": "Bhagyashree",
        "phone": "9876543210",
        "line1": "123 Heritage Lane",
        "line2": "Near Saree Bazaar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560001",
        "country": "India",
        "is_default": True,
    }


def test_list_addresses_requires_token():
    response = client.get("/api/v1/addresses")
    assert response.status_code == 401


def test_create_address_requires_token():
    response = client.post("/api/v1/addresses", json=sample_address_payload())
    assert response.status_code == 401


def test_create_address_validates_payload():
    app.dependency_overrides[get_current_user] = customer_user

    # Short full_name
    bad_payload = sample_address_payload()
    bad_payload["full_name"] = "A"
    response = client.post("/api/v1/addresses", json=bad_payload)
    assert response.status_code == 422

    # Short phone
    bad_payload = sample_address_payload()
    bad_payload["phone"] = "123"
    response = client.post("/api/v1/addresses", json=bad_payload)
    assert response.status_code == 422

    # Short pincode
    bad_payload = sample_address_payload()
    bad_payload["postal_code"] = "12"
    response = client.post("/api/v1/addresses", json=bad_payload)
    assert response.status_code == 422


def test_create_address_success(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_address = {
        "id": "addr-101",
        "user_id": "customer-1",
        **sample_address_payload(),
        "created_at": "2026-07-28T12:00:00Z",
        "updated_at": "2026-07-28T12:00:00Z",
    }

    monkeypatch.setattr(AddressRepository, "create", staticmethod(lambda data: mock_address))

    response = client.post("/api/v1/addresses", json=sample_address_payload())
    assert response.status_code == 201
    assert response.json()["success"] is True
    assert response.json()["data"]["id"] == "addr-101"
    assert response.json()["data"]["full_name"] == "Bhagyashree"


def test_list_addresses_success(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_addresses = [
        {
            "id": "addr-101",
            "user_id": "customer-1",
            **sample_address_payload(),
        }
    ]

    monkeypatch.setattr(AddressRepository, "list_by_user", staticmethod(lambda uid: mock_addresses))

    response = client.get("/api/v1/addresses")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["id"] == "addr-101"


def test_update_address_success(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_existing = {
        "id": "addr-101",
        "user_id": "customer-1",
        **sample_address_payload(),
    }
    mock_updated = {
        **mock_existing,
        "full_name": "Bhagyashree Updated",
    }

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(lambda aid, uid: mock_existing if aid == "addr-101" and uid == "customer-1" else None))
    monkeypatch.setattr(AddressRepository, "update", staticmethod(lambda aid, uid, payload: mock_updated))

    response = client.put("/api/v1/addresses/addr-101", json={"full_name": "Bhagyashree Updated"})
    assert response.status_code == 200
    assert response.json()["data"]["full_name"] == "Bhagyashree Updated"


def test_delete_address_success(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_existing = {
        "id": "addr-101",
        "user_id": "customer-1",
        **sample_address_payload(),
    }

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(lambda aid, uid: mock_existing if aid == "addr-101" and uid == "customer-1" else None))
    monkeypatch.setattr(AddressRepository, "delete", staticmethod(lambda aid, uid: True))

    response = client.delete("/api/v1/addresses/addr-101")
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_set_default_address_success(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    mock_existing = {
        "id": "addr-101",
        "user_id": "customer-1",
        **sample_address_payload(),
        "is_default": False,
    }
    mock_default = {
        **mock_existing,
        "is_default": True,
    }

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(lambda aid, uid: mock_existing if aid == "addr-101" and uid == "customer-1" else None))
    monkeypatch.setattr(AddressRepository, "set_default", staticmethod(lambda aid, uid: mock_default))

    response = client.post("/api/v1/addresses/addr-101/default")
    assert response.status_code == 200
    assert response.json()["data"]["is_default"] is True


def test_address_ownership_enforcement(monkeypatch):
    # Customer 2 attempts to access/update/delete Customer 1's address
    app.dependency_overrides[get_current_user] = second_customer_user

    # Address belongs to customer-1, so get_by_id_and_user returns None for customer-2
    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(lambda aid, uid: None))

    # GET address by id
    response = client.get("/api/v1/addresses/addr-101")
    assert response.status_code == 404
    assert "access denied" in response.json()["message"].lower() or "not found" in response.json()["message"].lower()

    # PUT address by id
    response = client.put("/api/v1/addresses/addr-101", json={"full_name": "Attacker"})
    assert response.status_code == 404

    # DELETE address by id
    response = client.delete("/api/v1/addresses/addr-101")
    assert response.status_code == 404

    # POST default address by id
    response = client.post("/api/v1/addresses/addr-101/default")
    assert response.status_code == 404
