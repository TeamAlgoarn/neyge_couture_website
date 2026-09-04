from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.dependencies import get_current_user, require_admin
from app.schemas.payment import PaymentFailedRequest, RefundRequest
from app.services.payment_service import PaymentService
from app.utils.response import success_response
from app.api.v1.whatsapp import send_whatsapp_message

router = APIRouter(prefix="/payments", tags=["Payments"])


def resolve_user_id(current_user: dict) -> str:
    user_id = (
        current_user.get("profile", {}).get("id")
        or current_user.get("id")
        or current_user.get("user", {}).get("id")
        or current_user.get("user_id")
        or current_user.get("uid")
    )
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to resolve authenticated user id",
        )
    return str(user_id)


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/verify", response_model=dict)
async def verify_payment(
    payload: PaymentVerifyRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)

    data = PaymentService.verify_payment_and_finalize(
        user_id=user_id,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )

    # ── Send WhatsApp notification after payment ──────────────────────────
    try:
        # data is the order dict directly (from _finalize_payment)
        customer_name = current_user.get("profile", {}).get("full_name", "Customer")
        phone = current_user.get("profile", {}).get("phone", "")
        order_id = data.get("id", payload.razorpay_order_id)
        amount = str(data.get("total_amount", ""))

        if phone:
            message = f"""Hi {customer_name}! 🎉

Your payment has been confirmed at Neyge Couture.

Order ID: {order_id}
Amount Paid: ₹{amount}

We will notify you once your order is shipped. Thank you for shopping with us! 🛍️

www.neygecouture.com"""
            await send_whatsapp_message(phone, message)
    except Exception as e:
        print(f"WhatsApp notification error: {e}")
    # ─────────────────────────────────────────────────────────────────────

    return success_response("Payment verified successfully", data)


# ── Payment Failure (Frontend Callback) ──────────────────────────────────

@router.post("/failed", response_model=dict)
async def report_payment_failure(
    payload: PaymentFailedRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Called by the frontend when Razorpay reports a payment failure.
    Marks the payment session as failed — does NOT touch inventory.
    """
    user_id = resolve_user_id(current_user)

    data = PaymentService.handle_payment_failure(
        razorpay_order_id=payload.razorpay_order_id,
        user_id=user_id,
        error_description=payload.error_description,
    )

    return success_response("Payment failure recorded", data)


# ── Refund Endpoints (Admin Only) ────────────────────────────────────────

@router.post("/refund", response_model=dict)
async def initiate_refund(
    payload: RefundRequest,
    current_user: dict = Depends(require_admin),
):
    """
    Initiate a refund via Razorpay API. Admin-only.
    Partial refund: specify amount in INR. Full refund: omit amount.
    """
    data = PaymentService.initiate_refund(
        order_id=payload.order_id,
        amount=payload.amount,
        reason=payload.reason,
    )

    return success_response("Refund initiated successfully", data)


@router.get("/refund/{refund_id}/status", response_model=dict)
async def get_refund_status(
    refund_id: str,
    current_user: dict = Depends(require_admin),
):
    """Fetch refund status from Razorpay. Admin-only."""
    data = PaymentService.get_refund_status(refund_id)
    return success_response("Refund status fetched", data)
