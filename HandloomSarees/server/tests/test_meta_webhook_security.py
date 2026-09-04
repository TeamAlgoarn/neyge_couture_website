"""
Unit and Integration Tests for WhatsApp and Instagram Webhook Security (Issue #15)
───────────────────────────────────────────────────────────────────────────────────
Covers:
  - HMAC-SHA256 signature verification on raw request bodies
  - X-Hub-Signature-256 header validation (presence, prefix, constant-time compare)
  - GET subscription challenge verification (timing safe, missing secret safety)
  - Atomic reserve-first event deduplication with normalized source-prefixed keys
  - Missing-secret safety in both runtime and production startup validation
  - Error handling: 400 Bad Request, 403 Forbidden, 500 Internal Error, 503 Unavailable
"""

import hashlib
import hmac
import json
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.main import app

client = TestClient(app)

WHATSAPP_SECRET = "whatsapp_test_secret_key_12345"
WHATSAPP_VERIFY_TOKEN = "whatsapp_verify_token_abc"

INSTAGRAM_SECRET = "instagram_test_secret_key_67890"
INSTAGRAM_VERIFY_TOKEN = "instagram_verify_token_xyz"


def _make_whatsapp_signature(body: bytes, secret: str = WHATSAPP_SECRET) -> str:
    digest = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return f"sha256={digest}"


def _make_instagram_signature(body: bytes, secret: str = INSTAGRAM_SECRET) -> str:
    digest = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return f"sha256={digest}"


def _make_whatsapp_message_payload(msg_id="wamid.HBgL12345", text="hello", phone="919876543210"):
    return {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "WHATSAPP_BIZ_ID",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "15551234567",
                                "phone_number_id": "123456789",
                            },
                            "messages": [
                                {
                                    "from": phone,
                                    "id": msg_id,
                                    "timestamp": "1700000000",
                                    "text": {"body": text},
                                    "type": "text",
                                }
                            ],
                        },
                        "field": "messages",
                    }
                ],
            }
        ],
    }


def _make_whatsapp_status_payload(status_id="wamid.HBgL12345", status="delivered", recipient="919876543210"):
    return {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "WHATSAPP_BIZ_ID",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "15551234567",
                                "phone_number_id": "123456789",
                            },
                            "statuses": [
                                {
                                    "id": status_id,
                                    "status": status,
                                    "timestamp": "1700000001",
                                    "recipient_id": recipient,
                                }
                            ],
                        },
                        "field": "messages",
                    }
                ],
            }
        ],
    }


def _make_instagram_dm_payload(mid="m_mid.12345", text="hello", sender_id="user_inst_1"):
    return {
        "object": "instagram",
        "entry": [
            {
                "id": "INSTAGRAM_BIZ_ID",
                "time": 1700000000,
                "messaging": [
                    {
                        "sender": {"id": sender_id},
                        "recipient": {"id": "INSTAGRAM_BIZ_ID"},
                        "timestamp": 1700000000,
                        "message": {
                            "mid": mid,
                            "text": text,
                        },
                    }
                ],
            }
        ],
    }


def _make_instagram_comment_payload(comment_id="comment_789", text="beautiful saree"):
    return {
        "object": "instagram",
        "entry": [
            {
                "id": "INSTAGRAM_BIZ_ID",
                "time": 1700000000,
                "changes": [
                    {
                        "field": "comments",
                        "value": {
                            "id": comment_id,
                            "text": text,
                        },
                    }
                ],
            }
        ],
    }


# ════════════════════════════════════════════════════════════════════════════════
# 1. WhatsApp Webhook Verification (GET)
# ════════════════════════════════════════════════════════════════════════════════

class TestWhatsAppGetWebhookVerification:
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_get_webhook_valid_token(self, mock_settings):
        mock_settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN = WHATSAPP_VERIFY_TOKEN
        response = client.get(
            "/api/v1/whatsapp/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": WHATSAPP_VERIFY_TOKEN,
                "hub.challenge": "challenge_code_12345",
            },
        )
        assert response.status_code == 200
        assert response.text == "challenge_code_12345"

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_get_webhook_invalid_token(self, mock_settings):
        mock_settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN = WHATSAPP_VERIFY_TOKEN
        response = client.get(
            "/api/v1/whatsapp/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": "wrong_verify_token",
                "hub.challenge": "challenge_code_12345",
            },
        )
        assert response.status_code == 403
        assert response.json()["message"] == "Verification failed"

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_get_webhook_invalid_mode(self, mock_settings):
        mock_settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN = WHATSAPP_VERIFY_TOKEN
        response = client.get(
            "/api/v1/whatsapp/webhook",
            params={
                "hub.mode": "unsubscribe",
                "hub.verify_token": WHATSAPP_VERIFY_TOKEN,
                "hub.challenge": "challenge_code_12345",
            },
        )
        assert response.status_code == 403
        assert response.json()["message"] == "Verification failed"

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_get_webhook_missing_verify_token_in_settings(self, mock_settings):
        mock_settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN = ""
        response = client.get(
            "/api/v1/whatsapp/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": "any_token",
                "hub.challenge": "challenge_code_12345",
            },
        )
        assert response.status_code == 500
        assert "not configured" in response.json()["message"].lower()


# ════════════════════════════════════════════════════════════════════════════════
# 2. WhatsApp Webhook Signature Verification (POST)
# ════════════════════════════════════════════════════════════════════════════════

class TestWhatsAppPostWebhookSignature:
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_post_webhook_missing_signature_header(self, mock_settings):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        payload = _make_whatsapp_message_payload()
        response = client.post("/api/v1/whatsapp/webhook", json=payload)
        assert response.status_code == 400
        assert "Missing X-Hub-Signature-256 header" in response.json()["message"]

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_post_webhook_malformed_signature_no_prefix(self, mock_settings):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        payload = _make_whatsapp_message_payload()
        body = json.dumps(payload).encode()
        raw_hash = hmac.new(WHATSAPP_SECRET.encode(), body, hashlib.sha256).hexdigest()
        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": raw_hash},
        )
        assert response.status_code == 400
        assert "Invalid signature format" in response.json()["message"]

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_post_webhook_invalid_signature_digest(self, mock_settings):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        payload = _make_whatsapp_message_payload()
        body = json.dumps(payload).encode()
        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=invalidhex000011112222"},
        )
        assert response.status_code == 400
        assert "Invalid webhook signature" in response.json()["message"]

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_post_webhook_missing_secret_in_settings(self, mock_settings):
        mock_settings.WHATSAPP_APP_SECRET = ""
        payload = _make_whatsapp_message_payload()
        body = json.dumps(payload).encode()
        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=fake"},
        )
        assert response.status_code == 500
        assert "Webhook secret not configured" in response.json()["message"]

    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_post_webhook_invalid_json(self, mock_settings):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        body = b"{not: valid, json...}"
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)
        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 400
        assert "Invalid JSON payload" in response.json()["message"]


# ════════════════════════════════════════════════════════════════════════════════
# 3. WhatsApp Webhook Deduplication & Message Processing (POST)
# ════════════════════════════════════════════════════════════════════════════════

class TestWhatsAppWebhookDeduplication:
    @patch("app.api.v1.whatsapp.send_whatsapp_message", new_callable=AsyncMock)
    @patch("app.api.v1.whatsapp.PaymentRepository")
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_message_processed_and_marked(self, mock_settings, mock_repo, mock_send):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        mock_repo.reserve_webhook_event.return_value = True
        mock_send.return_value = {"messaging_product": "whatsapp"}

        payload = _make_whatsapp_message_payload(msg_id="wamid.MSG001", text="hi", phone="919999999999")
        body = json.dumps(payload).encode()
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)

        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_repo.reserve_webhook_event.assert_called_once_with("whatsapp:msg:wamid.MSG001", "whatsapp.message")
        mock_send.assert_awaited_once()
        mock_repo.mark_webhook_event_processed.assert_called_once_with("whatsapp:msg:wamid.MSG001")

    @patch("app.api.v1.whatsapp.send_whatsapp_message", new_callable=AsyncMock)
    @patch("app.api.v1.whatsapp.PaymentRepository")
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_duplicate_message_skipped(self, mock_settings, mock_repo, mock_send):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        # Duplicate message: reserve returns False
        mock_repo.reserve_webhook_event.return_value = False

        payload = _make_whatsapp_message_payload(msg_id="wamid.MSG001", text="hi")
        body = json.dumps(payload).encode()
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)

        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_repo.reserve_webhook_event.assert_called_once_with("whatsapp:msg:wamid.MSG001", "whatsapp.message")
        mock_send.assert_not_awaited()
        mock_repo.mark_webhook_event_processed.assert_not_called()

    @patch("app.api.v1.whatsapp.PaymentRepository")
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_status_update_deduplication(self, mock_settings, mock_repo):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        mock_repo.reserve_webhook_event.return_value = True

        payload = _make_whatsapp_status_payload(status_id="wamid.MSG001", status="delivered")
        body = json.dumps(payload).encode()
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)

        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        mock_repo.reserve_webhook_event.assert_called_once_with("whatsapp:status:wamid.MSG001:delivered", "whatsapp.status")
        mock_repo.mark_webhook_event_processed.assert_called_once_with("whatsapp:status:wamid.MSG001:delivered")

    @patch("app.api.v1.whatsapp.PaymentRepository")
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_reservation_db_error_returns_503(self, mock_settings, mock_repo):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        mock_repo.reserve_webhook_event.side_effect = RuntimeError("Database connection timeout")

        payload = _make_whatsapp_message_payload(msg_id="wamid.MSG001", text="hi")
        body = json.dumps(payload).encode()
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)

        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 503
        assert "retry" in response.json()["message"].lower()

    @patch("app.api.v1.whatsapp.send_whatsapp_message", new_callable=AsyncMock)
    @patch("app.api.v1.whatsapp.PaymentRepository")
    @patch("app.api.v1.whatsapp.settings")
    def test_whatsapp_processing_failure_marks_failed_and_returns_503(self, mock_settings, mock_repo, mock_send):
        mock_settings.WHATSAPP_APP_SECRET = WHATSAPP_SECRET
        mock_repo.reserve_webhook_event.return_value = True
        mock_send.side_effect = Exception("WhatsApp Graph API 500 error")

        payload = _make_whatsapp_message_payload(msg_id="wamid.MSG001", text="shop")
        body = json.dumps(payload).encode()
        sig = _make_whatsapp_signature(body, WHATSAPP_SECRET)

        response = client.post(
            "/api/v1/whatsapp/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 503
        mock_repo.mark_webhook_event_failed.assert_called_once()
        assert "WhatsApp Graph API 500 error" in mock_repo.mark_webhook_event_failed.call_args[0][1]


# ════════════════════════════════════════════════════════════════════════════════
# 4. Instagram Webhook Verification (GET)
# ════════════════════════════════════════════════════════════════════════════════

class TestInstagramGetWebhookVerification:
    @patch("app.api.v1.instagram.settings")
    def test_instagram_get_webhook_valid_token(self, mock_settings):
        mock_settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN = INSTAGRAM_VERIFY_TOKEN
        response = client.get(
            "/api/v1/instagram/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": INSTAGRAM_VERIFY_TOKEN,
                "hub.challenge": "instagram_challenge_999",
            },
        )
        assert response.status_code == 200
        assert response.text == "instagram_challenge_999"

    @patch("app.api.v1.instagram.settings")
    def test_instagram_get_webhook_invalid_token(self, mock_settings):
        mock_settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN = INSTAGRAM_VERIFY_TOKEN
        response = client.get(
            "/api/v1/instagram/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": "invalid_insta_token",
                "hub.challenge": "instagram_challenge_999",
            },
        )
        assert response.status_code == 403
        assert response.json()["message"] == "Verification failed"

    @patch("app.api.v1.instagram.settings")
    def test_instagram_get_webhook_invalid_mode(self, mock_settings):
        mock_settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN = INSTAGRAM_VERIFY_TOKEN
        response = client.get(
            "/api/v1/instagram/webhook",
            params={
                "hub.mode": "invalid_mode",
                "hub.verify_token": INSTAGRAM_VERIFY_TOKEN,
                "hub.challenge": "instagram_challenge_999",
            },
        )
        assert response.status_code == 403
        assert response.json()["message"] == "Verification failed"

    @patch("app.api.v1.instagram.settings")
    def test_instagram_get_webhook_missing_verify_token_in_settings(self, mock_settings):
        mock_settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN = ""
        response = client.get(
            "/api/v1/instagram/webhook",
            params={
                "hub.mode": "subscribe",
                "hub.verify_token": "any_token",
                "hub.challenge": "instagram_challenge_999",
            },
        )
        assert response.status_code == 500
        assert "not configured" in response.json()["message"].lower()


# ════════════════════════════════════════════════════════════════════════════════
# 5. Instagram Webhook Signature Verification (POST)
# ════════════════════════════════════════════════════════════════════════════════

class TestInstagramPostWebhookSignature:
    @patch("app.api.v1.instagram.settings")
    def test_instagram_post_webhook_missing_signature_header(self, mock_settings):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        payload = _make_instagram_dm_payload()
        response = client.post("/api/v1/instagram/webhook", json=payload)
        assert response.status_code == 400
        assert "Missing X-Hub-Signature-256 header" in response.json()["message"]

    @patch("app.api.v1.instagram.settings")
    def test_instagram_post_webhook_malformed_signature_no_prefix(self, mock_settings):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        payload = _make_instagram_dm_payload()
        body = json.dumps(payload).encode()
        raw_hash = hmac.new(INSTAGRAM_SECRET.encode(), body, hashlib.sha256).hexdigest()
        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": raw_hash},
        )
        assert response.status_code == 400
        assert "Invalid signature format" in response.json()["message"]

    @patch("app.api.v1.instagram.settings")
    def test_instagram_post_webhook_invalid_signature_digest(self, mock_settings):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        payload = _make_instagram_dm_payload()
        body = json.dumps(payload).encode()
        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=invalidhex9999"},
        )
        assert response.status_code == 400
        assert "Invalid webhook signature" in response.json()["message"]

    @patch("app.api.v1.instagram.settings")
    def test_instagram_post_webhook_missing_secret_in_settings(self, mock_settings):
        mock_settings.INSTAGRAM_APP_SECRET = ""
        payload = _make_instagram_dm_payload()
        body = json.dumps(payload).encode()
        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=fake"},
        )
        assert response.status_code == 500
        assert "Webhook secret not configured" in response.json()["message"]

    @patch("app.api.v1.instagram.settings")
    def test_instagram_post_webhook_invalid_json(self, mock_settings):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        body = b"{bad json string}"
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)
        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 400
        assert "Invalid JSON payload" in response.json()["message"]


# ════════════════════════════════════════════════════════════════════════════════
# 6. Instagram Webhook Deduplication & Event Processing (POST)
# ════════════════════════════════════════════════════════════════════════════════

class TestInstagramWebhookDeduplication:
    @patch("app.api.v1.instagram.send_instagram_reply", new_callable=AsyncMock)
    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_dm_processed_and_marked(self, mock_settings, mock_repo, mock_send):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.return_value = True
        mock_send.return_value = {"recipient_id": "user_inst_1"}

        payload = _make_instagram_dm_payload(mid="m_mid.DM001", text="price", sender_id="user_inst_1")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_repo.reserve_webhook_event.assert_called_once_with("instagram:dm:m_mid.DM001", "instagram.message")
        mock_send.assert_awaited_once()
        mock_repo.mark_webhook_event_processed.assert_called_once_with("instagram:dm:m_mid.DM001")

    @patch("app.api.v1.instagram.send_instagram_reply", new_callable=AsyncMock)
    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_duplicate_dm_skipped(self, mock_settings, mock_repo, mock_send):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.return_value = False

        payload = _make_instagram_dm_payload(mid="m_mid.DM001", text="price", sender_id="user_inst_1")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
        mock_repo.reserve_webhook_event.assert_called_once_with("instagram:dm:m_mid.DM001", "instagram.message")
        mock_send.assert_not_awaited()
        mock_repo.mark_webhook_event_processed.assert_not_called()

    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_comment_processed_and_marked(self, mock_settings, mock_repo):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.return_value = True

        payload = _make_instagram_comment_payload(comment_id="comment_001", text="love this!")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        mock_repo.reserve_webhook_event.assert_called_once_with("instagram:comment:comment_001", "instagram.comment")
        mock_repo.mark_webhook_event_processed.assert_called_once_with("instagram:comment:comment_001")

    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_duplicate_comment_skipped(self, mock_settings, mock_repo):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.return_value = False

        payload = _make_instagram_comment_payload(comment_id="comment_001", text="love this!")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 200
        mock_repo.reserve_webhook_event.assert_called_once_with("instagram:comment:comment_001", "instagram.comment")
        mock_repo.mark_webhook_event_processed.assert_not_called()

    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_reservation_db_error_returns_503(self, mock_settings, mock_repo):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.side_effect = RuntimeError("Database connection reset")

        payload = _make_instagram_dm_payload(mid="m_mid.DM001", text="price")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 503
        assert "retry" in response.json()["message"].lower()

    @patch("app.api.v1.instagram.send_instagram_reply", new_callable=AsyncMock)
    @patch("app.api.v1.instagram.PaymentRepository")
    @patch("app.api.v1.instagram.settings")
    def test_instagram_processing_failure_marks_failed_and_returns_503(self, mock_settings, mock_repo, mock_send):
        mock_settings.INSTAGRAM_APP_SECRET = INSTAGRAM_SECRET
        mock_repo.reserve_webhook_event.return_value = True
        mock_send.side_effect = Exception("Instagram Graph API connection failed")

        payload = _make_instagram_dm_payload(mid="m_mid.DM001", text="hello")
        body = json.dumps(payload).encode()
        sig = _make_instagram_signature(body, INSTAGRAM_SECRET)

        response = client.post(
            "/api/v1/instagram/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
        )
        assert response.status_code == 503
        mock_repo.mark_webhook_event_failed.assert_called_once()
        assert "Instagram Graph API connection failed" in mock_repo.mark_webhook_event_failed.call_args[0][1]


# ════════════════════════════════════════════════════════════════════════════════
# 7. Production Missing-Secret Validation Tests
# ════════════════════════════════════════════════════════════════════════════════

class TestProductionSettingsMissingSecretSafety:
    def test_production_fails_when_whatsapp_secrets_missing(self):
        base_secrets = {
            "APP_ENV": "production",
            "SUPABASE_URL": "https://test.supabase.co",
            "SUPABASE_SERVICE_ROLE_KEY": "secret-role",
            "SUPABASE_ANON_KEY": "secret-anon",
            "JWT_SECRET": "jwt-secret-xyz",
            "PAYMENTS_ENABLED": False,
            "RAZORPAY_ENABLED": True,
            "RAZORPAY_KEY_ID": "rzp_test_123",
            "RAZORPAY_KEY_SECRET": "rzp_secret_456",
            "RAZORPAY_WEBHOOK_SECRET": "rzp_webhook_sec",
            "CLOUDINARY_CLOUD_NAME": "cloud",
            "CLOUDINARY_API_KEY": "cloud-key",
            "CLOUDINARY_API_SECRET": "cloud-secret",
            "INSTAGRAM_BUSINESS_ACCOUNT_ID": "insta_biz_id",
            "INSTAGRAM_ACCESS_TOKEN": "insta_token",
            "INSTAGRAM_APP_ID": "insta_app_id",
            "INSTAGRAM_APP_SECRET": "insta_app_sec",
            "INSTAGRAM_WEBHOOK_VERIFY_TOKEN": "insta_verify",
            "WHATSAPP_ENABLED": True,
            "INSTAGRAM_ENABLED": True,
            "WHATSAPP_PHONE_NUMBER_ID": "",
            "WHATSAPP_BUSINESS_ACCOUNT_ID": "",
            "WHATSAPP_ACCESS_TOKEN": "",
            "WHATSAPP_WEBHOOK_VERIFY_TOKEN": "",
            "WHATSAPP_APP_SECRET": "",
        }
        with pytest.raises(ValidationError) as exc:
            Settings(_env_file=None, **base_secrets)
        assert "WHATSAPP_APP_SECRET" in str(exc.value)
        assert "WHATSAPP_WEBHOOK_VERIFY_TOKEN" in str(exc.value)

    def test_production_fails_when_instagram_secrets_missing(self):
        base_secrets = {
            "APP_ENV": "production",
            "SUPABASE_URL": "https://test.supabase.co",
            "SUPABASE_SERVICE_ROLE_KEY": "secret-role",
            "SUPABASE_ANON_KEY": "secret-anon",
            "JWT_SECRET": "jwt-secret-xyz",
            "PAYMENTS_ENABLED": False,
            "RAZORPAY_ENABLED": True,
            "RAZORPAY_KEY_ID": "rzp_test_123",
            "RAZORPAY_KEY_SECRET": "rzp_secret_456",
            "RAZORPAY_WEBHOOK_SECRET": "rzp_webhook_sec",
            "CLOUDINARY_CLOUD_NAME": "cloud",
            "CLOUDINARY_API_KEY": "cloud-key",
            "CLOUDINARY_API_SECRET": "cloud-secret",
            "WHATSAPP_PHONE_NUMBER_ID": "wa_phone_id",
            "WHATSAPP_BUSINESS_ACCOUNT_ID": "wa_biz_id",
            "WHATSAPP_ACCESS_TOKEN": "wa_token",
            "WHATSAPP_WEBHOOK_VERIFY_TOKEN": "wa_verify",
            "WHATSAPP_APP_SECRET": "wa_app_sec",
            "WHATSAPP_ENABLED": True,
            "INSTAGRAM_ENABLED": True,
            "INSTAGRAM_BUSINESS_ACCOUNT_ID": "",
            "INSTAGRAM_ACCESS_TOKEN": "",
            "INSTAGRAM_APP_ID": "",
            "INSTAGRAM_APP_SECRET": "",
            "INSTAGRAM_WEBHOOK_VERIFY_TOKEN": "",
        }
        with pytest.raises(ValidationError) as exc:
            Settings(_env_file=None, **base_secrets)
        assert "INSTAGRAM_APP_SECRET" in str(exc.value)
        assert "INSTAGRAM_WEBHOOK_VERIFY_TOKEN" in str(exc.value)
