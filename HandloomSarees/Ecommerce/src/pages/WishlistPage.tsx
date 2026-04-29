// import { Link } from 'react-router-dom';
// import { Heart, Sparkles, ArrowRight } from 'lucide-react';
// import { useWishlist } from '@/hooks/useWishlist';
// import { SareeCard } from '@/components/features/SareeCard';

// const C = {
//   maroon: '#800020', gold: '#C4980A', goldV: '#D4AF37',
//   cream: '#F5E6D3', creamLt: '#FFF9F0', warmGrey: '#4a3828',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

// .wl-root {
//   font-family:'Jost',sans-serif;
//   background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
//   min-height:100vh;color:#1a1010;line-height:1;
// }
// .wl-wrap { max-width:1280px;margin:0 auto;padding:0 56px; }
// @media(max-width:900px){.wl-wrap{padding:0 24px;}}
// @media(max-width:480px){.wl-wrap{padding:0 16px;}}

// /* PAGE TOP */
// .wl-page-top{padding-top:140px;padding-bottom:80px;}
// @media(max-width:640px){.wl-page-top{padding-top:110px;padding-bottom:60px;}}

// /* ANIMATIONS */
// @keyframes wlFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
// @keyframes wlFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
// @keyframes wlPop     {from{opacity:0;transform:translateY(28px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
// @keyframes wlPulse   {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.8}}
// @keyframes wlShimmer {0%{left:-80%}100%{left:120%}}

// .wl-fadein{animation:wlFadeIn .8s cubic-bezier(.4,0,.2,1) both;}
// .wl-fadeup{animation:wlFadeUp .8s cubic-bezier(.4,0,.2,1) both;}
// .wl-d1{animation-delay:.1s} .wl-d2{animation-delay:.2s}

// /* EMPTY STATE */
// .wl-empty {
//   min-height:100vh;display:flex;align-items:center;justify-content:center;
//   background:linear-gradient(170deg,#FFF9F0 0%,#F5E6D3 100%);
//   padding:140px 24px 60px;
// }
// @media(max-width:640px){.wl-empty{padding-top:110px;}}
// .wl-empty-inner{text-align:center;max-width:420px;}
// .wl-empty-icon {
//   width:110px;height:110px;border-radius:50%;margin:0 auto 28px;
//   background:rgba(196,152,10,.1);border:1.5px solid rgba(196,152,10,.3);
//   display:flex;align-items:center;justify-content:center;
//   animation:wlPulse 3s ease infinite;
// }
// .wl-empty-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(28px,5vw,44px);font-weight:400;color:#800020;margin-bottom:12px;
// }
// .wl-empty-sub {
//   font-family:'Jost';font-size:14px;font-weight:300;
//   color:#4a3828;line-height:1.75;margin-bottom:32px;
// }

// /* HEADER */
// .wl-header{margin-bottom:44px;}
// .wl-header-badge {
//   display:inline-flex;align-items:center;gap:8px;
//   background:rgba(196,152,10,.12);border:1px solid rgba(196,152,10,.35);
//   padding:7px 18px;border-radius:100px;margin-bottom:16px;
// }
// .wl-header-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(36px,6vw,60px);font-weight:400;color:#800020;
//   line-height:1.06;margin-bottom:10px;
// }
// .wl-header-count {
//   display:flex;align-items:center;gap:8px;
//   font-family:'Jost';font-size:13px;color:#9a8070;font-weight:300;
// }

// /* GRID */
// .wl-grid {
//   display:grid;
//   grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
//   gap:28px;
// }
// @media(max-width:560px){.wl-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}

// /* BOTTOM CTA */
// .wl-cta {
//   margin-top:64px;text-align:center;
// }
// .wl-cta-card {
//   display:inline-block;
//   background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
//   border:1px solid rgba(196,152,10,.25);border-radius:24px;
//   padding:32px 48px;
//   box-shadow:0 8px 36px rgba(0,0,0,.06);
// }
// @media(max-width:480px){.wl-cta-card{padding:24px 28px;}}
// .wl-cta-text {
//   font-family:'Jost';font-size:13px;color:#4a3828;font-weight:300;margin-bottom:14px;
// }
// .wl-cta-divider{width:48px;height:1px;background:#C4980A;margin:0 auto 14px;}

// /* SHARED BUTTON */
// .wl-btn {
//   display:inline-flex;align-items:center;gap:10px;
//   padding:14px 40px;border:none;border-radius:100px;
//   background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
//   color:#800020;font-family:'Jost';font-size:13px;letter-spacing:.12em;
//   font-weight:600;text-transform:uppercase;text-decoration:none;cursor:pointer;
//   transition:transform .35s,box-shadow .35s;
//   box-shadow:0 6px 24px rgba(212,175,55,.38);
//   position:relative;overflow:hidden;
// }
// .wl-btn::after {
//   content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
//   background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
//   animation:wlShimmer 3s ease infinite;
// }
// .wl-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,175,55,.52);}

// .wl-link {
//   display:inline-flex;align-items:center;gap:8px;
//   font-family:'Jost';font-size:12px;letter-spacing:.12em;text-transform:uppercase;
//   color:#800020;font-weight:500;text-decoration:none;transition:color .2s;
// }
// .wl-link:hover{color:#C4980A;}

// .wl-ey {
//   font-family:'Jost';font-size:11px;letter-spacing:.25em;
//   text-transform:uppercase;color:#C4980A;font-weight:600;
// }
// `;

// export function WishlistPage() {
//   const { wishlist } = useWishlist();

//   if (wishlist.length === 0) {
//     return (
//       <>
//         <style>{CSS}</style>
//         <div className="wl-empty">
//           <div className="wl-empty-inner wl-fadeup">
//             <div className="wl-empty-icon">
//               <Heart size={44} color={C.gold} />
//             </div>
//             <div style={{ marginBottom: 8 }}>
//               <span className="wl-ey">Your Favorites</span>
//             </div>
//             <h2 className="wl-empty-title">Your Wishlist is Empty</h2>
//             <p className="wl-empty-sub">
//               Save your favourite sarees to revisit later<br />and keep track of what you love
//             </p>
//             <Link to="/shop" className="wl-btn">
//               Browse Sarees <ArrowRight size={15} />
//             </Link>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="wl-root">
//         <div className="wl-wrap wl-page-top">

//           {/* Header */}
//           <div className="wl-header wl-fadein">
//             <div className="wl-header-badge">
//               <Sparkles size={13} color={C.gold} />
//               <span className="wl-ey">Your Favorites</span>
//             </div>
//             <h1 className="wl-header-title">My Wishlist</h1>
//             <div className="wl-header-count">
//               <Heart size={14} color={C.gold} fill={C.gold} />
//               <span>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</span>
//             </div>
//           </div>

//           {/* Grid */}
//           <div className="wl-grid">
//             {wishlist.map((saree, i) => (
//               <div
//                 key={saree.id}
//                 style={{ animation: `wlPop .6s cubic-bezier(.34,1.56,.64,1) ${i * 0.07}s both` }}
//               >
//                 <SareeCard saree={saree} />
//               </div>
//             ))}
//           </div>

//           {/* Bottom CTA */}
//           <div className="wl-cta wl-fadeup wl-d2">
//             <div className="wl-cta-card">
//               <p className="wl-cta-text">Found everything you love?</p>
//               <div className="wl-cta-divider" />
//               <Link to="/shop" className="wl-link">
//                 Continue Shopping <ArrowRight size={13} />
//               </Link>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect } from 'react'; // 👈 added useEffect
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/utils';

// ─── Brand palette (matches HomePage, CartPage, etc.) ────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  creamDk: '#EDD8C4',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
  forest: '#14402A',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.wl-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.wl-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width:900px){ .wl-wrap { padding: 0 24px; } }
@media(max-width:480px){ .wl-wrap { padding: 0 16px; } }

.wl-page-top {
  padding-top: 140px;
  padding-bottom: 80px;
}
@media(max-width:640px){ .wl-page-top { padding-top: 110px; padding-bottom: 60px; } }

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

@keyframes wlFadeUp {
  from { opacity:0; transform:translateY(22px) }
  to { opacity:1; transform:translateY(0) }
}
@keyframes wlFadeIn {
  from { opacity:0; transform:scale(.96) }
  to { opacity:1; transform:scale(1) }
}
@keyframes wlPulse {
  0%,100% { transform:scale(1); opacity:1 }
  50% { transform:scale(1.06); opacity:.8 }
}

.wl-fadein { animation: wlFadeIn .8s cubic-bezier(.4,0,.2,1) both; }
.wl-fadeup { animation: wlFadeUp .8s cubic-bezier(.4,0,.2,1) both; }

/* Empty state */
.wl-empty {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(170deg, #FFF9F0 0%, #F5E6D3 100%);
  padding: 140px 24px 60px;
}
.wl-empty-inner {
  text-align: center;
  max-width: 420px;
}
.wl-empty-icon {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin: 0 auto 28px;
  background: rgba(196,152,10,.1);
  border: 1.5px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: wlPulse 3s ease infinite;
}
.wl-empty-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 400;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}
.wl-empty-sub {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.75;
  margin-bottom: 32px;
}
/* Button matching btn-gold */
.wl-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 38px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Josefin Sans';
  font-size: 10px;
  letter-spacing: .22em;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 100px;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 5px 24px rgba(196,152,10,.32);
}
.wl-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(196,152,10,.48);
}

/* Header */
.wl-header {
  margin-bottom: 44px;
}
.wl-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.35);
  padding: 7px 18px;
  border-radius: 100px;
  margin-bottom: 16px;
}
.wl-header-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 400;
  color: #800020;
  line-height: 1.06;
  margin-bottom: 10px;
  letter-spacing: 0.04em;
}
.wl-header-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #9a8070;
  font-weight: 300;
}

/* Grid & Card (matches home page product cards) */
.wl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media(max-width:1100px){ .wl-grid { grid-template-columns: repeat(3, 1fr); } }
@media(max-width:820px){ .wl-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width:520px){ .wl-grid { grid-template-columns: 1fr; } }

.wl-card {
  background: rgba(255,249,240,.96);
  border: 1px solid rgba(196,152,10,.18);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0,0,0,.05);
  transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
  display: flex;
  flex-direction: column;
}
.wl-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 44px rgba(0,0,0,.12);
  border-color: rgba(196,152,10,.4);
}
.wl-card-img-wrap {
  aspect-ratio: 3/4;
  background: #f1e4d2;
  overflow: hidden;
  position: relative;
}
.wl-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .6s ease;
}
.wl-card:hover .wl-card-img { transform: scale(1.06); }
.wl-card-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1e4d2;
  color: #C4980A;
  font-family: 'Cinzel', serif;
  font-size: 14px;
}
.wl-card-body {
  padding: 18px 18px 20px;
  background: white;
}
.wl-fabric {
  font-family: 'Josefin Sans';
  font-size: 10px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(128,0,32,.7);
  font-weight: 600;
  margin-bottom: 6px;
}
.wl-name {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 500;
  color: #800020;
  line-height: 1.2;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.wl-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
}
.wl-price {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 600;
  color: #800020;
}
.wl-stock {
  font-family: 'Josefin Sans';
  font-size: 11px;
  color: #059669;
  font-weight: 500;
}
.wl-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.wl-view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 100px;
  padding: 12px 18px;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  transition: transform .3s, box-shadow .3s;
}
.wl-view-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212,175,55,.4); }
.wl-remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid rgba(200,50,50,.4);
  border-radius: 100px;
  padding: 11px 18px;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  font-weight: 600;
  background: transparent;
  color: #c0392b;
  cursor: pointer;
  transition: background .25s, color .25s, transform .2s;
}
.wl-remove-btn:hover { background: #c0392b; color: white; transform: scale(1.02); }
.wl-remove-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

/* CTA section */
.wl-cta {
  margin-top: 64px;
  text-align: center;
}
.wl-cta-card {
  display: inline-block;
  background: rgba(255,249,240,.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 24px;
  padding: 32px 48px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}
.wl-cta-text {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
  font-weight: 300;
  margin-bottom: 14px;
}
.wl-cta-divider {
  width: 48px;
  height: 1px;
  background: #C4980A;
  margin: 0 auto 14px;
}
.wl-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Josefin Sans';
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #800020;
  font-weight: 500;
  text-decoration: none;
  transition: gap .25s;
}
.wl-link:hover { gap: 12px; color: #C4980A; }
`;

export function WishlistPage() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (sareeId: string) => {
    if (removingId === sareeId) return;

    try {
      setRemovingId(sareeId);
      await removeFromWishlist(sareeId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="wl-empty">
          <div className="wl-empty-inner wl-fadeup">
            <div className="wl-empty-icon">
              <Heart size={44} color={C.gold} />
            </div>
            <h2 className="wl-empty-title">Loading Wishlist...</h2>
          </div>
        </div>
      </>
    );
  }

  if (wishlist.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="wl-empty">
          <div className="wl-empty-inner wl-fadeup">
            <div className="wl-empty-icon">
              <Heart size={44} color={C.gold} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="ey">Your Favorites</span>
            </div>
            <h2 className="wl-empty-title">Your Wishlist is Empty</h2>
            <p className="wl-empty-sub">
              Save your favourite sarees to revisit later
              <br />
              and keep track of what you love
            </p>
            <Link to="/shop" className="wl-btn">
              Browse Sarees <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="wl-root">
        <div className="wl-wrap wl-page-top">
          <div className="wl-header wl-fadein">
            <div className="wl-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="ey">Your Favorites</span>
            </div>

            <h1 className="wl-header-title">My Wishlist</h1>
            <div className="gd" style={{ marginTop: 8, marginBottom: 12 }} />

            <div className="wl-header-count">
              <Heart size={14} color={C.gold} fill={C.gold} />
              <span>
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </span>
            </div>
          </div>

          <div className="wl-grid">
            {wishlist.map((saree, i) => {
              const cardImage = saree.image || saree.images?.[0] || '';
              const productLink = `/product/${saree.slug || saree.id}`;
              const outOfStock = saree.stock <= 0;

              return (
                <div
                  key={saree.id}
                  className="wl-card"
                  style={{ animation: `wlFadeUp .6s ease ${i * 0.06}s both` }}
                >
                  <Link to={productLink} className="wl-card-img-wrap">
                    {cardImage ? (
                      <img
                        src={cardImage}
                        alt={saree.name}
                        className="wl-card-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="wl-card-fallback"
                      style={{ display: cardImage ? 'none' : 'flex' }}
                    >
                      No Image
                    </div>
                  </Link>

                  <div className="wl-card-body">
                    <div className="wl-fabric">{saree.fabric || 'Handloom'}</div>
                    <div className="wl-name">{saree.name}</div>

                    <div className="wl-price-row">
                      <div className="wl-price">{formatCurrency(saree.price || 0)}</div>
                      <div className="wl-stock">
                        {outOfStock ? 'Out of stock' : `${saree.stock} left`}
                      </div>
                    </div>

                    <div className="wl-actions">
                      <Link to={productLink} className="wl-view-btn">
                        View Product
                      </Link>

                      <button
                        className="wl-remove-btn"
                        onClick={() => handleRemove(saree.id)}
                        disabled={removingId === saree.id}
                      >
                        <Trash2 size={14} />
                        {removingId === saree.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wl-cta wl-fadeup">
            <div className="wl-cta-card">
              <p className="wl-cta-text">Found everything you love?</p>
              <div className="wl-cta-divider" />
              <Link to="/shop" className="wl-link">
                Continue Shopping <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}