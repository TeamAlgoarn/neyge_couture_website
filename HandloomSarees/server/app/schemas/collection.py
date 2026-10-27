# from datetime import datetime
# from typing import Optional

# from pydantic import BaseModel, Field


# class CollectionBase(BaseModel):
#     name: str = Field(..., min_length=2, max_length=120)
#     slug: Optional[str] = Field(default=None, max_length=140)
#     banner_image: Optional[str] = Field(default=None, max_length=500)
#     description: Optional[str] = Field(default=None, max_length=500)
#     story: Optional[str] = Field(default=None)
#     sort_order: int = Field(default=0, ge=0)
#     is_active: bool = True


# class CollectionCreate(CollectionBase):
#     pass


# class CollectionUpdate(BaseModel):
#     name: Optional[str] = Field(default=None, min_length=2, max_length=120)
#     slug: Optional[str] = Field(default=None, max_length=140)
#     banner_image: Optional[str] = Field(default=None, max_length=500)
#     description: Optional[str] = Field(default=None, max_length=500)
#     story: Optional[str] = Field(default=None)
#     sort_order: Optional[int] = Field(default=None, ge=0)
#     is_active: Optional[bool] = None


# class CollectionResponse(BaseModel):
#     id: str
#     name: str
#     slug: str
#     banner_image: Optional[str] = None
#     description: Optional[str] = None
#     story: Optional[str] = None
#     sort_order: int
#     is_active: bool
#     created_at: datetime
#     updated_at: datetime









from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class CollectionCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    slug: Optional[str] = Field(default=None, max_length=180)
    banner_image: Optional[str] = Field(default=None, max_length=1000)
    description: Optional[str] = None
    story: Optional[str] = None
    sort_order: int = Field(default=0, ge=0)
    is_active: bool = True
    featured: bool = Field(
        default=False,
        description="Whether this collection is shown in the homepage Collections section",
    )
    # ── NEW: category lets admin tag the collection type ──────────────────────
    # This drives the filter sidebar in CollectionsPage without name-guessing
    category: Optional[str] = Field(
        default=None,
        max_length=80,
        description="e.g. Wedding, Party & Festive, Casual, Formal, Heritage"
    )

    @field_validator("banner_image", mode="before")
    @classmethod
    def empty_banner_to_none(cls, value):
        return value.strip() or None if isinstance(value, str) else value


class CollectionUpdateRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    slug: Optional[str] = Field(default=None, max_length=180)
    banner_image: Optional[str] = Field(default=None, max_length=1000)
    description: Optional[str] = None
    story: Optional[str] = None
    sort_order: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None
    featured: Optional[bool] = None
    category: Optional[str] = Field(default=None, max_length=80)

    @field_validator("banner_image", mode="before")
    @classmethod
    def empty_banner_to_none(cls, value):
        return value.strip() or None if isinstance(value, str) else value


class CollectionResponse(BaseModel):
    id: str
    name: str
    slug: str
    banner_image: Optional[str] = None
    description: Optional[str] = None
    story: Optional[str] = None
    sort_order: int = 0
    is_active: bool
    featured: bool = False
    # ── NEW ──────────────────────────────────────────────────────────────────
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime
