from pathlib import Path


FRONTEND_SRC = Path(__file__).resolve().parents[2] / "Ecommerce" / "src"


def _active_homepage_source() -> str:
    source = (FRONTEND_SRC / "pages" / "HomePage.tsx").read_text(encoding="utf-8")
    return source.split('import FestiveCollectionsSection', 1)[1]


def test_homepage_uses_new_heritage_heading_and_no_legacy_editorials():
    source = _active_homepage_source()

    assert "Generations of weaving mastery" in source
    assert "3 Generations" not in source
    assert "The Terracotta Weave" not in source
    assert "Indigo Memories" not in source


def test_homepage_mounts_admin_managed_collections_in_legacy_location():
    source = _active_homepage_source()

    assert 'import { FeaturedCollections }' in source
    assert "<FestiveCollectionsSection />" in source
    assert "<FeaturedCollections />" in source
    assert source.index("<FestiveCollectionsSection />") < source.index(
        "<FeaturedCollections />"
    ) < source.index("<CorePillarsStrip />")


def test_featured_collection_component_handles_visibility_order_and_empty_state():
    source = (
        FRONTEND_SRC / "components" / "features" / "FeaturedCollections.tsx"
    ).read_text(encoding="utf-8")

    assert "'/collections/homepage'" in source
    assert "item.is_active !== false && item.featured !== false" in source
    assert "(a.sort_order ?? 0) - (b.sort_order ?? 0)" in source
    assert "if (loading || error || collections.length === 0) return null" in source
    assert "}, [collections.length]);" in source


def test_featured_collection_card_has_cover_fallback_and_slug_route():
    source = (
        FRONTEND_SRC / "components" / "features" / "FeaturedCollections.tsx"
    ).read_text(encoding="utf-8")

    assert "col.banner_image" in source
    assert 'className="fc-card-img-fallback"' in source
    assert "event.currentTarget.style.display = 'none'" in source
    assert "to={`/collections/${col.slug}`}" in source
    assert "unsplash" not in source.lower()


def test_admin_collection_form_reuses_cover_visibility_active_and_sort_fields():
    source = (
        FRONTEND_SRC / "admin" / "pages" / "CollectionForm.tsx"
    ).read_text(encoding="utf-8")

    for field in ("banner_image", "featured", "is_active", "sort_order"):
        assert field in source
    assert "Remove Cover Image" in source
    assert "Show this collection on homepage" in source
    assert "Homepage Sort Order" in source


def test_admin_collection_form_allows_generated_slug_and_optional_cover():
    source = (
        FRONTEND_SRC / "admin" / "pages" / "CollectionForm.tsx"
    ).read_text(encoding="utf-8")

    slug_block = source.split("{/* Slug */}", 1)[1].split("{/*", 1)[0]
    assert "required" not in slug_block
    assert "Leave blank to generate a unique URL-friendly identifier" in slug_block
    assert "slug: form.slug.trim() || undefined" in source
    assert "banner_image: form.banner_image.trim() || null" in source
