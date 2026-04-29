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









from fastapi import HTTPException, status

from app.core.database import get_supabase_admin, get_supabase_public
from app.schemas.auth import LoginRequest, RegisterRequest


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
    def login(payload: LoginRequest) -> dict:
        public_client = get_supabase_public()
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
            print("SUPABASE LOGIN ERROR:", repr(exc))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid email or password: {str(exc)}",
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
            print("SUPABASE PROFILE FETCH ERROR:", repr(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unable to fetch user profile: {str(exc)}",
            ) from exc

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found",
            )

        if not profile.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "token_type": "bearer",
            "user": profile,
            "email_confirmation_required": False,
        }
