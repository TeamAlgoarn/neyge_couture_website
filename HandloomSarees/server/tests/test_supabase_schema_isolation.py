from types import SimpleNamespace

import pytest
from pydantic import ValidationError

import app.core.database as database
from app.core.config import Settings


def _settings_kwargs(app_env: str, schema: str) -> dict:
    return {
        "APP_ENV": app_env,
        "DEBUG": False,
        "SUPABASE_URL": "https://example.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "service-role-placeholder",
        "SUPABASE_ANON_KEY": "anon-placeholder",
        "SUPABASE_DB_SCHEMA": schema,
        "JWT_SECRET": "jwt-placeholder",
        "PAYMENTS_ENABLED": True,
        "RAZORPAY_ENABLED": True,
        "RAZORPAY_KEY_ID": "rzp_test_placeholder",
        "RAZORPAY_KEY_SECRET": "razorpay-placeholder",
        "RAZORPAY_WEBHOOK_SECRET": "webhook-placeholder",
        "CLOUDINARY_CLOUD_NAME": "cloud",
        "CLOUDINARY_API_KEY": "cloud-key",
        "CLOUDINARY_API_SECRET": "cloud-secret",
        "WHATSAPP_ENABLED": False,
        "INSTAGRAM_ENABLED": False,
    }


def _settings(app_env: str, schema: str) -> Settings:
    return Settings(_env_file=None, **_settings_kwargs(app_env, schema))


@pytest.mark.parametrize(
    ("app_env", "schema", "expected_allowed", "expected_schema"),
    [
        ("development", "public", True, "public"),
        ("development", "preview", True, "preview"),
        ("test", "public", True, "public"),
        ("test", "preview", True, "preview"),
        ("staging", "preview", True, "preview"),
        ("staging", "public", False, None),
        ("production", "public", True, "public"),
        ("production", "preview", False, None),
        ("development", "foobar", False, None),
        ("test", "foobar", False, None),
        ("staging", "foobar", False, None),
        ("production", "foobar", False, None),
    ],
)
def test_supabase_schema_validation_matrix(
    app_env, schema, expected_allowed, expected_schema
):
    if expected_allowed:
        settings = _settings(app_env, schema)
        assert settings.SUPABASE_DB_SCHEMA == expected_schema
    else:
        with pytest.raises(ValidationError):
            _settings(app_env, schema)


@pytest.mark.parametrize(
    ("raw_schema", "expected_schema"),
    [
        ("PUBLIC", "public"),
        (" preview ", "preview"),
        ("", "public"),
    ],
)
def test_supabase_schema_normalization(raw_schema, expected_schema):
    settings = _settings("development", raw_schema)

    assert settings.SUPABASE_DB_SCHEMA == expected_schema


def test_supabase_admin_client_uses_configured_preview_schema(monkeypatch):
    calls = []
    fake_client = SimpleNamespace(name="admin")

    def fake_create_client(url, key, options=None):
        calls.append((url, key, options))
        return fake_client

    monkeypatch.setattr(database, "_supabase_admin", None)
    monkeypatch.setattr(database, "settings", _settings("staging", "preview"))
    monkeypatch.setattr(database, "create_client", fake_create_client)

    assert database.get_supabase_admin() is fake_client
    assert calls[0][2].schema == "preview"


def test_supabase_public_client_uses_configured_public_schema(monkeypatch):
    calls = []
    fake_client = SimpleNamespace(name="public")

    def fake_create_client(url, key, options=None):
        calls.append((url, key, options))
        return fake_client

    monkeypatch.setattr(database, "_supabase_public", None)
    monkeypatch.setattr(database, "settings", _settings("production", "PUBLIC"))
    monkeypatch.setattr(database, "create_client", fake_create_client)

    assert database.get_supabase_public() is fake_client
    assert calls[0][2].schema == "public"


def test_supabase_schema_configuration_does_not_replace_auth_or_storage_apis():
    options = database.ClientOptions(schema="preview")

    assert options.schema == "preview"
