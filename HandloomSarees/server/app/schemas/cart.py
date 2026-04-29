from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CartAddRequest(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=1)


class CartRemoveRequest(BaseModel):
    product_id: str = Field(..., min_length=1)


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    unit_price: float
    line_total: float
    product: Optional[dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CartResponse(BaseModel):
    cart_id: Optional[str] = None
    user_id: str
    items: list[CartItemResponse]
    subtotal: float
    total_items: int