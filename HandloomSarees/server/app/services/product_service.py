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




from fastapi import HTTPException, status

from app.repositories.collection_repository import CollectionRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest
from app.utils.pagination import build_pagination
from app.utils.slug import slugify


class ProductService:
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
    def _to_public_product(product: dict) -> dict:
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
        slug = payload.slug.strip().lower() if payload.slug else slugify(payload.name)

        if ProductRepository.exists_by_slug(slug):
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
        data["slug"] = slug

        if payload.artisan:
            data["artisan"] = payload.artisan.model_dump()

        return ProductRepository.create(data)

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

        return ProductService._to_public_product(product)

    @staticmethod
    def get_by_id(product_id: str) -> dict:
        product = ProductRepository.get_by_id(product_id)
        if not product or not product.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
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

        if "collection_id" in data and data["collection_id"]:
            collection = CollectionRepository.get_by_id(data["collection_id"])
            if not collection:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid collection_id",
                )

        if "slug" in data and data["slug"]:
            data["slug"] = slugify(data["slug"])
        elif "name" in data and data["name"]:
            data["slug"] = slugify(data["name"])

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

        if "artisan" in data and data["artisan"] is not None:
            data["artisan"] = data["artisan"].model_dump()

        updated = ProductRepository.update(product_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update product",
            )

        return updated

    @staticmethod
    def soft_delete(product_id: str) -> dict:
        existing = ProductRepository.get_by_id(product_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        return ProductRepository.update(product_id, {"is_active": False})