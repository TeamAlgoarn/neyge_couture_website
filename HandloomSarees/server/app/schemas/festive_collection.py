from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class FestiveCollectionBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    slug: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    banner_image: Optional[str] = None
    popup_enabled: bool = False
    popup_message: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True


class FestiveCollectionCreate(FestiveCollectionBase):
    product_ids: List[str] = []


class FestiveCollectionUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    banner_image: Optional[str] = None
    popup_enabled: Optional[bool] = None
    popup_message: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    product_ids: Optional[List[str]] = None


class FestiveCollectionResponse(FestiveCollectionBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class FestiveCollectionWithProductsResponse(FestiveCollectionResponse):
    products: List[dict] = []