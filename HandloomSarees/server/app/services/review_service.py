from fastapi import HTTPException, status

from app.repositories.product_repository import ProductRepository
from app.repositories.review_repository import ReviewRepository
from app.schemas.review import ReviewCreateRequest


class ReviewService:
    @staticmethod
    def create_review(user_id: str, payload: ReviewCreateRequest) -> dict:
        product = ProductRepository.get_active_by_id(payload.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or inactive",
            )

        existing = ReviewRepository.get_by_user_and_product(user_id, payload.product_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already reviewed this product",
            )

        review = ReviewRepository.create(
            {
                "user_id": user_id,
                "product_id": payload.product_id,
                "rating": payload.rating,
                "comment": payload.comment.strip(),
            }
        )
        return review

    @staticmethod
    def list_product_reviews(product_id: str) -> list[dict]:
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        return ReviewRepository.get_by_product(product_id)