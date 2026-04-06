from fastapi import APIRouter, Depends, File, UploadFile, status

from app.core.dependencies import require_admin
from app.services.upload_service import UploadService
from app.utils.response import success_response

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/products/{product_id}/image", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_product_image(product_id, file)
    return success_response("Product image uploaded successfully", data)


@router.post("/collections/{collection_id}/banner", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_collection_banner(
    collection_id: str,
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_collection_banner(collection_id, file)
    return success_response("Collection banner uploaded successfully", data)