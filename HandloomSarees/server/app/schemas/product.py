from datetime import datetime
from typing import Any, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator


class ArtisanInfo(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    region: Optional[str] = Field(default=None, max_length=120)
    experience: Optional[str] = Field(default=None, max_length=120)


# ─────────────────────────────────────────────────────────────────────────────
# HOW color & fabric now work
# ─────────────────────────────────────────────────────────────────────────────
# Admin sends:  color=["Red","Gold"]   fabric=["Silk","Cotton"]
# Stored in DB: color="Red,Gold"       fabric="Silk,Cotton"
#   (plain comma-joined string — no DB migration needed)
# Filtering:    ilike "%Red%"  works on the stored string  ✓
# Frontend:     splits on "," to build filter chip options ✓
# ─────────────────────────────────────────────────────────────────────────────

def _join(v: Any) -> Optional[str]:
    """Accept list[str] or str, always return a comma-joined string or None."""
    if v is None:
        return None
    if isinstance(v, list):
        cleaned = [x.strip() for x in v if isinstance(x, str) and x.strip()]
        return ",".join(cleaned) if cleaned else None
    if isinstance(v, str):
        return v.strip() or None
    return None


def _split(v: Any) -> list[str]:
    """Accept str or list, always return a clean list of strings."""
    if v is None:
        return []
    if isinstance(v, list):
        return [x.strip() for x in v if isinstance(x, str) and x.strip()]
    if isinstance(v, str):
        return [x.strip() for x in v.split(",") if x.strip()]
    return []


class ProductCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=180)
    slug: Optional[str] = Field(default=None, max_length=220)
    price: float = Field(..., ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    images: List[str] = Field(default_factory=list)
    thumbnail: Optional[str] = None
    short_description: Optional[str] = None
    story: Optional[str] = None

    # ── CHANGED: accept list[str] from admin form, store as "A,B,C" string ──
    fabric: Optional[Any] = None          # list[str] | str  →  stored as str
    color: Optional[Any] = None           # list[str] | str  →  stored as str

    technique: Optional[str] = None
    origin: Optional[str] = None
    collection_id: Optional[str] = None
    occasion: List[str] = Field(default_factory=list)
    artisan: Optional[ArtisanInfo] = None
    stock: int = Field(default=0, ge=0)
    is_featured: bool = False
    is_active: bool = True
    care_instructions: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    has_fall: bool = True
    fall_price: float = Field(default=150.0, ge=0)
    has_in_skirt: bool = True
    in_skirt_price: float = Field(default=350.0, ge=0)

    # validators: normalise whatever arrives into a plain string for DB
    @field_validator("color", "fabric", mode="before")
    @classmethod
    def normalise_to_string(cls, v):
        return _join(v)

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

    # ── CHANGED: same normalisation on update ────────────────────────────────
    fabric: Optional[Any] = None
    color: Optional[Any] = None

    technique: Optional[str] = None
    origin: Optional[str] = None
    collection_id: Optional[str] = None
    occasion: Optional[List[str]] = None
    artisan: Optional[ArtisanInfo] = None
    stock: Optional[int] = Field(default=None, ge=0)
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    care_instructions: Optional[str] = None
    tags: Optional[List[str]] = None
    has_fall: Optional[bool] = None
    fall_price: Optional[float] = Field(default=None, ge=0)
    has_in_skirt: Optional[bool] = None
    in_skirt_price: Optional[float] = Field(default=None, ge=0)

    @field_validator("color", "fabric", mode="before")
    @classmethod
    def normalise_to_string(cls, v):
        return _join(v)


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
    fabric: Optional[str] = None          # returned as plain string "Silk,Cotton"
    technique: Optional[str] = None
    origin: Optional[str] = None
    color: Optional[str] = None           # returned as plain string "Red,Gold"
    collection_id: Optional[str] = None
    occasion: List[str]
    artisan: Optional[ArtisanInfo] = None
    stock: int
    is_featured: bool
    is_active: bool
    care_instructions: Optional[str] = None
    tags: List[str]
    has_fall: bool = False
    fall_price: float = 0.0
    has_in_skirt: bool = False
    in_skirt_price: float = 0.0
    created_at: datetime
    updated_at: datetime


class ProductListQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=12, ge=1, le=50)

    collection: Optional[str] = None
    occasion: Optional[str] = None

    # ── CHANGED: accept comma-separated multi-values e.g. "Silk,Cotton" ──────
    # The repository splits these and ORs the ilike filters
    fabric: Optional[str] = None          # "Silk" | "Silk,Cotton"
    color: Optional[str] = None           # "Red"  | "Red,Gold"

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
    fabric: str | None = None            # "Silk,Cotton" — frontend splits for display
    technique: str | None = None
    origin: str | None = None
    color: str | None = None             # "Red,Gold"   — frontend splits for display
    occasion: list[str] = []
    artisan: dict[str, Any] | None = None
    stock: int | None = None
    is_featured: bool = False
    tags: list[str] = []
    has_fall: bool = False
    fall_price: float = 0.0
    has_in_skirt: bool = False
    in_skirt_price: float = 0.0
    collection: PublicCollectionSummary | None = None


class PublicProductListResponse(BaseModel):
    items: list[PublicProductResponse]
    pagination: dict
    filters: dict