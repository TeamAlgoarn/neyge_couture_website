from fastapi import HTTPException, status

from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.cart import CartAddRequest, CartRemoveRequest


class CartService:
    @staticmethod
    def _validate_product(product_id: str) -> dict:
        product = ProductRepository.get_active_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or inactive",
            )
        return product

    @staticmethod
    def get_cart(user_id: str) -> dict:
        cart = CartRepository.get_or_create_cart(user_id)
        items = CartRepository.get_cart_items(cart["id"])

        enriched_items = []
        subtotal = 0.0
        total_items = 0

        for item in items:
            product = ProductRepository.get_by_id(item["product_id"])
            line_total = float(item["unit_price"]) * int(item["quantity"])
            subtotal += line_total
            total_items += int(item["quantity"])

            enriched_items.append(
                {
                    **item,
                    "line_total": line_total,
                    "product": product,
                }
            )

        return {
            "cart_id": cart["id"],
            "user_id": user_id,
            "items": enriched_items,
            "subtotal": subtotal,
            "total_items": total_items,
        }

    @staticmethod
    def add_item(user_id: str, payload: CartAddRequest) -> dict:
        product = CartService._validate_product(payload.product_id)

        if payload.quantity > int(product.get("stock", 0)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock",
            )

        cart = CartRepository.get_or_create_cart(user_id)
        existing = CartRepository.get_cart_item(cart["id"], payload.product_id)

        unit_price = float(product.get("discount_price") or product["price"])

        if existing:
            new_qty = int(existing["quantity"]) + payload.quantity

            if new_qty > int(product.get("stock", 0)):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Insufficient stock",
                )

            CartRepository.update_cart_item(
                existing["id"],
                {
                    "quantity": new_qty,
                    "unit_price": unit_price,
                },
            )
        else:
            CartRepository.create_cart_item(
                {
                    "cart_id": cart["id"],
                    "product_id": payload.product_id,
                    "quantity": payload.quantity,
                    "unit_price": unit_price,
                }
            )

        return CartService.get_cart(user_id)

    @staticmethod
    def remove_item(user_id: str, payload: CartRemoveRequest) -> dict:
        cart = CartRepository.get_or_create_cart(user_id)
        CartRepository.delete_cart_item(cart["id"], payload.product_id)
        return CartService.get_cart(user_id)