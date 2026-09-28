import asyncio
import os
from io import BytesIO
from pathlib import Path

import pytest
from fastapi import HTTPException, UploadFile
from PIL import Image
from pydantic import ValidationError
from starlette.datastructures import Headers

os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault("DEBUG", "release")
os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "service-role-placeholder")
os.environ.setdefault("SUPABASE_ANON_KEY", "anon-placeholder")
os.environ.setdefault("JWT_SECRET", "jwt-placeholder-for-tests")
os.environ.setdefault("CLOUDINARY_CLOUD_NAME", "cloud")
os.environ.setdefault("CLOUDINARY_API_KEY", "cloud-key")
os.environ.setdefault("CLOUDINARY_API_SECRET", "cloud-secret")

from app.repositories.collection_repository import CollectionRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.collection import CollectionCreateRequest
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest
from app.services.collection_service import CollectionService
from app.services.product_service import ProductService
from app.services.upload_service import UploadService


MIGRATIONS_DIR = Path(__file__).resolve().parents[1] / "migrations"


def product_payload(**overrides):
    payload = {
        "name": "Kanchipuram Silk Saree",
        "price": 12500,
        "images": [],
        "fabric": ["Silk"],
        "color": ["Maroon"],
        "design": "Temple border",
        "zari": "Pure Zari",
        "certification": "Silk Mark",
        "brand": "Neyge Couture",
    }
    payload.update(overrides)
    return payload


@pytest.mark.parametrize("count", [0, 1, 10])
def test_product_schema_accepts_zero_through_ten_images(count):
    model = ProductCreateRequest(**product_payload(images=[f"https://img/{i}.jpg" for i in range(count)]))
    assert len(model.images) == count


def test_product_schema_rejects_eleven_images():
    with pytest.raises(ValidationError):
        ProductCreateRequest(**product_payload(images=[f"https://img/{i}.jpg" for i in range(11)]))


def test_product_schema_requires_positive_price():
    with pytest.raises(ValidationError):
        ProductCreateRequest(**product_payload(price=0))


@pytest.mark.parametrize("price", [None, 0, -1])
def test_product_schema_rejects_missing_or_non_positive_price(price):
    payload = {"price": price} if price is not None else {}
    with pytest.raises(ValidationError):
        ProductCreateRequest(**payload)


def test_product_schema_accepts_price_as_the_only_admin_supplied_value():
    model = ProductCreateRequest(price=4999, stock="", sku=" ", brand=" ")

    assert model.name is None
    assert model.slug is None
    assert model.sku is None
    assert model.brand is None
    assert model.stock == 0
    assert model.images == []
    assert model.collection_id is None


def test_optional_product_text_is_trimmed_or_normalised_to_none():
    model = ProductCreateRequest(
        price=4999,
        name="  Kanjivaram Silk Saree  ",
        fabric=" ",
        color=" ",
        design=" ",
        zari=" ",
        certification=" ",
        short_description=" ",
    )

    assert model.name == "Kanjivaram Silk Saree"
    assert model.fabric is None
    assert model.color is None
    assert model.design is None
    assert model.zari is None
    assert model.certification is None
    assert model.short_description is None


def test_duplicate_visible_values_receive_distinct_system_identifiers(monkeypatch):
    created = []

    def fake_create(payload, sku):
        product = {
            "id": f"product-{len(created) + 1}",
            **payload,
            "sku": sku or f"NEY-GENERATED-{len(created) + 1}",
        }
        created.append(product)
        return product

    monkeypatch.setattr(ProductRepository, "create_with_sku", fake_create)
    duplicate = ProductCreateRequest(
        name="Kanjivaram Silk Saree",
        price=4999,
        fabric="Silk",
        color="Red",
        design="Temple",
        brand="Neyge Couture",
    )

    first = ProductService.create(duplicate)
    second = ProductService.create(duplicate)

    assert first["name"] == second["name"]
    assert first["price"] == second["price"] == 4999
    assert first["fabric"] == second["fabric"] == "Silk"
    assert first["color"] == second["color"] == "Red"
    assert first["slug"] != second["slug"]
    assert first["sku"] != second["sku"]


def test_blank_name_gets_safe_display_and_routable_slug(monkeypatch):
    monkeypatch.setattr(
        ProductRepository,
        "create_with_sku",
        lambda payload, sku: {"id": "product-1", **payload, "sku": "NEY-GENERATED"},
    )

    product = ProductService.create(ProductCreateRequest(price=4999))

    assert product["name"] == "Untitled Product"
    assert product["slug"].startswith("untitled-product-")


def test_duplicate_name_slugs_route_to_the_correct_product(monkeypatch):
    products = {
        "kanjivaram-silk-saree-111": {
            "id": "product-1",
            "name": "Kanjivaram Silk Saree",
            "slug": "kanjivaram-silk-saree-111",
            "price": 4999,
            "is_active": True,
        },
        "kanjivaram-silk-saree-222": {
            "id": "product-2",
            "name": "Kanjivaram Silk Saree",
            "slug": "kanjivaram-silk-saree-222",
            "price": 4999,
            "is_active": True,
        },
    }
    monkeypatch.setattr(ProductRepository, "get_by_slug", products.get)

    first = ProductService.get_public_by_slug("kanjivaram-silk-saree-111")
    second = ProductService.get_public_by_slug("kanjivaram-silk-saree-222")

    assert first["id"] == "product-1"
    assert second["id"] == "product-2"


def test_product_metadata_and_sku_persist_on_create(monkeypatch):
    captured = {}

    monkeypatch.setattr(ProductRepository, "exists_by_slug", lambda *_args, **_kwargs: False)
    def fake_create(payload, sku):
        captured.update(payload)
        return {"id": "product-1", **payload, "sku": sku or "NEY-GENERATED"}

    monkeypatch.setattr(ProductRepository, "create_with_sku", fake_create)

    result = ProductService.create(ProductCreateRequest(**product_payload(sku="ney-silk-001")))

    assert captured["design"] == "Temple border"
    assert captured["price"] == 12500
    assert captured["fabric"] == "Silk"
    assert captured["color"] == "Maroon"
    assert captured["zari"] == "Pure Zari"
    assert captured["certification"] == "Silk Mark"
    assert captured["brand"] == "Neyge Couture"
    assert "sku" not in captured
    assert result["sku"] == "NEY-SILK-001"


def test_product_metadata_and_sku_persist_on_update(monkeypatch):
    existing = {"id": "product-1", "name": "Old", "slug": "old", "price": 1000, "images": []}
    captured = {}

    monkeypatch.setattr(ProductRepository, "get_by_id", lambda *_args: existing.copy())
    monkeypatch.setattr(ProductRepository, "exists_by_slug", lambda *_args, **_kwargs: False)
    def fake_update(_product_id, payload, sku):
        captured.update(payload)
        return {**existing, **payload, "sku": sku}

    monkeypatch.setattr(ProductRepository, "update_with_sku", fake_update)

    result = ProductService.update(
        "product-1",
        ProductUpdateRequest(
            design="Peacock",
            zari="Tested Zari",
            certification="Handloom Mark",
            brand="Neyge Couture",
            sku="NEY-EDIT-001",
        ),
    )

    assert captured == {
        "design": "Peacock",
        "zari": "Tested Zari",
        "certification": "Handloom Mark",
        "brand": "Neyge Couture",
    }
    assert result["sku"] == "NEY-EDIT-001"


def test_product_level_sku_edit_rejects_multi_variant_product(monkeypatch):
    existing = {
        "id": "product-variants",
        "name": "Variant Saree",
        "slug": "variant-saree",
        "price": 1000,
        "images": [],
        "has_variants": True,
    }
    monkeypatch.setattr(ProductRepository, "get_by_id", lambda *_args: existing)
    def reject_variant_sku(*_args, **_kwargs):
        raise RuntimeError(
            "SKU must be managed at variant level for products with multiple variants"
        )

    monkeypatch.setattr(ProductRepository, "update_with_sku", reject_variant_sku)

    with pytest.raises(HTTPException, match="variant level"):
        ProductService.update(
            "product-variants",
            ProductUpdateRequest(sku="NEY-VARIANT-001"),
        )


def test_multi_variant_metadata_update_omits_sku_and_succeeds(monkeypatch):
    existing = {
        "id": "product-variants",
        "name": "Variant Saree",
        "slug": "variant-saree",
        "price": 1000,
        "images": [],
        "has_variants": True,
    }
    captured = {}
    monkeypatch.setattr(ProductRepository, "get_by_id", lambda *_args: existing)

    def fake_update(product_id, payload, sku):
        captured.update({"product_id": product_id, "payload": payload, "sku": sku})
        return {**existing, **payload, "sku": None}

    monkeypatch.setattr(ProductRepository, "update_with_sku", fake_update)
    result = ProductService.update(
        "product-variants", ProductUpdateRequest(design="Peacock")
    )

    assert captured == {
        "product_id": "product-variants",
        "payload": {"design": "Peacock"},
        "sku": None,
    }
    assert result["design"] == "Peacock"


def test_blank_sku_update_means_unchanged(monkeypatch):
    existing = {
        "id": "product-1",
        "name": "Saree",
        "slug": "saree",
        "price": 1000,
        "images": [],
    }
    monkeypatch.setattr(ProductRepository, "get_by_id", lambda *_args: existing)
    captured = {}

    def fake_update(_product_id, payload, sku):
        captured.update({"payload": payload, "sku": sku})
        return {**existing, **payload, "sku": "NEY-EXISTING"}

    monkeypatch.setattr(ProductRepository, "update_with_sku", fake_update)
    result = ProductService.update(
        "product-1", ProductUpdateRequest(brand="Neyge Couture", sku=" ")
    )
    assert captured["sku"] is None
    assert "sku" not in captured["payload"]
    assert result["sku"] == "NEY-EXISTING"


@pytest.mark.parametrize(
    "migration",
    [
        MIGRATIONS_DIR / "007_admin_product_metadata.sql",
        MIGRATIONS_DIR / "preview" / "003_admin_product_metadata.sql",
    ],
)
def test_sku_migrations_preserve_historical_commercial_records(migration):
    sql = migration.read_text(encoding="utf-8").lower()
    assert "update public.order_items set sku" not in sql
    assert "update preview.order_items set sku" not in sql
    assert "update public.inventory_transactions set sku" not in sql
    assert "update preview.inventory_transactions set sku" not in sql
    assert "is_active = false" in sql


def make_upload(filename: str, content: bytes, content_type: str) -> UploadFile:
    return UploadFile(
        file=BytesIO(content),
        filename=filename,
        headers=Headers({"content-type": content_type}),
    )


def image_bytes(width=800, height=800, image_format="PNG") -> bytes:
    output = BytesIO()
    Image.new("RGB", (width, height), "white").save(output, format=image_format)
    return output.getvalue()


def test_valid_product_image_is_accepted():
    upload = make_upload("saree.png", image_bytes(), "image/png")
    content = asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=800))
    assert content


def test_unsupported_image_type_is_rejected():
    upload = make_upload("saree.gif", b"GIF89a", "image/gif")
    with pytest.raises(HTTPException, match="JPG"):
        asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=800))


def test_oversized_image_is_rejected():
    upload = make_upload("saree.png", b"x" * (UploadService.MAX_FILE_SIZE_BYTES + 1), "image/png")
    with pytest.raises(HTTPException, match="5 MB"):
        asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=800))


def test_too_small_product_image_is_rejected():
    upload = make_upload("saree.png", image_bytes(799, 800), "image/png")
    with pytest.raises(HTTPException, match="800px"):
        asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=800))


def test_collection_cover_accepts_landscape_minimum_dimensions():
    upload = make_upload("cover.webp", image_bytes(800, 600, "WEBP"), "image/webp")
    content = asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=600))
    assert content


def test_file_extension_and_content_must_match():
    upload = make_upload("saree.jpg", image_bytes(image_format="PNG"), "image/jpeg")
    with pytest.raises(HTTPException, match="valid JPG"):
        asyncio.run(UploadService._validate_image(upload, min_width=800, min_height=800))


def test_direct_upload_rejects_eleventh_product_image_before_storage(monkeypatch):
    monkeypatch.setattr(
        ProductRepository,
        "get_by_id",
        lambda *_args: {"id": "product-1", "images": [f"url-{i}" for i in range(10)]},
    )
    monkeypatch.setattr(
        UploadService,
        "_upload_to_supabase",
        lambda *_args, **_kwargs: pytest.fail("storage must not be called"),
    )
    upload = make_upload("saree.png", image_bytes(), "image/png")

    with pytest.raises(HTTPException, match="at most 10"):
        asyncio.run(UploadService.upload_product_image("product-1", upload))


def test_collection_visibility_and_cover_persist(monkeypatch):
    captured = {}
    monkeypatch.setattr(CollectionRepository, "exists_by_slug", lambda *_args, **_kwargs: False)

    def fake_create(payload):
        captured.update(payload)
        return {"id": "collection-1", **payload}

    monkeypatch.setattr(CollectionRepository, "create", fake_create)
    result = CollectionService.create(
        CollectionCreateRequest(
            name="Wedding Silks",
            banner_image="https://img/cover.webp",
            featured=True,
        )
    )

    assert captured["featured"] is True
    assert captured["banner_image"] == "https://img/cover.webp"
    assert result["featured"] is True


def test_collection_allows_missing_cover_image():
    model = CollectionCreateRequest(name="Uncovered Collection", banner_image="", featured=False)
    assert model.banner_image is None
    assert model.featured is False


def test_homepage_collection_query_enforces_active_and_featured(monkeypatch):
    class Query:
        def __init__(self):
            self.filters = []

        def select(self, *_args, **_kwargs):
            return self

        def eq(self, field, value):
            self.filters.append((field, value))
            return self

        def order(self, *_args, **_kwargs):
            return self

        def execute(self):
            return type("Result", (), {"data": [{"id": "visible", "featured": True}]})()

    query = Query()
    client = type("Client", (), {"table": lambda self, name: query})()
    monkeypatch.setattr(
        "app.repositories.collection_repository.get_supabase_admin",
        lambda: client,
    )

    result = CollectionRepository.list_homepage()

    assert ("is_active", True) in query.filters
    assert ("featured", True) in query.filters
    assert result == [{"id": "visible", "featured": True}]
