# # # from typing import Optional

# # # from app.core.database import get_supabase_admin


# # # class CollectionRepository:
# # #     @staticmethod
# # #     def create(payload: dict) -> dict:
# # #         client = get_supabase_admin()
# # #         result = client.table("collections").insert(payload).execute()
# # #         return result.data[0]

# # #     @staticmethod
# # #     def list_active() -> list[dict]:
# # #         client = get_supabase_admin()
# # #         result = (
# # #             client.table("collections")
# # #             .select("*")
# # #             .eq("is_active", True)
# # #             .order("created_at", desc=True)
# # #             .execute()
# # #         )
# # #         return result.data or []

# # #     @staticmethod
# # #     def get_by_slug(slug: str) -> Optional[dict]:
# # #         client = get_supabase_admin()
# # #         result = (
# # #             client.table("collections")
# # #             .select("*")
# # #             .eq("slug", slug)
# # #             .single()
# # #             .execute()
# # #         )
# # #         return result.data

# # #     @staticmethod
# # #     def get_by_id(collection_id: str) -> Optional[dict]:
# # #         client = get_supabase_admin()
# # #         result = (
# # #             client.table("collections")
# # #             .select("*")
# # #             .eq("id", collection_id)
# # #             .single()
# # #             .execute()
# # #         )
# # #         return result.data

# # #     @staticmethod
# # #     def update(collection_id: str, payload: dict) -> Optional[dict]:
# # #         client = get_supabase_admin()
# # #         result = (
# # #             client.table("collections")
# # #             .update(payload)
# # #             .eq("id", collection_id)
# # #             .execute()
# # #         )
# # #         return result.data[0] if result.data else None

# # #     @staticmethod
# # #     def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
# # #         client = get_supabase_admin()
# # #         query = client.table("collections").select("id").eq("slug", slug)
# # #         if exclude_id:
# # #             query = query.neq("id", exclude_id)
# # #         result = query.limit(1).execute()
# # #         return bool(result.data)
# # # @staticmethod
# # # def get_active_by_id(collection_id: str) -> dict | None:
# # #     client = get_supabase_admin()
# # #     result = (
# # #         client.table("collections")
# # #         .select("*")
# # #         .eq("id", collection_id)
# # #         .eq("is_active", True)
# # #         .limit(1)
# # #         .execute()
# # #     )
# # #     return result.data[0] if result.data else None

# # from typing import Optional
# # from app.core.database import get_supabase_admin


# # class CollectionRepository:
# #     @staticmethod
# #     def create(payload: dict) -> dict:
# #         client = get_supabase_admin()
# #         result = client.table("collections").insert(payload).execute()
# #         return result.data[0]

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
# #     def get_active_by_id(collection_id: str) -> dict | None:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .select("*")
# #             .eq("id", collection_id)
# #             .eq("is_active", True)
# #             .limit(1)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def update(collection_id: str, payload: dict) -> dict | None:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .update(payload)
# #             .eq("id", collection_id)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def delete(collection_id: str) -> bool:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("collections")
# #             .delete()
# #             .eq("id", collection_id)
# #             .execute()
# #         )
# #         return bool(result.data)

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

# from typing import Optional
# from app.core.database import get_supabase_admin


# class CollectionRepository:
#     @staticmethod
#     def create(payload: dict) -> dict:
#         client = get_supabase_admin()
#         result = client.table("collections").insert(payload).execute()
#         return result.data[0]

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

#     @staticmethod
#     def get_by_slug(slug: str) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .select("*")
#             .eq("slug", slug)
#             .limit(1)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def get_by_id(collection_id: str) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("collections")
#             .select("*")
#             .eq("id", collection_id)
#             .limit(1)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def get_active_by_id(collection_id: str) -> Optional[dict]:
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
#     def update(collection_id: str, payload: dict) -> Optional[dict]:
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
#     def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
#         client = get_supabase_admin()
#         query = client.table("collections").select("id").eq("slug", slug)

#         if exclude_id:
#             query = query.neq("id", exclude_id)

#         result = query.limit(1).execute()
#         return bool(result.data)
    
# async def get_collection_by_slug(slug: str):
#     return await db.collections.find_one({"slug": slug, "is_active": True})





from typing import Optional

from postgrest.exceptions import APIError

from app.core.database import get_supabase_admin


def _is_missing_sort_order_error(exc: APIError) -> bool:
    """Recognize the legacy Production schema that predates sort_order."""
    message = str(exc).lower()
    return "sort_order" in message and (
        "pgrst204" in message
        or "schema cache" in message
        or "column" in message
    )


class CollectionRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        try:
            result = client.table("collections").insert(payload).execute()
        except APIError as exc:
            if "sort_order" not in payload or not _is_missing_sort_order_error(exc):
                raise
            compatible_payload = {
                key: value for key, value in payload.items() if key != "sort_order"
            }
            result = client.table("collections").insert(compatible_payload).execute()
        return result.data[0]

    @staticmethod
    def get_by_id(collection_id: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("id", collection_id)
            .single()
            .execute()
        )
        return result.data

    @staticmethod
    def get_by_slug(slug: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("collections")
            .select("*")
            .eq("slug", slug)
            .eq("is_active", True)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_active_by_id(collection_id: str) -> dict | None:
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
    def update(collection_id: str, payload: dict) -> dict | None:
        client = get_supabase_admin()
        try:
            result = (
                client.table("collections")
                .update(payload)
                .eq("id", collection_id)
                .execute()
            )
        except APIError as exc:
            if "sort_order" not in payload or not _is_missing_sort_order_error(exc):
                raise
            compatible_payload = {
                key: value for key, value in payload.items() if key != "sort_order"
            }
            result = (
                client.table("collections")
                .update(compatible_payload)
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
    def list_homepage() -> list[dict]:
        client = get_supabase_admin()
        try:
            result = (
                client.table("collections")
                .select("*")
                .eq("is_active", True)
                .eq("featured", True)
                .order("sort_order")
                .order("created_at", desc=True)
                .execute()
            )
        except APIError as exc:
            if not _is_missing_sort_order_error(exc):
                raise
            result = (
                client.table("collections")
                .select("*")
                .eq("is_active", True)
                .eq("featured", True)
                .order("created_at", desc=True)
                .order("name")
                .order("id")
                .execute()
            )
        return result.data or []

    @staticmethod
    def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
        client = get_supabase_admin()
        query = client.table("collections").select("id").eq("slug", slug)
        if exclude_id:
            query = query.neq("id", exclude_id)
        result = query.limit(1).execute()
        return bool(result.data)
