import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.core.dependencies import get_current_user
from app.main import app
from app.repositories import address_repository
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
        "is_default": False,
    }


class FakeSupabaseClient:
    def __init__(self, data_store):
        self.data_store = data_store

    def table(self, name):
        return FakeTableQuery(self.data_store)

    def rpc(self, name, params):
        target_user_id = params.get("target_user_id")
        target_address_id = params.get("target_address_id")
        for addr in self.data_store:
            if addr.get("user_id") == target_user_id:
                addr["is_default"] = (addr.get("id") == target_address_id)
        mock = MagicMock()
        mock.execute.return_value = MagicMock(data=None)
        return mock


class FakeTableQuery:
    def __init__(self, data_store):
        self.data_store = data_store
        self._action = None
        self._filters = []
        self._payload = None
        self._order_by = []
        self._limit_num = None

    def select(self, columns="*"):
        self._action = "select"
        return self

    def insert(self, payload):
        self._action = "insert"
        self._payload = payload
        return self

    def update(self, payload):
        self._action = "update"
        self._payload = payload
        return self

    def delete(self):
        self._action = "delete"
        return self

    def eq(self, column, value):
        self._filters.append((column, "eq", value))
        return self

    def neq(self, column, value):
        self._filters.append((column, "neq", value))
        return self

    def order(self, column, desc=False):
        self._order_by.append((column, desc))
        return self

    def limit(self, count):
        self._limit_num = count
        return self

    def _matches_filters(self, item):
        for col, op, val in self._filters:
            item_val = item.get(col)
            if op == "eq" and item_val != val:
                return False
            if op == "neq" and item_val == val:
                return False
        return True

    def execute(self):
        if self._action == "select":
            matched = [item for item in self.data_store if self._matches_filters(item)]
            for col, desc in reversed(self._order_by):
                matched.sort(key=lambda x: x.get(col, ""), reverse=desc)
            if self._limit_num:
                matched = matched[:self._limit_num]
            return MagicMock(data=matched)

        elif self._action == "insert":
            new_item = dict(self._payload)
            if "id" not in new_item:
                new_item["id"] = f"addr-{len(self.data_store) + 1}"
            self.data_store.append(new_item)
            return MagicMock(data=[new_item])

        elif self._action == "update":
            updated = []
            for item in self.data_store:
                if self._matches_filters(item):
                    item.update(self._payload)
                    updated.append(item)
            return MagicMock(data=updated)

        elif self._action == "delete":
            to_remove = [item for item in self.data_store if self._matches_filters(item)]
            for item in to_remove:
                self.data_store.remove(item)
            return MagicMock(data=to_remove)

        return MagicMock(data=[])


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

    # Invalid phone (letters, too short)
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
    db_store = []
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    injection_payload = sample_address_payload()
    injection_payload["user_id"] = "hacker-user-id"

    response = client.post("/api/v1/addresses", json=injection_payload)
    assert response.status_code == 201
    assert db_store[0]["user_id"] == "customer-1"


def test_list_and_get_user_addresses(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    db_store = [
        {"id": "addr-1", "user_id": "customer-1", "full_name": "User 1", "phone": "9876543210", "line1": "L1", "city": "Bengaluru", "state": "KA", "postal_code": "560001", "country": "India", "is_default": True},
        {"id": "addr-2", "user_id": "customer-1", "full_name": "User 1", "phone": "9876543210", "line1": "L2", "city": "Bengaluru", "state": "KA", "postal_code": "560002", "country": "India", "is_default": False},
    ]
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    # Test GET list addresses
    list_res = client.get("/api/v1/addresses")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 2

    # Test GET single address
    get_res = client.get("/api/v1/addresses/addr-1")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == "addr-1"


def test_update_address_fields(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    db_store = [
        {"id": "addr-1", "user_id": "customer-1", "full_name": "User 1", "phone": "9876543210", "line1": "Old Street", "city": "Bengaluru", "state": "KA", "postal_code": "560001", "country": "India", "is_default": True},
    ]
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    # Test PUT update address
    update_res = client.put("/api/v1/addresses/addr-1", json={"line1": "New Street 456", "phone": "9123456789"})
    assert update_res.status_code == 200
    assert db_store[0]["line1"] == "New Street 456"
    assert db_store[0]["phone"] == "9123456789"


def test_first_address_automatically_set_as_default(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    db_store = []
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    res1 = client.post("/api/v1/addresses", json=sample_address_payload())
    assert res1.status_code == 201
    assert res1.json()["data"]["is_default"] is True
    assert db_store[0]["is_default"] is True


def test_only_one_default_address(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    db_store = [
        {"id": "addr-1", "user_id": "customer-1", "full_name": "U1", "phone": "9876543210", "line1": "A1", "city": "C", "state": "S", "postal_code": "560001", "country": "India", "is_default": True},
        {"id": "addr-2", "user_id": "customer-1", "full_name": "U2", "phone": "9876543210", "line1": "A2", "city": "C", "state": "S", "postal_code": "560002", "country": "India", "is_default": False},
    ]
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    response = client.post("/api/v1/addresses/addr-2/default")
    assert response.status_code == 200
    assert db_store[0]["is_default"] is False
    assert db_store[1]["is_default"] is True


def test_delete_default_address_promotes_remaining(monkeypatch):
    app.dependency_overrides[get_current_user] = customer_user
    db_store = [
        {"id": "addr-1", "user_id": "customer-1", "full_name": "U1", "phone": "9876543210", "line1": "A1", "city": "C", "state": "S", "postal_code": "560001", "country": "India", "is_default": True},
        {"id": "addr-2", "user_id": "customer-1", "full_name": "U2", "phone": "9876543210", "line1": "A2", "city": "C", "state": "S", "postal_code": "560002", "country": "India", "is_default": False},
    ]
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    res = client.delete("/api/v1/addresses/addr-1")
    assert res.status_code == 200
    assert len(db_store) == 1
    assert db_store[0]["id"] == "addr-2"
    assert db_store[0]["is_default"] is True


def test_address_ownership_isolation(monkeypatch):
    app.dependency_overrides[get_current_user] = second_customer_user
    db_store = [
        {"id": "addr-101", "user_id": "customer-1", "full_name": "U1", "phone": "9876543210", "line1": "A1", "city": "C", "state": "S", "postal_code": "560001", "country": "India", "is_default": True},
    ]
    fake_client = FakeSupabaseClient(db_store)
    monkeypatch.setattr(address_repository, "get_supabase_admin", lambda: fake_client)

    assert client.get("/api/v1/addresses/addr-101").status_code == 404
    assert client.put("/api/v1/addresses/addr-101", json={"full_name": "Attacker"}).status_code == 404
    assert client.delete("/api/v1/addresses/addr-101").status_code == 404
    assert client.post("/api/v1/addresses/addr-101/default").status_code == 404
