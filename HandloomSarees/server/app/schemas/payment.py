from pydantic import BaseModel, Field

from app.schemas.order import ShippingAddress


class PaymentCreateOrderRequest(BaseModel):
    shipping_address: ShippingAddress


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str = Field(..., min_length=1)
    razorpay_payment_id: str = Field(..., min_length=1)
    razorpay_signature: str = Field(..., min_length=1)


class PaymentFailedRequest(BaseModel):
    razorpay_order_id: str = Field(..., min_length=1)
    error_description: str = Field(default="")


class RefundRequest(BaseModel):
    order_id: str = Field(..., min_length=1)
    amount: float | None = Field(
        default=None,
        description="Partial refund amount in INR. None = full refund.",
    )
    reason: str = Field(default="", max_length=500)