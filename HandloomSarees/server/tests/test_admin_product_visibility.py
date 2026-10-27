"""Regression tests for admin product access and storefront visibility.

All product data is synthetic. No live Supabase calls are required.
"""

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user, require_admin
from app.repositories.product_repository import ProductRepository


API = "/api/v1/products"


@pytest.fixture(autouse=True)
def clean_auth_overrides():
    original = app.dependency_overrides.copy()
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()
    app.dependency_overrides.update(original)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def products():
    return [
        {
            "id": f"test-product-{i:02d}",
            "name": f"Test Saree {i}",
            "price": 1000,
            "is_active": i <= 19,
            "is_featured": i <= 5 or i == 22,
            "product_variants": [],
        }
        for i in range(1, 23)
    ]


def authenticated_admin():
    return {
        "profile": {
            "id": "test-admin",
            "role": "admin",
            "is_active": True,
        }
    }


def authenticated_customer():
    return {
        "profile": {
            "id": "test-customer",
            "role": "customer",
            "is_active": True,
        }
    }


def mock_admin_list(monkeypatch, products):
    def list_admin(page, page_size):
        start = (page - 1) * page_size
        return products[start:start + page_size], len(products)

    monkeypatch.setattr(ProductRepository, "list_admin", list_admin)


def test_admin_list_without_auth_returns_401(client):
    response = client.get(f"{API}/admin/all")
    assert response.status_code == 401


def test_admin_list_customer_returns_403(client):
    app.dependency_overrides[get_current_user] = authenticated_customer
    response = client.get(f"{API}/admin/all")
    assert response.status_code == 403


def test_admin_list_includes_inactive_and_paginates(
    client, monkeypatch, products
):
    app.dependency_overrides[require_admin] = authenticated_admin
    mock_admin_list(monkeypatch, products)

    first = client.get(
        f"{API}/admin/all",
        params={"page": 1, "page_size": 12},
    )
    second = client.get(
        f"{API}/admin/all",
        params={"page": 2, "page_size": 12},
    )

    assert first.status_code == 200
    assert second.status_code == 200

    page1 = first.json()["data"]
    page2 = second.json()["data"]

    assert len(page1["items"]) == 12
    assert len(page2["items"]) == 10

    assert page1["pagination"]["total"] == 22
    assert page2["pagination"]["total"] == 22
    assert page1["pagination"]["total_pages"] == 2

    returned = page1["items"] + page2["items"]
    assert len({item["id"] for item in returned}) == 22
    assert any(item["is_active"] is False for item in returned)


def test_admin_detail_without_auth_returns_401(client):
    response = client.get(f"{API}/admin/test-product-22")
    assert response.status_code == 401


def test_admin_detail_customer_returns_403(client):
    app.dependency_overrides[get_current_user] = authenticated_customer
    response = client.get(f"{API}/admin/test-product-22")
    assert response.status_code == 403


def test_admin_can_read_inactive_product(
    client, monkeypatch, products
):
    app.dependency_overrides[require_admin] = authenticated_admin
    inactive = products[-1]

    monkeypatch.setattr(
        ProductRepository,
        "get_by_id",
        lambda product_id: inactive
        if product_id == inactive["id"] else None,
    )

    response = client.get(f"{API}/admin/{inactive['id']}")

    assert response.status_code == 200
    assert response.json()["data"]["is_active"] is False


def test_public_product_detail_excludes_inactive(
    client, monkeypatch, products
):
    inactive = products[-1]

    monkeypatch.setattr(
        ProductRepository,
        "get_by_id",
        lambda product_id: inactive,
    )

    response = client.get(f"{API}/{inactive['id']}")
    assert response.status_code == 404


def test_public_slug_excludes_inactive(
    client, monkeypatch, products
):
    inactive = products[-1]

    monkeypatch.setattr(
        ProductRepository,
        "get_by_slug",
        lambda slug: inactive,
    )

    response = client.get(f"{API}/slug/inactive-test-saree")
    assert response.status_code == 404


def test_featured_query_requires_active_and_featured(
    client, monkeypatch
):
    """Check filtering at the Supabase query-building boundary."""
    queries = []

    def make_query(table_name):
        assert table_name == "products"

        query = MagicMock()
        query.eq.return_value = query
        query.order.return_value = query
        query.range.return_value = query
        query.select.return_value = query
        query.limit.return_value = query
        query.execute.return_value = SimpleNamespace(
            data=[],
            count=0,
        )
        queries.append(query)
        return query

    database = MagicMock()
    database.table.side_effect = make_query

    monkeypatch.setattr(
        "app.repositories.product_repository.get_supabase_admin",
        lambda: database,
    )

    response = client.get(
        API,
        params={"featured": "true", "page": 1, "page_size": 12},
    )

    assert response.status_code == 200
    assert len(queries) >= 2

    for query in queries:
        filters = [
            call.args
            for call in query.eq.call_args_list
        ]
        assert ("is_active", True) in filters
        assert ("is_featured", True) in filters

    assert response.json()["data"]["items"] == []


def test_admin_pagination_parameter_validation(client):
    app.dependency_overrides[require_admin] = authenticated_admin

    assert client.get(
        f"{API}/admin/all", params={"page": 0}
    ).status_code == 422

    assert client.get(
        f"{API}/admin/all", params={"page_size": 51}
    ).status_code == 422