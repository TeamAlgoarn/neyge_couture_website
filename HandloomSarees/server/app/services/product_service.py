# from fastapi import HTTPException, status

# from app.repositories.collection_repository import CollectionRepository
# from app.repositories.product_repository import ProductRepository
# from app.schemas.product import ProductCreateRequest, ProductUpdateRequest
# from app.utils.pagination import build_pagination
# from app.utils.slug import slugify


# class ProductService:
#     @staticmethod
#     def _resolve_collection_filter(collection: str | None) -> str | None:
#         if not collection:
#             return None

#         collection = collection.strip()
#         if not collection:
#             return None

#         found = CollectionRepository.get_by_slug(collection)
#         if found:
#             return found["id"]

#         found = CollectionRepository.get_by_id(collection)
#         if found:
#             return found["id"]

#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Collection not found",
#         )

#     @staticmethod
#     def create(payload: ProductCreateRequest) -> dict:
#         slug = payload.slug.strip().lower() if payload.slug else slugify(payload.name)

#         if ProductRepository.exists_by_slug(slug):
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Product slug already exists",
#             )

#         if payload.collection_id:
#             collection = CollectionRepository.get_by_id(payload.collection_id)
#             if not collection:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail="Invalid collection_id",
#                 )

#         data = payload.model_dump()
#         data["slug"] = slug

#         if payload.artisan:
#             data["artisan"] = payload.artisan.model_dump()

#         return ProductRepository.create(data)

#     @staticmethod
#     def list_filtered(
#         *,
#         page: int,
#         page_size: int,
#         collection: str | None,
#         occasion: str | None,
#         fabric: str | None,
#         color: str | None,
#         featured: bool | None,
#         min_price: float | None,
#         max_price: float | None,
#         search: str | None,
#         sort_by: str,
#         sort_order: str,
#     ) -> dict:
#         if min_price is not None and max_price is not None and min_price > max_price:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="min_price cannot be greater than max_price",
#             )

#         collection_id = ProductService._resolve_collection_filter(collection)

#         products, total = ProductRepository.list_filtered(
#             page=page,
#             page_size=page_size,
#             collection_id=collection_id,
#             occasion=occasion.strip() if occasion else None,
#             fabric=fabric.strip() if fabric else None,
#             color=color.strip() if color else None,
#             featured=featured,
#             min_price=min_price,
#             max_price=max_price,
#             search=search.strip() if search else None,
#             sort_by=sort_by,
#             sort_order=sort_order,
#         )

#         return {
#             "items": products,
#             "pagination": build_pagination(page, page_size, total),
#             "filters": {
#                 "collection": collection,
#                 "occasion": occasion,
#                 "fabric": fabric,
#                 "color": color,
#                 "featured": featured,
#                 "min_price": min_price,
#                 "max_price": max_price,
#                 "search": search,
#                 "sort_by": sort_by,
#                 "sort_order": sort_order,
#             },
#         }

#     @staticmethod
#     def get_by_id(product_id: str) -> dict:
#         product = ProductRepository.get_by_id(product_id)
#         if not product or not product.get("is_active", False):
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Product not found",
#             )
#         return product

#     @staticmethod
#     def update(product_id: str, payload: ProductUpdateRequest) -> dict:
#         existing = ProductRepository.get_by_id(product_id)
#         if not existing:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Product not found",
#             )

#         data = payload.model_dump(exclude_unset=True)

#         if "collection_id" in data and data["collection_id"]:
#             collection = CollectionRepository.get_by_id(data["collection_id"])
#             if not collection:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail="Invalid collection_id",
#                 )

#         if "slug" in data and data["slug"]:
#             data["slug"] = slugify(data["slug"])
#         elif "name" in data and data["name"]:
#             data["slug"] = slugify(data["name"])

#         if data.get("slug") and ProductRepository.exists_by_slug(
#             data["slug"], exclude_id=product_id
#         ):
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Product slug already exists",
#             )

#         price = data.get("price", existing["price"])
#         discount_price = data.get("discount_price", existing.get("discount_price"))
#         if discount_price is not None and discount_price > price:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="discount_price cannot be greater than price",
#             )

#         if "artisan" in data and data["artisan"] is not None:
#             data["artisan"] = data["artisan"].model_dump()

#         updated = ProductRepository.update(product_id, data)
#         if not updated:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to update product",
#             )

#         return updated

#     @staticmethod
#     def soft_delete(product_id: str) -> dict:
#         existing = ProductRepository.get_by_id(product_id)
#         if not existing:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Product not found",
#             )

#         return ProductRepository.update(product_id, {"is_active": False})




from uuid import uuid4

from fastapi import HTTPException, status

from app.repositories.collection_repository import CollectionRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest
from app.utils.pagination import build_pagination
from app.utils.slug import slugify


class ProductService:
    DEFAULT_PRODUCT_NAME = "Untitled Product"

    @staticmethod
    def _generated_slug(name: str) -> str:
        """Return a routable identifier without coupling uniqueness to display text."""
        base = slugify(name) or "product"
        suffix = uuid4().hex
        return f"{base[: 220 - len(suffix) - 1]}-{suffix}"

    @staticmethod
    def _sku_from_product(product: dict) -> str | None:
        if product.get("sku"):
            return str(product["sku"])
        variants = product.get("product_variants") or []
        active_variants = [variant for variant in variants if variant.get("is_active", True)]
        if len(active_variants) != 1:
            return None
        active_variants.sort(key=lambda variant: variant.get("created_at") or "")
        return active_variants[0].get("sku")

    @staticmethod
    def _raise_product_write_error(exc: Exception) -> None:
        message = str(exc)
        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            ) from exc
        if "multiple variants" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SKU must be managed at variant level for products with multiple variants",
            ) from exc
        if "cannot be renamed" in message:
            reason = next(
                (
                    text
                    for text in (
                        "SKU cannot be renamed while stock is reserved",
                        "SKU cannot be renamed while it is referenced by a cart",
                        "SKU cannot be renamed while it is referenced by an active order",
                    )
                    if text in message
                ),
                "SKU cannot be renamed while it has active references",
            )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=reason,
            ) from exc
        if "SKU already exists" in message or "duplicate key" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="SKU already exists",
            ) from exc
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to save product",
        ) from exc

    @staticmethod
    def _resolve_collection_filter(collection: str | None) -> str | None:
        if not collection:
            return None

        collection = collection.strip()
        if not collection:
            return None

        found = CollectionRepository.get_by_slug(collection)
        if found:
            return found["id"]

        found = CollectionRepository.get_by_id(collection)
        if found:
            return found["id"]

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found",
        )

    @staticmethod
    def _to_public_product(product: dict, *, include_sku: bool = False) -> dict:
        collection_summary = None
        collection_id = product.get("collection_id")

        if collection_id:
            collection = CollectionRepository.get_active_by_id(collection_id)
            if collection:
                collection_summary = {
                    "id": collection["id"],
                    "name": collection.get("name"),
                    "slug": collection.get("slug"),
                }

        return {
            "id": product["id"],
            "name": product.get("name"),
            "slug": product.get("slug"),
            "price": product.get("price"),
            "discount_price": product.get("discount_price"),
            "thumbnail": product.get("thumbnail"),
            "images": product.get("images") or [],
            "short_description": product.get("short_description"),
            "fabric": product.get("fabric"),
            "technique": product.get("technique"),
            "design": product.get("design"),
            "zari": product.get("zari"),
            "certification": product.get("certification"),
            "brand": product.get("brand"),
            "sku": (
                ProductService._sku_from_product(product)
                if include_sku
                else None
            ),
            "origin": product.get("origin"),
            "color": product.get("color"),
            "occasion": product.get("occasion") or [],
            "artisan": product.get("artisan"),
            "stock": product.get("stock"),
            "is_featured": product.get("is_featured", False),
            "tags": product.get("tags") or [],
            "has_fall": product.get("has_fall", False),
            "fall_price": product.get("fall_price", 0),
            "has_in_skirt": product.get("has_in_skirt", False),
            "in_skirt_price": product.get("in_skirt_price", 0),
            "collection": collection_summary,
        }

    @staticmethod
    def create(payload: ProductCreateRequest) -> dict:
        name = payload.name or ProductService.DEFAULT_PRODUCT_NAME
        requested_slug = slugify(payload.slug) if payload.slug else None
        slug = requested_slug or ProductService._generated_slug(name)

        # Explicit slugs are system identifiers and remain unique. Generated
        # slugs carry a suffix so duplicate display names do not contend for
        # the same identifier during concurrent product creation.
        if requested_slug and ProductRepository.exists_by_slug(slug):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product slug already exists",
            )

        if payload.collection_id:
            collection = CollectionRepository.get_by_id(payload.collection_id)
            if not collection:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid collection_id",
                )

        data = payload.model_dump()
        sku = data.pop("sku", None)
        data["name"] = name
        images = data.get("images") or []
        data["images"] = images
        data["thumbnail"] = data.get("thumbnail") if data.get("thumbnail") in images else (images[0] if images else None)
        data["brand"] = data.get("brand") or "Neyge Couture"
        data["slug"] = slug

        if payload.artisan:
            data["artisan"] = payload.artisan.model_dump()

        try:
            return ProductRepository.create_with_sku(data, sku)
        except Exception as exc:
            ProductService._raise_product_write_error(exc)

    @staticmethod
    def list_filtered(
        *,
        page: int,
        page_size: int,
        collection: str | None,
        occasion: str | None,
        fabric: str | None,
        color: str | None,
        featured: bool | None,
        min_price: float | None,
        max_price: float | None,
        search: str | None,
        sort_by: str,
        sort_order: str,
    ) -> dict:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="min_price cannot be greater than max_price",
            )

        collection_id = ProductService._resolve_collection_filter(collection)

        products, total = ProductRepository.list_filtered(
            page=page,
            page_size=page_size,
            collection_id=collection_id,
            occasion=occasion.strip() if occasion else None,
            fabric=fabric.strip() if fabric else None,
            color=color.strip() if color else None,
            featured=featured,
            min_price=min_price,
            max_price=max_price,
            search=search.strip() if search else None,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        public_items = [ProductService._to_public_product(product) for product in products]

        return {
            "items": public_items,
            "pagination": build_pagination(page, page_size, total),
            "filters": {
                "collection": collection,
                "occasion": occasion,
                "fabric": fabric,
                "color": color,
                "featured": featured,
                "min_price": min_price,
                "max_price": max_price,
                "search": search,
                "sort_by": sort_by,
                "sort_order": sort_order,
            },
        }

    @staticmethod
    def get_public_by_slug(slug: str) -> dict:
        product = ProductRepository.get_by_slug(slug)
        if not product or not product.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        return ProductService._to_public_product(product, include_sku=True)

    @staticmethod
    def get_by_id(product_id: str) -> dict:
        product = ProductRepository.get_by_id(product_id)
        if not product or not product.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        product["sku"] = ProductService._sku_from_product(product)
        return product

    @staticmethod
    def update(product_id: str, payload: ProductUpdateRequest) -> dict:
        existing = ProductRepository.get_by_id(product_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        data = payload.model_dump(exclude_unset=True)
        sku = data.pop("sku", None)

        if "images" in data:
            images = data.get("images") or []
            data["images"] = images
            requested_thumbnail = data.get("thumbnail", existing.get("thumbnail"))
            data["thumbnail"] = requested_thumbnail if requested_thumbnail in images else (images[0] if images else None)

        if "brand" in data and not data["brand"]:
            data["brand"] = "Neyge Couture"

        if "collection_id" in data and data["collection_id"]:
            collection = CollectionRepository.get_by_id(data["collection_id"])
            if not collection:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid collection_id",
                )

        if "name" in data and not data["name"]:
            # Blank identity fields on edit mean unchanged. Creation supplies
            # safe values for the database's NOT NULL columns above.
            data.pop("name")

        if "slug" in data and not data["slug"]:
            data.pop("slug")
        elif "slug" in data:
            normalised_slug = slugify(data["slug"])
            if normalised_slug:
                data["slug"] = normalised_slug
            else:
                data.pop("slug")

        if data.get("slug") and ProductRepository.exists_by_slug(
            data["slug"], exclude_id=product_id
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product slug already exists",
            )

        price = data.get("price", existing["price"])
        discount_price = data.get("discount_price", existing.get("discount_price"))
        if discount_price is not None and discount_price > price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="discount_price cannot be greater than price",
            )

        if "artisan" in data and payload.artisan is not None:
            data["artisan"] = payload.artisan.model_dump()

        try:
            # A missing/blank SKU is intentionally passed as NULL: the database
            # leaves an existing default SKU unchanged and repairs a missing one.
            return ProductRepository.update_with_sku(product_id, data, sku)
        except Exception as exc:
            ProductService._raise_product_write_error(exc)

    @staticmethod
    def soft_delete(product_id: str) -> dict:
        existing = ProductRepository.get_by_id(product_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        return ProductRepository.update(product_id, {"is_active": False})
