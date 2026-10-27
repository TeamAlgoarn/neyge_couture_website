from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CartAddRequest(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=1)
    selected_addons: list[str] = Field(default_factory=list)


class CartRemoveRequest(BaseModel):
    product_id: Optional[str] = None
    cart_item_id: Optional[str] = None
    item_id: Optional[str] = None
    selected_addons: list[str] = Field(default_factory=list)


class CartQuantityUpdateRequest(BaseModel):
    product_id: Optional[str] = None
    cart_item_id: Optional[str] = None
    item_id: Optional[str] = None
    quantity: int = Field(..., ge=1, description="Target quantity must be a positive integer")
    selected_addons: list[str] = Field(default_factory=list)


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    product_price: float = 0.0
    selected_addons: list[dict] = Field(default_factory=list)
    addons_total: float = 0.0
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