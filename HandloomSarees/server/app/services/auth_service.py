# # from fastapi import HTTPException, status

# # from app.core.database import get_supabase_admin, get_supabase_public
# # from app.schemas.auth import LoginRequest, RegisterRequest


# # class AuthService:
# #     @staticmethod
# #     def register(payload: RegisterRequest) -> dict:
# #         public_client = get_supabase_public()
# #         admin_client = get_supabase_admin()

# #         response = public_client.auth.sign_up(
# #             {
# #                 "email": payload.email.lower().strip(),
# #                 "password": payload.password,
# #                 "options": {
# #                     "data": {
# #                         "full_name": payload.full_name.strip(),
# #                         "phone": payload.phone.strip() if payload.phone else None,
# #                     }
# #                 },
# #             }
# #         )

# #         user = response.user
# #         session = response.session

# #         if not user:
# #             raise HTTPException(
# #                 status_code=status.HTTP_400_BAD_REQUEST,
# #                 detail="Unable to register user",
# #             )

# #         profile_payload = {
# #             "id": str(user.id),
# #             "email": payload.email.lower().strip(),
# #             "full_name": payload.full_name.strip(),
# #             "phone": payload.phone.strip() if payload.phone else None,
# #             "role": "user",
# #             "is_active": True,
# #         }

# #         admin_client.table("profiles").upsert(profile_payload).execute()

# #         return {
# #             "access_token": session.access_token if session else None,
# #             "refresh_token": session.refresh_token if session else None,
# #             "token_type": "bearer",
# #             "user": profile_payload,
# #             "email_confirmation_required": session is None,
# #         }

# #     @staticmethod
# #     def login(payload: LoginRequest) -> dict:
# #         public_client = get_supabase_public()

# #         response = public_client.auth.sign_in_with_password(
# #             {
# #                 "email": payload.email.lower().strip(),
# #                 "password": payload.password,
# #             }
# #         )

# #         user = response.user
# #         session = response.session

# #         if not user or not session:
# #             raise HTTPException(
# #                 status_code=status.HTTP_401_UNAUTHORIZED,
# #                 detail="Invalid email or password",
# #             )

# #         admin_client = get_supabase_admin()
# #         profile_res = (
# #             admin_client.table("profiles")
# #             .select("*")
# #             .eq("id", str(user.id))
# #             .single()
# #             .execute()
# #         )
# #         profile = profile_res.data

# #         if not profile:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="User profile not found",
# #             )

# #         if not profile.get("is_active", True):
# #             raise HTTPException(
# #                 status_code=status.HTTP_403_FORBIDDEN,
# #                 detail="User account is inactive",
# #             )

# #         return {
# #             "access_token": session.access_token,
# #             "refresh_token": session.refresh_token,
# #             "token_type": "bearer",
# #             "user": profile,
# #             "email_confirmation_required": False,
# #         }








# from fastapi import HTTPException, status

# from app.core.database import get_supabase_admin, get_supabase_public
# from app.schemas.auth import LoginRequest, RegisterRequest


# class AuthService:
#     @staticmethod
#     def register(payload: RegisterRequest) -> dict:
#         public_client = get_supabase_public()
#         admin_client = get_supabase_admin()

#         email = payload.email.lower().strip()
#         phone = payload.phone.strip() if payload.phone else None
#         full_name = payload.full_name.strip()

#         # 1. Check duplicate in profiles table
#         existing_profile = (
#             admin_client.table("profiles")
#             .select("id,email")
#             .eq("email", email)
#             .limit(1)
#             .execute()
#         )

#         if existing_profile.data:
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Email already registered",
#             )

#         # 2. Check duplicate in Supabase Auth users
#         try:
#             auth_users = admin_client.auth.admin.list_users()
#             if auth_users and getattr(auth_users, "users", None):
#                 for auth_user in auth_users.users:
#                     if getattr(auth_user, "email", None) and auth_user.email.lower() == email:
#                         raise HTTPException(
#                             status_code=status.HTTP_409_CONFLICT,
#                             detail="Email already registered in auth",
#                         )
#         except HTTPException:
#             raise
#         except Exception as exc:
#             print("SUPABASE AUTH LIST_USERS ERROR:", repr(exc))
#             # Do not block signup only because list_users check failed

#         # 3. Try signup
#         try:
#             response = public_client.auth.sign_up(
#                 {
#                     "email": email,
#                     "password": payload.password,
#                     "options": {
#                         "data": {
#                             "full_name": full_name,
#                             "phone": phone,
#                         }
#                     },
#                 }
#             )
#         except Exception as exc:
#             print("SUPABASE SIGNUP ERROR:", repr(exc))
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=f"Unable to register user: {str(exc)}",
#             ) from exc

#         user = response.user
#         session = response.session

#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Unable to register user: signup returned no user",
#             )

#         profile_payload = {
#             "id": str(user.id),
#             "email": email,
#             "full_name": full_name,
#             "phone": phone,
#             "role": "user",
#             "is_active": True,
#             "addresses": [],
#             "wishlist": [],
#         }

#         # 4. Create profile row
#         try:
#             admin_client.table("profiles").upsert(profile_payload).execute()
#         except Exception as exc:
#             print("SUPABASE PROFILE UPSERT ERROR:", repr(exc))
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=f"User created in auth but profile creation failed: {str(exc)}",
#             ) from exc

#         return {
#             "access_token": session.access_token if session else None,
#             "refresh_token": session.refresh_token if session else None,
#             "token_type": "bearer",
#             "user": profile_payload,
#             "email_confirmation_required": session is None,
#         }

#     @staticmethod
#     def login(payload: LoginRequest) -> dict:
#         public_client = get_supabase_public()
#         admin_client = get_supabase_admin()

#         email = payload.email.lower().strip()

#         try:
#             response = public_client.auth.sign_in_with_password(
#                 {
#                     "email": email,
#                     "password": payload.password,
#                 }
#             )
#         except Exception as exc:
#             print("SUPABASE LOGIN ERROR:", repr(exc))
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail=f"Invalid email or password: {str(exc)}",
#             ) from exc

#         user = response.user
#         session = response.session

#         if not user or not session:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid email or password",
#             )

#         try:
#             profile_res = (
#                 admin_client.table("profiles")
#                 .select("*")
#                 .eq("id", str(user.id))
#                 .single()
#                 .execute()
#             )
#             profile = profile_res.data
#         except Exception as exc:
#             print("SUPABASE PROFILE FETCH ERROR:", repr(exc))
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=f"Unable to fetch user profile: {str(exc)}",
#             ) from exc

#         if not profile:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User profile not found",
#             )

#         if not profile.get("is_active", True):
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="User account is inactive",
#             )

#         return {
#             "access_token": session.access_token,
#             "refresh_token": session.refresh_token,
#             "token_type": "bearer",
#             "user": profile,
#             "email_confirmation_required": False,
#         }









import logging

import jwt
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.database import (
    create_supabase_public_client,
    get_supabase_admin,
    get_supabase_public,
)
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)


logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    def register(payload: RegisterRequest) -> dict:
        public_client = get_supabase_public()
        admin_client = get_supabase_admin()

        email = payload.email.lower().strip()
        phone = payload.phone.strip() if payload.phone else None
        name = payload.name.strip()

        # 1. Check duplicate in profiles table
        existing_profile = (
            admin_client.table("profiles")
            .select("id,email")
            .eq("email", email)
            .limit(1)
            .execute()
        )

        if existing_profile.data:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # 2. Check duplicate in Supabase Auth users
        try:
            auth_users = admin_client.auth.admin.list_users()
            if auth_users and getattr(auth_users, "users", None):
                for auth_user in auth_users.users:
                    auth_email = getattr(auth_user, "email", None)
                    if auth_email and auth_email.lower() == email:
                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail="Email already registered in auth",
                        )
        except HTTPException:
            raise
        except Exception as exc:
            print("SUPABASE AUTH LIST_USERS ERROR:", repr(exc))
            # Do not block signup only because list_users check failed

        # 3. Try signup
        try:
            response = public_client.auth.sign_up(
                {
                    "email": email,
                    "password": payload.password,
                    "options": {
                        "data": {
                            "name": name,
                            "phone": phone,
                        }
                    },
                }
            )
        except Exception as exc:
            print("SUPABASE SIGNUP ERROR:", repr(exc))
            error_message = str(exc).lower()

            if "rate limit" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Supabase signup blocked: {str(exc)}",
                ) from exc

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to register user: {str(exc)}",
            ) from exc

        user = response.user
        session = response.session

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to register user: signup returned no user",
            )

        profile_payload = {
            "id": str(user.id),
            "email": email,
            "name": name,
            "phone": phone,
            "role": "user",
            "is_active": True,
            "addresses": [],
            "wishlist": [],
        }

        # 4. Create profile row
        try:
            admin_client.table("profiles").upsert(profile_payload).execute()
        except Exception as exc:
            print("SUPABASE PROFILE UPSERT ERROR:", repr(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"User created in auth but profile creation failed: {str(exc)}",
            ) from exc

        return {
            "access_token": session.access_token if session else None,
            "refresh_token": session.refresh_token if session else None,
            "token_type": "bearer",
            "user": profile_payload,
            "email_confirmation_required": session is None,
        }

    @staticmethod
    def _authenticate(payload: LoginRequest) -> tuple[object, dict]:
        public_client = create_supabase_public_client()
        admin_client = get_supabase_admin()

        email = payload.email.lower().strip()

        try:
            response = public_client.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": payload.password,
                }
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            ) from exc

        user = response.user
        session = response.session

        if not user or not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        try:
            profile_res = (
                admin_client.table("profiles")
                .select("*")
                .eq("id", str(user.id))
                .single()
                .execute()
            )
            profile = profile_res.data
        except Exception as exc:
            logger.warning("Unable to fetch an authenticated user profile")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to fetch user profile",
            ) from exc

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found",
            )

        if profile.get("is_active") is not True:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        return public_client, {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "token_type": "bearer",
            "user": profile,
            "email_confirmation_required": False,
        }

    @staticmethod
    def login(payload: LoginRequest) -> dict:
        _, result = AuthService._authenticate(payload)
        return result

    @staticmethod
    def _sign_out(client: object) -> None:
        try:
            client.auth.sign_out({"scope": "global"})
        except Exception:
            logger.warning("Unable to revoke Supabase refresh sessions")

    @staticmethod
    def admin_login(payload: LoginRequest) -> dict:
        public_client, result = AuthService._authenticate(payload)
        user = result.get("user") or {}
        if user.get("role") != "admin" or user.get("is_active") is not True:
            AuthService._sign_out(public_client)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )
        result.pop("refresh_token", None)
        return result

    @staticmethod
    def request_password_reset(email: str) -> None:
        """Request an email without disclosing whether the account exists."""
        try:
            client = create_supabase_public_client()
            redirect_url = f"{settings.FRONTEND_URL.rstrip('/')}/admin/reset-password"
            client.auth.reset_password_for_email(
                email.lower().strip(),
                {"redirect_to": redirect_url},
            )
        except Exception:
            # Always keep the public response generic. Supabase also deliberately
            # does not disclose whether an email is registered.
            logger.warning("Supabase password recovery request was not completed")

    @staticmethod
    def reset_admin_password(payload: ResetPasswordRequest) -> None:
        client = create_supabase_public_client()

        try:
            session_response = client.auth.set_session(
                payload.access_token,
                payload.refresh_token,
            )
            user = getattr(session_response, "user", None)
            if not user:
                raise ValueError("Recovery session has no user")

            session = getattr(session_response, "session", None)
            verified_access_token = getattr(session, "access_token", None)
            claims = jwt.decode(
                verified_access_token,
                options={"verify_signature": False, "verify_exp": False},
            )
            authentication_methods = claims.get("amr") or []
            if not any(
                isinstance(method, dict) and method.get("method") == "recovery"
                for method in authentication_methods
            ):
                raise ValueError("Session was not issued by password recovery")

            profile_response = (
                get_supabase_admin()
                .table("profiles")
                .select("id,role,is_active")
                .eq("id", str(user.id))
                .single()
                .execute()
            )
            profile = profile_response.data
            if (
                not profile
                or profile.get("role") != "admin"
                or profile.get("is_active") is not True
            ):
                raise ValueError("Recovery session is not for an active administrator")

            updated = client.auth.update_user({"password": payload.new_password})
            if not getattr(updated, "user", None):
                raise ValueError("Password update returned no user")
        except Exception as exc:
            AuthService._sign_out(client)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password recovery link is invalid or has expired",
            ) from exc

        AuthService._sign_out(client)

    @staticmethod
    def change_admin_password(
        payload: ChangePasswordRequest,
        current_user: dict,
    ) -> None:
        auth_user = current_user.get("auth") or {}
        profile = current_user.get("profile") or {}
        email = auth_user.get("email") or profile.get("email")
        user_id = auth_user.get("id") or profile.get("id")

        if not email or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to resolve the authenticated administrator",
            )

        client = create_supabase_public_client()
        try:
            response = client.auth.sign_in_with_password(
                {
                    "email": str(email).lower().strip(),
                    "password": payload.current_password,
                }
            )
            reauthenticated_user = getattr(response, "user", None)
            if not reauthenticated_user or str(reauthenticated_user.id) != str(user_id):
                raise ValueError("Reauthenticated user mismatch")
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            ) from exc

        try:
            updated = client.auth.update_user({"password": payload.new_password})
            if not getattr(updated, "user", None):
                raise ValueError("Password update returned no user")
        except Exception as exc:
            AuthService._sign_out(client)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to change password",
            ) from exc

        AuthService._sign_out(client)
