from pydantic import BaseModel, Field
from typing import Literal


class ProductImageUploadResponse(BaseModel):
    product_id: str
    image_url: str
    optimized_url: str
    thumbnail_url: str
    images: list[str]


class CollectionBannerUploadResponse(BaseModel):
    collection_id: str
    banner_image: str
    optimized_url: str


class UploadTargetRequest(BaseModel):
    target_type: Literal["product", "collection"]
    target_id: str = Field(..., min_length=1)