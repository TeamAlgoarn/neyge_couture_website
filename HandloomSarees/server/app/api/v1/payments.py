from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.dependencies import get_current_user
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
        order = data.get("order", {})
        customer_name = current_user.get("profile", {}).get("full_name", "Customer")
        phone = current_user.get("profile", {}).get("phone", "")
        order_id = order.get("id", payload.razorpay_order_id)
        amount = str(order.get("total_amount", ""))

        if phone:
            message = f"""Hi {customer_name}! 🎉

Your payment has been confirmed at Neyge Couture.

Order ID: {order_id}
Amount Paid: ₹{amount}

We will notify you once your order is shipped. Thank you for shopping with us! 🛍️

www.negyecouture.com"""
            await send_whatsapp_message(phone, message)
    except Exception as e:
        print(f"WhatsApp notification error: {e}")
    # ─────────────────────────────────────────────────────────────────────

    return success_response("Payment verified successfully", data)