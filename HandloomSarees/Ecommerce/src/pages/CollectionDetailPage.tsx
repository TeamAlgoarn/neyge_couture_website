import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '@/api/client';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');

.cd-root{
  min-height:100vh;
  background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
  font-family:'Jost',sans-serif;
  color:#1a1010;
}
.cd-wrap{
  max-width:1280px;
  margin:0 auto;
  padding:130px 56px 80px;
}
@media(max-width:900px){.cd-wrap{padding:120px 24px 60px;}}
@media(max-width:480px){.cd-wrap{padding:110px 16px 50px;}}

.cd-breadcrumb{
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  font-size:12px;color:#7d6857;margin-bottom:24px;
}
.cd-breadcrumb a{
  color:#800020;text-decoration:none;
}

.cd-hero{
  position:relative;
  border-radius:28px;
  overflow:hidden;
  min-height:420px;
  box-shadow:0 20px 70px rgba(0,0,0,.12);
  margin-bottom:40px;
  background:#eee;
}
.cd-hero-img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
.cd-hero-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top, rgba(20,10,10,.72) 0%, rgba(40,15,20,.45) 42%, rgba(0,0,0,.12) 100%);
}
.cd-hero-content{
  position:relative;z-index:2;
  padding:46px 42px;
  max-width:760px;
  color:white;
}
@media(max-width:640px){.cd-hero-content{padding:28px 22px;}}
.cd-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(212,175,55,.16);
  border:1px solid rgba(212,175,55,.35);
  padding:7px 16px;border-radius:100px;margin-bottom:16px;
}
.cd-ey{
  font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  color:#D4AF37;font-weight:600;
}
.cd-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(40px,6vw,68px);
  font-weight:400;
  line-height:1.02;
  margin-bottom:14px;
}
.cd-desc{
  font-size:15px;line-height:1.8;color:rgba(255,255,255,.88);
  max-width:620px;
}
.cd-meta{
  display:flex;gap:12px;flex-wrap:wrap;margin-top:22px;
}
.cd-pill{
  display:inline-flex;align-items:center;
  padding:8px 14px;border-radius:100px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.16);
  font-size:12px;color:rgba(255,255,255,.92);
}

.cd-section-head{
  display:flex;align-items:end;justify-content:space-between;gap:16px;
  margin-bottom:24px;flex-wrap:wrap;
}
.cd-section-title{
  font-family:'Cormorant Garamond',serif;
  font-size:38px;font-weight:500;color:#800020;line-height:1.1;
}
.cd-section-sub{
  font-size:14px;color:#6b5848;line-height:1.7;
}

.cd-state{
  border:1px solid rgba(196,152,10,.2);
  background:rgba(255,249,240,.95);
  border-radius:22px;
  padding:40px 24px;
  text-align:center;
  box-shadow:0 8px 30px rgba(0,0,0,.04);
}
.cd-error{color:#b42318;}
.cd-loading{color:#6b5848;}

.cd-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:24px;
}
@media(max-width:1100px){.cd-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:820px){.cd-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:520px){.cd-grid{grid-template-columns:1fr;}}

.cd-card{
  display:block;
  text-decoration:none;
  background:rgba(255,249,240,.96);
  border:1px solid rgba(196,152,10,.18);
  border-radius:24px;
  overflow:hidden;
  box-shadow:0 10px 28px rgba(0,0,0,.05);
  transition:transform .35s ease, box-shadow .35s ease, border-color .35s ease;
}
.cd-card:hover{
  transform:translateY(-6px);
  box-shadow:0 18px 44px rgba(0,0,0,.12);
  border-color:rgba(196,152,10,.4);
}
.cd-card-img-wrap{
  aspect-ratio:3/4;
  background:#f1e4d2;
  overflow:hidden;
}
.cd-card-img{
  width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .6s ease;
}
.cd-card:hover .cd-card-img{transform:scale(1.06);}
.cd-card-body{padding:18px 18px 20px;}
.cd-card-title{
  font-family:'Cormorant Garamond',serif;
  font-size:24px;font-weight:500;color:#800020;line-height:1.12;
  margin-bottom:8px;
}
.cd-card-desc{
  font-size:13px;line-height:1.65;color:#6d5a4b;
  min-height:42px;
}
.cd-card-bottom{
  display:flex;align-items:center;justify-content:space-between;
  margin-top:16px;gap:12px;
}
.cd-price{
  font-size:18px;font-weight:600;color:#800020;
}
.cd-link{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  font-weight:600;color:#C4980A;
}

.cd-back{
  display:inline-flex;align-items:center;gap:8px;
  margin-bottom:18px;
  text-decoration:none;color:#800020;font-size:13px;font-weight:500;
}
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
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollectionPage = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError('');

        const [collectionRes, productsRes] = await Promise.all([
          api.get(`/collections/${slug}`),
          api.get('/products'),
        ]);

        let collectionData: Collection | null =
          collectionRes.data?.data ||
          collectionRes.data?.collection ||
          collectionRes.data ||
          null;

        let productItems: Product[] = [];

        const rawProducts = productsRes.data;

        if (Array.isArray(rawProducts)) {
          productItems = rawProducts;
        } else if (Array.isArray(rawProducts?.data)) {
          productItems = rawProducts.data;
        } else if (Array.isArray(rawProducts?.data?.items)) {
          productItems = rawProducts.data.items;
        } else if (Array.isArray(rawProducts?.products)) {
          productItems = rawProducts.products;
        } else if (Array.isArray(rawProducts?.items)) {
          productItems = rawProducts.items;
        }

        const filteredProducts = productItems.filter((product) => {
          if (product.is_active === false) return false;

          const byCollectionSlug = product.collection?.slug === slug;
          const byCollectionId =
            collectionData?.id && product.collection_id === collectionData.id;

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
          <div className="cd-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>{collection.name}</span>
          </div>

          <Link to="/" className="cd-back">
            ← Back
          </Link>

          <section className="cd-hero">
            <img
              src={bannerImage}
              alt={collection.name}
              className="cd-hero-img"
            />
            <div className="cd-hero-overlay" />
            <div className="cd-hero-content">
              <div className="cd-badge">
                <Sparkles size={13} color="#D4AF37" />
                <span className="cd-ey">Collection</span>
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

          <div className="cd-section-head">
            <div>
              <h2 className="cd-section-title">Explore the Collection</h2>
              <p className="cd-section-sub">
                Browse the products available under {collection.name}.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="cd-state">
              <ShoppingBag size={28} style={{ marginBottom: 12, color: '#C4980A' }} />
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
                const desc = product.short_description || product.description || 'Handwoven elegance crafted for timeless style.';

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="cd-card"
                  >
                    <div className="cd-card-img-wrap">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="cd-card-img"
                      />
                    </div>

                    <div className="cd-card-body">
                      <h3 className="cd-card-title">{product.name}</h3>
                      <p className="cd-card-desc">{desc}</p>

                      <div className="cd-card-bottom">
                        <div className="cd-price">
                          ₹{Number(price).toLocaleString('en-IN')}
                        </div>

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