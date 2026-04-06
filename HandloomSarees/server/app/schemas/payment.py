from pydantic import BaseModel, Field

from app.schemas.order import ShippingAddress


class PaymentCreateOrderRequest(BaseModel):
    shipping_address: ShippingAddress


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str = Field(..., min_length=1)
    razorpay_payment_id: str = Field(..., min_length=1)
    razorpay_signature: str = Field(..., min_length=1)