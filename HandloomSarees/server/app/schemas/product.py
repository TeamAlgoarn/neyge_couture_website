from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator
from pydantic import BaseModel
from typing import Any
class ArtisanInfo(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    region: Optional[str] = Field(default=None, max_length=120)
    experience: Optional[str] = Field(default=None, max_length=120)


class ProductCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=180)
    slug: Optional[str] = Field(default=None, max_length=220)
    price: float = Field(..., ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    images: List[str] = Field(default_factory=list)
    thumbnail: Optional[str] = None
    short_description: Optional[str] = None
    story: Optional[str] = None
    fabric: Optional[str] = None
    technique: Optional[str] = None
    origin: Optional[str] = None
    color: Optional[str] = None
    collection_id: Optional[str] = None
    occasion: List[str] = Field(default_factory=list)
    artisan: Optional[ArtisanInfo] = None
    stock: int = Field(default=0, ge=0)
    is_featured: bool = False
    is_active: bool = True
    care_instructions: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

    @field_validator("discount_price")
    @classmethod
    def validate_discount_price(cls, value, info):
        price = info.data.get("price")
        if value is not None and price is not None and value > price:
            raise ValueError("discount_price cannot be greater than price")
        return value


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=180)
    slug: Optional[str] = Field(default=None, max_length=220)
    price: Optional[float] = Field(default=None, ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    short_description: Optional[str] = None
    story: Optional[str] = None
    fabric: Optional[str] = None
    technique: Optional[str] = None
    origin: Optional[str] = None
    color: Optional[str] = None
    collection_id: Optional[str] = None
    occasion: Optional[List[str]] = None
    artisan: Optional[ArtisanInfo] = None
    stock: Optional[int] = Field(default=None, ge=0)
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    care_instructions: Optional[str] = None
    tags: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    price: float
    discount_price: Optional[float] = None
    images: List[str]
    thumbnail: Optional[str] = None
    short_description: Optional[str] = None
    story: Optional[str] = None
    fabric: Optional[str] = None
    technique: Optional[str] = None
    origin: Optional[str] = None
    color: Optional[str] = None
    collection_id: Optional[str] = None
    occasion: List[str]
    artisan: Optional[ArtisanInfo] = None
    stock: int
    is_featured: bool
    is_active: bool
    care_instructions: Optional[str] = None
    tags: List[str]
    created_at: datetime
    updated_at: datetime


from typing import Literal, Optional
from pydantic import BaseModel, Field


class ProductListQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=12, ge=1, le=50)

    collection: Optional[str] = None
    occasion: Optional[str] = None
    fabric: Optional[str] = None
    color: Optional[str] = None
    featured: Optional[bool] = None

    min_price: Optional[float] = Field(default=None, ge=0)
    max_price: Optional[float] = Field(default=None, ge=0)

    search: Optional[str] = None

    sort_by: Literal["created_at", "price", "name"] = "created_at"
    sort_order: Literal["asc", "desc"] = "desc"




class PublicCollectionSummary(BaseModel):
    id: str
    name: str | None = None
    slug: str | None = None


class PublicProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    price: float
    discount_price: float | None = None
    thumbnail: str | None = None
    images: list[str] = []
    short_description: str | None = None
    fabric: str | None = None
    technique: str | None = None
    origin: str | None = None
    color: str | None = None
    occasion: list[str] = []
    artisan: dict[str, Any] | None = None
    stock: int | None = None
    is_featured: bool = False
    tags: list[str] = []
    collection: PublicCollectionSummary | None = None


class PublicProductListResponse(BaseModel):
    items: list[PublicProductResponse]
    pagination: dict
    filters: dict