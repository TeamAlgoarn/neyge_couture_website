import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { SareeCard } from '@/components/features/SareeCard';

const C = {
  maroon: '#800020', gold: '#C4980A', goldV: '#D4AF37',
  cream: '#F5E6D3', creamLt: '#FFF9F0', warmGrey: '#4a3828',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.wl-root {
  font-family:'Jost',sans-serif;
  background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
  min-height:100vh;color:#1a1010;line-height:1;
}
.wl-wrap { max-width:1280px;margin:0 auto;padding:0 56px; }
@media(max-width:900px){.wl-wrap{padding:0 24px;}}
@media(max-width:480px){.wl-wrap{padding:0 16px;}}

/* PAGE TOP */
.wl-page-top{padding-top:140px;padding-bottom:80px;}
@media(max-width:640px){.wl-page-top{padding-top:110px;padding-bottom:60px;}}

/* ANIMATIONS */
@keyframes wlFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes wlFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes wlPop     {from{opacity:0;transform:translateY(28px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes wlPulse   {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.8}}
@keyframes wlShimmer {0%{left:-80%}100%{left:120%}}

.wl-fadein{animation:wlFadeIn .8s cubic-bezier(.4,0,.2,1) both;}
.wl-fadeup{animation:wlFadeUp .8s cubic-bezier(.4,0,.2,1) both;}
.wl-d1{animation-delay:.1s} .wl-d2{animation-delay:.2s}

/* EMPTY STATE */
.wl-empty {
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(170deg,#FFF9F0 0%,#F5E6D3 100%);
  padding:140px 24px 60px;
}
@media(max-width:640px){.wl-empty{padding-top:110px;}}
.wl-empty-inner{text-align:center;max-width:420px;}
.wl-empty-icon {
  width:110px;height:110px;border-radius:50%;margin:0 auto 28px;
  background:rgba(196,152,10,.1);border:1.5px solid rgba(196,152,10,.3);
  display:flex;align-items:center;justify-content:center;
  animation:wlPulse 3s ease infinite;
}
.wl-empty-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(28px,5vw,44px);font-weight:400;color:#800020;margin-bottom:12px;
}
.wl-empty-sub {
  font-family:'Jost';font-size:14px;font-weight:300;
  color:#4a3828;line-height:1.75;margin-bottom:32px;
}

/* HEADER */
.wl-header{margin-bottom:44px;}
.wl-header-badge {
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(196,152,10,.12);border:1px solid rgba(196,152,10,.35);
  padding:7px 18px;border-radius:100px;margin-bottom:16px;
}
.wl-header-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,6vw,60px);font-weight:400;color:#800020;
  line-height:1.06;margin-bottom:10px;
}
.wl-header-count {
  display:flex;align-items:center;gap:8px;
  font-family:'Jost';font-size:13px;color:#9a8070;font-weight:300;
}

/* GRID */
.wl-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:28px;
}
@media(max-width:560px){.wl-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}

/* BOTTOM CTA */
.wl-cta {
  margin-top:64px;text-align:center;
}
.wl-cta-card {
  display:inline-block;
  background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
  border:1px solid rgba(196,152,10,.25);border-radius:24px;
  padding:32px 48px;
  box-shadow:0 8px 36px rgba(0,0,0,.06);
}
@media(max-width:480px){.wl-cta-card{padding:24px 28px;}}
.wl-cta-text {
  font-family:'Jost';font-size:13px;color:#4a3828;font-weight:300;margin-bottom:14px;
}
.wl-cta-divider{width:48px;height:1px;background:#C4980A;margin:0 auto 14px;}

/* SHARED BUTTON */
.wl-btn {
  display:inline-flex;align-items:center;gap:10px;
  padding:14px 40px;border:none;border-radius:100px;
  background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
  color:#800020;font-family:'Jost';font-size:13px;letter-spacing:.12em;
  font-weight:600;text-transform:uppercase;text-decoration:none;cursor:pointer;
  transition:transform .35s,box-shadow .35s;
  box-shadow:0 6px 24px rgba(212,175,55,.38);
  position:relative;overflow:hidden;
}
.wl-btn::after {
  content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
  animation:wlShimmer 3s ease infinite;
}
.wl-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,175,55,.52);}

.wl-link {
  display:inline-flex;align-items:center;gap:8px;
  font-family:'Jost';font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:#800020;font-weight:500;text-decoration:none;transition:color .2s;
}
.wl-link:hover{color:#C4980A;}

.wl-ey {
  font-family:'Jost';font-size:11px;letter-spacing:.25em;
  text-transform:uppercase;color:#C4980A;font-weight:600;
}
`;

export function WishlistPage() {
  const { wishlist } = useWishlist();

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
              <span className="wl-ey">Your Favorites</span>
            </div>
            <h2 className="wl-empty-title">Your Wishlist is Empty</h2>
            <p className="wl-empty-sub">
              Save your favourite sarees to revisit later<br />and keep track of what you love
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

          {/* Header */}
          <div className="wl-header wl-fadein">
            <div className="wl-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="wl-ey">Your Favorites</span>
            </div>
            <h1 className="wl-header-title">My Wishlist</h1>
            <div className="wl-header-count">
              <Heart size={14} color={C.gold} fill={C.gold} />
              <span>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</span>
            </div>
          </div>

          {/* Grid */}
          <div className="wl-grid">
            {wishlist.map((saree, i) => (
              <div
                key={saree.id}
                style={{ animation: `wlPop .6s cubic-bezier(.34,1.56,.64,1) ${i * 0.07}s both` }}
              >
                <SareeCard saree={saree} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="wl-cta wl-fadeup wl-d2">
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