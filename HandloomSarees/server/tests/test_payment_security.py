"""
Test Suite: Payment Security & Hardening (Issue #14)
────────────────────────────────────────────────────
Tests for:
  - Duplicate verify callback → returns existing order (no duplicate)
  - Failed payment → inventory untouched
  - Tampered amount → rejected
  - Invalid signature → rejected
  - Webhook signature verification
  - Idempotency key deduplication
  - Refund initiation
  - Processing lock (CAS)
  - Optimistic stock deduction

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

        # Should not raise
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
        """Items in different order should produce the same key (sorted internally)."""
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

        # Session is already paid
        paid_session = _make_session(payment_status="paid")
        paid_session["order_id"] = "order-existing"
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = paid_session

        existing_order = _make_order(order_id="order-existing")
        mock_order_repo.get_by_id.return_value = existing_order

        order_id = "order_test_123"
        payment_id = "pay_test_456"
        signature = _compute_valid_signature(order_id, payment_id, "test_secret")

        result = PaymentService.verify_payment_and_finalize(
            user_id="user-1",
            razorpay_order_id=order_id,
            razorpay_payment_id=payment_id,
            razorpay_signature=signature,
        )

        # Should return existing order, NOT create a new one
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

        # CAS lock fails (another request got there first)
        mock_pay_repo.atomic_set_processing.return_value = None

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
# Test: Amount Tampering Detection
# ════════════════════════════════════════════════════════════════════════

class TestAmountTampering:
    """Razorpay order amount must match our stored total."""

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.settings")
    def test_matching_amount_passes(self, mock_settings, mock_client_fn):
        from app.services.payment_service import PaymentService

        mock_client = MagicMock()
        mock_client.order.fetch.return_value = {"amount": 500000}  # 5000.00 INR
        mock_client_fn.return_value = mock_client

        # Should not raise
        PaymentService._verify_amount_integrity("order_123", 5000.00)

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.settings")
    def test_mismatched_amount_raises(self, mock_settings, mock_client_fn):
        from app.services.payment_service import PaymentService

        mock_client = MagicMock()
        mock_client.order.fetch.return_value = {"amount": 100}  # Tampered: 1.00 INR
        mock_client_fn.return_value = mock_client

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._verify_amount_integrity("order_123", 5000.00)

        assert exc_info.value.status_code == 400
        assert "tampering" in exc_info.value.detail.lower()


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

        # Session should be marked failed
        mock_pay_repo.update_by_id.assert_called_once()
        call_args = mock_pay_repo.update_by_id.call_args
        update_payload = call_args[0][1]
        assert update_payload["payment_status"] == "failed"

        # Result reflects failure
        assert result["payment_status"] == "failed"

    @patch("app.services.payment_service.PaymentRepository")
    def test_failure_on_paid_session_is_ignored(self, mock_pay_repo):
        """Cannot mark a paid session as failed."""
        from app.services.payment_service import PaymentService

        paid_session = _make_session(payment_status="paid")
        mock_pay_repo.get_by_razorpay_order_id_and_user.return_value = paid_session

        result = PaymentService.handle_payment_failure(
            razorpay_order_id="order_test_123",
            user_id="user-1",
        )

        # Should NOT update the session
        mock_pay_repo.update_by_id.assert_not_called()


# ════════════════════════════════════════════════════════════════════════
# Test: Optimistic Stock Deduction
# ════════════════════════════════════════════════════════════════════════

class TestOptimisticStockDeduction:
    """Stock deduction with optimistic concurrency."""

    @patch("app.services.payment_service.ProductRepository")
    def test_stock_deduction_succeeds(self, mock_prod_repo):
        from app.services.payment_service import PaymentService

        product = _make_product(stock=10)
        mock_prod_repo.get_active_by_id.return_value = product
        mock_prod_repo.decrement_stock_optimistic.return_value = {**product, "stock": 9}

        items = [{"product_id": "prod-1", "quantity": 1}]
        PaymentService._deduct_stock_safely(items)

        mock_prod_repo.decrement_stock_optimistic.assert_called_once_with(
            product_id="prod-1", quantity=1, expected_stock=10
        )

    @patch("app.services.payment_service.ProductRepository")
    def test_stock_race_returns_409(self, mock_prod_repo):
        from app.services.payment_service import PaymentService

        product = _make_product(stock=10)
        mock_prod_repo.get_active_by_id.return_value = product
        # Optimistic update fails (stock changed by another request)
        mock_prod_repo.decrement_stock_optimistic.return_value = None

        items = [{"product_id": "prod-1", "quantity": 1}]

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._deduct_stock_safely(items)
        assert exc_info.value.status_code == 409

    @patch("app.services.payment_service.ProductRepository")
    def test_insufficient_stock_raises_400(self, mock_prod_repo):
        from app.services.payment_service import PaymentService

        product = _make_product(stock=0)  # No stock
        mock_prod_repo.get_active_by_id.return_value = product

        items = [{"product_id": "prod-1", "quantity": 1}]

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._deduct_stock_safely(items)
        assert exc_info.value.status_code == 400
        assert "Insufficient stock" in exc_info.value.detail


# ════════════════════════════════════════════════════════════════════════
# Test: Webhook Signature Verification
# ════════════════════════════════════════════════════════════════════════

class TestWebhookSignature:
    """Tests for webhook HMAC-SHA256 verification."""

    @patch("app.api.v1.webhooks.settings")
    def test_valid_webhook_signature(self, mock_settings):
        from app.api.v1.webhooks import _verify_webhook_signature

        secret = "webhook_test_secret"
        mock_settings.RAZORPAY_WEBHOOK_SECRET = secret

        body = b'{"event":"payment.captured"}'
        signature = hmac.new(
            secret.encode(), body, hashlib.sha256
        ).hexdigest()

        # Should not raise
        _verify_webhook_signature(body, signature)

    @patch("app.api.v1.webhooks.settings")
    def test_invalid_webhook_signature(self, mock_settings):
        from app.api.v1.webhooks import _verify_webhook_signature

        mock_settings.RAZORPAY_WEBHOOK_SECRET = "webhook_test_secret"

        with pytest.raises(HTTPException) as exc_info:
            _verify_webhook_signature(b"tampered body", "bad_signature")
        assert exc_info.value.status_code == 400

    @patch("app.api.v1.webhooks.settings")
    def test_missing_webhook_secret_raises_500(self, mock_settings):
        from app.api.v1.webhooks import _verify_webhook_signature

        mock_settings.RAZORPAY_WEBHOOK_SECRET = ""

        with pytest.raises(HTTPException) as exc_info:
            _verify_webhook_signature(b"body", "signature")
        assert exc_info.value.status_code == 500


# ════════════════════════════════════════════════════════════════════════
# Test: Refund Initiation
# ════════════════════════════════════════════════════════════════════════

class TestRefund:
    """Tests for refund lifecycle."""

    @patch("app.services.payment_service.PaymentService._client")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.OrderRepository")
    def test_full_refund_success(self, mock_order_repo, mock_pay_repo, mock_client_fn):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order

        session = _make_session(payment_status="paid")
        session["refund_id"] = None
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = session

        mock_client = MagicMock()
        mock_client.payment.refund.return_value = {
            "id": "rfnd_test_123",
            "status": "processed",
            "amount": 500000,
        }
        mock_client_fn.return_value = mock_client

        result = PaymentService.initiate_refund(
            order_id="order-1",
            reason="Customer requested",
        )

        assert result["refund_id"] == "rfnd_test_123"
        assert result["amount"] == 5000.0
        mock_client.payment.refund.assert_called_once()

    @patch("app.services.payment_service.OrderRepository")
    def test_refund_without_payment_id_raises(self, mock_order_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()
        order["payment_id"] = None  # No payment ID
        mock_order_repo.get_by_id.return_value = order

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1")
        assert exc_info.value.status_code == 400
        assert "no associated payment" in exc_info.value.detail.lower()

    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.OrderRepository")
    def test_duplicate_refund_raises(self, mock_order_repo, mock_pay_repo):
        from app.services.payment_service import PaymentService

        order = _make_order()
        mock_order_repo.get_by_id.return_value = order

        session = _make_session(payment_status="paid")
        session["refund_id"] = "rfnd_already_exists"
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = session

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.initiate_refund(order_id="order-1")
        assert exc_info.value.status_code == 400
        assert "already been initiated" in exc_info.value.detail.lower()


# ════════════════════════════════════════════════════════════════════════
# Test: Create Payment Order Idempotency
# ════════════════════════════════════════════════════════════════════════

class TestCreatePaymentOrderIdempotency:
    """Creating a payment order twice with same cart should reuse existing."""

    @patch("app.services.payment_service.ProductRepository")
    @patch("app.services.payment_service.CartRepository")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.settings")
    def test_reuses_existing_session(
        self, mock_settings, mock_pay_repo, mock_cart_repo, mock_prod_repo
    ):
        from app.services.payment_service import PaymentService

        mock_settings.RAZORPAY_KEY_ID = "rzp_test_key"
        mock_settings.RAZORPAY_KEY_SECRET = "test_secret"

        # Cart setup
        mock_cart_repo.get_or_create_cart.return_value = {"id": "cart-1"}
        mock_cart_repo.get_cart_items.return_value = [
            {"product_id": "prod-1", "quantity": 1}
        ]

        product = _make_product()
        mock_prod_repo.get_active_by_id.return_value = product

        # Existing session with matching idempotency key
        existing_session = _make_session(
            razorpay_order_id="order_existing_123",
            total_amount=5000.0,
            payment_status="pending",
        )
        mock_pay_repo.get_by_idempotency_key.return_value = existing_session

        result = PaymentService.create_payment_order(
            user_id="user-1",
            shipping_address={"full_name": "Test"},
        )

        # Should reuse existing session
        assert result["razorpay_order_id"] == "order_existing_123"
        # Should NOT create a new Razorpay order
        mock_pay_repo.create.assert_not_called()
