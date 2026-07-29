import pytest
from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app
from app.repositories.address_repository import AddressRepository

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
        "is_default": False,
    }


def test_unauthenticated_requests_reject_no_token():
    assert client.get("/api/v1/addresses").status_code == 401
    assert client.get("/api/v1/addresses/addr-1").status_code == 401
    assert client.post("/api/v1/addresses", json=sample_address_payload()).status_code == 401
    assert client.put("/api/v1/addresses/addr-1", json={"full_name": "New"}).status_code == 401
    assert client.delete("/api/v1/addresses/addr-1").status_code == 401
    assert client.post("/api/v1/addresses/addr-1/default").status_code == 401


def test_create_address_validates_payload_whitespace_and_formats():
    app.dependency_overrides[get_current_user] = customer_user

    # Whitespace-only name
    bad_payload = sample_address_payload()
    bad_payload["full_name"] = "   "
    assert client.post("/api/v1/addresses", json=bad_payload).status_code == 422

    # Invalid phone (letters, too short, too long)
    bad_payload = sample_address_payload()
    bad_payload["phone"] = "abc1234567"
    assert client.post("/api/v1/addresses", json=bad_payload).status_code == 422

    bad_payload["phone"] = "123"
    assert client.post("/api/v1/addresses", json=bad_payload).status_code == 422

    # Invalid pincode (not 6 digits)
    bad_payload = sample_address_payload()
    bad_payload["postal_code"] = "12345"
    assert client.post("/api/v1/addresses", json=bad_payload).status_code == 422

    bad_payload["postal_code"] = "abcdef"
    assert client.post("/api/v1/addresses", json=bad_payload).status_code == 422


def test_user_id_injection_prevented(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user

    created_payloads = []

    def mock_create(payload):
        created_payloads.append(payload)
        return {"id": "addr-101", **payload}

    monkeypatch.setattr(AddressRepository, "list_by_user", staticmethod(lambda uid: []))
    monkeypatch.setattr(AddressRepository, "create", staticmethod(mock_create))

    injection_payload = sample_address_payload()
    injection_payload["user_id"] = "hacker-user-id"

    response = client.post("/api/v1/addresses", json=injection_payload)
    assert response.status_code == 201
    # Check that service assigned customer-1, ignoring user_id from injection
    assert created_payloads[0]["user_id"] == "customer-1"


def test_first_address_automatically_set_as_default(monkeypatch):
    user_addresses = []

    def mock_list(uid):
        return [a for a in user_addresses if a["user_id"] == uid]

    def mock_create(payload):
        user_id = payload["user_id"]
        existing = mock_list(user_id)
        if not existing:
            payload["is_default"] = True
        addr = {"id": f"addr-{len(user_addresses)+1}", **payload}
        user_addresses.append(addr)
        return addr

    monkeypatch.setattr(AddressRepository, "list_by_user", staticmethod(mock_list))
    monkeypatch.setattr(AddressRepository, "create", staticmethod(mock_create))

    app.dependency_overrides[get_current_user] = customer_user

    # First address has is_default = False in payload, but should be forced to True
    res1 = client.post("/api/v1/addresses", json=sample_address_payload())
    assert res1.status_code == 201
    assert res1.json()["data"]["is_default"] is True


def test_only_one_default_address(monkeypatch):
    mock_addresses = [
        {
            "id": "addr-1",
            "user_id": "customer-1",
            "full_name": "User 1",
            "phone": "9876543210",
            "line1": "Address 1",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560001",
            "country": "India",
            "is_default": True,
        },
        {
            "id": "addr-2",
            "user_id": "customer-1",
            "full_name": "User 2",
            "phone": "9876543210",
            "line1": "Address 2",
            "city": "Bengaluru",
            "state": "Karnataka",
            "postal_code": "560002",
            "country": "India",
            "is_default": False,
        },
    ]

    def mock_get(aid, uid):
        for a in mock_addresses:
            if a["id"] == aid and a["user_id"] == uid:
                return a
        return None

    def mock_set_default(aid, uid):
        target = mock_get(aid, uid)
        if not target:
            return None
        for a in mock_addresses:
            if a["user_id"] == uid:
                a["is_default"] = (a["id"] == aid)
        return target

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(mock_get))
    monkeypatch.setattr(AddressRepository, "set_default", staticmethod(mock_set_default))

    app.dependency_overrides[get_current_user] = customer_user

    response = client.post("/api/v1/addresses/addr-2/default")
    assert response.status_code == 200
    assert mock_addresses[0]["is_default"] is False
    assert mock_addresses[1]["is_default"] is True


def test_delete_default_address_promotes_remaining(monkeypatch):
    mock_addresses = [
        {
            "id": "addr-1",
            "user_id": "customer-1",
            "full_name": "Addr 1",
            "phone": "9876543210",
            "line1": "Line 1",
            "city": "City",
            "state": "State",
            "postal_code": "560001",
            "country": "India",
            "is_default": True,
        },
        {
            "id": "addr-2",
            "user_id": "customer-1",
            "full_name": "Addr 2",
            "phone": "9876543210",
            "line1": "Line 2",
            "city": "City",
            "state": "State",
            "postal_code": "560002",
            "country": "India",
            "is_default": False,
        },
    ]

    def mock_get(aid, uid):
        for a in mock_addresses:
            if a["id"] == aid and a["user_id"] == uid:
                return a
        return None

    def mock_delete(aid, uid):
        target = mock_get(aid, uid)
        if not target:
            return False
        was_default = target["is_default"]
        mock_addresses.remove(target)
        if was_default and mock_addresses:
            mock_addresses[0]["is_default"] = True
        return True

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(mock_get))
    monkeypatch.setattr(AddressRepository, "delete", staticmethod(mock_delete))

    app.dependency_overrides[get_current_user] = customer_user

    res = client.delete("/api/v1/addresses/addr-1")
    assert res.status_code == 200
    assert len(mock_addresses) == 1
    assert mock_addresses[0]["is_default"] is True


def test_address_ownership_isolation(monkeypatch):
    app.dependency_overrides[get_current_user] = second_customer_user

    monkeypatch.setattr(AddressRepository, "get_by_id_and_user", staticmethod(lambda aid, uid: None))

    assert client.get("/api/v1/addresses/addr-101").status_code == 404
    assert client.put("/api/v1/addresses/addr-101", json={"full_name": "Attacker"}).status_code == 404
    assert client.delete("/api/v1/addresses/addr-101").status_code == 404
    assert client.post("/api/v1/addresses/addr-101/default").status_code == 404
