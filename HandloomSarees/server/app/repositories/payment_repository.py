from app.core.database import get_supabase_admin


class PaymentRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("payment_sessions").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def get_by_id(session_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .select("*")
            .eq("id", session_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_by_razorpay_order_id(razorpay_order_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .select("*")
            .eq("razorpay_order_id", razorpay_order_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_by_razorpay_order_id_and_user(
        razorpay_order_id: str,
        user_id: str,
    ) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .select("*")
            .eq("razorpay_order_id", razorpay_order_id)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def update_by_id(session_id: str, payload: dict) -> dict:
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .update(payload)
            .eq("id", session_id)
            .execute()
        )
        return result.data[0]

    @staticmethod
    def list_by_user(user_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []