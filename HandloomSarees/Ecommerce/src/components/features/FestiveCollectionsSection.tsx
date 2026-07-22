import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicFestiveCollections } from "@/api/festiveCollections";

type FestiveCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
  popup_enabled?: boolean;
  popup_message?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
 
 
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  products?: any[];
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.festive-section {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  padding: 110px 0;
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
.fade-up { animation: fadeUp .8s cubic-bezier(.4,0,.2,1) both; }
.delay-1 { animation-delay: .1s; }
.delay-2 { animation-delay: .2s; }
.delay-3 { animation-delay: .3s; }

.festive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  margin-top: 32px;
}
@media(max-width: 700px) { .festive-grid { gap: 20px; } }

.festive-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform .35s, box-shadow .35s;
  display: flex;
  flex-direction: column;
}
.festive-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 48px rgba(128,0,32,.12);
  border-color: rgba(196,152,10,.4);
}
.festive-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  background: #F5E6D3;
  transition: transform .6s ease;
}
.festive-card:hover .festive-img { transform: scale(1.03); }
.festive-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.festive-title {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.festive-desc {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.8;
  margin-bottom: 20px;
  flex: 1;
}
.festive-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
  border-top: 1px solid rgba(196,152,10,.18);
  padding-top: 16px;
  margin-top: 8px;
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
`;

export default function FestiveCollectionsSection() {
  const [items, setItems] = useState<FestiveCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestives = async () => {
      try {
        setLoading(true);
        const data = await getPublicFestiveCollections();
        console.log("Festive collections response:", data);
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load festive collections:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFestives();
  }, []);

  if (loading) {
    return (
      <div className="festive-section">
        <div className="festive-wrap" style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#7a5c44" }}>
            Loading festive collections...
          </p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    console.log("No festive collections to render");
    return null;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="festive-section">
        <div className="festive-wrap">
          {/* Section Header with Animations */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="ey fade-up" style={{ marginBottom: 12 }}>Seasonal Edit</p>
            <h2 className="fade-up delay-1" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 400, color: "#800020", lineHeight: 1.1, letterSpacing: ".05em", marginBottom: 14 }}>
              Festive Collections
            </h2>
            <div className="gd fade-up delay-2" style={{ margin: "0 auto 20px" }} />
            <p className="fade-up delay-3" style={{ fontFamily: "'Josefin Sans'", fontSize: 15, color: "#4a3828", fontWeight: 300, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
              Discover handpicked festive sarees curated for special moments and celebrations.
            </p>
          </div>

          {/* Thread Divider */}
          <div className="thread-divider">
            <svg className="thread-svg" viewBox="0 0 1800 32" preserveAspectRatio="none">
              <path d="M0,16 C300,4 600,28 900,16 C1200,4 1500,28 1800,16" />
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="festive-grid">
            {items.map((item, index) => (
              <Link
                key={item.id}
                to={`/festive/${item.slug}`}
                className="festive-card"
                style={{ animation: `fadeUp .6s ease ${index * 0.08}s both` }}
              >
                <div style={{ overflow: "hidden" }}>
                  {item.banner_image ? (
                    <img
                      src={item.banner_image}
                      alt={item.name}
                      className="festive-img"
                    />
                  ) : (
                    <div className="festive-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Josefin Sans'", color: "#9a8070" }}>No Banner</span>
                    </div>
                  )}
                </div>
                <div className="festive-content">
                  <h3 className="festive-title">{item.name}</h3>
                  <p className="festive-desc">
                    {item.description || item.popup_message || "Explore this festive edit."}
                  </p>
                  <div className="festive-meta">
                    <span>{item.is_active ? "Active" : "Inactive"}</span>
                    <span>{item.products?.length || 0} Products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Optional second thread divider */}
          <div className="thread-divider" style={{ marginTop: 40 }}>
            <svg className="thread-svg" viewBox="0 0 1800 32" preserveAspectRatio="none">
              <path d="M0,20 C300,8 600,30 900,20 C1200,8 1500,30 1800,20" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}