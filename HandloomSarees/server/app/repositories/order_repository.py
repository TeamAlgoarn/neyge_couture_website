# from fastapi import HTTPException, status
# from app.repositories.order_repository import OrderRepository


# class OrderService:
#     @staticmethod
#     def get_order_by_id(user_id: str, order_id: str) -> dict:
#         order = OrderRepository.get_by_id(order_id)
#         if not order:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found",
#             )
#         if order["user_id"] != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not allowed to access this order",
#             )
#         return order

#     @staticmethod
#     def list_user_orders(user_id: str) -> list[dict]:
#         return OrderRepository.get_by_user(user_id)

#     @staticmethod
#     def list_all_orders() -> list[dict]:
#         return OrderRepository.list_all()

#     @staticmethod
#     def get_admin_order_by_id(order_id: str) -> dict:
#         order = OrderRepository.get_by_id(order_id)
#         if not order:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Order not found",
#             )
#         return order



from app.core.database import get_supabase_admin


class OrderRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("orders").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def get_by_id(order_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("orders")
            .select("*")
            .eq("id", order_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_by_user(user_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("orders")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def list_all() -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("orders")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def update_by_id(order_id: str, payload: dict) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("orders")
            .update(payload)
            .eq("id", order_id)
            .execute()
        )
        return result.data[0] if result.data else None