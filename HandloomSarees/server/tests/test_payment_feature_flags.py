from unittest.mock import patch

import pytest
from fastapi import HTTPException


class TestPaymentFeatureFlags:
    """Payment flags separate checkout initiation from Razorpay reconciliation."""

    @patch("app.services.payment_service.razorpay.Client")
    @patch("app.services.payment_service.settings")
    def test_reconciliation_only_allows_razorpay_client(self, mock_settings, mock_razorpay_client):
        from app.services.payment_service import PaymentService

        mock_settings.PAYMENTS_ENABLED = False
        mock_settings.RAZORPAY_ENABLED = True
        mock_settings.RAZORPAY_KEY_ID = "rzp_test_key"
        mock_settings.RAZORPAY_KEY_SECRET = "test-secret"
        expected_client = mock_razorpay_client.return_value

        result = PaymentService._client()

        assert result is expected_client
        mock_razorpay_client.assert_called_once_with(
            auth=("rzp_test_key", "test-secret")
        )

    @patch("app.services.payment_service.razorpay.Client")
    @patch("app.services.payment_service.settings")
    def test_disabled_payments_block_new_checkout(self, mock_settings, mock_razorpay_client):
        from app.services.payment_service import PaymentService

        mock_settings.PAYMENTS_ENABLED = False
        mock_settings.RAZORPAY_ENABLED = True

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.create_payment_order("user-1", {"full_name": "Test User"})

        assert exc_info.value.status_code == 503
        assert "checkout is disabled" in exc_info.value.detail.lower()
        mock_razorpay_client.assert_not_called()

    @patch("app.services.payment_service.razorpay.Client")
    @patch("app.services.payment_service.settings")
    def test_disabled_razorpay_skips_razorpay_client(self, mock_settings, mock_razorpay_client):
        from app.services.payment_service import PaymentService

        mock_settings.PAYMENTS_ENABLED = True
        mock_settings.RAZORPAY_ENABLED = False

        with pytest.raises(HTTPException) as exc_info:
            PaymentService._client()

        assert exc_info.value.status_code == 503
        assert "disabled" in exc_info.value.detail.lower()
        mock_razorpay_client.assert_not_called()

    @patch("app.services.payment_service.PaymentService._finalize_payment")
    @patch("app.services.payment_service.PaymentRepository")
    @patch("app.services.payment_service.settings")
    def test_reconciliation_only_allows_captured_webhook_service(
        self, mock_settings, mock_pay_repo, mock_finalize_payment
    ):
        from app.services.payment_service import PaymentService

        session = {
            "id": "sess-1",
            "razorpay_order_id": "order_test_existing",
            "payment_status": "pending",
        }
        mock_settings.PAYMENTS_ENABLED = False
        mock_settings.RAZORPAY_ENABLED = True
        mock_pay_repo.get_pending_by_razorpay_order_id.return_value = session
        mock_finalize_payment.return_value = {"id": "order-1"}

        result = PaymentService.handle_webhook_payment_captured(
            razorpay_order_id="order_test_existing",
            razorpay_payment_id="pay_test_existing",
            event_id="evt_existing_capture",
        )

        assert result == {"id": "order-1"}
        mock_pay_repo.update_by_id.assert_called_once_with(
            "sess-1", {"webhook_event_id": "evt_existing_capture"}
        )
        mock_finalize_payment.assert_called_once()

    @patch("app.services.payment_service.settings")
    def test_disabled_razorpay_blocks_captured_webhook_service(self, mock_settings):
        from app.services.payment_service import PaymentService

        mock_settings.PAYMENTS_ENABLED = False
        mock_settings.RAZORPAY_ENABLED = False

        with pytest.raises(HTTPException) as exc_info:
            PaymentService.handle_webhook_payment_captured(
                razorpay_order_id="order_test_existing",
                razorpay_payment_id="pay_test_existing",
            )

        assert exc_info.value.status_code == 503
