from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class WishlistToggleRequest(BaseModel):
    product_id: str = Field(..., min_length=1)


class WishlistItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    created_at: Optional[datetime] = None
    product: Optional[dict] = None