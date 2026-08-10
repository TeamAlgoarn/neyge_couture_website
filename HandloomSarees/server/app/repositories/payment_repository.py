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

    @staticmethod
    def get_by_idempotency_key(idempotency_key: str, user_id: str) -> dict | None:
        """Find an existing payment session by idempotency key + user."""
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .select("*")
            .eq("idempotency_key", idempotency_key)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_pending_by_razorpay_order_id(razorpay_order_id: str) -> dict | None:
        """Find a pending payment session by razorpay_order_id (no user filter, for webhooks)."""
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
    def atomic_set_processing(session_id: str) -> dict | None:
        """
        CAS (compare-and-swap) lock: set payment_status to 'processing'
        ONLY if it is currently 'pending'. Returns the updated row or None
        if another request already grabbed the lock.
        """
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .update({"payment_status": "processing"})
            .eq("id", session_id)
            .eq("payment_status", "pending")
            .execute()
        )
        return result.data[0] if result.data else None