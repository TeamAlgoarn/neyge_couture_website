import hashlib
import hmac
import logging
from datetime import datetime, timezone

import razorpay
from fastapi import HTTPException, status

from app.core.config import settings
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.product_repository import ProductRepository

logger = logging.getLogger(__name__)


class PaymentService:
    @staticmethod
    def _client() -> razorpay.Client:
        return razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    # ── Idempotency Key ──────────────────────────────────────────────────

    @staticmethod
    def _compute_idempotency_key(user_id: str, cart_items: list[dict], total_amount: float) -> str:
        """
        Deterministic key from (user_id, sorted product+qty pairs, total).
        Same cart contents → same key → reuse existing Razorpay order.
        """
        sorted_items = sorted(
            [(item.get("product_id", ""), int(item.get("quantity", 0))) for item in cart_items]
        )
        raw = f"{user_id}|{'|'.join(f'{pid}:{qty}' for pid, qty in sorted_items)}|{total_amount:.2f}"
        return hashlib.sha256(raw.encode()).hexdigest()

    # ── Checkout Snapshot ────────────────────────────────────────────────

    @staticmethod
    def _build_checkout_snapshot(user_id: str, shipping_address: dict) -> dict:
        user_id = str(user_id)

        cart = CartRepository.get_or_create_cart(user_id)
        cart_items = CartRepository.get_cart_items(cart["id"])

        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cart is empty",
            )

        order_items: list[dict] = []
        total_amount = 0.0

        for item in cart_items:
            product_id = item.get("product_id")
            if not product_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid cart item: product_id missing",
                )

            product = ProductRepository.get_active_by_id(product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Product not found in cart",
                )

            quantity = int(item.get("quantity", 0))
            available_stock = int(product.get("stock", 0))

            if quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid cart quantity",
                )

            if available_stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.get('name', 'Unknown')}'",
                )

            unit_price = float(
                product.get("discount_price")
                if product.get("discount_price") is not None
                else product.get("price", 0)
            )

            if unit_price <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid price for '{product.get('name', 'Unknown')}'",
                )

            line_total = unit_price * quantity
            total_amount += line_total

            order_items.append(
                {
                    "name": product.get("name"),
                    "slug": product.get("slug"),
                    "price": unit_price,
                    "quantity": quantity,
                    "thumbnail": product.get("thumbnail"),
                    "line_total": line_total,
                    "product_id": product.get("id"),
                }
            )

        return {
            "cart_id": cart["id"],
            "user_id": user_id,
            "items": order_items,
            "total_amount": total_amount,
            "shipping_address": shipping_address,
        }

    # ── Create Payment Order (Idempotent) ────────────────────────────────

    @staticmethod
    def create_payment_order(user_id: str, shipping_address: dict) -> dict:
        user_id = str(user_id)

        snapshot = PaymentService._build_checkout_snapshot(
            user_id=user_id,
            shipping_address=shipping_address,
        )

        # Generate idempotency key to prevent duplicate Razorpay orders
        idempotency_key = PaymentService._compute_idempotency_key(
            user_id=user_id,
            cart_items=snapshot["items"],
            total_amount=snapshot["total_amount"],
        )

        # Check for existing unexpired session with same idempotency key
        existing = PaymentRepository.get_by_idempotency_key(idempotency_key, user_id)
        if existing and existing.get("payment_status") in ("pending", "created"):
            logger.info(
                "Reusing existing payment session %s (idempotency_key=%s)",
                existing["id"],
                idempotency_key[:12],
            )
            amount_paise = int(round(existing["total_amount"] * 100))
            return {
                "razorpay_order_id": existing["razorpay_order_id"],
                "amount": amount_paise,
                "currency": "INR",
                "key": settings.RAZORPAY_KEY_ID,
            }

        client = PaymentService._client()
        amount_paise = int(round(snapshot["total_amount"] * 100))

        try:
            razorpay_order = client.order.create(
                {
                    "amount": amount_paise,
                    "currency": "INR",
                    "payment_capture": 1,
                }
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to create Razorpay order",
            ) from exc

        PaymentRepository.create(
            {
                "user_id": user_id,
                "razorpay_order_id": razorpay_order["id"],
                "items": snapshot["items"],
                "total_amount": snapshot["total_amount"],
                "shipping_address": snapshot["shipping_address"],
                "currency": "INR",
                "status": "created",
                "payment_status": "pending",
                "idempotency_key": idempotency_key,
            }
        )

        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
        }

    # ── Signature Verification ───────────────────────────────────────────

    @staticmethod
    def _verify_signature(
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> None:
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(generated_signature, razorpay_signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment verification",
            )

    # ── Amount Tampering Check ───────────────────────────────────────────

    @staticmethod
    def _verify_amount_integrity(razorpay_order_id: str, expected_total: float) -> None:
        """
        Fetch the Razorpay order and confirm its amount matches what we
        stored in our payment_session. Rejects price/quantity tampering.
        """
        try:
            client = PaymentService._client()
            rz_order = client.order.fetch(razorpay_order_id)
            rz_amount_paise = int(rz_order.get("amount", 0))
            expected_paise = int(round(expected_total * 100))

            if rz_amount_paise != expected_paise:
                logger.warning(
                    "Amount tampering detected! Razorpay amount=%d, expected=%d, order_id=%s",
                    rz_amount_paise,
                    expected_paise,
                    razorpay_order_id,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment amount mismatch — possible tampering detected",
                )
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(
                "Failed to fetch Razorpay order %s for amount verification: %s",
                razorpay_order_id,
                exc,
            )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to verify payment amount with Razorpay",
            ) from exc

    # ── Stock Deduction (Optimistic Concurrency) ─────────────────────────

    @staticmethod
    def _deduct_stock_safely(items: list[dict]) -> None:
        """
        Deduct stock for every item using optimistic concurrency.
        If any item's stock changed since we read it, abort the whole
        operation (another request or webhook beat us to it).
        """
        for item in items:
            product_id = item["product_id"]
            quantity = int(item["quantity"])

            product = ProductRepository.get_active_by_id(product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product not found: {product_id}",
                )

            current_stock = int(product.get("stock", 0))
            if current_stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.get('name', 'Unknown')}'",
                )

            updated = ProductRepository.decrement_stock_optimistic(
                product_id=product_id,
                quantity=quantity,
                expected_stock=current_stock,
            )

            if not updated:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Stock was modified by another request. Please retry.",
                )

    # ── Finalize Payment (Shared Logic) ──────────────────────────────────

    @staticmethod
    def _finalize_payment(
        session: dict,
        razorpay_payment_id: str,
        razorpay_signature: str | None = None,
        source: str = "callback",
    ) -> dict:
        """
        Shared finalization logic used by both the frontend callback
        and the webhook handler. Idempotent — returns existing order
        if already finalized.
        """
        # Already paid → idempotent return
        if session.get("payment_status") == "paid":
            order_id = session.get("order_id")
            if order_id:
                existing_order = OrderRepository.get_by_id(order_id)
                if existing_order:
                    logger.info(
                        "Payment already finalized (source=%s, session=%s). Returning existing order.",
                        source,
                        session["id"],
                    )
                    return existing_order
            # Edge case: paid but order missing — should not happen, raise
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment marked as paid but order not found",
            )

        # Acquire processing lock (CAS)
        locked = PaymentRepository.atomic_set_processing(session["id"])
        if not locked:
            # Another request is already processing this session
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Payment is being processed by another request",
            )

        try:
            items = session.get("items", [])
            if not items:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment session has no items",
                )

            # Amount tampering check
            PaymentService._verify_amount_integrity(
                razorpay_order_id=session["razorpay_order_id"],
                expected_total=session["total_amount"],
            )

            # Deduct stock with optimistic concurrency
            PaymentService._deduct_stock_safely(items)

            # Create order
            order = OrderRepository.create(
                {
                    "user_id": session["user_id"],
                    "items": items,
                    "total_amount": session["total_amount"],
                    "payment_status": "paid",
                    "order_status": "confirmed",
                    "shipping_address": session["shipping_address"],
                    "payment_id": razorpay_payment_id,
                    "razorpay_order_id": session["razorpay_order_id"],
                }
            )

            # Update payment session
            update_payload = {
                "payment_status": "paid",
                "status": "verified",
                "razorpay_payment_id": razorpay_payment_id,
                "order_id": order["id"],
            }
            if razorpay_signature:
                update_payload["razorpay_signature"] = razorpay_signature
            if source == "webhook":
                update_payload["webhook_verified_at"] = datetime.now(timezone.utc).isoformat()

            PaymentRepository.update_by_id(session["id"], update_payload)

            # Clear cart
            try:
                cart = CartRepository.get_or_create_cart(session["user_id"])
                CartRepository.clear_cart(cart["id"])
            except Exception as cart_err:
                logger.warning("Failed to clear cart after payment: %s", cart_err)

            logger.info(
                "Payment finalized (source=%s, order=%s, session=%s)",
                source,
                order["id"],
                session["id"],
            )
            return order

        except HTTPException:
            # Revert processing lock on business-logic failure
            PaymentRepository.update_by_id(
                session["id"], {"payment_status": "pending"}
            )
            raise
        except Exception as exc:
            PaymentRepository.update_by_id(
                session["id"], {"payment_status": "pending"}
            )
            logger.exception("Unexpected error during payment finalization")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment processing failed unexpectedly",
            ) from exc

    # ── Verify Payment (Frontend Callback) ───────────────────────────────

    @staticmethod
    def verify_payment_and_finalize(
        user_id: str,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> dict:
        user_id = str(user_id)

        session = PaymentRepository.get_by_razorpay_order_id_and_user(
            razorpay_order_id=razorpay_order_id,
            user_id=user_id,
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment session not found",
            )

        # Verify Razorpay signature (from frontend callback)
        PaymentService._verify_signature(
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
        )

        return PaymentService._finalize_payment(
            session=session,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
            source="callback",
        )

    # ── Handle Payment Failure ───────────────────────────────────────────

    @staticmethod
    def handle_payment_failure(
        razorpay_order_id: str,
        user_id: str | None = None,
        error_description: str = "",
    ) -> dict:
        """
        Mark a payment session as failed. Does NOT touch inventory.
        Can be called by frontend or webhook.
        """
        if user_id:
            session = PaymentRepository.get_by_razorpay_order_id_and_user(
                razorpay_order_id=razorpay_order_id,
                user_id=str(user_id),
            )
        else:
            session = PaymentRepository.get_pending_by_razorpay_order_id(
                razorpay_order_id=razorpay_order_id,
            )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment session not found",
            )

        # Don't overwrite an already-finalized session
        if session.get("payment_status") in ("paid", "processing"):
            logger.warning(
                "Ignoring failure report for session %s with status %s",
                session["id"],
                session["payment_status"],
            )
            return session

        PaymentRepository.update_by_id(
            session["id"],
            {
                "payment_status": "failed",
                "status": "failed",
                "failure_reason": error_description[:500] if error_description else "Payment failed",
            },
        )

        logger.info(
            "Payment session %s marked as failed (order_id=%s)",
            session["id"],
            razorpay_order_id,
        )
        return {**session, "payment_status": "failed", "status": "failed"}

    # ── Refund Lifecycle ─────────────────────────────────────────────────

    @staticmethod
    def initiate_refund(
        order_id: str,
        amount: float | None = None,
        reason: str = "",
    ) -> dict:
        """
        Initiate a refund via Razorpay API. Admin-only.
        amount=None means full refund.
        """
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        payment_id = order.get("payment_id")
        if not payment_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order has no associated payment to refund",
            )

        razorpay_order_id = order.get("razorpay_order_id", "")
        session = PaymentRepository.get_pending_by_razorpay_order_id(razorpay_order_id)

        if session and session.get("refund_id"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A refund has already been initiated for this payment",
            )

        client = PaymentService._client()
        refund_amount_paise = (
            int(round(amount * 100)) if amount else int(round(order["total_amount"] * 100))
        )

        try:
            refund = client.payment.refund(
                payment_id,
                {
                    "amount": refund_amount_paise,
                    "notes": {"reason": reason, "order_id": order_id},
                },
            )
        except Exception as exc:
            logger.error("Razorpay refund API error: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to initiate refund with Razorpay",
            ) from exc

        # Update payment session with refund info
        if session:
            PaymentRepository.update_by_id(
                session["id"],
                {
                    "refund_id": refund.get("id"),
                    "refund_status": refund.get("status", "created"),
                    "refund_amount": refund_amount_paise / 100.0,
                    "refund_reason": reason[:500],
                    "refund_created_at": datetime.now(timezone.utc).isoformat(),
                },
            )

        logger.info(
            "Refund initiated: refund_id=%s, order_id=%s, amount_paise=%d",
            refund.get("id"),
            order_id,
            refund_amount_paise,
        )

        return {
            "refund_id": refund.get("id"),
            "status": refund.get("status"),
            "amount": refund_amount_paise / 100.0,
            "currency": "INR",
            "order_id": order_id,
            "payment_id": payment_id,
        }

    @staticmethod
    def get_refund_status(refund_id: str) -> dict:
        """Fetch refund status from Razorpay API."""
        try:
            client = PaymentService._client()
            refund = client.refund.fetch(refund_id)
            return {
                "refund_id": refund.get("id"),
                "status": refund.get("status"),
                "amount": (refund.get("amount", 0)) / 100.0,
                "currency": refund.get("currency", "INR"),
                "created_at": refund.get("created_at"),
            }
        except Exception as exc:
            logger.error("Failed to fetch refund %s: %s", refund_id, exc)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to fetch refund status from Razorpay",
            ) from exc

    # ── Webhook Event Handlers ───────────────────────────────────────────

    @staticmethod
    def handle_webhook_payment_captured(
        razorpay_order_id: str,
        razorpay_payment_id: str,
        event_id: str = "",
    ) -> dict | None:
        """
        Handle payment.captured webhook. Uses shared _finalize_payment
        for idempotency — if already finalized, returns existing order.
        """
        session = PaymentRepository.get_pending_by_razorpay_order_id(razorpay_order_id)
        if not session:
            logger.warning(
                "Webhook payment.captured: no session found for order_id=%s",
                razorpay_order_id,
            )
            return None

        if event_id:
            PaymentRepository.update_by_id(
                session["id"], {"webhook_event_id": event_id}
            )

        return PaymentService._finalize_payment(
            session=session,
            razorpay_payment_id=razorpay_payment_id,
            source="webhook",
        )

    @staticmethod
    def handle_webhook_payment_failed(
        razorpay_order_id: str,
        error_description: str = "",
        event_id: str = "",
    ) -> None:
        """Handle payment.failed webhook."""
        session = PaymentRepository.get_pending_by_razorpay_order_id(razorpay_order_id)
        if not session:
            logger.warning(
                "Webhook payment.failed: no session found for order_id=%s",
                razorpay_order_id,
            )
            return

        if event_id:
            PaymentRepository.update_by_id(
                session["id"], {"webhook_event_id": event_id}
            )

        PaymentService.handle_payment_failure(
            razorpay_order_id=razorpay_order_id,
            error_description=error_description,
        )

    @staticmethod
    def handle_webhook_refund_event(
        payment_id: str,
        refund_id: str,
        refund_status: str,
        refund_amount_paise: int,
        event_id: str = "",
    ) -> None:
        """Handle refund.created / refund.processed webhooks."""
        # Find session by payment_id
        # We search all sessions — refund events reference payment_id
        client_db = PaymentRepository
        # Note: We don't have a direct payment_id lookup, so we search by it
        from app.core.database import get_supabase_admin
        db = get_supabase_admin()
        result = (
            db.table("payment_sessions")
            .select("*")
            .eq("razorpay_payment_id", payment_id)
            .limit(1)
            .execute()
        )
        session = result.data[0] if result.data else None

        if not session:
            logger.warning(
                "Webhook refund event: no session found for payment_id=%s",
                payment_id,
            )
            return

        update_data = {
            "refund_id": refund_id,
            "refund_status": refund_status,
            "refund_amount": refund_amount_paise / 100.0,
        }
        if event_id:
            update_data["webhook_event_id"] = event_id

        PaymentRepository.update_by_id(session["id"], update_data)
        logger.info(
            "Refund event processed: refund_id=%s, status=%s, session=%s",
            refund_id,
            refund_status,
            session["id"],
        )