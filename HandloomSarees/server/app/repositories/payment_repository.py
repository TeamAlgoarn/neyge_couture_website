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

    @staticmethod
    def atomic_set_refunding(session_id: str) -> dict | None:
        """
        Atomic CAS lock for refund initiation.
        Sets refund_status to 'initiating' ONLY if BOTH refund_id AND
        refund_status are null. Returns updated row or None if refund
        already initiated/completed.
        """
        client = get_supabase_admin()
        result = (
            client.table("payment_sessions")
            .update({"refund_status": "initiating"})
            .eq("id", session_id)
            .is_("refund_id", "null")
            .is_("refund_status", "null")
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def reserve_webhook_event(event_id: str, event_type: str) -> bool:
        """
        Atomically reserve a webhook event ID by inserting into processed_webhook_events
        with status='processing'. Returns True if this caller won the insert (first arrival),
        False if the event was already reserved/processed (duplicate key violation).
        """
        if not event_id:
            return True
        client = get_supabase_admin()
        try:
            result = (
                client.table("processed_webhook_events")
                .insert({
                    "event_id": event_id,
                    "event_type": event_type,
                    "status": "processing",
                })
                .execute()
            )
            return bool(result.data)
        except Exception:
            # Duplicate key violation — another request already reserved this event
            return False

    @staticmethod
    def mark_webhook_event_processed(event_id: str) -> None:
        """Mark a reserved webhook event as fully processed."""
        if not event_id:
            return
        client = get_supabase_admin()
        try:
            client.table("processed_webhook_events").update(
                {"status": "processed"}
            ).eq("event_id", event_id).execute()
        except Exception as exc:
            import logging
            logging.getLogger(__name__).warning(
                "Failed to mark webhook event %s as processed: %s", event_id, exc
            )

    @staticmethod
    def delete_by_id(session_id: str) -> None:
        client = get_supabase_admin()
        client.table("payment_sessions").delete().eq("id", session_id).execute()