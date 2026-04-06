from supabase import Client

from app.core.database import get_supabase_admin


def verify_supabase_token(access_token: str) -> dict:
    client: Client = get_supabase_admin()
    response = client.auth.get_user(access_token)

    if not response or not response.user:
        raise ValueError("Invalid or expired token")

    user = response.user

    return {
        "id": str(user.id),
        "email": user.email,
        "user_metadata": user.user_metadata or {},
    }