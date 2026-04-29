from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import require_admin
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest
from app.services.product_service import ProductService
from app.utils.response import success_response

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=dict)
async def list_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    collection: str | None = Query(default=None),
    occasion: str | None = Query(default=None),

    # ── CHANGED: these now accept comma-separated multi-values ────────────────
    # Single:   ?fabric=Silk
    # Multiple: ?fabric=Silk,Cotton   (frontend joins selected chips with ",")
    fabric: str | None = Query(
        default=None,
        description="Comma-separated fabric values e.g. Silk,Cotton"
    ),
    color: str | None = Query(
        default=None,
        description="Comma-separated color values e.g. Red,Gold"
    ),
    # ─────────────────────────────────────────────────────────────────────────

    featured: bool | None = Query(default=None),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    search: str | None = Query(default=None),
    sort_by: str = Query(default="created_at", pattern="^(created_at|price|name)$"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
):
    """
    List products with optional filters.

    Multi-value example:
        GET /products?color=Red,Gold&fabric=Silk,Cotton
    Returns products that match ANY of the selected colors AND ANY of the
    selected fabrics (OR within each group, AND between groups).
    """
    data = ProductService.list_filtered(
        page=page,
        page_size=page_size,
        collection=collection,
        occasion=occasion,
        fabric=fabric,
        color=color,
        featured=featured,
        min_price=min_price,
        max_price=max_price,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return success_response("Products fetched successfully", data)


@router.get("/slug/{slug}", response_model=dict)
async def get_product_by_slug(slug: str):
    data = ProductService.get_public_by_slug(slug)
    return success_response("Product fetched successfully", data)


@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    data = ProductService.get_by_id(product_id)
    return success_response("Product fetched successfully", data)


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreateRequest,
    _: dict = Depends(require_admin),
):
    data = ProductService.create(payload)
    return success_response("Product created successfully", data)


@router.put("/{product_id}", response_model=dict)
async def update_product(
    product_id: str,
    payload: ProductUpdateRequest,
    _: dict = Depends(require_admin),
):
    data = ProductService.update(product_id, payload)
    return success_response("Product updated successfully", data)


@router.delete("/{product_id}", response_model=dict)
async def delete_product(
    product_id: str,
    _: dict = Depends(require_admin),
):
    data = ProductService.soft_delete(product_id)
    return success_response("Product deleted successfully", data)