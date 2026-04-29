from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ShippingAddress(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    line1: str = Field(..., min_length=3, max_length=200)
    line2: str | None = Field(default=None, max_length=200)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., min_length=4, max_length=20)
    country: str = Field(..., min_length=2, max_length=100)


class OrderCreateRequest(BaseModel):
    shipping_address: ShippingAddress


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[dict[str, Any]]
    total_amount: float
    payment_status: str
    order_status: str
    shipping_address: dict[str, Any]
    payment_id: str | None = None
    created_at: datetime
    updated_at: datetime