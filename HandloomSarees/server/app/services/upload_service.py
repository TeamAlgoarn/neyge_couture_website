from io import BytesIO
from pathlib import Path
import uuid

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

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
    MAX_PRODUCT_IMAGES = 10
    MAX_IMAGE_PIXELS = 40_000_000
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
    FORMAT_EXTENSIONS = {
        "JPEG": {".jpg", ".jpeg"},
        "PNG": {".png"},
        "WEBP": {".webp"},
    }
    FORMAT_MIME_TYPES = {
        "JPEG": {"image/jpeg", "image/jpg"},
        "PNG": {"image/png"},
        "WEBP": {"image/webp"},
    }

    PRODUCT_BUCKET = "product-images"
    COLLECTION_BUCKET = "collection-images"
    FESTIVE_BUCKET = "collection-images"  # keep same bucket for festive banners

    @staticmethod
    def _bucket(default_bucket: str) -> str:
        return settings.SUPABASE_STORAGE_BUCKET.strip() or default_bucket

    @staticmethod
    async def upload_temp_collection_image(file: UploadFile) -> dict:
        content = await UploadService._validate_image(file, min_width=800, min_height=600)

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
    async def _validate_image(
        file: UploadFile,
        *,
        min_width: int | None = None,
        min_height: int | None = None,
    ) -> bytes:
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file uploaded",
            )

        content_type = (file.content_type or "").lower()
        extension = Path(file.filename or "").suffix.lower()

        if content_type not in UploadService.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPG, PNG and WEBP images are allowed",
            )

        if extension not in UploadService.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image filename must use a JPG, JPEG, PNG or WEBP extension",
            )

        content = await file.read(UploadService.MAX_FILE_SIZE_BYTES + 1)

        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty",
            )

        if len(content) > UploadService.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image size must not exceed 5 MB",
            )

        try:
            with Image.open(BytesIO(content)) as image:
                image_format = (image.format or "").upper()
                width, height = image.size
                if image_format not in UploadService.FORMAT_EXTENSIONS:
                    raise ValueError("unsupported image format")
                if extension not in UploadService.FORMAT_EXTENSIONS[image_format]:
                    raise ValueError("extension does not match image content")
                if content_type not in UploadService.FORMAT_MIME_TYPES[image_format]:
                    raise ValueError("MIME type does not match image content")
                if width * height > UploadService.MAX_IMAGE_PIXELS:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Image dimensions are too large (maximum 40 megapixels)",
                    )
                if min_width and width < min_width:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Image width must be at least {min_width}px",
                    )
                if min_height and height < min_height:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Image height must be at least {min_height}px",
                    )
                image.verify()
        except HTTPException:
            raise
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content must be a valid JPG, PNG or WEBP image",
            ) from exc

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
        content = await UploadService._validate_image(file, min_width=800, min_height=800)

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

        existing_images = list(product.get("images") or [])
        if len(existing_images) >= UploadService.MAX_PRODUCT_IMAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A product can have at most 10 images",
            )

        content = await UploadService._validate_image(file, min_width=800, min_height=800)

        extension = Path(file.filename or "product-image").suffix or ".jpg"
        path = f"products/{product_id}/{uuid.uuid4().hex}{extension}"

        image_url = UploadService._upload_to_supabase(
            UploadService._bucket(UploadService.PRODUCT_BUCKET),
            path,
            content,
            file.content_type or "image/jpeg",
        )

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

        content = await UploadService._validate_image(file, min_width=800, min_height=600)

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
