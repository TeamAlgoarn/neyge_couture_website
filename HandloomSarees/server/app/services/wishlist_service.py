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
                enriched.append(
                    {
                        **item,
                        "product": product,
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