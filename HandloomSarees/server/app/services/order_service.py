from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.repositories.order_repository import OrderRepository
from app.schemas.order import OrderStatusUpdateRequest, ALLOWED_TRANSITIONS, OrderStatusEnum


class OrderService:
    @staticmethod
    def get_order_by_id(user_id: str, order_id: str) -> dict:
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        if str(order.get("user_id")) != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to access this order",
            )

        return order

    @staticmethod
    def list_user_orders(user_id: str) -> list[dict]:
        return OrderRepository.get_by_user(str(user_id))

    @staticmethod
    def list_all_orders() -> list[dict]:
        return OrderRepository.list_all()

    @staticmethod
    def get_admin_order_by_id(order_id: str) -> dict:
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )
        return order

    @staticmethod
    def update_order_status(order_id: str, payload: OrderStatusUpdateRequest) -> dict:
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found",
            )

        current_status = order.get("order_status", "confirmed")
        try:
            current_status_enum = OrderStatusEnum(current_status)
        except ValueError:
            current_status_enum = OrderStatusEnum.confirmed

        requested_status = payload.order_status

        # If it's already the same status, just return it (or allow updating tracking details)
        if current_status_enum != requested_status:
            allowed_next = ALLOWED_TRANSITIONS.get(current_status_enum, [])
            if requested_status not in allowed_next:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status transition from '{current_status_enum.value}' to '{requested_status.value}'",
                )

        now = datetime.now(timezone.utc).isoformat()

        update_dict = {
            "order_status": requested_status.value,
            "updated_at": now
        }

        if payload.courier_name is not None:
            update_dict["courier_name"] = payload.courier_name
        if payload.tracking_number is not None:
            update_dict["tracking_number"] = payload.tracking_number
        if payload.tracking_url is not None:
            update_dict["tracking_url"] = payload.tracking_url

        # Handle history
        history = order.get("status_history") or []
        history_entry = {
            "status": requested_status.value,
            "timestamp": now,
        }
        if payload.courier_name:
            history_entry["courier_name"] = payload.courier_name
        if payload.tracking_number:
            history_entry["tracking_number"] = payload.tracking_number
        if payload.tracking_url:
            history_entry["tracking_url"] = payload.tracking_url

        history.append(history_entry)
        update_dict["status_history"] = history

        updated_order = OrderRepository.update_by_id(order_id, update_dict)
        if not updated_order:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update order",
            )
        return updated_order