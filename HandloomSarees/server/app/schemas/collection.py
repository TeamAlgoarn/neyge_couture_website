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

from pydantic import BaseModel, Field


class CollectionCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    slug: Optional[str] = Field(default=None, max_length=180)
    banner_image: Optional[str] = None
    description: Optional[str] = None
    story: Optional[str] = None
    is_active: bool = True
    featured: bool = False
    # ── NEW: category lets admin tag the collection type ──────────────────────
    # This drives the filter sidebar in CollectionsPage without name-guessing
    category: Optional[str] = Field(
        default=None,
        max_length=80,
        description="e.g. Wedding, Party & Festive, Casual, Formal, Heritage"
    )


class CollectionUpdateRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    slug: Optional[str] = Field(default=None, max_length=180)
    banner_image: Optional[str] = None
    description: Optional[str] = None
    story: Optional[str] = None
    is_active: Optional[bool] = None
    featured: Optional[bool] = None
    # ── NEW ──────────────────────────────────────────────────────────────────
    category: Optional[str] = Field(default=None, max_length=80)


class CollectionResponse(BaseModel):
    id: str
    name: str
    slug: str
    banner_image: Optional[str] = None
    description: Optional[str] = None
    story: Optional[str] = None
    is_active: bool
    featured: bool = False
    # ── NEW ──────────────────────────────────────────────────────────────────
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime