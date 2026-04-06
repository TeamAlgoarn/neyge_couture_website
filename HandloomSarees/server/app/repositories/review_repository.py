from app.core.database import get_supabase_admin


class ReviewRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("reviews").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def get_by_product(product_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("reviews")
            .select("*")
            .eq("product_id", product_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_by_user_and_product(user_id: str, product_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("reviews")
            .select("*")
            .eq("user_id", user_id)
            .eq("product_id", product_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None