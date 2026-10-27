import asyncio
from types import SimpleNamespace
from unittest.mock import MagicMock

import jwt
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.dependencies import get_current_user, require_admin
from app.core.rate_limit import limiter
from app.main import app
from app.schemas.auth import ChangePasswordRequest, LoginRequest, ResetPasswordRequest
from app.services.auth_service import AuthService


client = TestClient(app)
VALID_PASSWORD = "SyntheticPass1!"
OTHER_PASSWORD = "DifferentPass2!"


def auth_method_token(method: str) -> str:
    return jwt.encode(
        {"amr": [{"method": method}]},
        "synthetic-test-signing-key-with-ample-length",
        algorithm="HS256",
    )


def active_admin() -> dict:
    return {
        "auth": {"id": "admin-test-id", "email": "admin-test@example.com"},
        "profile": {
            "id": "admin-test-id",
            "email": "admin-test@example.com",
            "role": "admin",
            "is_active": True,
        },
        "access_token": "synthetic-access-token",
    }


def active_customer() -> dict:
    return {
        "auth": {"id": "customer-test-id", "email": "customer-test@example.com"},
        "profile": {"id": "customer-test-id", "role": "user", "is_active": True},
        "access_token": "synthetic-access-token",
    }


@pytest.fixture(autouse=True)
def reset_app_state():
    app.dependency_overrides.clear()
    limiter.reset()
    yield
    app.dependency_overrides.clear()
    limiter.reset()


def test_admin_login_endpoint_accepts_valid_admin(monkeypatch):
    monkeypatch.setattr(
        AuthService,
        "admin_login",
        lambda _payload: {
            "access_token": "synthetic-admin-token",
            "token_type": "bearer",
            "user": {"id": "admin-test-id", "role": "admin", "is_active": True},
        },
    )

    response = client.post(
        "/api/v1/auth/admin/login",
        json={"email": "admin-test@example.com", "password": VALID_PASSWORD},
    )

    assert response.status_code == 200
    assert response.json()["data"]["user"]["role"] == "admin"


def test_admin_login_returns_no_refresh_token(monkeypatch):
    auth_client = MagicMock()
    monkeypatch.setattr(
        AuthService,
        "_authenticate",
        lambda _payload: (
            auth_client,
            {
                "access_token": "synthetic-admin-token",
                "refresh_token": "synthetic-refresh-token",
                "user": {"id": "admin-test-id", "role": "admin", "is_active": True},
            },
        ),
    )

    result = AuthService.admin_login(
        LoginRequest(email="admin-test@example.com", password=VALID_PASSWORD)
    )

    assert "refresh_token" not in result


@pytest.mark.parametrize("role", ["user", None])
def test_admin_login_fails_closed_for_non_admin_or_missing_role(monkeypatch, role):
    auth_client = MagicMock()
    monkeypatch.setattr(
        AuthService,
        "_authenticate",
        lambda _payload: (
            auth_client,
            {
                "access_token": "synthetic-user-token",
                "user": {"id": "user-test-id", "role": role, "is_active": True},
            },
        ),
    )

    with pytest.raises(HTTPException) as exc_info:
        AuthService.admin_login(
            LoginRequest(email="user-test@example.com", password=VALID_PASSWORD)
        )

    assert exc_info.value.status_code == 403
    auth_client.auth.sign_out.assert_called_once_with({"scope": "global"})


@pytest.mark.parametrize("is_active", [False, None])
def test_admin_login_fails_closed_for_inactive_or_missing_status(monkeypatch, is_active):
    auth_client = MagicMock()
    monkeypatch.setattr(
        AuthService,
        "_authenticate",
        lambda _payload: (
            auth_client,
            {
                "access_token": "synthetic-admin-token",
                "user": {
                    "id": "admin-test-id",
                    "role": "admin",
                    "is_active": is_active,
                },
            },
        ),
    )

    with pytest.raises(HTTPException) as exc_info:
        AuthService.admin_login(
            LoginRequest(email="admin-test@example.com", password=VALID_PASSWORD)
        )

    assert exc_info.value.status_code == 403


def test_forgot_password_response_is_generic(monkeypatch):
    requested = []
    monkeypatch.setattr(
        AuthService,
        "request_password_reset",
        lambda email: requested.append(email),
    )

    response = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "unknown@example.com"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == (
        "If an account exists for this email, a password reset link has been sent."
    )
    assert requested == ["unknown@example.com"]


def test_forgot_password_keeps_upstream_failures_generic(monkeypatch):
    auth_client = MagicMock()
    auth_client.auth.reset_password_for_email.side_effect = RuntimeError("upstream unavailable")
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )

    AuthService.request_password_reset("unknown@example.com")


def test_forgot_password_uses_configured_admin_reset_redirect(monkeypatch):
    auth_client = MagicMock()
    monkeypatch.setattr(settings, "FRONTEND_URL", "https://neygecouture.com")
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )

    AuthService.request_password_reset("admin-test@example.com")

    auth_client.auth.reset_password_for_email.assert_called_once_with(
        "admin-test@example.com",
        {"redirect_to": "https://neygecouture.com/admin/reset-password"},
    )


def test_forgot_password_is_rate_limited(monkeypatch):
    monkeypatch.setattr(AuthService, "request_password_reset", lambda _email: None)

    responses = [
        client.post(
            "/api/v1/auth/forgot-password",
            json={"email": "rate-test@example.com"},
        )
        for _ in range(4)
    ]

    assert [response.status_code for response in responses[:3]] == [200, 200, 200]
    assert responses[3].status_code == 429


def test_reset_password_rejects_invalid_or_expired_session(monkeypatch):
    auth_client = MagicMock()
    auth_client.auth.set_session.side_effect = RuntimeError("invalid session")
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )

    payload = ResetPasswordRequest(
        access_token="synthetic-access-token-value",
        refresh_token="synthetic-refresh-token-value",
        recovery_type="recovery",
        new_password=VALID_PASSWORD,
        confirm_password=VALID_PASSWORD,
    )

    with pytest.raises(HTTPException) as exc_info:
        AuthService.reset_admin_password(payload)

    assert exc_info.value.status_code == 400
    assert "invalid or has expired" in exc_info.value.detail


def test_reset_password_rejects_mismatched_passwords():
    response = client.post(
        "/api/v1/auth/reset-password",
        json={
            "access_token": "synthetic-access-token-value",
            "refresh_token": "synthetic-refresh-token-value",
            "recovery_type": "recovery",
            "new_password": VALID_PASSWORD,
            "confirm_password": OTHER_PASSWORD,
        },
    )

    assert response.status_code == 422
    assert "synthetic-access-token-value" not in response.text
    assert VALID_PASSWORD not in response.text
    assert OTHER_PASSWORD not in response.text


def test_successful_admin_reset_updates_password_and_revokes_session(monkeypatch):
    auth_client = MagicMock()
    auth_client.auth.set_session.return_value = SimpleNamespace(
        user=SimpleNamespace(id="admin-test-id"),
        session=SimpleNamespace(access_token=auth_method_token("recovery")),
    )
    auth_client.auth.update_user.return_value = SimpleNamespace(
        user=SimpleNamespace(id="admin-test-id")
    )
    admin_client = MagicMock()
    admin_client.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = SimpleNamespace(
        data={"id": "admin-test-id", "role": "admin", "is_active": True}
    )
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )
    monkeypatch.setattr("app.services.auth_service.get_supabase_admin", lambda: admin_client)

    payload = ResetPasswordRequest(
        access_token="synthetic-access-token-value",
        refresh_token="synthetic-refresh-token-value",
        recovery_type="recovery",
        new_password=VALID_PASSWORD,
        confirm_password=VALID_PASSWORD,
    )
    AuthService.reset_admin_password(payload)

    auth_client.auth.update_user.assert_called_once_with({"password": VALID_PASSWORD})
    auth_client.auth.sign_out.assert_called_once_with({"scope": "global"})


def test_reset_password_rejects_non_recovery_admin_session(monkeypatch):
    auth_client = MagicMock()
    auth_client.auth.set_session.return_value = SimpleNamespace(
        user=SimpleNamespace(id="admin-test-id"),
        session=SimpleNamespace(access_token=auth_method_token("password")),
    )
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )

    payload = ResetPasswordRequest(
        access_token="synthetic-access-token-value",
        refresh_token="synthetic-refresh-token-value",
        recovery_type="recovery",
        new_password=VALID_PASSWORD,
        confirm_password=VALID_PASSWORD,
    )

    with pytest.raises(HTTPException) as exc_info:
        AuthService.reset_admin_password(payload)

    assert exc_info.value.status_code == 400
    auth_client.auth.update_user.assert_not_called()


def test_change_password_requires_admin_role():
    app.dependency_overrides[get_current_user] = active_customer

    response = client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": OTHER_PASSWORD,
            "new_password": VALID_PASSWORD,
            "confirm_password": VALID_PASSWORD,
        },
        headers={"Authorization": "Bearer synthetic-access-token"},
    )

    assert response.status_code == 403


def test_authenticated_admin_can_change_password(monkeypatch):
    app.dependency_overrides[require_admin] = active_admin
    called = []
    monkeypatch.setattr(
        AuthService,
        "change_admin_password",
        lambda payload, user: called.append((payload, user)),
    )

    response = client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": OTHER_PASSWORD,
            "new_password": VALID_PASSWORD,
            "confirm_password": VALID_PASSWORD,
        },
        headers={"Authorization": "Bearer synthetic-access-token"},
    )

    assert response.status_code == 200
    assert called[0][1]["profile"]["role"] == "admin"


def test_change_password_reauthenticates_updates_and_revokes(monkeypatch):
    auth_client = MagicMock()
    auth_client.auth.sign_in_with_password.return_value = SimpleNamespace(
        user=SimpleNamespace(id="admin-test-id")
    )
    auth_client.auth.update_user.return_value = SimpleNamespace(
        user=SimpleNamespace(id="admin-test-id")
    )
    monkeypatch.setattr(
        "app.services.auth_service.create_supabase_public_client",
        lambda: auth_client,
    )

    payload = ChangePasswordRequest(
        current_password=OTHER_PASSWORD,
        new_password=VALID_PASSWORD,
        confirm_password=VALID_PASSWORD,
    )
    AuthService.change_admin_password(payload, active_admin())

    auth_client.auth.sign_in_with_password.assert_called_once()
    auth_client.auth.update_user.assert_called_once_with({"password": VALID_PASSWORD})
    auth_client.auth.sign_out.assert_called_once_with({"scope": "global"})


def test_require_admin_rejects_missing_role_and_allows_admin():
    missing_role = {"profile": {"id": "missing-role-user"}}
    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(require_admin(missing_role))
    assert exc_info.value.status_code == 403

    result = asyncio.run(require_admin(active_admin()))
    assert result["profile"]["role"] == "admin"


@pytest.mark.parametrize("is_active", [False, None])
def test_require_admin_rejects_inactive_or_missing_status(is_active):
    user = active_admin()
    user["profile"]["is_active"] = is_active

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(require_admin(user))

    assert exc_info.value.status_code == 403
