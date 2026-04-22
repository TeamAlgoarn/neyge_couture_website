from fastapi import APIRouter, Depends, File, UploadFile, status

from app.core.dependencies import require_admin
from app.services.upload_service import UploadService
from app.utils.response import success_response

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/product-image", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_product_image_temp(
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_temp_product_image(file)
    return success_response("Product image uploaded successfully", data)


@router.post("/products/{product_id}/image", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_product_image(product_id, file)
    return success_response("Product image uploaded successfully", data)


@router.post("/collection-image", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_collection_image_temp(
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_temp_collection_image(file)
    return success_response("Collection image uploaded successfully", data)


@router.post("/festive-image", response_model=dict, status_code=status.HTTP_201_CREATED)
async def upload_festive_image_temp(
    file: UploadFile = File(...),
    _: dict = Depends(require_admin),
):
    data = await UploadService.upload_temp_festive_image(file)
    return success_response("Festive image uploaded successfully", data)