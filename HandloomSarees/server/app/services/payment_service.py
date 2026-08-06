import hashlib
import hmac

import razorpay
from fastapi import HTTPException, status

from app.core.config import settings
from app.repositories.cart_repository import CartRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.product_repository import ProductRepository


class PaymentService:
    @staticmethod
    def _client() -> razorpay.Client:
        return razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    @staticmethod
    def _build_checkout_snapshot(user_id: str, shipping_address: dict) -> dict:
        user_id = str(user_id)

        cart = CartRepository.get_or_create_cart(user_id)
        cart_items = CartRepository.get_cart_items(cart["id"])

        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cart is empty",
            )

        order_items: list[dict] = []
        total_amount = 0.0

        for item in cart_items:
            product_id = item.get("product_id")
            if not product_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid cart item: product_id missing",
                )

            product = ProductRepository.get_active_by_id(product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Product not found in cart",
                )

            quantity = int(item.get("quantity", 0))
            available_stock = int(product.get("stock", 0))

            if quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid cart quantity",
                )

            if available_stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.get('name', 'Unknown')}'",
                )

            product_price = float(
                product.get("discount_price")
                if product.get("discount_price") is not None
                else product.get("price", 0)
            )

            if product_price <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid price for '{product.get('name', 'Unknown')}'",
                )

            selected_addons = item.get("selected_addons") or []
            addons_total = sum(float(a.get("price", 0)) for a in selected_addons)
            unit_price = product_price + addons_total

            line_total = unit_price * quantity
            total_amount += line_total

            order_items.append(
                {
                    "name": product.get("name"),
                    "slug": product.get("slug"),
                    "price": product_price,
                    "selected_addons": selected_addons,
                    "addons_total": addons_total,
                    "unit_price": unit_price,
                    "quantity": quantity,
                    "thumbnail": product.get("thumbnail"),
                    "line_total": line_total,
                    "product_id": product.get("id"),
                }
            )

        return {
            "cart_id": cart["id"],
            "user_id": user_id,
            "items": order_items,
            "total_amount": total_amount,
            "shipping_address": shipping_address,
        }

    @staticmethod
    def create_payment_order(user_id: str, shipping_address: dict) -> dict:
        user_id = str(user_id)

        snapshot = PaymentService._build_checkout_snapshot(
            user_id=user_id,
            shipping_address=shipping_address,
        )

        client = PaymentService._client()
        amount_paise = int(round(snapshot["total_amount"] * 100))

        try:
            razorpay_order = client.order.create(
                {
                    "amount": amount_paise,
                    "currency": "INR",
                    "payment_capture": 1,
                }
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to create Razorpay order",
            ) from exc

        PaymentRepository.create(
            {
                "user_id": user_id,
                "razorpay_order_id": razorpay_order["id"],
                "items": snapshot["items"],
                "total_amount": snapshot["total_amount"],
                "shipping_address": snapshot["shipping_address"],
                "currency": "INR",
                "status": "created",
                "payment_status": "pending",
            }
        )

        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
        }

    @staticmethod
    def _verify_signature(
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> None:
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(generated_signature, razorpay_signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment verification",
            )

    @staticmethod
    def verify_payment_and_finalize(
        user_id: str,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> dict:
        user_id = str(user_id)

        session = PaymentRepository.get_by_razorpay_order_id_and_user(
            razorpay_order_id=razorpay_order_id,
            user_id=user_id,
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment session not found",
            )

        if session.get("payment_status") == "paid":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment session already verified",
            )

        PaymentService._verify_signature(
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
        )

        items = session.get("items", [])
        if not items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment session has no items",
            )

        for item in items:
            product_id = item["product_id"]
            quantity = int(item["quantity"])

            product = ProductRepository.get_active_by_id(product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product not found: {product_id}",
                )

            current_stock = int(product.get("stock", 0))
            if current_stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.get('name', 'Unknown')}'",
                )

        for item in items:
            product_id = item["product_id"]
            quantity = int(item["quantity"])

            product = ProductRepository.get_active_by_id(product_id)
            current_stock = int(product.get("stock", 0))

            ProductRepository.update_by_id(
                product_id,
                {
                    "stock": current_stock - quantity,
                },
            )

        order = OrderRepository.create(
            {
                "user_id": user_id,
                "items": items,
                "total_amount": session["total_amount"],
                "payment_status": "paid",
                "order_status": "confirmed",
                "shipping_address": session["shipping_address"],
                "payment_id": razorpay_payment_id,
                "razorpay_order_id": razorpay_order_id,
            }
        )

        PaymentRepository.update_by_id(
            session["id"],
            {
                "payment_status": "paid",
                "status": "verified",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
                "order_id": order["id"],
            },
        )

        cart = CartRepository.get_or_create_cart(user_id)
        CartRepository.clear_cart(cart["id"])

        return order