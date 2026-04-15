import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { Sparkles, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';

// ─── Brand palette ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.cl-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
}

.cl-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 140px 64px 80px;
}
@media(max-width:900px){ .cl-wrap { padding: 120px 24px 60px; } }
@media(max-width:480px){ .cl-wrap { padding: 110px 16px 50px; } }

/* ── Page Header ── */
.cl-header {
  text-align: center;
  margin-bottom: 56px;
}
.cl-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10px; letter-spacing: 0.30em; text-transform: uppercase;
  color: #C4980A; font-weight: 600; margin-bottom: 16px;
}
.cl-page-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(36px, 5vw, 62px);
  font-weight: 400;
  color: #800020;
  letter-spacing: 0.04em;
  line-height: 1.1;
  margin-bottom: 16px;
}
.cl-page-sub {
  font-size: 15px; color: #6b5848; font-weight: 300; line-height: 1.8;
  max-width: 500px; margin: 0 auto;
}
.cl-divider {
  width: 60px; height: 1px; background: #C4980A;
  margin: 24px auto 0;
}

/* ── Layout: sidebar + grid ── */
.cl-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
  align-items: start;
}
@media(max-width:900px){
  .cl-layout { grid-template-columns: 1fr; }
}

/* ── Sidebar ── */
.cl-sidebar {
  position: sticky;
  top: 100px;
  background: rgba(255,249,240,.98);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,.05);
}
@media(max-width:900px){
  .cl-sidebar { position: static; }
}
.cl-sidebar-title {
  font-family: 'Cinzel', serif;
  font-size: 14px; font-weight: 600; color: #800020;
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
}
.cl-search-wrap {
  position: relative; margin-bottom: 24px;
}
.cl-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: #9a8070; pointer-events: none;
}
.cl-search {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 100px;
  background: rgba(255,255,255,.7);
  font-family: 'Josefin Sans'; font-size: 13px; color: #1a1010;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.cl-search:focus {
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.1);
}
.cl-search::placeholder { color: #b09880; }

/* Filter tags */
.cl-filter-label {
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: #9a8070; font-weight: 600; margin-bottom: 12px; margin-top: 20px;
  display: block;
}
.cl-filter-list {
  display: flex; flex-direction: column; gap: 6px;
}
@media(max-width:900px){
  .cl-filter-list { flex-direction: row; flex-wrap: wrap; gap: 8px; }
}
.cl-filter-btn {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer; text-align: left;
  font-family: 'Josefin Sans'; font-size: 13px; color: #4a3828;
  font-weight: 400;
  transition: all .2s;
  width: 100%;
}
@media(max-width:900px){
  .cl-filter-btn { width: auto; }
}
.cl-filter-btn:hover {
  background: rgba(196,152,10,.08);
  border-color: rgba(196,152,10,.2);
  color: #800020;
}
.cl-filter-btn.active {
  background: rgba(128,0,32,.06);
  border-color: rgba(128,0,32,.2);
  color: #800020;
  font-weight: 600;
}
.cl-filter-count {
  font-size: 10px;
  background: rgba(196,152,10,.15);
  color: #C4980A;
  padding: 2px 8px; border-radius: 100px;
  font-weight: 600;
}
.cl-filter-btn.active .cl-filter-count {
  background: rgba(128,0,32,.1);
  color: #800020;
}
.cl-clear-btn {
  display: flex; align-items: center; gap: 6px;
  margin-top: 20px; padding: 8px 0;
  background: none; border: none; cursor: pointer;
  font-family: 'Josefin Sans'; font-size: 12px; color: #9a8070;
  transition: color .2s;
}
.cl-clear-btn:hover { color: #800020; }

/* ── Main content ── */
.cl-main-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px; gap: 16px; flex-wrap: wrap;
}
.cl-results-label {
  font-size: 13px; color: #6b5848; font-weight: 300;
}
.cl-results-label strong { color: #800020; font-weight: 600; }

/* ── Collections grid ── */
.cl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media(max-width:1100px){ .cl-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width:600px){ .cl-grid { grid-template-columns: 1fr; } }

/* ── Collection card ── */
.cl-card {
  display: block; text-decoration: none;
  border-radius: 24px; overflow: hidden;
  background: rgba(255,249,240,.96);
  border: 1px solid rgba(196,152,10,.18);
  box-shadow: 0 10px 28px rgba(0,0,0,.05);
  transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
  position: relative;
}
.cl-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 22px 48px rgba(0,0,0,.13);
  border-color: rgba(196,152,10,.4);
}

.cl-card-img-wrap {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
  background: #f1e4d2;
}
.cl-card-img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .6s ease;
}
.cl-card:hover .cl-card-img { transform: scale(1.07); }
.cl-card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(90,0,22,.55) 0%, transparent 55%);
  opacity: 0; transition: opacity .35s;
}
.cl-card:hover .cl-card-overlay { opacity: 1; }

.cl-card-body { padding: 20px 20px 22px; }
.cl-card-tag {
  font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #C4980A; font-weight: 600; margin-bottom: 8px;
}
.cl-card-name {
  font-family: 'Cinzel', serif;
  font-size: 22px; font-weight: 500; color: #800020;
  line-height: 1.15; letter-spacing: 0.02em;
  margin-bottom: 8px;
}
.cl-card-desc {
  font-size: 13px; color: #6d5a4b; line-height: 1.65; font-weight: 300;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cl-card-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.cl-card-count {
  font-size: 11px; color: #9a8070; font-weight: 400;
}
.cl-card-cta {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  font-weight: 600; color: #C4980A;
  transition: gap 0.25s;
}
.cl-card:hover .cl-card-cta { gap: 10px; }

/* ── Empty / Loading states ── */
.cl-state {
  border: 1px solid rgba(196,152,10,.2);
  background: rgba(255,249,240,.95);
  border-radius: 24px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,.04);
  font-family: 'Josefin Sans'; font-weight: 300; font-size: 15px;
  color: #6b5848;
}

/* Mobile filter toggle */
.cl-mobile-toggle {
  display: none;
}
@media(max-width:900px){
  .cl-mobile-toggle {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 100px;
    border: 1px solid rgba(196,152,10,.3);
    background: rgba(255,249,240,.95);
    font-family: 'Josefin Sans'; font-size: 13px; font-weight: 500;
    color: #800020; cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.06);
    margin-bottom: 20px;
  }
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
  category?: string;
  product_count?: number;
  is_active?: boolean;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop';

// Derive category tags from collection names for filtering
function deriveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('wedding') || n.includes('bridal') || n.includes('bride')) return 'Wedding';
  if (n.includes('party') || n.includes('occasion') || n.includes('festive') || n.includes('celebration')) return 'Party & Festive';
  if (n.includes('casual') || n.includes('daily') || n.includes('everyday')) return 'Casual Wear';
  if (n.includes('formal') || n.includes('office') || n.includes('work')) return 'Formal';
  if (n.includes('summer') || n.includes('cotton') || n.includes('light')) return 'Summer';
  if (n.includes('winter') || n.includes('silk') || n.includes('heavy')) return 'Winter & Silk';
  if (n.includes('tradition') || n.includes('heritage') || n.includes('handloom') || n.includes('hand')) return 'Heritage';
  return 'Other';
}

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const res = await api.get('/collections');
        const raw = res.data;
        let items: Collection[] = [];

        if (Array.isArray(raw)) items = raw;
        else if (Array.isArray(raw?.data)) items = raw.data;
        else if (Array.isArray(raw?.collections)) items = raw.collections;
        else if (Array.isArray(raw?.items)) items = raw.items;

        setCollections(items.filter((c) => c.is_active !== false));
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Build category list dynamically from collections
  const categories = useMemo(() => {
    const counts: Record<string, number> = { All: collections.length };
    collections.forEach((c) => {
      const cat = c.category || deriveCategory(c.name);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [collections]);

  // Filtered collections
  const filtered = useMemo(() => {
    return collections.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const cat = c.category || deriveCategory(c.name);
      const matchCat = activeCategory === 'All' || cat === activeCategory;
      return matchSearch && matchCat;
    });
  }, [collections, search, activeCategory]);

  const handleCollectionClick = () => {
    navigate(`/collections`);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="cl-root">
        <div className="cl-wrap">

          {/* ── Page Header ── */}
          <div className="cl-header">
            <div className="cl-eyebrow">
              <Sparkles size={12} color="#C4980A" />
              Curated for You
            </div>
            <h1 className="cl-page-title">Our Collections</h1>
            <p className="cl-page-sub">
              Explore handcrafted saree collections, each telling a story of artisanal heritage.
            </p>
            <div className="cl-divider" />
          </div>

          {/* Mobile filter toggle */}
          <button className="cl-mobile-toggle" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={15} />
            {showFilters ? 'Hide Filters' : 'Filter Collections'}
            {activeCategory !== 'All' && (
              <span style={{
                background: '#800020', color: '#fff',
                borderRadius: '100px', padding: '1px 8px', fontSize: 11
              }}>1</span>
            )}
          </button>

          <div className="cl-layout">

            {/* ── Sidebar ── */}
            <aside className="cl-sidebar" style={{ display: showFilters || window.innerWidth > 900 ? 'block' : 'none' }}>
              <div className="cl-sidebar-title">
                <SlidersHorizontal size={14} />
                Filter
              </div>

              {/* Search */}
              <div className="cl-search-wrap">
                <Search size={14} className="cl-search-icon" />
                <input
                  className="cl-search"
                  placeholder="Search collections…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <span className="cl-filter-label">By Category</span>
              <div className="cl-filter-list">
                {Object.entries(categories).map(([cat, count]) => (
                  <button
                    key={cat}
                    className={`cl-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="cl-filter-count">{count}</span>
                  </button>
                ))}
              </div>

              {(activeCategory !== 'All' || search) && (
                <button
                  className="cl-clear-btn"
                  onClick={() => { setActiveCategory('All'); setSearch(''); }}
                >
                  <X size={13} /> Clear filters
                </button>
              )}
            </aside>

            {/* ── Main grid ── */}
            <main>
              <div className="cl-main-top">
                <p className="cl-results-label">
                  Showing <strong>{filtered.length}</strong> of {collections.length} collections
                  {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
                </p>
              </div>

              {loading ? (
                <div className="cl-state">Loading collections…</div>
              ) : error ? (
                <div className="cl-state" style={{ color: '#b42318' }}>{error}</div>
              ) : filtered.length === 0 ? (
                <div className="cl-state">No collections found. Try a different filter.</div>
              ) : (
                <div className="cl-grid">
                  {filtered.map((collection) => {
                    const img =
                      collection.banner_image ||
                      collection.image_url ||
                      collection.image ||
                      collection.thumbnail ||
                      FALLBACK_IMAGE;
                    const cat = collection.category || deriveCategory(collection.name);

                    return (
                      <Link
                        key={collection.id}
                        to={`/collections/${collection.slug}`}
                        className="cl-card"
                      >
                        <div className="cl-card-img-wrap">
                          <img src={img} alt={collection.name} className="cl-card-img" />
                          <div className="cl-card-overlay" />
                        </div>
                        <div className="cl-card-body">
                          <div className="cl-card-tag">{cat}</div>
                          <h3 className="cl-card-name">{collection.name}</h3>
                          <p className="cl-card-desc">
                            {collection.description || 'Discover handcrafted pieces from this curated collection.'}
                          </p>
                          <div className="cl-card-bottom">
                            <span className="cl-card-count">
                              {collection.product_count != null
                                ? `${collection.product_count} products`
                                : 'View products'}
                            </span>
                            <span className="cl-card-cta">
                              Explore <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}