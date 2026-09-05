from pathlib import Path
import uuid

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
from app.core.database import get_supabase_admin
from app.repositories.collection_repository import CollectionRepository
from app.repositories.product_repository import ProductRepository


class UploadService:
    ALLOWED_IMAGE_TYPES = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }
    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

    PRODUCT_BUCKET = "product-images"
    COLLECTION_BUCKET = "collection-images"
    FESTIVE_BUCKET = "collection-images"  # keep same bucket for festive banners

    @staticmethod
    def _bucket(default_bucket: str) -> str:
        return settings.SUPABASE_STORAGE_BUCKET.strip() or default_bucket

    @staticmethod
    async def upload_temp_collection_image(file: UploadFile) -> dict:
        content = await UploadService._validate_image(file)

        extension = Path(file.filename or "collection-image").suffix or ".jpg"
        path = f"collections/temp/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.COLLECTION_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

        return {
            "path": path,
            "url": image_url,
            "filename": file.filename,
        }

    @staticmethod
    async def upload_temp_festive_image(file: UploadFile) -> dict:
        content = await UploadService._validate_image(file)

        extension = Path(file.filename or "festive-image").suffix or ".jpg"
        path = f"festive/temp/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.FESTIVE_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

        return {
            "path": path,
            "url": image_url,
            "filename": file.filename,
        }

    @staticmethod
    async def _validate_image(file: UploadFile) -> bytes:
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file uploaded",
            )

        if file.content_type not in UploadService.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPG, PNG and WEBP images are allowed",
            )

        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty",
            )

        if len(content) > UploadService.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image size must be less than 5 MB",
            )

        return content

    @staticmethod
    def _upload_to_supabase(bucket: str, path: str, content: bytes, content_type: str) -> str:
        supabase = get_supabase_admin()

        result = supabase.storage.from_(bucket).upload(
            path,
            content,
            {"content-type": content_type},
        )

        if getattr(result, "error", None):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image to Supabase Storage",
            )

        public_url = supabase.storage.from_(bucket).get_public_url(path)
        return public_url

    @staticmethod
    async def upload_temp_product_image(file: UploadFile) -> dict:
        content = await UploadService._validate_image(file)

        extension = Path(file.filename or "product-image").suffix or ".jpg"
        path = f"products/temp/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.PRODUCT_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

        return {
            "path": path,
            "url": image_url,
            "filename": file.filename,
        }

    @staticmethod
    async def upload_product_image(product_id: str, file: UploadFile) -> dict:
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        content = await UploadService._validate_image(file)

        extension = Path(file.filename or "product-image").suffix or ".jpg"
        path = f"products/{product_id}/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.PRODUCT_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

        existing_images = product.get("images") or []
        if image_url not in existing_images:
            existing_images.append(image_url)

        update_payload = {
            "images": existing_images,
        }

        if not product.get("thumbnail"):
            update_payload["thumbnail"] = image_url

        updated = ProductRepository.update(product_id, update_payload)

        return {
            "product_id": product_id,
            "image_url": image_url,
            "thumbnail": updated.get("thumbnail") if updated else image_url,
            "images": updated.get("images") if updated else existing_images,
        }

    @staticmethod
    async def upload_collection_banner(collection_id: str, file: UploadFile) -> dict:
        collection = CollectionRepository.get_by_id(collection_id)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Collection not found",
            )

        content = await UploadService._validate_image(file)

        extension = Path(file.filename or "collection-banner").suffix or ".jpg"
        path = f"collections/{collection_id}/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.COLLECTION_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

        updated = CollectionRepository.update(
            collection_id,
            {"banner_image": image_url},
        )

        return {
            "collection_id": collection_id,
            "banner_image": updated.get("banner_image") if updated else image_url,
        }
