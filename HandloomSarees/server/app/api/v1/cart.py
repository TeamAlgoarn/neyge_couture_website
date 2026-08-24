from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.schemas.cart import CartAddRequest, CartRemoveRequest, CartQuantityUpdateRequest
from app.services.cart_service import CartService
from app.utils.response import success_response

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=dict)
async def get_cart(current_user: dict = Depends(get_current_user)):
    user_id = current_user["profile"]["id"]
    data = CartService.get_cart(user_id)
    return success_response("Cart fetched successfully", data)


@router.post("/add", response_model=dict)
async def add_to_cart(
    payload: CartAddRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = CartService.add_item(user_id, payload)
    return success_response("Item added to cart successfully", data)


@router.post("/update", response_model=dict)
async def update_cart_quantity(
    payload: CartQuantityUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = CartService.update_item_quantity(user_id, payload)
    return success_response("Cart item quantity updated successfully", data)


@router.post("/remove", response_model=dict)
async def remove_from_cart(
    payload: CartRemoveRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = CartService.remove_item(user_id, payload)
    return success_response("Item removed from cart successfully", data)