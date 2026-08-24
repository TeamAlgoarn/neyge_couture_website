from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.core.database import get_supabase_admin


class FestiveCollectionRepository:
    def __init__(self):
        self.db = get_supabase_admin()
        self.table = "festive_collections"
        self.link_table = "festive_collection_products"
        self.product_table = "products"

    def create(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        response = self.db.table(self.table).insert(payload).execute()
        return response.data[0]

    def get_all(self) -> List[Dict[str, Any]]:
        response = (
            self.db.table(self.table)
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []

    def get_by_id(self, festive_id: str) -> Optional[Dict[str, Any]]:
        response = (
            self.db.table(self.table)
            .select("*")
            .eq("id", festive_id)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None

    def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        response = (
            self.db.table(self.table)
            .select("*")
            .eq("slug", slug)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None

    def update(self, festive_id: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()
        response = (
            self.db.table(self.table)
            .update(payload)
            .eq("id", festive_id)
            .execute()
        )
        return response.data[0] if response.data else None

    def delete(self, festive_id: str) -> bool:
        self.db.table(self.link_table).delete().eq("festive_collection_id", festive_id).execute()
        response = self.db.table(self.table).delete().eq("id", festive_id).execute()
        return bool(response.data)

    def replace_products(self, festive_id: str, product_ids: List[str]) -> None:
        self.db.table(self.link_table).delete().eq("festive_collection_id", festive_id).execute()

        if not product_ids:
            return

        rows = [
            {"festive_collection_id": festive_id, "product_id": product_id}
            for product_id in product_ids
        ]
        self.db.table(self.link_table).insert(rows).execute()

    def get_product_ids(self, festive_id: str) -> List[str]:
        response = (
            self.db.table(self.link_table)
            .select("product_id")
            .eq("festive_collection_id", festive_id)
            .execute()
        )
        return [row["product_id"] for row in (response.data or [])]

    def get_products(self, festive_id: str) -> List[Dict[str, Any]]:
        product_ids = self.get_product_ids(festive_id)
        if not product_ids:
            return []

        response = (
            self.db.table(self.product_table)
            .select("*")
            .in_("id", product_ids)
            .execute()
        )
        return response.data or []

    def get_active_popup(self) -> Optional[Dict[str, Any]]:
        response = (
            self.db.table(self.table)
            .select("*")
            .eq("is_active", True)
            .eq("popup_enabled", True)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None

    def get_active_public(self) -> List[Dict[str, Any]]:
        response = (
            self.db.table(self.table)
            .select("*")
            .eq("is_active", True)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []