import os
from pathlib import Path

import cloudinary
import cloudinary.uploader
import cloudinary.utils
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
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

    @staticmethod
    def configure_cloudinary() -> None:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )

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
    def _build_optimized_url(public_id: str) -> str:
        optimized_url, _ = cloudinary.utils.cloudinary_url(
            public_id,
            secure=True,
            fetch_format="auto",
            quality="auto",
        )
        return optimized_url

    @staticmethod
    def _build_thumbnail_url(public_id: str) -> str:
        thumb_url, _ = cloudinary.utils.cloudinary_url(
            public_id,
            secure=True,
            width=500,
            crop="scale",
            fetch_format="auto",
            quality="auto",
        )
        return thumb_url

    @staticmethod
    async def upload_product_image(product_id: str, file: UploadFile) -> dict:
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )

        UploadService.configure_cloudinary()
        content = await UploadService._validate_image(file)

        filename = Path(file.filename or "product-image").stem
        public_id = f"neyge-couture/products/{product_id}/{filename}"

        try:
            uploaded = cloudinary.uploader.upload(
                content,
                public_id=public_id,
                overwrite=True,
                resource_type="image",
                folder=None,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to upload image to Cloudinary",
            ) from exc

        image_url = uploaded.get("secure_url")
        public_id = uploaded.get("public_id")

        optimized_url = UploadService._build_optimized_url(public_id)
        thumbnail_url = UploadService._build_thumbnail_url(public_id)

        existing_images = product.get("images") or []
        if image_url not in existing_images:
            existing_images.append(image_url)

        update_payload = {
            "images": existing_images,
        }

        if not product.get("thumbnail"):
            update_payload["thumbnail"] = thumbnail_url

        updated = ProductRepository.update(product_id, update_payload)

        return {
            "product_id": product_id,
            "image_url": image_url,
            "optimized_url": optimized_url,
            "thumbnail_url": thumbnail_url,
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

        UploadService.configure_cloudinary()
        content = await UploadService._validate_image(file)

        filename = Path(file.filename or "collection-banner").stem
        public_id = f"neyge-couture/collections/{collection_id}/{filename}"

        try:
            uploaded = cloudinary.uploader.upload(
                content,
                public_id=public_id,
                overwrite=True,
                resource_type="image",
                folder=None,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to upload banner to Cloudinary",
            ) from exc

        image_url = uploaded.get("secure_url")
        public_id = uploaded.get("public_id")
        optimized_url = UploadService._build_optimized_url(public_id)

        updated = CollectionRepository.update(
            collection_id,
            {"banner_image": image_url},
        )

        return {
            "collection_id": collection_id,
            "banner_image": updated.get("banner_image") if updated else image_url,
            "optimized_url": optimized_url,
        }