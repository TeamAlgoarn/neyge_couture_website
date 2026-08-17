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


from app.services.cart_service import CartService


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

            product_price = float(
                product.get("discount_price")
                if product.get("discount_price") is not None
                else product.get("price", 0)
            )

            if product_price <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid price for '{product.get('name', 'Unknown')}'",
                )

            raw_addons = item.get("selected_addons") or []
            addon_keys = []
            for a in raw_addons:
                if isinstance(a, dict) and "id" in a:
                    addon_keys.append(str(a["id"]))
                elif isinstance(a, str):
                    addon_keys.append(a)

            # Revalidate add-on availability & compute current add-on prices directly from latest DB product record
            selected_addons, addons_total = CartService._process_addons(
                product=product,
                requested_addons=addon_keys,
            )
            unit_price = product_price + addons_total

            line_total = unit_price * quantity
            total_amount += line_total

            order_items.append(
                {
                    "name": product.get("name"),
                    "slug": product.get("slug"),
                    "price": product_price,
                    "selected_addons": selected_addons,
                    "addons_total": addons_total,
                    "unit_price": unit_price,
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

    # ── Create Payment Order (Atomic Idempotent) ──────────────────────────

    @staticmethod
    def create_payment_order(user_id: str, shipping_address: dict) -> dict:
        user_id = str(user_id)

        snapshot = PaymentService._build_checkout_snapshot(
            user_id=user_id,
            shipping_address=shipping_address,
        )

        idempotency_key = PaymentService._compute_idempotency_key(
            user_id=user_id,
            cart_items=snapshot["items"],
            total_amount=snapshot["total_amount"],
        )

        # 1. Check for existing unexpired session with same idempotency key
        existing = PaymentRepository.get_by_idempotency_key(idempotency_key, user_id)
        if existing and existing.get("payment_status") in ("pending", "created"):
            razorpay_oid = str(existing.get("razorpay_order_id", ""))
            if razorpay_oid and not razorpay_oid.startswith("tmp_"):
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
            # tmp_* means another request is creating the Razorpay order right now
            if razorpay_oid.startswith("tmp_"):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Payment order creation is already in progress",
                )

        # 2. Claim DB record FIRST to eliminate race condition around Razorpay API call
        try:
            session_record = PaymentRepository.create(
                {
                    "user_id": user_id,
                    "razorpay_order_id": f"tmp_{idempotency_key[:16]}",
                    "items": snapshot["items"],
                    "total_amount": snapshot["total_amount"],
                    "shipping_address": snapshot["shipping_address"],
                    "currency": "INR",
                    "status": "created",
                    "payment_status": "pending",
                    "idempotency_key": idempotency_key,
                }
            )
        except Exception as db_exc:
            # Concurrent request inserted first — fetch existing record
            existing = PaymentRepository.get_by_idempotency_key(idempotency_key, user_id)
            if existing and existing.get("razorpay_order_id") and not str(existing["razorpay_order_id"]).startswith("tmp_"):
                amount_paise = int(round(existing["total_amount"] * 100))
                return {
                    "razorpay_order_id": existing["razorpay_order_id"],
                    "amount": amount_paise,
                    "currency": "INR",
                    "key": settings.RAZORPAY_KEY_ID,
                }
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Payment order creation is already in progress for this cart",
            ) from db_exc

        # 3. Call Razorpay API safely — only the session creator reaches here
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
            # Update session with real razorpay_order_id
            PaymentRepository.update_by_id(
                session_record["id"],
                {"razorpay_order_id": razorpay_order["id"]},
            )
        except Exception as exc:
            # Delete temporary session on Razorpay failure so user can retry
            if session_record and str(session_record.get("razorpay_order_id", "")).startswith("tmp_"):
                try:
                    PaymentRepository.delete_by_id(session_record["id"])
                except Exception:
                    pass
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to create Razorpay order",
            ) from exc

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

    # ── Amount & Currency Integrity Check ───────────────────────────────

    @staticmethod
    def _verify_amount_integrity(razorpay_order_id: str, expected_total: float) -> None:
        """
        Fetch the Razorpay order and confirm its amount and currency match what we
        stored in our payment_session. Rejects price/quantity/currency tampering.
        """
        try:
            client = PaymentService._client()
            rz_order = client.order.fetch(razorpay_order_id)
            rz_amount_paise = int(rz_order.get("amount", 0))
            rz_currency = str(rz_order.get("currency", "INR")).upper()
            expected_paise = int(round(expected_total * 100))

            if rz_currency != "INR":
                logger.warning("Currency mismatch: %s != INR", rz_currency)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported payment currency '{rz_currency}'. Must be INR.",
                )

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

    # ── Stock Deduction with Partial Failure Rollback ─────────────────────

    @staticmethod
    def _deduct_stock_safely(items: list[dict]) -> None:
        """
        Deduct stock for every item using optimistic concurrency.
        If any item's stock deduction fails, roll back all previously
        decremented items in the cart before raising exception.
        """
        decremented_items: list[dict] = []

        for item in items:
            product_id = item["product_id"]
            quantity = int(item["quantity"])

            product = ProductRepository.get_active_by_id(product_id)
            if not product:
                # Roll back previous decrements
                PaymentService._rollback_stock_decrements(decremented_items)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product not found: {product_id}",
                )

            current_stock = int(product.get("stock", 0))
            if current_stock < quantity:
                # Roll back previous decrements
                PaymentService._rollback_stock_decrements(decremented_items)
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
                # Roll back previous decrements
                PaymentService._rollback_stock_decrements(decremented_items)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Stock was modified by another request. Please retry.",
                )

            decremented_items.append({"product_id": product_id, "quantity": quantity})

    @staticmethod
    def _rollback_stock_decrements(decremented_items: list[dict]) -> None:
        """Restore stock for items decremented prior to a failure."""
        for item in decremented_items:
            try:
                ProductRepository.increment_stock(item["product_id"], item["quantity"])
            except Exception as exc:
                logger.error("Failed to rollback stock for product %s: %s", item["product_id"], exc)

    # ── Finalize Payment (Transaction & Rollback Safe) ───────────────────

    @staticmethod
    def _finalize_payment(
        session: dict,
        razorpay_payment_id: str,
        razorpay_signature: str | None = None,
        source: str = "callback",
    ) -> dict:
        """
        Shared finalization logic used by both the frontend callback
        and the webhook handler. Fully transaction-safe with stock compensation.
        """
        order_id = session.get("order_id")
        if session.get("payment_status") == "paid" or order_id:
            existing_order = OrderRepository.get_by_id(order_id) if order_id else None
            if not existing_order and session.get("razorpay_order_id"):
                existing_order = OrderRepository.get_by_razorpay_order_id(session["razorpay_order_id"])

            if existing_order:
                if session.get("payment_status") != "paid":
                    update_payload = {
                        "payment_status": "paid",
                        "status": "verified",
                        "razorpay_payment_id": razorpay_payment_id,
                        "order_id": existing_order["id"],
                    }
                    if razorpay_signature:
                        update_payload["razorpay_signature"] = razorpay_signature
                    if source == "webhook":
                        update_payload["webhook_verified_at"] = datetime.now(timezone.utc).isoformat()
                    try:
                        PaymentRepository.update_by_id(session["id"], update_payload)
                    except Exception as update_err:
                        logger.warning("Failed to sync session for existing order: %s", update_err)
                return existing_order

            if session.get("payment_status") == "paid":
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Payment marked as paid but order not found",
                )

        # Acquire processing lock (CAS)
        locked = PaymentRepository.atomic_set_processing(session["id"])
        if not locked:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Payment is being processed by another request",
            )

        stock_deducted = False
        created_order = None
        items = session.get("items", [])

        try:
            if not items:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment session has no items",
                )

            # 1. Amount & Currency integrity check
            PaymentService._verify_amount_integrity(
                razorpay_order_id=session["razorpay_order_id"],
                expected_total=session["total_amount"],
            )

            # 2. Deduct stock safely (rolls back partial stock on failure)
            PaymentService._deduct_stock_safely(items)
            stock_deducted = True

            # 3. Create order
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
            created_order = order

            # 4. Update payment session
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

            # 5. Clear cart
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

        except Exception as exc:
            # Only roll back stock if order creation failed BEFORE an order was created!
            # If an order WAS created, stock was legitimately allocated for that order.
            if stock_deducted and not created_order:
                logger.warning("Payment finalization failed before order creation. Executing stock compensation rollback...")
                PaymentService._rollback_stock_decrements(items)

            if created_order:
                try:
                    session["order_id"] = created_order["id"]
                    session["payment_status"] = "paid"
                    PaymentRepository.update_by_id(
                        session["id"],
                        {
                            "payment_status": "paid",
                            "status": "verified",
                            "razorpay_payment_id": razorpay_payment_id,
                            "order_id": created_order["id"],
                        },
                    )
                except Exception as sync_err:
                    logger.warning("Failed to sync session with created order: %s", sync_err)
            else:
                PaymentRepository.update_by_id(
                    session["id"], {"payment_status": "pending"}
                )

            if isinstance(exc, HTTPException):
                raise exc

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

    # ── Refund Lifecycle (Atomic Lock & Validated Amount) ────────────────

    @staticmethod
    def initiate_refund(
        order_id: str,
        amount: float | None = None,
        reason: str = "",
    ) -> dict:
        """
        Initiate a refund via Razorpay API. Admin-only.
        Validates amount > 0 and amount <= order_total. Uses atomic CAS lock.
        """
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        order_total = float(order.get("total_amount", 0))

        # Amount validation
        if amount is not None:
            if amount <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Refund amount must be greater than 0",
                )
            if amount > order_total:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Refund amount ({amount}) cannot exceed order total amount ({order_total})",
                )
            refund_target = amount
        else:
            refund_target = order_total

        payment_id = order.get("payment_id")
        if not payment_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order has no associated payment to refund",
            )

        razorpay_order_id = order.get("razorpay_order_id", "")
        session = PaymentRepository.get_pending_by_razorpay_order_id(razorpay_order_id)

        if not session:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No payment session found for this order. Cannot track refund state.",
            )

        if session.get("refund_id") or session.get("refund_status") in ("initiating", "processed", "created"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A refund has already been initiated or completed for this payment",
            )

        # Atomic lock to block concurrent double refunds
        locked = PaymentRepository.atomic_set_refunding(session["id"])
        if not locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A refund is currently being processed for this payment",
            )

        client = PaymentService._client()
        refund_amount_paise = int(round(refund_target * 100))

        try:
            refund = client.payment.refund(
                payment_id,
                {
                    "amount": refund_amount_paise,
                    "notes": {"reason": reason, "order_id": order_id},
                },
            )
        except Exception as exc:
            # Revert atomic lock on Razorpay API error
            PaymentRepository.update_by_id(
                session["id"],
                {"refund_status": None},
            )
            logger.error("Razorpay refund API error: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to initiate refund with Razorpay",
            ) from exc

        # Update payment session with refund info
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