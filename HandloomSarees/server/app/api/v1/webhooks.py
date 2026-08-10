"""
Razorpay Webhook Endpoint
─────────────────────────
Receives POST requests from Razorpay when payment events occur.
Verified by HMAC-SHA256 signature — NO JWT auth required.

Events handled:
  - payment.captured  → finalize order (idempotent)
  - payment.failed    → mark session failed, inventory untouched
  - refund.created    → update refund status
  - refund.processed  → update refund status
"""

import hashlib
import hmac
import logging

from fastapi import APIRouter, Request, HTTPException, status

from app.core.config import settings
from app.services.payment_service import PaymentService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


def _verify_webhook_signature(raw_body: bytes, signature: str) -> None:
    """
    Verify Razorpay webhook signature using HMAC-SHA256.
    The secret is the Webhook Secret from the Razorpay Dashboard
    (NOT the API key secret).
    """
    webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
    if not webhook_secret:
        logger.error("RAZORPAY_WEBHOOK_SECRET is not configured — rejecting webhook")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured",
        )

    expected = hmac.new(
        webhook_secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        logger.warning("Webhook signature verification failed")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature",
        )


@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """
    Razorpay sends POST with JSON body + X-Razorpay-Signature header.
    We must respond 200 quickly — Razorpay retries on non-2xx.
    """
    # Read raw body for signature verification
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Razorpay-Signature header",
        )

    # Verify signature
    _verify_webhook_signature(raw_body, signature)

    # Parse JSON payload
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    event = payload.get("event", "")
    event_id = payload.get("id", "")  # Razorpay event ID for deduplication

    logger.info("Webhook received: event=%s, event_id=%s", event, event_id)

    try:
        if event == "payment.captured":
            _handle_payment_captured(payload, event_id)

        elif event == "payment.failed":
            _handle_payment_failed(payload, event_id)

        elif event in ("refund.created", "refund.processed"):
            _handle_refund_event(payload, event_id)

        else:
            # Unrecognized event — acknowledge to prevent retries
            logger.info("Webhook: unhandled event type '%s', acknowledging", event)

    except HTTPException:
        # Re-raise HTTP exceptions (e.g., 409 Conflict from concurrent processing)
        raise
    except Exception as exc:
        # Log but still return 200 to prevent Razorpay retries on transient errors
        # that we've already partially handled
        logger.exception("Webhook handler error for event=%s: %s", event, exc)

    return {"status": "ok"}


def _handle_payment_captured(payload: dict, event_id: str) -> None:
    """Process payment.captured event."""
    payment_entity = (
        payload.get("payload", {}).get("payment", {}).get("entity", {})
    )
    razorpay_order_id = payment_entity.get("order_id", "")
    razorpay_payment_id = payment_entity.get("id", "")

    if not razorpay_order_id or not razorpay_payment_id:
        logger.warning(
            "Webhook payment.captured: missing order_id or payment_id in payload"
        )
        return

    logger.info(
        "Webhook payment.captured: order_id=%s, payment_id=%s",
        razorpay_order_id,
        razorpay_payment_id,
    )

    PaymentService.handle_webhook_payment_captured(
        razorpay_order_id=razorpay_order_id,
        razorpay_payment_id=razorpay_payment_id,
        event_id=event_id,
    )


def _handle_payment_failed(payload: dict, event_id: str) -> None:
    """Process payment.failed event — marks session failed, no inventory change."""
    payment_entity = (
        payload.get("payload", {}).get("payment", {}).get("entity", {})
    )
    razorpay_order_id = payment_entity.get("order_id", "")
    error_desc = payment_entity.get("error_description", "Payment failed")

    if not razorpay_order_id:
        logger.warning("Webhook payment.failed: missing order_id in payload")
        return

    logger.info(
        "Webhook payment.failed: order_id=%s, error=%s",
        razorpay_order_id,
        error_desc,
    )

    PaymentService.handle_webhook_payment_failed(
        razorpay_order_id=razorpay_order_id,
        error_description=error_desc,
        event_id=event_id,
    )


def _handle_refund_event(payload: dict, event_id: str) -> None:
    """Process refund.created / refund.processed events."""
    refund_entity = (
        payload.get("payload", {}).get("refund", {}).get("entity", {})
    )
    payment_id = refund_entity.get("payment_id", "")
    refund_id = refund_entity.get("id", "")
    refund_status = refund_entity.get("status", "")
    refund_amount = int(refund_entity.get("amount", 0))

    if not payment_id or not refund_id:
        logger.warning("Webhook refund event: missing payment_id or refund_id")
        return

    logger.info(
        "Webhook refund event: refund_id=%s, status=%s, payment_id=%s",
        refund_id,
        refund_status,
        payment_id,
    )

    PaymentService.handle_webhook_refund_event(
        payment_id=payment_id,
        refund_id=refund_id,
        refund_status=refund_status,
        refund_amount_paise=refund_amount,
        event_id=event_id,
    )
