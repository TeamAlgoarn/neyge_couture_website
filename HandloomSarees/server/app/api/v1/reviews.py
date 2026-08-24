from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.schemas.review import ReviewCreateRequest
from app.services.review_service import ReviewService
from app.utils.response import success_response

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_review(
    payload: ReviewCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = ReviewService.create_review(user_id, payload)
    return success_response("Review created successfully", data)


@router.get("/{product_id}", response_model=dict)
async def get_reviews_by_product(product_id: str):
    data = ReviewService.list_product_reviews(product_id)
    return success_response("Reviews fetched successfully", data)