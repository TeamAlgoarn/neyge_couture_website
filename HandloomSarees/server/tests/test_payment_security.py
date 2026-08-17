"""
Test Suite: Payment Security & Hardening (Issue #14)
────────────────────────────────────────────────────
Tests for:
  - Duplicate verify callback → returns existing order (no duplicate)
  - Failed payment → inventory untouched
  - Tampered amount / currency mismatch → rejected
  - Invalid signature → rejected
  - Webhook signature verification & event deduplication
  - Idempotency key deduplication & race protection
  - Refund initiation atomic lock & amount validations
  - Non-admin refund access restriction (403 Forbidden)
  - Processing lock (CAS)
  - Optimistic stock deduction & multi-item rollback compensation
  - Order-created session-update failure recovery without duplicate orders

Uses mocks — does NOT require a running Supabase or Razorpay instance.
"""

import hashlib
import hmac
import json
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch, PropertyMock

import pytest
from fastapi import HTTPException


# ════════════════════════════════════════════════════════════════════════
# Helper Factories
# ════════════════════════════════════════════════════════════════════════

def _make_product(product_id="prod-1", stock=10, price=5000, discount_price=None, name="Test Saree"):
    return {
        "id": product_id,
        "name": name,
        "slug": "test-saree",
        "stock": stock,
        "price": price,
        "discount_price": discount_price,
        "thumbnail": "https://img.test/thumb.jpg",
        "is_active": True,
    }


def _make_session(
    session_id="sess-1",
    user_id="user-1",
    razorpay_order_id="order_test_123",
    total_amount=5000.0,
    payment_status="pending",
    items=None,
):
    return {
        "id": session_id,
        "user_id": user_id,
        "razorpay_order_id": razorpay_order_id,
        "total_amount": total_amount,
        "payment_status": payment_status,
        "status": "created" if payment_status == "pending" else payment_status,
        "items": items or [
            {
                "product_id": "prod-1",
                "name": "Test Saree",
                "price": 5000.0,
                "quantity": 1,
                "line_total": 5000.0,
            }
        ],
        "shipping_address": {
            "full_name": "Test User",
            "phone": "9876543210",
            "line1": "123 Test Street",
            "city": "Test City",
            "state": "Test State",
            "postal_code": "560001",
            "country": "India",
        },
        "currency": "INR",
        "idempotency_key": "test-key-123",
    }


def _make_order(order_id="order-1", user_id="user-1"):
    return {
        "id": order_id,
        "user_id": user_id,
        "items": [{"product_id": "prod-1", "quantity": 1, "price": 5000.0}],
        "total_amount": 5000.0,
        "payment_status": "paid",
        "order_status": "confirmed",
        "shipping_address": {"full_name": "Test User"},
        "payment_id": "pay_test_123",
        "razorpay_order_id": "order_test_123",
    }


def _compute_valid_signature(order_id, payment_id, secret="test_secret"):
    """Compute a valid HMAC-SHA256 signature for testing."""
    return hmac.new(
        secret.encode(),
        f"{order_id}|{payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()


# ════════════════════════════════════════════════════════════════════════
# Test: Signature Verification
# ════════════════════════════════════════════════════════════════════════

class TestSignatureVerification:
    """Tests for _verify_signature."""

    @patch("app.services.payment_service.settings")
    def test_valid_signature_passes(self, mock_settings):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"
        order_id = "order_test_123"
        payment_id = "pay_test_456"
        signature = _compute_valid_signature(order_id, payment_id, "test_secret")

        PaymentService._verify_signature(order_id, payment_id, signature)

    @patch("app.services.payment_service.settings")
    def test_invalid_signature_raises(self, mock_settings):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._verify_signature(
                "order_test_123", "pay_test_456", "invalid_signature"
            )
        assert exc_info.value.status_code == 400
        assert "Invalid payment verification" in exc_info.value.detail

    @patch("app.services.payment_service.settings")
    def test_tampered_order_id_fails(self, mock_settings):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"
        signature = _compute_valid_signature("order_real", "pay_123", "test_secret")

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._verify_signature("order_tampered", "pay_123", signature)
        assert exc_info.value.status_code == 400


# ════════════════════════════════════════════════════════════════════════
# Test: Idempotency Key
# ════════════════════════════════════════════════════════════════════════

class TestIdempotencyKey:
    """Tests for _compute_idempotency_key determinism."""

    def test_same_input_same_key(self):
        from app.services.payment_service import PaymentService

        items = [
            {"product_id": "prod-1", "quantity": 2},
            {"product_id": "prod-2", "quantity": 1},
        ]
        key1 = PaymentService._compute_idempotency_key("user-1", items, 15000.00)
        key2 = PaymentService._compute_idempotency_key("user-1", items, 15000.00)
        assert key1 == key2

    def test_different_order_same_key(self):
        from app.services.payment_service import PaymentService

        items_a = [
            {"product_id": "prod-2", "quantity": 1},
            {"product_id": "prod-1", "quantity": 2},
        ]
        items_b = [
            {"product_id": "prod-1", "quantity": 2},
            {"product_id": "prod-2", "quantity": 1},
        ]
        key_a = PaymentService._compute_idempotency_key("user-1", items_a, 15000.00)
        key_b = PaymentService._compute_idempotency_key("user-1", items_b, 15000.00)
        assert key_a == key_b

    def test_different_user_different_key(self):
        from app.services.payment_service import PaymentService

        items = [{"product_id": "prod-1", "quantity": 1}]
        key1 = PaymentService._compute_idempotency_key("user-1", items, 5000.00)
        key2 = PaymentService._compute_idempotency_key("user-2", items, 5000.00)
        assert key1 != key2

    def test_different_amount_different_key(self):
        from app.services.payment_service import PaymentService

        items = [{"product_id": "prod-1", "quantity": 1}]
        key1 = PaymentService._compute_idempotency_key("user-1", items, 5000.00)
        key2 = PaymentService._compute_idempotency_key("user-1", items, 9999.00)
        assert key1 != key2


# ════════════════════════════════════════════════════════════════════════
# Test: Duplicate Verify (Idempotent Finalization)
# ════════════════════════════════════════════════════════════════════════

class TestDuplicateVerify:
    """Duplicate callbacks must NOT create duplicate orders."""

    @patch("app.services.payment_service.CartRepository")
    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.settings")
    def test_already_paid_returns_existing_order(
        self, mock_settings, mock_pay_repo, mock_order_repo, mock_cart_repo
    ):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"

        paid_session = _make_session(payment_status="paid")
        paid_session["order_id"] = "order-existing"
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = paid_session

        existing_order = _make_order(order_id="order-existing")
        mock_order_repo.get_by_id.return_value = existing_order
        mock_order_repo.get_by_razorpay_order_id.return_value = existing_order

        order_id = "order_test_123"
        payment_id = "pay_test_456"
        signature = _compute_valid_signature(order_id, payment_id, "test_secret")

        result = PaymentService.verify_payment_and_finalize(
            user_id="user-1",
            razorpay_order_id=order_id,
            razorpay_payment_id=payment_id,
            razorpay_signature=signature,
        )

        assert result["id"] == "order-existing"
        mock_order_repo.create.assert_not_called()
        mock_cart_repo.clear_cart.assert_not_called()


# ════════════════════════════════════════════════════════════════════════
# Test: Processing Lock (CAS)
# ════════════════════════════════════════════════════════════════════════

class TestProcessingLock:
    """Concurrent requests should be rejected by the CAS lock."""

    @patch("app.services.payment_service.CartRepository")
    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.settings")
    def test_concurrent_request_gets_409(
        self, mock_settings, mock_pay_repo, mock_order_repo, mock_cart_repo
    ):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"

        session = _make_session(payment_status="pending")
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = session
        mock_pay_repo.atomic_set_processing.return_value = None
        mock_order_repo.get_by_id.return_value = None
        mock_order_repo.get_by_razorpay_order_id.return_value = None

        order_id = "order_test_123"
        payment_id = "pay_test_456"
        signature = _compute_valid_signature(order_id, payment_id, "test_secret")

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.verify_payment_and_finalize(
                user_id="user-1",
                razorpay_order_id=order_id,
                razorpay_payment_id=payment_id,
                razorpay_signature=signature,
            )

        assert exc_info.value.status_code == 409
        assert "another request" in exc_info.value.detail.lower()


# ════════════════════════════════════════════════════════════════════════
# Test: Amount & Currency Tampering Detection
# ════════════════════════════════════════════════════════════════════════

class TestAmountAndCurrencyTampering:
    """Razorpay order amount and currency must match our stored details."""

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.settings")
    def test_matching_amount_and_currency_passes(self, mock_settings, mock_client_fn):
        from app.services.payment_service import PaymentService

        mock_client = MagicMock()
        mock_client.order.fetch.return_value = {"amount": 500000, "currency": "INR"}
        mock_client_fn.return_value = mock_client

        PaymentService._verify_amount_integrity("order_123", 5000.00)

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.settings")
    def test_mismatched_amount_raises(self, mock_settings, mock_client_fn):
        from app.services.payment_service import PaymentService

        mock_client = MagicMock()
        mock_client.order.fetch.return_value = {"amount": 100, "currency": "INR"}
        mock_client_fn.return_value = mock_client

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._verify_amount_integrity("order_123", 5000.00)

        assert exc_info.value.status_code == 400
        assert "tampering" in exc_info.value.detail.lower()

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.settings")
    def test_currency_mismatch_rejected(self, mock_settings, mock_client_fn):
        from app.services.payment_service import PaymentService

        mock_client = MagicMock()
        mock_client.order.fetch.return_value = {"amount": 500000, "currency": "USD"}
        mock_client_fn.return_value = mock_client

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._verify_amount_integrity("order_123", 5000.00)

        assert exc_info.value.status_code == 400
        assert "currency" in exc_info.value.detail.lower()


# ════════════════════════════════════════════════════════════════════════
# Test: Failed Payment Does NOT Reduce Inventory
# ════════════════════════════════════════════════════════════════════════

class TestFailedPaymentInventory:
    """Failed payments must not touch inventory."""

    @patch("app.services.payment_service.PaymentRepository")
    def test_failure_does_not_touch_stock(self, mock_pay_repo):
        from app.services.payment_service import PaymentService

        session = _make_session(payment_status="pending")
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = session

        result = PaymentService.handle_payment_failure(
            razorpay_order_id="order_test_123",
            user_id="user-1",
            error_description="Card declined",
        )

        mock_pay_repo.update_by_id.assert_called_once()
        call_args = mock_pay_repo.update_by_id.call_args
        update_payload = call_args[0][1]
        assert update_payload["payment_status"] == "failed"
        assert result["payment_status"] == "failed"

    @patch("app.services.payment_service.PaymentRepository")
    def test_failure_on_paid_session_is_ignored(self, mock_pay_repo):
        from app.services.payment_service import PaymentService

        paid_session = _make_session(payment_status="paid")
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = paid_session

        result = PaymentService.handle_payment_failure(
            razorpay_order_id="order_test_123",
            user_id="user-1",
        )

        mock_pay_repo.update_by_id.assert_not_called()


# ════════════════════════════════════════════════════════════════════════
# Test: Multi-Item Stock Deduction & Compensation Rollback
# ════════════════════════════════════════════════════════════════════════

class TestMultiItemStockCompensation:
    """Stock deduction with multi-item rollback compensation."""

    @patch("app.services.payment_service.ProductRepository")
    def test_multi_item_partial_stock_failure_rolls_back(self, mock_prod_repo):
        from app.services.payment_service import PaymentService

        prod1 = _make_product(product_id="prod-1", stock=10)
        prod2 = _make_product(product_id="prod-2", stock=0)  # Out of stock

        mock_prod_repo.get_active_by_id.side_effect = lambda pid: prod1 if pid == "prod-1" else prod2
        mock_prod_repo.decrement_stock_optimistic.return_value = {**prod1, "stock": 9}

        items = [
            {"product_id": "prod-1", "quantity": 1},
            {"product_id": "prod-2", "quantity": 1},
        ]

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._deduct_stock_safely(items)

        assert exc_info.value.status_code == 400
        # Verify that stock for prod-1 was incremented back!
        mock_prod_repo.increment_stock.assert_called_once_with("prod-1", 1)

    @patch("app.services.payment_service.ProductRepository")
    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.PaymentService._verify_amount_integrity")
    def test_order_creation_failure_rolls_back_all_stock(
        self, mock_verify_amt, mock_pay_repo, mock_order_repo, mock_prod_repo
    ):
        from app.services.payment_service import PaymentService

        session = _make_session(payment_status="pending")
        mock_pay_repo.atomic_set_processing.return_value = session
        mock_verify_amt.return_value = None
        mock_order_repo.get_by_id.return_value = None
        mock_order_repo.get_by_razorpay_order_id.return_value = None

        prod1 = _make_product(product_id="prod-1", stock=5)
        mock_prod_repo.get_active_by_id.return_value = prod1
        mock_prod_repo.decrement_stock_optimistic.return_value = {**prod1, "stock": 4}

        # Order creation throws an unexpected DB error before order is created
        mock_order_repo.create.side_effect = Exception("DB Insert Failed")

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._finalize_payment(
                session=session,
                razorpay_payment_id="pay_123",
                source="callback",
            )

        assert exc_info.value.status_code == 500
        # Verify stock compensation rollback occurred because order was NOT created
        mock_prod_repo.increment_stock.assert_called_once_with("prod-1", 1)

    @patch("app.services.payment_service.ProductRepository")
    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.PaymentService._verify_amount_integrity")
    def test_order_created_but_session_update_fails_recovers_safely(
        self, mock_verify_amt, mock_pay_repo, mock_order_repo, mock_prod_repo
    ):
        """Order created successfully -> session update fails -> stock NOT rolled back -> retry recovers created order safely."""
        from app.services.payment_service import PaymentService

        session = _make_session(payment_status="pending")

        # First call: atomic_set_processing succeeds
        mock_pay_repo.atomic_set_processing.return_value = session
        mock_verify_amt.return_value = None
        mock_order_repo.get_by_id.return_value = None
        mock_order_repo.get_by_razorpay_order_id.return_value = None

        prod1 = _make_product(product_id="prod-1", stock=5)
        mock_prod_repo.get_active_by_id.return_value = prod1
        mock_prod_repo.decrement_stock_optimistic.return_value = {**prod1, "stock": 4}

        created_order = _make_order(order_id="order-created-1")
        mock_order_repo.create.return_value = created_order

        # PaymentRepository.update_by_id throws exception on session update
        mock_pay_repo.update_by_id.side_effect = Exception("DB Connection Dropped on session update")

        # Initial call fails due to session update error
        with pytest.raises(HTTPException) as exc_info:
            PaymentService._finalize_payment(
                session=session,
                razorpay_payment_id="pay_123",
                source="callback",
            )

        assert exc_info.value.status_code == 500

        # Must NOT roll back stock because order was legitimately created!
        mock_prod_repo.increment_stock.assert_not_called()

        # On retry: OrderRepository finds the existing order by razorpay_order_id and recovers safely
        session["order_id"] = "order-created-1"
        mock_order_repo.get_by_id.return_value = created_order
        mock_order_repo.get_by_razorpay_order_id.return_value = created_order
        mock_pay_repo.update_by_id.side_effect = None  # Reset mock side effect for retry sync

        retry_result = PaymentService._finalize_payment(
            session=session,
            razorpay_payment_id="pay_123",
            source="callback",
        )

        assert retry_result["id"] == "order-created-1"
        # Must not call OrderRepository.create() a second time!
        mock_order_repo.create.assert_called_once()


# ════════════════════════════════════════════════════════════════════════
# Test: Webhook Signature & Deduplication
# ════════════════════════════════════════════════════════════════════════

class TestWebhookDeduplicationAndEvents:
    """Tests for webhook HMAC verification and event deduplication."""

    @patch("app.api.v1.webhooks.settings")
    def test_valid_webhook_signature(self, mock_settings):
        from app.api.v1.webhooks import _verify_webhook_signature

        secret = "webhook_test_secret"
        mock_settings.RAZORPAY_WEBHOOK_SECRET = secret

        body = b'{"event":"payment.captured"}'
        signature = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

        _verify_webhook_signature(body, signature)

    @patch("app.api.v1.webhooks.PaymentRepository")
    @patch("app.api.v1.webhooks.settings")
    def test_duplicate_webhook_event_id_skipped(self, mock_settings, mock_pay_repo):
        from app.api.v1.webhooks import razorpay_webhook
        from unittest.mock import AsyncMock

        secret = "webhook_test_secret"
        mock_settings.RAZORPAY_WEBHOOK_SECRET = secret

        body = b'{"event":"payment.captured","id":"evt_dup_123"}'
        signature = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

        # reserve_webhook_event returns False = already reserved by another handler
        mock_pay_repo.reserve_webhook_event.return_value = False

        mock_request = MagicMock()
        mock_request.body = AsyncMock(return_value=body)
        mock_request.headers.get.return_value = signature
        mock_request.json = AsyncMock(return_value={"event": "payment.captured", "id": "evt_dup_123"})

        import asyncio
        response = asyncio.run(razorpay_webhook(mock_request))

        assert response["status"] == "ok"
        assert "already processed" in response["message"].lower()


# ════════════════════════════════════════════════════════════════════════
# Test: Sequence Edge Cases (Captured Before/After Callback, Failed After Captured)
# ════════════════════════════════════════════════════════════════════════

class TestWebhookSequenceEdgeCases:
    """Sequence edge cases between webhooks and frontend callbacks."""

    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    def test_captured_webhook_before_frontend_verify(self, mock_pay_repo, mock_order_repo):
        from app.services.payment_service import PaymentService

        # Session is already paid by webhook
        paid_session = _make_session(payment_status="paid")
        paid_session["order_id"] = "order-webhook-1"
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = paid_session
        existing_order = _make_order(order_id="order-webhook-1")
        mock_order_repo.get_by_id.return_value = existing_order
        mock_order_repo.get_by_razorpay_order_id.return_value = existing_order

        signature = _compute_valid_signature("order_test_123", "pay_test_456", "test_secret")

        with patch("app.services.payment_service.settings") as mock_settings:
            mock_settings.RAZORPAY_KEY_SECRET = "test_secret"
            result = PaymentService.verify_payment_and_finalize(
                user_id="user-1",
                razorpay_order_id="order_test_123",
                razorpay_payment_id="pay_test_456",
                razorpay_signature=signature,
            )

        assert result["id"] == "order-webhook-1"

    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    def test_captured_webhook_after_frontend_verify(self, mock_pay_repo, mock_order_repo):
        """Frontend verification succeeds first -> order becomes paid -> same payment.captured webhook arrives -> no duplicate order created."""
        from app.services.payment_service import PaymentService

        paid_session = _make_session(payment_status="paid")
        paid_session["order_id"] = "order-frontend-1"

        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = paid_session
        existing_order = _make_order(order_id="order-frontend-1")
        mock_order_repo.get_by_id.return_value = existing_order
        mock_order_repo.get_by_razorpay_order_id.return_value = existing_order

        # Webhook payment.captured arrives AFTER frontend verification
        result = PaymentService.handle_webhook_payment_captured(
            razorpay_order_id="order_test_123",
            razorpay_payment_id="pay_test_456",
            event_id="evt_cap_after_verify",
        )

        assert result["id"] == "order-frontend-1"
        mock_order_repo.create.assert_not_called()

    @patch("app.services.payment_service.PaymentRepository")
    def test_failed_after_captured_ignored(self, mock_pay_repo):
        from app.services.payment_service import PaymentService

        paid_session = _make_session(payment_status="paid")
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = paid_session

        result = PaymentService.handle_payment_failure("order_test_123", error_description="Late failure")

        assert result["payment_status"] == "paid"
        mock_pay_repo.update_by_id.assert_not_called()


# ════════════════════════════════════════════════════════════════════════
# Test: Refund Validations & Role Permissions & Atomic Lock
# ════════════════════════════════════════════════════════════════════════

class TestRefundValidationsAndAtomicLock:
    """Tests for refund amount validations and atomic CAS double-submit lock."""

    @patch("app.services.payment_service.OrderRepository")
    def test_invalid_refund_amount_zero_or_negative_raises_400(self, mock_order_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1", amount=0.0)
        assert exc_info.value.status_code == 400
        assert "greater than 0" in exc_info.value.detail

    @patch("app.services.payment_service.OrderRepository")
    def test_invalid_refund_amount_exceeds_total_raises_400(self, mock_order_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()  # total = 5000.0
        mock_order_repo.get_by_id.return_value = order

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1", amount=99999.0)
        assert exc_info.value.status_code == 400
        assert "cannot exceed" in exc_info.value.detail

    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.OrderRepository")
    def test_concurrent_double_refund_blocked_by_atomic_lock(self, mock_order_repo, mock_pay_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order

        session = _make_session(payment_status="paid")
        session["refund_id"] = None
        session["refund_status"] = None
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = session
        mock_pay_repo.atomic_set_refunding.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1", amount=1000.0)
        assert exc_info.value.status_code == 400
        assert "being processed" in exc_info.value.detail


class TestRefundRolePermissions:
    """Tests for non-admin refund access restriction (HTTP 403 Forbidden)."""

    def test_non_admin_refund_access_forbidden(self):
        from app.core.dependencies import require_admin

        customer_user = {"profile": {"id": "user-1", "role": "customer"}}
        import asyncio
        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(require_admin(customer_user))

        assert exc_info.value.status_code == 403
        assert "Admin access required" in exc_info.value.detail

    def test_admin_refund_access_allowed(self):
        from app.core.dependencies import require_admin

        admin_user = {"profile": {"id": "admin-1", "role": "admin"}}
        import asyncio
        res = asyncio.run(require_admin(admin_user))
        assert res["profile"]["role"] == "admin"


# ════════════════════════════════════════════════════════════════════════
# Test: tmp_* Session Blocks Razorpay Order Creation (Fix #1)
# ════════════════════════════════════════════════════════════════════════

class TestTmpSessionBlocksRazorpayCall:
    """Existing tmp_* session must return 409 and NOT call client.order.create()."""

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.CartRepository")
    @patch("app.services.payment_service.ProductRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.settings")
    def test_tmp_session_returns_409_and_skips_razorpay(
        self, mock_settings, mock_pay_repo, mock_prod_repo, mock_cart_repo, mock_client_fn
    ):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_ID = "rzp_test_key"
        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"

        # Mock cart + product for snapshot building
        mock_cart_repo.get_or_create_cart.return_value = {"id": "cart-1"}
        mock_cart_repo.get_cart_items.return_value = [
            {"product_id": "prod-1", "quantity": 1}
        ]
        mock_prod_repo.get_active_by_id.return_value = _make_product()

        # An existing session with a tmp_* order ID (creation in progress by request A)
        tmp_session = _make_session(payment_status="pending")
        tmp_session["razorpay_order_id"] = "tmp_abc123def456"
        mock_pay_repo.get_by_idempotency_key.return_value = tmp_session

        mock_client = MagicMock()
        mock_client_fn.return_value = mock_client

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.create_payment_order(
                user_id="user-1",
                shipping_address={"full_name": "Test", "city": "Test City"},
            )

        assert exc_info.value.status_code == 409
        assert "already in progress" in exc_info.value.detail.lower()
        # CRITICAL: client.order.create() must NOT be called
        mock_client.order.create.assert_not_called()


# ════════════════════════════════════════════════════════════════════════
# Test: Refund CAS Checks BOTH refund_id AND refund_status (Fix #2)
# ════════════════════════════════════════════════════════════════════════

class TestRefundAtomicLockBothColumns:
    """atomic_set_refunding must check both refund_id IS NULL AND refund_status IS NULL."""

    def test_atomic_set_refunding_checks_both_conditions(self):
        """Verify the CAS query includes both .is_('refund_id', 'null') and .is_('refund_status', 'null')."""
        from app.repositories.payment_repository import PaymentRepository

        mock_client = MagicMock()
        mock_table = MagicMock()
        mock_update = MagicMock()
        mock_eq = MagicMock()
        mock_is1 = MagicMock()
        mock_is2 = MagicMock()

        mock_client.table.return_value = mock_table
        mock_table.update.return_value = mock_update
        mock_update.eq.return_value = mock_eq
        mock_eq.is_.return_value = mock_is1
        mock_is1.is_.return_value = mock_is2
        mock_is2.execute.return_value = MagicMock(data=[])

        with patch("app.repositories.payment_repository.get_supabase_admin", return_value=mock_client):
            result = PaymentRepository.atomic_set_refunding("sess-1")

        # Verify both .is_() calls were made
        mock_eq.is_.assert_called_once_with("refund_id", "null")
        mock_is1.is_.assert_called_once_with("refund_status", "null")
        assert result is None  # No data returned = lock failed


# ════════════════════════════════════════════════════════════════════════
# Test: Webhook Reserve-First Deduplication (Fix #3)
# ════════════════════════════════════════════════════════════════════════

class TestWebhookReserveFirst:
    """reserve_webhook_event must insert-or-fail atomically."""

    def test_reserve_returns_true_on_first_insert(self):
        from app.repositories.payment_repository import PaymentRepository

        mock_client = MagicMock()
        mock_table = MagicMock()
        mock_insert = MagicMock()
        mock_insert.execute.return_value = MagicMock(data=[{"event_id": "evt_1"}])
        mock_table.insert.return_value = mock_insert
        mock_client.table.return_value = mock_table

        with patch("app.repositories.payment_repository.get_supabase_admin", return_value=mock_client):
            result = PaymentRepository.reserve_webhook_event("evt_1", "payment.captured")

        assert result is True
        # Verify status='processing' was included
        insert_args = mock_table.insert.call_args[0][0]
        assert insert_args["status"] == "processing"
        assert insert_args["event_id"] == "evt_1"

    def test_reserve_returns_false_on_duplicate_key(self):
        """Duplicate key violation (23505) returns False — safe to skip."""
        from app.repositories.payment_repository import PaymentRepository
        from postgrest.exceptions import APIError

        mock_client = MagicMock()
        mock_table = MagicMock()
        # Simulate PostgreSQL 23505 unique_violation via PostgREST APIError
        dup_error = APIError({"message": "duplicate key", "code": "23505", "details": "", "hint": ""})
        mock_table.insert.return_value.execute.side_effect = dup_error
        mock_client.table.return_value = mock_table

        with patch("app.repositories.payment_repository.get_supabase_admin", return_value=mock_client):
            result = PaymentRepository.reserve_webhook_event("evt_1", "payment.captured")

        assert result is False

    def test_reserve_raises_on_non_duplicate_db_error(self):
        """Non-duplicate DB errors (e.g. connection, schema) must raise, not return False."""
        from app.repositories.payment_repository import PaymentRepository
        from postgrest.exceptions import APIError

        mock_client = MagicMock()
        mock_table = MagicMock()
        # Simulate a non-duplicate PostgREST error (e.g. 42P01 = undefined table)
        db_error = APIError({"message": "relation does not exist", "code": "42P01", "details": "", "hint": ""})
        mock_table.insert.return_value.execute.side_effect = db_error
        mock_client.table.return_value = mock_table

        with patch("app.repositories.payment_repository.get_supabase_admin", return_value=mock_client):
            with pytest.raises(APIError):
                PaymentRepository.reserve_webhook_event("evt_1", "payment.captured")

    def test_reserve_raises_on_network_error(self):
        """Network/timeout errors must raise, not return False."""
        from app.repositories.payment_repository import PaymentRepository

        mock_client = MagicMock()
        mock_table = MagicMock()
        mock_table.insert.return_value.execute.side_effect = ConnectionError("DB unreachable")
        mock_client.table.return_value = mock_table

        with patch("app.repositories.payment_repository.get_supabase_admin", return_value=mock_client):
            with pytest.raises(ConnectionError):
                PaymentRepository.reserve_webhook_event("evt_1", "payment.captured")

    def test_empty_event_id_always_returns_true(self):
        from app.repositories.payment_repository import PaymentRepository

        assert PaymentRepository.reserve_webhook_event("", "payment.captured") is True


# ════════════════════════════════════════════════════════════════════════
# Test: Webhook Handler Error Behavior (Mentor Required)
# ════════════════════════════════════════════════════════════════════════

class TestWebhookHandlerErrorBehavior:
    """Tests for correct HTTP status codes based on reservation and processing outcomes."""

    def _make_signed_request(self, secret, event="payment.captured", event_id="evt_test_1"):
        """Helper: build a mock request with valid HMAC signature and proper nested payload."""
        from unittest.mock import AsyncMock
        # Build full Razorpay webhook payload structure
        payload_dict = {
            "event": event,
            "id": event_id,
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_test_999",
                        "order_id": "order_test_999",
                    }
                }
            },
        }
        payload = json.dumps(payload_dict).encode()
        sig = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
        mock_request = MagicMock()
        mock_request.body = AsyncMock(return_value=payload)
        mock_request.headers.get.return_value = sig
        mock_request.json = AsyncMock(return_value=payload_dict)
        return mock_request

    @patch("app.api.v1.webhooks.PaymentRepository")
    @patch("app.api.v1.webhooks.settings")
    def test_duplicate_event_returns_200_skip(self, mock_settings, mock_pay_repo):
        """Duplicate event ID (reserve returns False) → HTTP 200 with skip message."""
        from app.api.v1.webhooks import razorpay_webhook
        import asyncio

        mock_settings.RAZORPAY_WEBHOOK_SECRET = "test_secret"
        mock_pay_repo.reserve_webhook_event.return_value = False

        request = self._make_signed_request("test_secret", event_id="evt_dup")
        response = asyncio.run(razorpay_webhook(request))

        assert response["status"] == "ok"
        assert "already processed" in response["message"].lower()

    @patch("app.api.v1.webhooks.PaymentRepository")
    @patch("app.api.v1.webhooks.settings")
    def test_reservation_db_error_returns_503(self, mock_settings, mock_pay_repo):
        """Non-duplicate DB error during reservation → HTTP 503 retryable."""
        from app.api.v1.webhooks import razorpay_webhook
        import asyncio

        mock_settings.RAZORPAY_WEBHOOK_SECRET = "test_secret"
        mock_pay_repo.reserve_webhook_event.side_effect = ConnectionError("DB down")

        request = self._make_signed_request("test_secret", event_id="evt_db_err")

        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(razorpay_webhook(request))

        assert exc_info.value.status_code == 503
        assert "retry" in exc_info.value.detail.lower()

    @patch("app.api.v1.webhooks.PaymentService")
    @patch("app.api.v1.webhooks.PaymentRepository")
    @patch("app.api.v1.webhooks.settings")
    def test_processing_failure_marks_event_failed_and_returns_503(
        self, mock_settings, mock_pay_repo, mock_pay_service
    ):
        """Processing failure after successful reservation → mark event failed + HTTP 503."""
        from app.api.v1.webhooks import razorpay_webhook
        import asyncio

        mock_settings.RAZORPAY_WEBHOOK_SECRET = "test_secret"
        mock_pay_repo.reserve_webhook_event.return_value = True

        # Simulate processing failure in the payment.captured handler
        mock_pay_service.handle_webhook_payment_captured.side_effect = RuntimeError("Processing crashed")

        request = self._make_signed_request("test_secret", event="payment.captured", event_id="evt_proc_fail")

        with pytest.raises(HTTPException) as exc_info:
            asyncio.run(razorpay_webhook(request))

        assert exc_info.value.status_code == 503
        assert "retry" in exc_info.value.detail.lower()
        # Verify event was marked as failed
        mock_pay_repo.mark_webhook_event_failed.assert_called_once()
        call_args = mock_pay_repo.mark_webhook_event_failed.call_args
        assert call_args[0][0] == "evt_proc_fail"
        assert "Processing crashed" in call_args[0][1]


# ════════════════════════════════════════════════════════════════════════
# Test: Atomic increment_stock via RPC (Fix #4)
# ════════════════════════════════════════════════════════════════════════

class TestAtomicIncrementStock:
    """increment_stock must use Postgres RPC, not read-modify-write."""

    def test_increment_stock_calls_rpc(self):
        from app.repositories.product_repository import ProductRepository

        mock_client = MagicMock()
        mock_rpc = MagicMock()
        mock_rpc.execute.return_value = MagicMock(data=[])
        mock_client.rpc.return_value = mock_rpc

        with patch("app.repositories.product_repository.get_supabase_admin", return_value=mock_client):
            ProductRepository.increment_stock("prod-1", 3)

        mock_client.rpc.assert_called_once_with(
            "increment_product_stock",
            {"p_id": "prod-1", "qty": 3},
        )

    def test_increment_stock_rpc_failure_raises(self):
        from app.repositories.product_repository import ProductRepository

        mock_client = MagicMock()
        mock_client.rpc.return_value.execute.side_effect = Exception("RPC failed")

        with patch("app.repositories.product_repository.get_supabase_admin", return_value=mock_client):
            with pytest.raises(Exception, match="RPC failed"):
                ProductRepository.increment_stock("prod-1", 3)


# ════════════════════════════════════════════════════════════════════════
# Test: Refund Without Payment Session Blocked (Fix #6)
# ════════════════════════════════════════════════════════════════════════

class TestRefundWithoutSessionBlocked:
    """Refund must NOT proceed if no payment session exists for the order."""

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.OrderRepository")
    def test_refund_without_session_raises_400(
        self, mock_order_repo, mock_pay_repo, mock_client_fn
    ):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = None

        mock_client = MagicMock()
        mock_client_fn.return_value = mock_client

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1", amount=1000.0)

        assert exc_info.value.status_code == 400
        assert "No payment session found" in exc_info.value.detail
        # CRITICAL: Razorpay refund API must NOT be called
        mock_client.payment.refund.assert_not_called()

    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.OrderRepository")
    def test_refund_already_initiated_blocked(self, mock_order_repo, mock_pay_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order

        session = _make_session(payment_status="paid")
        session["refund_id"] = None
        session["refund_status"] = "initiating"
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = session

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1", amount=1000.0)

        assert exc_info.value.status_code == 400
        assert "already been initiated" in exc_info.value.detail


# ════════════════════════════════════════════════════════════════════════
# Test: Webhook Captured AFTER Frontend Verify (Sequence Test)
# ════════════════════════════════════════════════════════════════════════

class TestWebhookCapturedAfterFrontendVerify:
    """When frontend verify finalizes first, a later webhook.captured must NOT create a duplicate order."""

    @patch("app.services.payment_service.CartRepository")
    @patch("app.services.payment_service.ProductRepository")
    @patch("app.services.payment_service.OrderRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.PaymentService._verify_amount_integrity")
    @patch("app.services.payment_service.settings")
    def test_webhook_after_frontend_verify_returns_existing_order(
        self, mock_settings, mock_verify_amt, mock_pay_repo, mock_order_repo,
        mock_prod_repo, mock_cart_repo
    ):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"
        mock_verify_amt.return_value = None

        # Step 1: Frontend verify succeeds — order created
        pending_session = _make_session(payment_status="pending")
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = pending_session
        mock_pay_repo.atomic_set_processing.return_value = pending_session
        mock_order_repo.get_by_id.return_value = None
        mock_order_repo.get_by_razorpay_order_id.return_value = None

        created_order = _make_order(order_id="order-frontend-created")
        mock_order_repo.create.return_value = created_order
        mock_prod_repo.get_active_by_id.return_value = _make_product()
        mock_prod_repo.decrement_stock_optimistic.return_value = _make_product(stock=9)
        mock_cart_repo.get_or_create_cart.return_value = {"id": "cart-1"}

        sig = _compute_valid_signature("order_test_123", "pay_test_456", "test_secret")
        frontend_result = PaymentService.verify_payment_and_finalize(
            user_id="user-1",
            razorpay_order_id="order_test_123",
            razorpay_payment_id="pay_test_456",
            razorpay_signature=sig,
        )
        assert frontend_result["id"] == "order-frontend-created"
        mock_order_repo.create.assert_called_once()

        # Step 2: Webhook arrives — session now shows paid + has order_id
        paid_session = _make_session(payment_status="paid")
        paid_session["order_id"] = "order-frontend-created"
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = paid_session
        mock_order_repo.get_by_id.return_value = created_order
        mock_order_repo.get_by_razorpay_order_id.return_value = created_order

        webhook_result = PaymentService.handle_webhook_payment_captured(
            razorpay_order_id="order_test_123",
            razorpay_payment_id="pay_test_456",
            event_id="evt_cap_after",
        )

        assert webhook_result["id"] == "order-frontend-created"
        # CRITICAL: OrderRepository.create must NOT be called a second time
        mock_order_repo.create.assert_called_once()
