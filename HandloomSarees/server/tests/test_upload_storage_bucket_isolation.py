from types import SimpleNamespace

import app.services.upload_service as upload_service
from app.services.upload_service import UploadService


class FakeBucket:
    def __init__(self, bucket: str, calls: list[tuple]):
        self.bucket = bucket
        self.calls = calls

    def upload(self, path, content, options):
        self.calls.append(("upload", self.bucket, path, content, options))
        return SimpleNamespace(error=None)

    def get_public_url(self, path):
        self.calls.append(("get_public_url", self.bucket, path))
        return f"https://storage.example/{self.bucket}/{path}"


class FakeStorage:
    def __init__(self, calls: list[tuple]):
        self.calls = calls

    def from_(self, bucket):
        self.calls.append(("from", bucket))
        return FakeBucket(bucket, self.calls)


class FakeSupabase:
    def __init__(self):
        self.calls = []
        self.storage = FakeStorage(self.calls)


def test_preview_storage_bucket_override_is_used_for_upload_and_public_url(monkeypatch):
    fake_supabase = FakeSupabase()
    monkeypatch.setattr(
        upload_service,
        "settings",
        SimpleNamespace(SUPABASE_STORAGE_BUCKET="neyge-preview"),
    )
    monkeypatch.setattr(upload_service, "get_supabase_admin", lambda: fake_supabase)

    bucket = UploadService._bucket(UploadService.PRODUCT_BUCKET)
    url = UploadService._upload_to_supabase(
        bucket,
        "products/temp/example.png",
        b"image-bytes",
        "image/png",
    )

    assert bucket == "neyge-preview"
    assert url == "https://storage.example/neyge-preview/products/temp/example.png"
    assert ("from", "neyge-preview") in fake_supabase.calls
    assert ("from", UploadService.PRODUCT_BUCKET) not in fake_supabase.calls
    assert any(call[:3] == ("upload", "neyge-preview", "products/temp/example.png") for call in fake_supabase.calls)
    assert ("get_public_url", "neyge-preview", "products/temp/example.png") in fake_supabase.calls


def test_production_storage_bucket_fallback_preserves_existing_product_bucket(monkeypatch):
    fake_supabase = FakeSupabase()
    monkeypatch.setattr(
        upload_service,
        "settings",
        SimpleNamespace(SUPABASE_STORAGE_BUCKET=""),
    )
    monkeypatch.setattr(upload_service, "get_supabase_admin", lambda: fake_supabase)

    bucket = UploadService._bucket(UploadService.PRODUCT_BUCKET)
    url = UploadService._upload_to_supabase(
        bucket,
        "products/temp/example.png",
        b"image-bytes",
        "image/png",
    )

    assert bucket == UploadService.PRODUCT_BUCKET
    assert url == "https://storage.example/product-images/products/temp/example.png"
    assert ("from", UploadService.PRODUCT_BUCKET) in fake_supabase.calls
    assert ("get_public_url", UploadService.PRODUCT_BUCKET, "products/temp/example.png") in fake_supabase.calls


def test_production_storage_bucket_fallback_preserves_existing_collection_bucket(monkeypatch):
    fake_supabase = FakeSupabase()
    monkeypatch.setattr(
        upload_service,
        "settings",
        SimpleNamespace(SUPABASE_STORAGE_BUCKET=" "),
    )
    monkeypatch.setattr(upload_service, "get_supabase_admin", lambda: fake_supabase)

    bucket = UploadService._bucket(UploadService.COLLECTION_BUCKET)
    url = UploadService._upload_to_supabase(
        bucket,
        "collections/temp/example.png",
        b"image-bytes",
        "image/png",
    )

    assert bucket == UploadService.COLLECTION_BUCKET
    assert url == "https://storage.example/collection-images/collections/temp/example.png"
    assert ("from", UploadService.COLLECTION_BUCKET) in fake_supabase.calls
    assert ("get_public_url", UploadService.COLLECTION_BUCKET, "collections/temp/example.png") in fake_supabase.calls
