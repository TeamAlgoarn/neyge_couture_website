from fastapi import APIRouter, Depends
from app.core.dependencies import require_admin
from app.schemas.festive_collection import (
    FestiveCollectionCreate,
    FestiveCollectionUpdate,
)
from app.services.festive_collection_service import FestiveCollectionService

router = APIRouter()
service = FestiveCollectionService()


@router.post("/admin/festive-collections")
def create_festive_collection(
    payload: FestiveCollectionCreate,
    _: dict = Depends(require_admin),
):
    data = service.create_festive_collection(payload.model_dump(mode="json"))
    return {"success": True, "data": data}


@router.get("/admin/festive-collections")
def list_festive_collections(_: dict = Depends(require_admin)):
    data = service.list_festive_collections()
    return {"success": True, "data": data}


@router.get("/admin/festive-collections/{festive_id}")
def get_festive_collection(
    festive_id: str,
    _: dict = Depends(require_admin),
):
    data = service.get_festive_collection(festive_id)
    return {"success": True, "data": data}


@router.put("/admin/festive-collections/{festive_id}")
def update_festive_collection(
    festive_id: str,
    payload: FestiveCollectionUpdate,
    _: dict = Depends(require_admin),
):
    data = service.update_festive_collection(
        festive_id,
        payload.model_dump(mode="json", exclude_unset=True),
    )
    return {"success": True, "data": data}


@router.delete("/admin/festive-collections/{festive_id}")
def delete_festive_collection(
    festive_id: str,
    _: dict = Depends(require_admin),
):
    service.delete_festive_collection(festive_id)
    return {"success": True, "message": "Festive collection deleted"}


@router.get("/festive-collections")
def get_public_festive_collections():
    data = service.get_public_active()
    return {"success": True, "data": data}


@router.get("/festive-collections/popup/active")
def get_active_popup():
    data = service.get_active_popup()
    return {"success": True, "data": data}


@router.get("/festive-collections/{slug}")
def get_public_festive_collection(slug: str):
    data = service.get_public_by_slug(slug)
    return {"success": True, "data": data}