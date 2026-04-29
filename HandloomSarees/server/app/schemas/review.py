from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    product_id: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=2, max_length=2000)


class ReviewResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    rating: int
    comment: str
    created_at: datetime