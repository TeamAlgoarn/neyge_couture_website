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