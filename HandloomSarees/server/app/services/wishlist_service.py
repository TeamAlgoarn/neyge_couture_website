# from fastapi import HTTPException, status

# from app.repositories.product_repository import ProductRepository
# from app.repositories.wishlist_repository import WishlistRepository
# from app.schemas.wishlist import WishlistToggleRequest


# class WishlistService:
#     @staticmethod
#     def list_items(user_id: str) -> list[dict]:
#         items = WishlistRepository.list_items(user_id)

#         enriched = []
#         for item in items:
#             product = ProductRepository.get_by_id(item["product_id"])
#             if product and product.get("is_active", False):
#                 enriched.append(
#                     {
#                         **item,
#                         "product": product,
#                     }
#                 )
#         return enriched

#     @staticmethod
#     def add_item(user_id: str, payload: WishlistToggleRequest) -> dict:
#         product = ProductRepository.get_active_by_id(payload.product_id)
#         if not product:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Product not found or inactive",
#             )

#         existing = WishlistRepository.get_item(user_id, payload.product_id)
#         if existing:
#             return existing

#         return WishlistRepository.add_item(
#             {
#                 "user_id": user_id,
#                 "product_id": payload.product_id,
#             }
#         )

#     @staticmethod
#     def remove_item(user_id: str, payload: WishlistToggleRequest) -> list[dict]:
#         WishlistRepository.remove_item(user_id, payload.product_id)
#         return WishlistService.list_items(user_id)

from fastapi import HTTPException, status

from app.repositories.product_repository import ProductRepository
from app.repositories.wishlist_repository import WishlistRepository
from app.schemas.wishlist import WishlistToggleRequest


class WishlistService:
    @staticmethod
    def list_items(user_id: str) -> list[dict]:
        items = WishlistRepository.list_items(user_id)

        enriched = []
        for item in items:
            product = ProductRepository.get_by_id(item["product_id"])
            if product and product.get("is_active", False):
                images: list[str] = product.get("images") or []

                enriched.append(
                    {
                        "id": product.get("id", item["product_id"]),
                        "name": product.get("name", ""),
                        "slug": product.get("slug", ""),
                        "price": product.get("price", 0),
                        "discount_price": product.get("discount_price") or None,
                        "thumbnail": images[0] if images else None,
                        "images": images,
                        "short_description": (
                            product.get("short_description")
                            or product.get("description")
                            or ""
                        ),
                        "color": product.get("color") or "",
                        "fabric": product.get("fabric") or "",
                        "technique": product.get("technique") or "",
                        "occasion": product.get("occasion") or [],
                        "care_instructions": product.get("care_instructions") or "",
                        "is_featured": product.get("is_featured", False),
                        "stock": product.get("stock") or 0,
                        "artisan": product.get("artisan") or None,
                    }
                )
        return enriched

    @staticmethod
    def add_item(user_id: str, payload: WishlistToggleRequest) -> dict:
        product = ProductRepository.get_active_by_id(payload.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or inactive",
            )

        existing = WishlistRepository.get_item(user_id, payload.product_id)
        if existing:
            return existing

        return WishlistRepository.add_item(
            {
                "user_id": user_id,
                "product_id": payload.product_id,
            }
        )

    @staticmethod
    def remove_item(user_id: str, payload: WishlistToggleRequest) -> list[dict]:
        WishlistRepository.remove_item(user_id, payload.product_id)
        return WishlistService.list_items(user_id)