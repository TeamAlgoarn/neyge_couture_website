# from supabase import Client

# from app.core.database import get_supabase_admin


# def verify_supabase_token(access_token: str) -> dict:
#     client: Client = get_supabase_admin()
#     response = client.auth.get_user(access_token)

#     if not response or not response.user:
#         raise ValueError("Invalid or expired token")

#     user = response.user

#     return {
#         "id": str(user.id),
#         "email": user.email,
#         "user_metadata": user.user_metadata or {},
#     }

from fastapi import HTTPException, status
from supabase import Client
from supabase_auth.errors import AuthApiError

from app.core.database import get_supabase_admin


def verify_supabase_token(access_token: str) -> dict:
    client: Client = get_supabase_admin()

    try:
        response = client.auth.get_user(access_token)
    except AuthApiError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not response or not response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = response.user

    return {
        "id": str(user.id),
        "email": user.email,
        "user_metadata": user.user_metadata or {},
    }