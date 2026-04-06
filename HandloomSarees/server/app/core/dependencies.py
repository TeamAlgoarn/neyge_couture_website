from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_supabase_admin
from app.core.security import verify_supabase_token

bearer_scheme = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    token = credentials.credentials

    try:
        auth_user = verify_supabase_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    client = get_supabase_admin()
    profile_res = (
        client.table("profiles")
        .select("*")
        .eq("id", auth_user["id"])
        .single()
        .execute()
    )

    profile = profile_res.data
    if not profile or not profile.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile not found or inactive",
        )

    return {
        "auth": auth_user,
        "profile": profile,
        "access_token": token,
    }


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["profile"].get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user