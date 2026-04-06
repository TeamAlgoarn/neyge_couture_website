from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.schemas.wishlist import WishlistToggleRequest
from app.services.wishlist_service import WishlistService
from app.utils.response import success_response

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=dict)
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    user_id = current_user["profile"]["id"]
    data = WishlistService.list_items(user_id)
    return success_response("Wishlist fetched successfully", data)


@router.post("/add", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    payload: WishlistToggleRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = WishlistService.add_item(user_id, payload)
    return success_response("Item added to wishlist successfully", data)


@router.post("/remove", response_model=dict)
async def remove_from_wishlist(
    payload: WishlistToggleRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = WishlistService.remove_item(user_id, payload)
    return success_response("Item removed from wishlist successfully", data)