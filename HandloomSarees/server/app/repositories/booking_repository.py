from app.core.database import get_supabase_admin


class BookingRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("video_bookings").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def list_all() -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("video_bookings")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def list_by_email(email: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("video_bookings")
            .select("*")
            .eq("email", email)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_by_id(booking_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("video_bookings")
            .select("*")
            .eq("id", booking_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            return None
        return result.data[0]

    @staticmethod
    def update_status(booking_id: str, status: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("video_bookings")
            .update({"status": status})
            .eq("id", booking_id)
            .execute()
        )
        if not result.data:
            return None
        return result.data[0]