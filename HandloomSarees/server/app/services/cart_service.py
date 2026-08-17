from fastapi import HTTPException, status

from app.repositories.cart_repository import CartRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.cart import CartAddRequest, CartRemoveRequest, CartQuantityUpdateRequest


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
    def _process_addons(product: dict, requested_addons: list[str]) -> tuple[list[dict], float]:
        """
        Validates selected add-ons against product availability (has_fall, has_in_skirt)
        and calculates add-on prices strictly from product record (fall_price, in_skirt_price).
        Rejects frontend-supplied price overrides or unavailable add-ons.
        """
        if not requested_addons:
            return [], 0.0

        cleaned_addons = [str(a).strip().lower() for a in requested_addons if isinstance(a, str)]
        unique_addons = sorted(list(set(cleaned_addons)))

        has_fall = bool(product.get("has_fall", False))
        fall_price_raw = product.get("fall_price")
        fall_price = float(fall_price_raw) if fall_price_raw is not None else 0.0

        has_in_skirt = bool(product.get("has_in_skirt", False))
        in_skirt_price_raw = product.get("in_skirt_price")
        in_skirt_price = float(in_skirt_price_raw) if in_skirt_price_raw is not None else 0.0

        addons_snapshot = []
        addons_total = 0.0

        for addon_id in unique_addons:
            if addon_id == "fall":
                if not has_fall:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Fall add-on is not available for this product",
                    )
                addons_snapshot.append({
                    "id": "fall",
                    "name": "Fall & Pico",
                    "price": fall_price,
                })
                addons_total += fall_price
            elif addon_id == "in_skirt":
                if not has_in_skirt:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="In-skirt add-on is not available for this product",
                    )
                addons_snapshot.append({
                    "id": "in_skirt",
                    "name": "Matching In-Skirt",
                    "price": in_skirt_price,
                })
                addons_total += in_skirt_price
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unavailable add-on selected: '{addon_id}'",
                )

        return addons_snapshot, addons_total

    @staticmethod
    def get_cart(user_id: str) -> dict:
        cart = CartRepository.get_or_create_cart(user_id)
        items = CartRepository.get_cart_items(cart["id"])

        enriched_items = []
        subtotal = 0.0
        total_items = 0

        for item in items:
            product = ProductRepository.get_by_id(item["product_id"])
            if not product:
                product_price = float(item.get("product_price", item.get("unit_price", 0)))
            else:
                product_price = float(
                    product.get("discount_price")
                    if product.get("discount_price") is not None
                    else product.get("price", 0)
                )

            addons_snapshot = item.get("selected_addons") or []
            addons_total = sum(float(a.get("price", 0)) for a in addons_snapshot)
            unit_price = product_price + addons_total
            quantity = int(item["quantity"])
            line_total = unit_price * quantity

            subtotal += line_total
            total_items += quantity

            enriched_items.append(
                {
                    **item,
                    "product_price": product_price,
                    "selected_addons": addons_snapshot,
                    "addons_total": addons_total,
                    "unit_price": unit_price,
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

        addons_snapshot, addons_total = CartService._process_addons(
            product=product,
            requested_addons=payload.selected_addons,
        )

        cart = CartRepository.get_or_create_cart(user_id)
        existing_items = CartRepository.get_cart_items(cart["id"])

        # Find existing line item with matching product_id and identical selected_addons
        target_addon_ids = set(a["id"] for a in addons_snapshot)
        existing = None
        for item in existing_items:
            if item.get("product_id") == payload.product_id:
                item_addon_ids = set(a.get("id") for a in (item.get("selected_addons") or []))
                if item_addon_ids == target_addon_ids:
                    existing = item
                    break

        product_price = float(
            product.get("discount_price")
            if product.get("discount_price") is not None
            else product.get("price", 0)
        )
        unit_price = product_price + addons_total

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
                    "product_price": product_price,
                    "selected_addons": addons_snapshot,
                    "addons_total": addons_total,
                },
            )
        else:
            CartRepository.create_cart_item(
                {
                    "cart_id": cart["id"],
                    "product_id": payload.product_id,
                    "quantity": payload.quantity,
                    "product_price": product_price,
                    "unit_price": unit_price,
                    "selected_addons": addons_snapshot,
                    "addons_total": addons_total,
                }
            )

        return CartService.get_cart(user_id)

    @staticmethod
    def update_item_quantity(user_id: str, payload: CartQuantityUpdateRequest) -> dict:
        cart = CartRepository.get_or_create_cart(user_id)
        target_item_id = payload.cart_item_id or payload.item_id

        existing = None
        if target_item_id:
            existing = CartRepository.get_cart_item_by_id(cart["id"], target_item_id)

        if not existing:
            existing_items = CartRepository.get_cart_items(cart["id"])
            if payload.selected_addons:
                target_addons = set(str(a).strip().lower() for a in payload.selected_addons)
                for item in existing_items:
                    if item.get("product_id") == payload.product_id:
                        item_addons = set(a.get("id") for a in (item.get("selected_addons") or []))
                        if item_addons == target_addons:
                            existing = item
                            break
            elif payload.product_id:
                for item in existing_items:
                    if item.get("product_id") == payload.product_id:
                        existing = item
                        break

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found in cart",
            )

        product = CartService._validate_product(existing["product_id"])

        if payload.quantity > int(product.get("stock", 0)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock",
            )

        existing_addon_keys = [a["id"] for a in (existing.get("selected_addons") or []) if isinstance(a, dict) and "id" in a]
        addons_snapshot, addons_total = CartService._process_addons(
            product=product,
            requested_addons=existing_addon_keys,
        )

        product_price = float(
            product.get("discount_price")
            if product.get("discount_price") is not None
            else product.get("price", 0)
        )
        unit_price = product_price + addons_total

        CartRepository.update_cart_item(
            existing["id"],
            {
                "quantity": payload.quantity,
                "product_price": product_price,
                "unit_price": unit_price,
                "selected_addons": addons_snapshot,
                "addons_total": addons_total,
            },
        )

        return CartService.get_cart(user_id)

    @staticmethod
    def remove_item(user_id: str, payload: CartRemoveRequest) -> dict:
        cart = CartRepository.get_or_create_cart(user_id)
        target_item_id = payload.cart_item_id or payload.item_id

        if target_item_id:
            CartRepository.delete_cart_item_by_id(cart["id"], target_item_id)
        else:
            existing_items = CartRepository.get_cart_items(cart["id"])
            matched = None
            if payload.selected_addons and payload.product_id:
                target_addons = set(str(a).strip().lower() for a in payload.selected_addons)
                for item in existing_items:
                    if item.get("product_id") == payload.product_id:
                        item_addons = set(a.get("id") for a in (item.get("selected_addons") or []))
                        if item_addons == target_addons:
                            matched = item
                            break
            elif payload.product_id:
                for item in existing_items:
                    if item.get("product_id") == payload.product_id:
                        matched = item
                        break

            if matched:
                CartRepository.delete_cart_item_by_id(cart["id"], matched["id"])
            elif payload.product_id:
                CartRepository.delete_cart_item(cart["id"], payload.product_id)

        return CartService.get_cart(user_id)