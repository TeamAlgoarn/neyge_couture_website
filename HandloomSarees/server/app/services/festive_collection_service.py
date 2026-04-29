from typing import Dict, List
from fastapi import HTTPException, status
from app.repositories.festive_collection_repository import FestiveCollectionRepository


class FestiveCollectionService:
    def __init__(self):
        self.repo = FestiveCollectionRepository()

    def _serialize_datetimes(self, data: Dict) -> Dict:
        serialized = data.copy()

        for key in ["start_date", "end_date"]:
            value = serialized.get(key)
            if value is not None and hasattr(value, "isoformat"):
                serialized[key] = value.isoformat()

        return serialized

    def create_festive_collection(self, data: Dict) -> Dict:
        existing = self.repo.get_by_slug(data["slug"])
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Festive collection slug already exists",
            )

        product_ids = data.pop("product_ids", [])
        data = self._serialize_datetimes(data)

        created = self.repo.create(data)
        self.repo.replace_products(created["id"], product_ids)
        created["products"] = self.repo.get_products(created["id"])
        return created

    def list_festive_collections(self) -> List[Dict]:
        rows = self.repo.get_all()
        enriched = []
        for row in rows:
            row["products"] = self.repo.get_products(row["id"])
            enriched.append(row)
        return enriched

    def get_festive_collection(self, festive_id: str) -> Dict:
        row = self.repo.get_by_id(festive_id)
        if not row:
            raise HTTPException(
                status_code=404,
                detail="Festive collection not found",
            )
        row["products"] = self.repo.get_products(festive_id)
        return row

    def update_festive_collection(self, festive_id: str, data: Dict) -> Dict:
        existing = self.repo.get_by_id(festive_id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Festive collection not found",
            )

        if "slug" in data and data["slug"] != existing["slug"]:
            slug_row = self.repo.get_by_slug(data["slug"])
            if slug_row:
                raise HTTPException(
                    status_code=400,
                    detail="Slug already exists",
                )

        product_ids = data.pop("product_ids", None)
        data = self._serialize_datetimes(data)

        updated = self.repo.update(festive_id, data)

        if product_ids is not None:
            self.repo.replace_products(festive_id, product_ids)

        updated["products"] = self.repo.get_products(festive_id)
        return updated

    def delete_festive_collection(self, festive_id: str) -> bool:
        existing = self.repo.get_by_id(festive_id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Festive collection not found",
            )
        return self.repo.delete(festive_id)

    def get_public_active(self) -> List[Dict]:
        rows = self.repo.get_active_public()
        enriched = []
        for row in rows:
            row["products"] = self.repo.get_products(row["id"])
            enriched.append(row)
        return enriched

    def get_public_by_slug(self, slug: str) -> Dict:
        row = self.repo.get_by_slug(slug)
        if not row or not row.get("is_active"):
            raise HTTPException(
                status_code=404,
                detail="Festive collection not found",
            )
        row["products"] = self.repo.get_products(row["id"])
        return row

    def get_active_popup(self):
        popup = self.repo.get_active_popup()
        if not popup:
            return None
        popup["products"] = self.repo.get_products(popup["id"])
        return popup