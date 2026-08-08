import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFestiveCollectionBySlug } from '@/api/festiveCollections';
import { SareeCard } from '@/components/features/SareeCard';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.festive-page-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.festive-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width: 900px){ .festive-wrap { padding: 0 24px; } }
@media(max-width: 480px){ .festive-wrap { padding: 0 16px; } }

.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}
.gd { width: 44px; height: 1px; background: #C4980A; margin: 0 auto; }

@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes subtleKenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}
.fade-up { animation: fadeUp .8s cubic-bezier(.4,0,.2,1) both; }
.delay-1 { animation-delay: .12s; }
.delay-2 { animation-delay: .24s; }
.delay-3 { animation-delay: .36s; }

.hero-banner {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 32px;
  overflow: hidden;
  margin-bottom: 56px;
  box-shadow: 0 20px 60px rgba(0,0,0,.12);
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: subtleKenBurns 20s ease-in-out infinite alternate;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(90,0,22,.45) 0%, rgba(27,42,107,.65) 100%);
}
.hero-content {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 24px;
  color: white;
  z-index: 2;
}
.hero-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 400;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
  text-shadow: 0 2px 12px rgba(0,0,0,.3);
}
.hero-desc {
  font-family: 'Josefin Sans';
  font-size: 16px;
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
  color: rgba(255,255,255,.85);
  text-shadow: 0 1px 6px rgba(0,0,0,.2);
}

.thread-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  padding: 8px 0;
  margin: 20px 0;
}
.thread-svg {
  width: 100%;
  height: 32px;
  display: block;
}
.thread-svg path {
  stroke: rgba(196,152,10,0.3);
  stroke-width: 1;
  fill: none;
  animation: flowThread 6s ease-in-out infinite;
}
@keyframes flowThread {
  0%,100% { d: path("M0,16 C300,4 600,28 900,16 C1200,4 1500,28 1800,16"); }
  50% { d: path("M0,12 C300,24 600,8 900,12 C1200,24 1500,8 1800,12"); }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin: 48px 0 64px;
}
@media(max-width: 1100px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media(max-width: 820px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
@media(max-width: 560px) { .product-grid { grid-template-columns: 1fr; gap: 16px; } }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 500;
  color: #800020;
  text-decoration: none;
  margin-bottom: 32px;
  transition: gap .25s;
}
.back-link:hover { gap: 12px; color: #C4980A; }

.loading-state, .error-state {
  text-align: center;
  padding: 120px 24px;
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #4a3828;
}
`;

export default function FestiveCollectionPage() {
  // ✅ Force scroll to top whenever this page is loaded/opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { slug = '' } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getFestiveCollectionBySlug(slug);
        setData(res);
      } catch (error) {
        console.error(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="festive-page-root">
          <div className="loading-state">Loading festive collection...</div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <style>{CSS}</style>
        <div className="festive-page-root">
          <div className="error-state">Festive collection not found</div>
        </div>
      </>
    );
  }

  const products = data.products || [];

  return (
    <>
      <style>{CSS}</style>
      <div className="festive-page-root">
        <div className="festive-wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
          {/* Back Link */}
          <Link to="/shop" className="back-link fade-up">
            ← Back to Shop
          </Link>

          {/* Hero Banner with Overlay */}
          <div className="hero-banner fade-up delay-1">
            {data.banner_image ? (
              <>
                <img src={data.banner_image} alt={data.name} className="hero-img" />
                <div className="hero-overlay" />
                <div className="hero-content">
                  <span className="ey" style={{ color: '#D4AF37', marginBottom: 8, display: 'block' }}>
                    Festive Collection
                  </span>
                  <h1 className="hero-title">{data.name}</h1>
                  {data.description && <p className="hero-desc">{data.description}</p>}
                </div>
              </>
            ) : (
              <div style={{ background: '#F5E6D3', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 className="hero-title" style={{ color: '#800020' }}>{data.name}</h1>
              </div>
            )}
          </div>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="ey fade-up delay-2">Handpicked for You</span>
            <h2 className="fade-up delay-2" style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 400, color: '#800020', marginTop: 12, letterSpacing: '0.04em' }}>
              Explore the Edit
            </h2>
            <div className="gd fade-up delay-2" style={{ margin: '16px auto 0' }} />
          </div>

          {/* Thread Divider */}
          <div className="thread-divider fade-up delay-3">
            <svg className="thread-svg" viewBox="0 0 1800 32" preserveAspectRatio="none">
              <path d="M0,16 C300,4 600,28 900,16 C1200,4 1500,28 1800,16" />
            </svg>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: "'Josefin Sans'", fontSize: 14, color: '#9a8070' }}>
                No products available in this festive collection yet.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
                <div
                  key={product.id}
                  style={{ animation: `fadeUp .6s ease ${idx * 0.06}s both` }}
                >
                  <SareeCard saree={product} />
                </div>
              ))}
            </div>
          )}

          {/* Optional CTA */}
          {products.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #D4AF37, #b8960f)',
                  color: '#800020',
                  borderRadius: 100,
                  fontFamily: "'Josefin Sans'",
                  fontSize: 12,
                  letterSpacing: '.12em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'transform .35s, box-shadow .35s',
                  boxShadow: '0 4px 16px rgba(212,175,55,.3)',
                }}
              >
                View All Collections <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}