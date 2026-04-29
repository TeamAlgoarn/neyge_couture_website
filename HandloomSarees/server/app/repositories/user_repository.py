from app.core.database import get_supabase_admin


class UserRepository:
    @staticmethod
    def get_wishlist(user_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("wishlists")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_wishlist_item(user_id: str, product_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("wishlists")
            .select("*")
            .eq("user_id", user_id)
            .eq("product_id", product_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def add_wishlist_item(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("wishlists").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def remove_wishlist_item(user_id: str, product_id: str) -> None:
        client = get_supabase_admin()
        client.table("wishlists").delete().eq("user_id", user_id).eq("product_id", product_id).execute()