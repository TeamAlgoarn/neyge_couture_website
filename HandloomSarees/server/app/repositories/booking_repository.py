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