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
    def decrement_stock_optimistic(
        product_id: str, quantity: int, expected_stock: int
    ) -> dict | None:
        """
        Optimistic concurrency: decrement stock ONLY if it still equals
        expected_stock. Returns the updated product or None if another
        request modified the stock first (caller should abort/retry).
        """
        new_stock = expected_stock - quantity
        if new_stock < 0:
            return None
        client = get_supabase_admin()
        result = (
            client.table("products")
            .update({"stock": new_stock})
            .eq("id", product_id)
            .eq("stock", expected_stock)
            .execute()
        )
        return result.data[0] if result.data else None

    # ─────────────────────────────────────────────────────────────────────────
    # HOW MULTI-VALUE COLOR / FABRIC FILTERING WORKS
    # ─────────────────────────────────────────────────────────────────────────
    # DB stores:  color="Red,Gold"  fabric="Silk,Cotton"  (comma-joined string)
    #
    # Query param arrives as: color="Red,Gold" (user picked Red AND Gold)
    # We split on "," → ["Red", "Gold"]
    # Then build an OR clause:  color.ilike.%Red%, color.ilike.%Gold%
    # Supabase .or_() accepts "col.ilike.%val%,col.ilike.%val2%"
    #
    # A product with color="Red,Gold,Silver" matches EITHER Red OR Gold → shown.
    # This is the standard e-commerce "show me anything in these colours" UX.
    # ─────────────────────────────────────────────────────────────────────────

    @staticmethod
    def _build_multi_ilike_clause(column: str, raw: str) -> str | None:
        """
        Given column='color' and raw='Red,Gold', returns the Supabase OR string:
          'color.ilike.%Red%,color.ilike.%Gold%'
        Returns None when raw is empty/blank so callers can skip the filter.
        """
        values = [v.strip() for v in raw.split(",") if v.strip()]
        if not values:
            return None
        return ",".join(f"{column}.ilike.%{v}%" for v in values)

    @staticmethod
    def list_filtered(
        *,
        page: int,
        page_size: int,
        collection_id: str | None,
        occasion: str | None,
        fabric: str | None,        # may be "Silk" or "Silk,Cotton"
        color: str | None,         # may be "Red"  or "Red,Gold"
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

        # ── collection ────────────────────────────────────────────────────────
        if collection_id:
            count_query = count_query.eq("collection_id", collection_id)
            data_query = data_query.eq("collection_id", collection_id)

        # ── occasion (stored as JSON array in DB) ─────────────────────────────
        if occasion:
            occasion_filter = json.dumps([occasion])
            count_query = count_query.contains("occasion", occasion_filter)
            data_query = data_query.contains("occasion", occasion_filter)

        # ── fabric: multi-value OR filter ─────────────────────────────────────
        # Example: fabric="Silk,Cotton"
        # → OR clause: fabric.ilike.%Silk%, fabric.ilike.%Cotton%
        # A product with fabric="Silk" matches Silk → returned ✓
        # A product with fabric="Cotton,Linen" matches Cotton → returned ✓
        if fabric:
            fabric_clause = ProductRepository._build_multi_ilike_clause("fabric", fabric)
            if fabric_clause:
                count_query = count_query.or_(fabric_clause)
                data_query = data_query.or_(fabric_clause)

        # ── color: multi-value OR filter ──────────────────────────────────────
        # Example: color="Red,Gold"
        # → OR clause: color.ilike.%Red%, color.ilike.%Gold%
        if color:
            color_clause = ProductRepository._build_multi_ilike_clause("color", color)
            if color_clause:
                count_query = count_query.or_(color_clause)
                data_query = data_query.or_(color_clause)

        # ── featured ──────────────────────────────────────────────────────────
        if featured is not None:
            count_query = count_query.eq("is_featured", featured)
            data_query = data_query.eq("is_featured", featured)

        # ── price range ───────────────────────────────────────────────────────
        if min_price is not None:
            count_query = count_query.gte("price", min_price)
            data_query = data_query.gte("price", min_price)

        if max_price is not None:
            count_query = count_query.lte("price", max_price)
            data_query = data_query.lte("price", max_price)

        # ── text search (unchanged) ───────────────────────────────────────────
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

        # ── pagination & sorting ──────────────────────────────────────────────
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