# # from typing import Optional

# # from app.core.database import get_supabase_admin


# # class CollectionRepository:
# #     @staticmethod
# #     def create(payload: dict) -> dict:
# #         client = get_supabase_admin()
# #         result = client.table("collections").insert(payload).execute()
# #         return result.data[0]

# #     @staticmethod
# #     def list_active() -> list[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .select("*")
# #             .eq("is_active", True)
# #             .order("created_at", desc=True)
# #             .execute()
# #         )
# #         return result.data or []

# #     @staticmethod
# #     def get_by_slug(slug: str) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .select("*")
# #             .eq("slug", slug)
# #             .single()
# #             .execute()
# #         )
# #         return result.data

# #     @staticmethod
# #     def get_by_id(collection_id: str) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .select("*")
# #             .eq("id", collection_id)
# #             .single()
# #             .execute()
# #         )
# #         return result.data

# #     @staticmethod
# #     def update(collection_id: str, payload: dict) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .update(payload)
# #             .eq("id", collection_id)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
# #         client = get_supabase_admin()
# #         query = client.table("collections").select("id").eq("slug", slug)
# #         if exclude_id:
# #             query = query.neq("id", exclude_id)
# #         result = query.limit(1).execute()
# #         return bool(result.data)
# # @staticmethod
# # def get_active_by_id(collection_id: str) -> dict | None:
# #     client = get_supabase_admin()
# #     result = (
# #         client.table("collections")
# #         .select("*")
# #         .eq("id", collection_id)
# #         .eq("is_active", True)
# #         .limit(1)
# #         .execute()
# #     )
# #     return result.data[0] if result.data else None

# from typing import Optional
# from app.core.database import get_supabase_admin


# class CollectionRepository:
#     @staticmethod
#     def create(payload: dict) -> dict:
#         client = get_supabase_admin()
#         result = client.table("collections").insert(payload).execute()
#         return result.data[0]

#     @staticmethod
#     def get_by_id(collection_id: str) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .select("*")
#             .eq("id", collection_id)
#             .single()
#             .execute()
#         )
#         return result.data

#     @staticmethod
#     def get_active_by_id(collection_id: str) -> dict | None:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .select("*")
#             .eq("id", collection_id)
#             .eq("is_active", True)
#             .limit(1)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def update(collection_id: str, payload: dict) -> dict | None:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .update(payload)
#             .eq("id", collection_id)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def delete(collection_id: str) -> bool:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .delete()
#             .eq("id", collection_id)
#             .execute()
#         )
#         return bool(result.data)

#     @staticmethod
#     def list_active() -> list[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .select("*")
#             .eq("is_active", True)
#             .order("created_at", desc=True)
#             .execute()
#         )
#         return result.data or []

from typing import Optional
from app.core.database import get_supabase_admin


class CollectionRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("collections").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def list_active() -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("is_active", True)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_by_slug(slug: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("slug", slug)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_by_id(collection_id: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("id", collection_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_active_by_id(collection_id: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("id", collection_id)
            .eq("is_active", True)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def update(collection_id: str, payload: dict) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .update(payload)
            .eq("id", collection_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def delete(collection_id: str) -> bool:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .delete()
            .eq("id", collection_id)
            .execute()
        )
        return bool(result.data)

    @staticmethod
    def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
        client = get_supabase_admin()
        query = client.table("collections").select("id").eq("slug", slug)

        if exclude_id:
            query = query.neq("id", exclude_id)

        result = query.limit(1).execute()
        return bool(result.data)