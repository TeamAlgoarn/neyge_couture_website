import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { ArrowRight, Sparkles, ShoppingBag, ChevronRight } from 'lucide-react';

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  maroon:   '#800020',
  maroonDk: '#5a0016',
  gold:     '#C4980A',
  goldV:    '#D4AF37',
  cream:    '#F5E6D3',
  creamLt:  '#FFF9F0',
  creamMid: '#F8EEE2',
  creamDk:  '#EDD8C4',
  warmGrey: '#4a3828',
  navy:     '#1B2A6B',
  forest:   '#14402A',
  blush:    '#F2C4CE',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.cd-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}

.cd-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 140px 64px 80px;
}
@media(max-width:900px){ .cd-wrap { padding: 120px 24px 60px; } }
@media(max-width:480px){ .cd-wrap { padding: 110px 16px 50px; } }

/* ── Eyebrow ── */
.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}

/* ── Gold divider ── */
.gd { width: 44px; height: 1px; background: #C4980A; margin: 0 auto; }

/* ── Breadcrumb ── */
.cd-breadcrumb {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: #9a8070;
  margin-bottom: 24px;
}
.cd-breadcrumb a {
  color: #800020;
  text-decoration: none;
  transition: color 0.2s;
}
.cd-breadcrumb a:hover { color: #C4980A; }

/* ── Back link ── */
.cd-back {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 18px;
  text-decoration: none;
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 500;
  color: #800020;
  transition: gap 0.25s, color 0.25s;
}
.cd-back:hover { gap: 12px; color: #C4980A; }

/* ── Collection filter strip ── */
.cd-filter-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  padding: 18px 22px;
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,.04);
}
.cd-filter-label {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #9a8070;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 4px;
}
.cd-filter-scroll {
  display: flex; gap: 8px; flex-wrap: wrap; flex: 1;
}
.cd-filter-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid rgba(196,152,10,.25);
  background: transparent;
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 500;
  color: #4a3828;
  cursor: pointer;
  text-decoration: none;
  transition: all .22s ease;
  white-space: nowrap;
}
.cd-filter-chip:hover {
  border-color: rgba(196,152,10,.5);
  background: rgba(196,152,10,.08);
  color: #800020;
  transform: translateY(-1px);
}
.cd-filter-chip.active {
  background: #800020;
  border-color: #800020;
  color: #fff;
  box-shadow: 0 4px 12px rgba(128,0,32,.22);
}
.cd-filter-chip.active:hover {
  background: #5a0016;
  transform: translateY(-1px);
}

/* ── Hero section ── */
.cd-hero {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  min-height: 420px;
  box-shadow: 0 20px 70px rgba(0,0,0,.12);
  margin-bottom: 40px;
  background: #eee;
}
.cd-hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
.cd-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(90,0,22,.78) 0%, rgba(27,42,107,.55) 42%, rgba(0,0,0,.18) 100%);
}
.cd-hero-content {
  position: relative; z-index: 2;
  padding: 46px 42px;
  max-width: 760px;
  color: white;
}
@media(max-width:640px){ .cd-hero-content { padding: 28px 22px; } }
.cd-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(212,175,55,.16);
  border: 1px solid rgba(212,175,55,.35);
  padding: 7px 16px; border-radius: 100px; margin-bottom: 16px;
}
.cd-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 400;
  line-height: 1.02;
  margin-bottom: 14px;
  letter-spacing: 0.04em;
}
.cd-desc {
  font-family: 'Josefin Sans';
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255,255,255,.88);
  max-width: 620px;
  font-weight: 300;
}
.cd-meta {
  display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px;
}
.cd-pill {
  display: inline-flex; align-items: center;
  padding: 8px 14px; border-radius: 100px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.16);
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: rgba(255,255,255,.92);
  font-weight: 400;
}

/* ── Section headers ── */
.cd-section-head {
  display: flex; align-items: end; justify-content: space-between; gap: 16px;
  margin-bottom: 24px; flex-wrap: wrap;
}
.cd-section-title {
  font-family: 'Cinzel', serif;
  font-size: 38px; font-weight: 500; color: #800020; line-height: 1.1;
  letter-spacing: 0.02em;
}
.cd-section-sub {
  font-family: 'Josefin Sans';
  font-size: 14px; color: #6b5848; line-height: 1.7;
  font-weight: 300;
}

/* ── State messages ── */
.cd-state {
  border: 1px solid rgba(196,152,10,.2);
  background: rgba(255,249,240,.95);
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,.04);
  font-family: 'Josefin Sans';
  font-weight: 300;
}
.cd-error { color: #b42318; }
.cd-loading { color: #6b5848; }

/* ── Product grid ── */
.cd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media(max-width:1100px){ .cd-grid { grid-template-columns: repeat(3, 1fr); } }
@media(max-width:820px){ .cd-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width:520px){ .cd-grid { grid-template-columns: 1fr; } }

.cd-card {
  display: block;
  text-decoration: none;
  background: rgba(255,249,240,.96);
  border: 1px solid rgba(196,152,10,.18);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0,0,0,.05);
  transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
}
.cd-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 44px rgba(0,0,0,.12);
  border-color: rgba(196,152,10,.4);
}
.cd-card-img-wrap {
  aspect-ratio: 3/4;
  background: #f1e4d2;
  overflow: hidden;
}
.cd-card-img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .6s ease;
}
.cd-card:hover .cd-card-img { transform: scale(1.06); }
.cd-card-body { padding: 18px 18px 20px; }
.cd-card-title {
  font-family: 'Cinzel', serif;
  font-size: 24px; font-weight: 500; color: #800020; line-height: 1.12;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}
.cd-card-desc {
  font-family: 'Josefin Sans';
  font-size: 13px; line-height: 1.65; color: #6d5a4b;
  min-height: 42px;
  font-weight: 300;
}
.cd-card-bottom {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 16px; gap: 12px;
}
.cd-price {
  font-family: 'Cinzel', serif;
  font-size: 18px; font-weight: 600; color: #800020;
}
.cd-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Josefin Sans';
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  font-weight: 600; color: #C4980A;
  transition: gap 0.25s;
}
.cd-card:hover .cd-link { gap: 10px; }
`;

type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  banner_image?: string;
  is_active?: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price?: number;
  discount_price?: number | null;
  short_description?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  is_active?: boolean;
  collection_id?: string;
  collection?: {
    id?: string;
    slug?: string;
    name?: string;
  } | null;
};

const FALLBACK_COLLECTION_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1400&auto=format&fit=crop';

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1583391733981-84978a7e0c04?q=80&w=900&auto=format&fit=crop';

export function CollectionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollectionPage = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError('');

        const [collectionRes, productsRes, allCollectionsRes] = await Promise.all([
          api.get(`/collections/${slug}`),
          api.get('/products'),
          api.get('/collections'),
        ]);

        // ── Current collection ──
        let collectionData: Collection | null =
          collectionRes.data?.data ||
          collectionRes.data?.collection ||
          collectionRes.data ||
          null;

        // ── All collections (for filter strip) ──
        const rawAll = allCollectionsRes.data;
        let allItems: Collection[] = [];
        if (Array.isArray(rawAll)) allItems = rawAll;
        else if (Array.isArray(rawAll?.data)) allItems = rawAll.data;
        else if (Array.isArray(rawAll?.collections)) allItems = rawAll.collections;
        else if (Array.isArray(rawAll?.items)) allItems = rawAll.items;

        setAllCollections(allItems.filter((c) => c.is_active !== false));

        // ── Products ──
        let productItems: Product[] = [];
        const rawProducts = productsRes.data;
        if (Array.isArray(rawProducts)) productItems = rawProducts;
        else if (Array.isArray(rawProducts?.data)) productItems = rawProducts.data;
        else if (Array.isArray(rawProducts?.data?.items)) productItems = rawProducts.data.items;
        else if (Array.isArray(rawProducts?.products)) productItems = rawProducts.products;
        else if (Array.isArray(rawProducts?.items)) productItems = rawProducts.items;

        const filteredProducts = productItems.filter((product) => {
          if (product.is_active === false) return false;
          const byCollectionSlug = product.collection?.slug === slug;
          const byCollectionId = collectionData?.id && product.collection_id === collectionData.id;
          return byCollectionSlug || byCollectionId;
        });

        setCollection(collectionData);
        setProducts(filteredProducts);
      } catch (err: any) {
        console.error('Failed to load collection detail page:', err);
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load collection'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionPage();
  }, [slug]);

  const bannerImage = useMemo(() => {
    return (
      collection?.banner_image ||
      collection?.image_url ||
      collection?.image ||
      collection?.thumbnail ||
      FALLBACK_COLLECTION_IMAGE
    );
  }, [collection]);

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cd-root">
          <div className="cd-wrap">
            <div className="cd-state cd-loading">Loading collection...</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !collection) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cd-root">
          <div className="cd-wrap">
            <div className="cd-state cd-error">{error || 'Collection not found'}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="cd-root">
        <div className="cd-wrap">

          {/* ── Breadcrumb ── */}
          <div className="cd-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to="/collections">Collections</Link>
            <ChevronRight size={12} />
            <span>{collection.name}</span>
          </div>

          <Link to="/collections" className="cd-back">
            ← Back to Collections
          </Link>

          {/* ── Collection Filter Strip ── */}
          {allCollections.length > 1 && (
            <div className="cd-filter-strip">
              <span className="cd-filter-label">Browse:</span>
              <div className="cd-filter-scroll">
                {/* "All" chip */}
                <Link
                  to="/collections"
                  className="cd-filter-chip"
                >
                  All Collections
                </Link>

                {/* Individual collection chips */}
                {allCollections.map((col) => (
                  <button
                    key={col.id}
                    className={`cd-filter-chip ${col.slug === slug ? 'active' : ''}`}
                    onClick={() => navigate(`/collections/${col.slug}`)}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Hero ── */}
          <section className="cd-hero">
            <img src={bannerImage} alt={collection.name} className="cd-hero-img" />
            <div className="cd-hero-overlay" />
            <div className="cd-hero-content">
              <div className="cd-badge">
                <Sparkles size={13} color="#D4AF37" />
                <span className="ey">Collection</span>
              </div>
              <h1 className="cd-title">{collection.name}</h1>
              <p className="cd-desc">
                {collection.description || 'Discover handcrafted pieces from this curated collection.'}
              </p>
              <div className="cd-meta">
                <span className="cd-pill">{products.length} Products</span>
                <span className="cd-pill">Handloom Heritage</span>
                <span className="cd-pill">Artisan Crafted</span>
              </div>
            </div>
          </section>

          {/* ── Products Section ── */}
          <div className="cd-section-head">
            <div>
              <h2 className="cd-section-title">Explore the Collection</h2>
              <p className="cd-section-sub">
                Browse the products available under {collection.name}.
              </p>
            </div>
          </div>
          <div className="gd" style={{ marginBottom: 32 }} />

          {products.length === 0 ? (
            <div className="cd-state">
              <ShoppingBag size={28} style={{ marginBottom: 12, color: C.gold }} />
              <div>No products available in this collection yet.</div>
            </div>
          ) : (
            <div className="cd-grid">
              {products.map((product) => {
                const productImage =
                  product.thumbnail ||
                  product.image ||
                  product.images?.[0] ||
                  FALLBACK_PRODUCT_IMAGE;

                const price = product.discount_price ?? product.price ?? 0;
                const desc =
                  product.short_description ||
                  product.description ||
                  'Handwoven elegance crafted for timeless style.';

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="cd-card"
                  >
                    <div className="cd-card-img-wrap">
                      <img src={productImage} alt={product.name} className="cd-card-img" />
                    </div>
                    <div className="cd-card-body">
                      <h3 className="cd-card-title">{product.name}</h3>
                      <p className="cd-card-desc">{desc}</p>
                      <div className="cd-card-bottom">
                        <div className="cd-price">₹{Number(price).toLocaleString('en-IN')}</div>
                        <div className="cd-link">
                          <span>View</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}