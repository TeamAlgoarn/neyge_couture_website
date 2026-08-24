from app.core.database import get_supabase_admin


class CartRepository:
    @staticmethod
    def get_or_create_cart(user_id: str) -> dict:
        client = get_supabase_admin()

        existing = (
            client.table("carts")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if existing.data:
            return existing.data[0]

        created = client.table("carts").insert({"user_id": user_id}).execute()
        return created.data[0]

    @staticmethod
    def get_cart_items(cart_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("cart_items")
            .select("*")
            .eq("cart_id", cart_id)
            .order("created_at", desc=False)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_cart_item(cart_id: str, product_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("cart_items")
            .select("*")
            .eq("cart_id", cart_id)
            .eq("product_id", product_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def create_cart_item(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("cart_items").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def update_cart_item(item_id: str, payload: dict) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("cart_items")
            .update(payload)
            .eq("id", item_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def delete_cart_item(cart_id: str, product_id: str) -> None:
        client = get_supabase_admin()
        client.table("cart_items").delete().eq("cart_id", cart_id).eq(
            "product_id", product_id
        ).execute()

    @staticmethod
    def remove_item(cart_id: str, product_id: str) -> None:
        client = get_supabase_admin()
        client.table("cart_items").delete().eq("cart_id", cart_id).eq(
            "product_id", product_id
        ).execute()

    @staticmethod
    def get_cart_item_by_id(cart_id: str, item_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("cart_items")
            .select("*")
            .eq("cart_id", cart_id)
            .eq("id", item_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def delete_cart_item_by_id(cart_id: str, item_id: str) -> None:
        client = get_supabase_admin()
        client.table("cart_items").delete().eq("cart_id", cart_id).eq("id", item_id).execute()

    @staticmethod
    def clear_cart(cart_id: str) -> None:
        client = get_supabase_admin()
        client.table("cart_items").delete().eq("cart_id", cart_id).execute()