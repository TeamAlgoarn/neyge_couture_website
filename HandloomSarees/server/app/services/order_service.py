from fastapi import HTTPException, status

from app.repositories.order_repository import OrderRepository


class OrderService:
    @staticmethod
    def get_order_by_id(user_id: str, order_id: str) -> dict:
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        if order["user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to access this order",
            )

        return order

    @staticmethod
    def list_user_orders(user_id: str) -> list[dict]:
        return OrderRepository.get_by_user(user_id)