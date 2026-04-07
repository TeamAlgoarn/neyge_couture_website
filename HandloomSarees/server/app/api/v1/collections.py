# from fastapi import APIRouter, Depends, status

# from app.core.dependencies import require_admin
# from app.schemas.collection import CollectionCreateRequest, CollectionUpdateRequest
# from app.services.collection_service import CollectionService
# from app.utils.response import success_response

# router = APIRouter(prefix="/collections", tags=["Collections"])


# @router.get("", response_model=dict)
# async def list_collections():
#     data = CollectionService.list_active()
#     return success_response("Collections fetched successfully", data)


# @router.get("/{slug}", response_model=dict)
# async def get_collection(slug: str):
#     data = CollectionService.get_by_slug(slug)
#     return success_response("Collection fetched successfully", data)


# @router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
# async def create_collection(
#     payload: CollectionCreateRequest,
#     _: dict = Depends(require_admin),
# ):
#     data = CollectionService.create(payload)
#     return success_response("Collection created successfully", data)


# @router.put("/{collection_id}", response_model=dict)
# async def update_collection(
#     collection_id: str,
#     payload: CollectionUpdateRequest,
#     _: dict = Depends(require_admin),
# ):
#     data = CollectionService.update(collection_id, payload)
#     return success_response("Collection updated successfully", data)


# @router.delete("/{collection_id}", response_model=dict)
# async def delete_collection(
#     collection_id: str,
#     _: dict = Depends(require_admin),
# ):
#     data = CollectionService.soft_delete(collection_id)
#     return success_response("Collection deleted successfully", data)

# @router.get("/{slug}")
# async def get_collection_by_slug(slug: str):
#     collection = await db.collections.find_one({"slug": slug, "is_active": True})

#     if not collection:
#         raise HTTPException(status_code=404, detail="Collection not found")

#     collection["_id"] = str(collection["_id"])
#     return collection


from fastapi import APIRouter, Depends, status

from app.core.dependencies import require_admin
from app.schemas.collection import CollectionCreateRequest, CollectionUpdateRequest
from app.services.collection_service import CollectionService
from app.utils.response import success_response

router = APIRouter(prefix="/collections", tags=["Collections"])


@router.get("", response_model=dict)
async def list_active_collections():
    data = CollectionService.list_active()
    return success_response("Collections fetched successfully", data)


@router.get("/{slug}", response_model=dict)
async def get_collection_by_slug(slug: str):
    data = CollectionService.get_by_slug(slug)
    return success_response("Collection fetched successfully", data)


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_collection(
    payload: CollectionCreateRequest,
    current_user: dict = Depends(require_admin),
):
    data = CollectionService.create(payload)
    return success_response("Collection created successfully", data)


@router.put("/{collection_id}", response_model=dict)
async def update_collection(
    collection_id: str,
    payload: CollectionUpdateRequest,
    current_user: dict = Depends(require_admin),
):
    data = CollectionService.update(collection_id, payload)
    return success_response("Collection updated successfully", data)


@router.delete("/{collection_id}", response_model=dict)
async def delete_collection(
    collection_id: str,
    current_user: dict = Depends(require_admin),
):
    data = CollectionService.soft_delete(collection_id)
    return success_response("Collection deleted successfully", data)