# # import json
# # from typing import Optional

# # from app.core.database import get_supabase_admin


# # class ProductRepository:
# #     @staticmethod
# #     def create(payload: dict) -> dict:
# #         client = get_supabase_admin()
# #         result = client.table("products").insert(payload).execute()
# #         return result.data[0]

# #     @staticmethod
# #     def get_by_id(product_id: str) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .select("*")
# #             .eq("id", product_id)
# #             .single()
# #             .execute()
# #         )
# #         return result.data

# #     @staticmethod
# #     def get_active_by_id(product_id: str) -> dict | None:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .select("*")
# #             .eq("id", product_id)
# #             .eq("is_active", True)
# #             .limit(1)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def get_by_slug(slug: str) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .select("*")
# #             .eq("slug", slug)
# #             .single()
# #             .execute()
# #         )
# #         return result.data

# #     @staticmethod
# #     def update(product_id: str, payload: dict) -> Optional[dict]:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .update(payload)
# #             .eq("id", product_id)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def update_by_id(product_id: str, payload: dict) -> dict | None:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .update(payload)
# #             .eq("id", product_id)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def update_stock(product_id: str, new_stock: int) -> dict | None:
# #         client = get_supabase_admin()
# #         result = (
# #             client.table("products")
# #             .update({"stock": new_stock})
# #             .eq("id", product_id)
# #             .execute()
# #         )
# #         return result.data[0] if result.data else None

# #     @staticmethod
# #     def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
# #         client = get_supabase_admin()
# #         query = client.table("products").select("id").eq("slug", slug)
# #         if exclude_id:
# #             query = query.neq("id", exclude_id)
# #         result = query.limit(1).execute()
# #         return bool(result.data)

# #     @staticmethod
# #     def list_filtered(
# #         *,
# #         page: int,
# #         page_size: int,
# #         collection_id: str | None,
# #         occasion: str | None,
# #         fabric: str | None,
# #         color: str | None,
# #         featured: bool | None,
# #         min_price: float | None,
# #         max_price: float | None,
# #         search: str | None,
# #     ) -> tuple[list[dict], int]:
# #         client = get_supabase_admin()

# #         count_query = (
# #             client.table("products")
# #             .select("*", count="exact")
# #             .eq("is_active", True)
# #         )
# #         data_query = (
# #             client.table("products")
# #             .select("*", count="exact")
# #             .eq("is_active", True)
# #         )

# #         if collection_id:
# #             count_query = count_query.eq("collection_id", collection_id)
# #             data_query = data_query.eq("collection_id", collection_id)

# #         if occasion:
# #             occasion_filter = json.dumps([occasion])
# #             count_query = count_query.contains("occasion", occasion_filter)
# #             data_query = data_query.contains("occasion", occasion_filter)

# #         if fabric:
# #             count_query = count_query.ilike("fabric", f"%{fabric}%")
# #             data_query = data_query.ilike("fabric", f"%{fabric}%")

# #         if color:
# #             count_query = count_query.ilike("color", f"%{color}%")
# #             data_query = data_query.ilike("color", f"%{color}%")

# #         if featured is not None:
# #             count_query = count_query.eq("is_featured", featured)
# #             data_query = data_query.eq("is_featured", featured)

# #         if min_price is not None:
# #             count_query = count_query.gte("price", min_price)
# #             data_query = data_query.gte("price", min_price)

# #         if max_price is not None:
# #             count_query = count_query.lte("price", max_price)
# #             data_query = data_query.lte("price", max_price)

# #         if search:
# #             search_clause = (
# #                 f"name.ilike.%{search}%,"
# #                 f"short_description.ilike.%{search}%,"
# #                 f"story.ilike.%{search}%,"
# #                 f"fabric.ilike.%{search}%,"
# #                 f"technique.ilike.%{search}%,"
# #                 f"origin.ilike.%{search}%,"
# #                 f"color.ilike.%{search}%"
# #             )
# #             count_query = count_query.or_(search_clause)
# #             data_query = data_query.or_(search_clause)

# #         start = (page - 1) * page_size
# #         end = start + page_size - 1

# #         result = data_query.order("created_at", desc=True).range(start, end).execute()
# #         count_result = count_query.limit(1).execute()

# #         return result.data or [], count_result.count or 0


# import json
# from typing import Optional

# from app.core.database import get_supabase_admin


# class ProductRepository:
#     @staticmethod
#     def create(payload: dict) -> dict:
#         client = get_supabase_admin()
#         result = client.table("products").insert(payload).execute()
#         return result.data[0]

#     @staticmethod
#     def get_by_id(product_id: str) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .select("*")
#             .eq("id", product_id)
#             .single()
#             .execute()
#         )
#         return result.data

#     @staticmethod
#     def get_active_by_id(product_id: str) -> dict | None:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .select("*")
#             .eq("id", product_id)
#             .eq("is_active", True)
#             .limit(1)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def get_by_slug(slug: str) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .select("*")
#             .eq("slug", slug)
#             .single()
#             .execute()
#         )
#         return result.data

#     @staticmethod
#     def update(product_id: str, payload: dict) -> Optional[dict]:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .update(payload)
#             .eq("id", product_id)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def update_by_id(product_id: str, payload: dict) -> dict | None:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .update(payload)
#             .eq("id", product_id)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def update_stock(product_id: str, new_stock: int) -> dict | None:
#         client = get_supabase_admin()
#         result = (
#             client.table("products")
#             .update({"stock": new_stock})
#             .eq("id", product_id)
#             .execute()
#         )
#         return result.data[0] if result.data else None

#     @staticmethod
#     def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
#         client = get_supabase_admin()
#         query = client.table("products").select("id").eq("slug", slug)
#         if exclude_id:
#             query = query.neq("id", exclude_id)
#         result = query.limit(1).execute()
#         return bool(result.data)

#     @staticmethod
#     def list_filtered(
#         *,
#         page: int,
#         page_size: int,
#         collection_id: str | None,
#         occasion: str | None,
#         fabric: str | None,
#         color: str | None,
#         featured: bool | None,
#         min_price: float | None,
#         max_price: float | None,
#         search: str | None,
#         sort_by: str,
#         sort_order: str,
#     ) -> tuple[list[dict], int]:
#         client = get_supabase_admin()

#         count_query = (
#             client.table("products")
#             .select("*", count="exact")
#             .eq("is_active", True)
#         )
#         data_query = (
#             client.table("products")
#             .select("*", count="exact")
#             .eq("is_active", True)
#         )

#         if collection_id:
#             count_query = count_query.eq("collection_id", collection_id)
#             data_query = data_query.eq("collection_id", collection_id)

#         if occasion:
#             occasion_filter = json.dumps([occasion])
#             count_query = count_query.contains("occasion", occasion_filter)
#             data_query = data_query.contains("occasion", occasion_filter)

#         if fabric:
#             count_query = count_query.ilike("fabric", f"%{fabric}%")
#             data_query = data_query.ilike("fabric", f"%{fabric}%")

#         if color:
#             count_query = count_query.ilike("color", f"%{color}%")
#             data_query = data_query.ilike("color", f"%{color}%")

#         if featured is not None:
#             count_query = count_query.eq("is_featured", featured)
#             data_query = data_query.eq("is_featured", featured)

#         if min_price is not None:
#             count_query = count_query.gte("price", min_price)
#             data_query = data_query.gte("price", min_price)

#         if max_price is not None:
#             count_query = count_query.lte("price", max_price)
#             data_query = data_query.lte("price", max_price)

#         if search:
#             search = search.strip()
#             search_clause = (
#                 f"name.ilike.%{search}%,"
#                 f"short_description.ilike.%{search}%,"
#                 f"story.ilike.%{search}%,"
#                 f"fabric.ilike.%{search}%,"
#                 f"technique.ilike.%{search}%,"
#                 f"origin.ilike.%{search}%,"
#                 f"color.ilike.%{search}%"
#             )
#             count_query = count_query.or_(search_clause)
#             data_query = data_query.or_(search_clause)

#         start = (page - 1) * page_size
#         end = start + page_size - 1

#         desc = sort_order == "desc"

#         result = (
#             data_query.order(sort_by, desc=desc)
#             .range(start, end)
#             .execute()
#         )
#         count_result = count_query.limit(1).execute()

#         return result.data or [], count_result.count or 0



import json
from typing import Optional

from app.core.database import get_supabase_admin


class ProductRepository:
    @staticmethod
    def create(payload: dict) -> dict:
        client = get_supabase_admin()
        result = client.table("products").insert(payload).execute()
        return result.data[0]

    @staticmethod
    def get_by_id(product_id: str) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .select("*")
            .eq("id", product_id)
            .single()
            .execute()
        )
        return result.data

    @staticmethod
    def get_active_by_id(product_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .select("*")
            .eq("id", product_id)
            .eq("is_active", True)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def get_by_slug(slug: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .select("*")
            .eq("slug", slug)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def update(product_id: str, payload: dict) -> Optional[dict]:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .update(payload)
            .eq("id", product_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def update_by_id(product_id: str, payload: dict) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .update(payload)
            .eq("id", product_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def update_stock(product_id: str, new_stock: int) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("products")
            .update({"stock": new_stock})
            .eq("id", product_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def exists_by_slug(slug: str, exclude_id: str | None = None) -> bool:
        client = get_supabase_admin()
        query = client.table("products").select("id").eq("slug", slug)
        if exclude_id:
            query = query.neq("id", exclude_id)
        result = query.limit(1).execute()
        return bool(result.data)

    @staticmethod
    def list_filtered(
        *,
        page: int,
        page_size: int,
        collection_id: str | None,
        occasion: str | None,
        fabric: str | None,
        color: str | None,
        featured: bool | None,
        min_price: float | None,
        max_price: float | None,
        search: str | None,
        sort_by: str,
        sort_order: str,
    ) -> tuple[list[dict], int]:
        client = get_supabase_admin()

        count_query = (
            client.table("products")
            .select("*", count="exact")
            .eq("is_active", True)
        )
        data_query = (
            client.table("products")
            .select("*", count="exact")
            .eq("is_active", True)
        )

        if collection_id:
            count_query = count_query.eq("collection_id", collection_id)
            data_query = data_query.eq("collection_id", collection_id)

        if occasion:
            occasion_filter = json.dumps([occasion])
            count_query = count_query.contains("occasion", occasion_filter)
            data_query = data_query.contains("occasion", occasion_filter)

        if fabric:
            count_query = count_query.ilike("fabric", f"%{fabric}%")
            data_query = data_query.ilike("fabric", f"%{fabric}%")

        if color:
            count_query = count_query.ilike("color", f"%{color}%")
            data_query = data_query.ilike("color", f"%{color}%")

        if featured is not None:
            count_query = count_query.eq("is_featured", featured)
            data_query = data_query.eq("is_featured", featured)

        if min_price is not None:
            count_query = count_query.gte("price", min_price)
            data_query = data_query.gte("price", min_price)

        if max_price is not None:
            count_query = count_query.lte("price", max_price)
            data_query = data_query.lte("price", max_price)

        if search:
            search = search.strip()
            search_clause = (
                f"name.ilike.%{search}%,"
                f"short_description.ilike.%{search}%,"
                f"story.ilike.%{search}%,"
                f"fabric.ilike.%{search}%,"
                f"technique.ilike.%{search}%,"
                f"origin.ilike.%{search}%,"
                f"color.ilike.%{search}%"
            )
            count_query = count_query.or_(search_clause)
            data_query = data_query.or_(search_clause)

        start = (page - 1) * page_size
        end = start + page_size - 1

        desc = sort_order == "desc"

        result = (
            data_query.order(sort_by, desc=desc)
            .range(start, end)
            .execute()
        )
        count_result = count_query.limit(1).execute()

        return result.data or [], count_result.count or 0