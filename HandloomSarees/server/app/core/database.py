# from supabase import Client, create_client

# from app.core.config import settings

# _supabase_admin: Client | None = None
# _supabase_public: Client | None = None


# def get_supabase_admin() -> Client:
#     global _supabase_admin
#     if _supabase_admin is None:
#         _supabase_admin = create_client(
#             settings.SUPABASE_URL,
#             settings.SUPABASE_SERVICE_ROLE_KEY,
#         )
#     return _supabase_admin


# def get_supabase_public() -> Client:
#     global _supabase_public
#     if _supabase_public is None:
#         _supabase_public = create_client(
#             settings.SUPABASE_URL,
#             settings.SUPABASE_ANON_KEY,
#         )
#     return _supabase_public

# def get_supabase_admin():
#     if not settings.SUPABASE_URL:
#         return None


from supabase import Client, create_client

from app.core.config import settings

_supabase_admin: Client | None = None
_supabase_public: Client | None = None


def get_supabase_admin() -> Client:
    global _supabase_admin
    if _supabase_admin is None:
        _supabase_admin = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
        )
    return _supabase_admin


def get_supabase_public() -> Client:
    global _supabase_public
    if _supabase_public is None:
        _supabase_public = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
    return _supabase_public