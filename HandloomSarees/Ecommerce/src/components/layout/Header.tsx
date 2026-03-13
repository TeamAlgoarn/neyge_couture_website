import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { authService } from '@/lib/auth';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

.hd-root {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  font-family: 'Jost', sans-serif;
  transition: background .45s, box-shadow .45s;
}
.hd-root.top      { background: rgba(255,249,240,.86); backdrop-filter: blur(14px); }
.hd-root.scrolled { background: rgba(255,249,240,.97); backdrop-filter: blur(20px); box-shadow: 0 2px 20px rgba(0,0,0,.06); }

.hd-inner {
  max-width: 1320px; margin: 0 auto; padding: 0 56px;
  display: flex; align-items: center; justify-content: space-between;
}
.hd-root.top      .hd-inner { padding-top: 15px; padding-bottom: 15px; }
.hd-root.scrolled .hd-inner { padding-top: 10px; padding-bottom: 10px; }
@media(max-width:900px){ .hd-inner { padding-left:24px !important; padding-right:24px !important; } }
@media(max-width:480px){ .hd-inner { padding-left:16px !important; padding-right:16px !important; } }

/* ════════════════════════════════════════
   SINGLE MERGED BORDER STRIP
   10px tall · position:absolute · zero layout impact
   The SVG tile fuses the zari running pattern
   with tassel diamond tips in one seamless design
════════════════════════════════════════ */
.hd-border {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 10px;
  pointer-events: none;
  z-index: 51;
  overflow: visible;       /* let shimmer spill slightly */
}

/* Top maroon thread */
.hd-border::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(128,0,32,.65) 4%,
    rgba(128,0,32,.65) 96%,
    transparent 100%
  );
}

/* Tiling SVG pattern */
.hd-border-tile {
  position: absolute;
  top: 1.5px; left: 0; right: 0; bottom: 0;
  background-repeat: repeat-x;
  background-position: left center;
  background-size: auto 100%;
}

/* Shimmer sweep */
@keyframes hdShimmer {
  0%   { transform: translateX(-240px); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(100vw);  opacity: 0; }
}
.hd-border-shimmer {
  position: absolute; top: 0; left: 0;
  width: 240px; height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 248, 180, .55) 50%,
    transparent 100%
  );
  animation: hdShimmer 5s ease-in-out infinite;
  pointer-events: none;
}

/* ── LOGO ── */
.hd-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
.hd-logo-mark {
  display:flex; align-items:center; justify-content:center; border-radius:14px;
  background:linear-gradient(135deg,#800020 0%,#5a0016 55%,#4B0082 100%);
  box-shadow:0 4px 18px rgba(128,0,32,.3);
  transition:width .35s,height .35s,border-radius .35s,transform .3s;
}
.hd-root.top     .hd-logo-mark { width:44px; height:44px; }
.hd-root.scrolled .hd-logo-mark { width:36px; height:36px; border-radius:10px; }
.hd-logo-mark:hover { transform:scale(1.06); }
.hd-logo-letter {
  font-family:'Cormorant Garamond',serif; color:white; font-weight:500; line-height:1;
  transition:font-size .35s;
}
.hd-root.top     .hd-logo-letter { font-size:21px; }
.hd-root.scrolled .hd-logo-letter { font-size:17px; }
.hd-logo-name {
  font-family:'Cormorant Garamond',serif; font-weight:500; color:#800020;
  display:block; line-height:1; transition:font-size .35s;
}
.hd-root.top     .hd-logo-name { font-size:21px; }
.hd-root.scrolled .hd-logo-name { font-size:17px; }
.hd-logo-sub {
  font-family:'Jost'; font-size:9px; letter-spacing:.22em;
  text-transform:uppercase; color:#9a8070; display:block; margin-top:2px;
}

/* ── DESKTOP NAV ── */
.hd-nav { display:flex; align-items:center; gap:32px; }
@media(max-width:1024px){ .hd-nav { display:none; } }
.hd-nav-link {
  position:relative; font-family:'Jost'; font-size:12px; letter-spacing:.14em;
  text-transform:uppercase; font-weight:500; color:#4a3828; text-decoration:none;
  transition:color .25s; padding-bottom:2px;
}
.hd-nav-link:hover { color:#800020; }
.hd-nav-link::after {
  content:''; position:absolute; left:0; bottom:-2px;
  width:0; height:1px; background:#C4980A;
  transition:width .35s cubic-bezier(.4,0,.2,1);
}
.hd-nav-link:hover::after { width:100%; }

/* ── ICONS ── */
.hd-icons { display:flex; align-items:center; gap:4px; }
.hd-icon-btn {
  position:relative; width:38px; height:38px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer;
  transition:background .25s,transform .2s; text-decoration:none; color:#4a3828;
}
.hd-icon-btn:hover { background:rgba(196,152,10,.1); transform:scale(1.08); }
@media(max-width:768px){ .hd-search { display:none !important; } }
.hd-badge {
  position:absolute; top:-2px; right:-2px; width:18px; height:18px; border-radius:50%;
  background:linear-gradient(135deg,#800020,#4B0082); color:white;
  font-family:'Jost'; font-size:10px; font-weight:600;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 8px rgba(128,0,32,.3); animation:hdPulse 2.5s ease infinite;
}
@keyframes hdPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
.hd-ham { display:none !important; }
@media(max-width:1024px){ .hd-ham { display:flex !important; } }

/* ── MOBILE MENU ── */
.hd-mobile {
  border-top:1px solid rgba(196,152,10,.18);
  background:rgba(255,249,240,.98); backdrop-filter:blur(18px);
  animation:hdSlide .3s cubic-bezier(.4,0,.2,1);
}
@keyframes hdSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.hd-mobile-inner { max-width:1320px; margin:0 auto; padding:12px 24px 20px; }
@media(max-width:480px){ .hd-mobile-inner { padding:10px 16px 16px; } }
.hd-mobile-link {
  display:block; padding:11px 0; font-family:'Jost'; font-size:13px; letter-spacing:.12em;
  text-transform:uppercase; font-weight:500; color:#4a3828; text-decoration:none;
  border-bottom:1px solid rgba(196,152,10,.12); transition:color .2s,padding-left .2s;
}
.hd-mobile-link:last-child { border-bottom:none; }
.hd-mobile-link:hover { color:#800020; padding-left:8px; }
`;

/*
  MERGED BORDER TILE  —  32 × 8.5 px
  ─────────────────────────────────────────
  The tile is divided into two halves side-by-side:

  LEFT HALF (16px): tassel unit
    • vertical thread from top → to mid
    • a rotated diamond at mid height  ← "tassel tip"
    • horizontal dot run at bottom

  RIGHT HALF (16px): zari geometric
    • large central diamond  ← "zari lozenge"
    • small flanking dots
    • connecting horizontal strokes

  Together they read as one continuous
  saree-border: thread · diamond · thread · lozenge · thread …
  alternating at 16px intervals.

  Colour palette:
    maroon band  #5a0016 @15% opacity — the base weave
    gold thread  #C4980A            — primary pattern
    bright gold  #D4AF37            — accent highlights
    cream        #fff8e8 @40%       — inner diamond fill
*/
const TILE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="8.5" viewBox="0 0 32 8.5">

  <!-- ░░ base band ░░ -->
  <rect width="32" height="8.5" fill="#3a0010" opacity="0.10"/>

  <!-- ── gold running line (mid-height) ── -->
  <line x1="0" y1="4" x2="32" y2="4" stroke="#C4980A" stroke-width="0.6" opacity="0.45"/>

  <!-- ══ LEFT UNIT (x 0–16): tassel ══ -->
  <!-- thread from top to diamond -->
  <line x1="8" y1="0" x2="8" y2="2.2" stroke="#C4980A" stroke-width="0.8" opacity="0.7"/>
  <!-- tassel diamond tip -->
  <polygon points="8,2.2  10.2,4  8,5.8  5.8,4"
           fill="#C4980A" stroke="#D4AF37" stroke-width="0.3" opacity="0.95"/>
  <!-- inner highlight -->
  <polygon points="8,3   9.2,4  8,5   6.8,4"
           fill="#fff8e8" opacity="0.35"/>
  <!-- thread from diamond to bottom -->
  <line x1="8" y1="5.8" x2="8" y2="8.5" stroke="#C4980A" stroke-width="0.8" opacity="0.5"/>
  <!-- flanking dots on mid-line -->
  <circle cx="3"  cy="4" r="0.9" fill="#C4980A" opacity="0.6"/>
  <circle cx="13" cy="4" r="0.9" fill="#C4980A" opacity="0.6"/>

  <!-- ══ RIGHT UNIT (x 16–32): zari lozenge ══ -->
  <!-- large lozenge -->
  <polygon points="24,0.8  28,4  24,7.2  20,4"
           fill="#C4980A" stroke="#D4AF37" stroke-width="0.4" opacity="0.9"/>
  <!-- cream inner fill -->
  <polygon points="24,2.2  26.6,4  24,5.8  21.4,4"
           fill="#fff8e8" opacity="0.3"/>
  <!-- bright gold inner diamond -->
  <polygon points="24,3   25,4  24,5  23,4"
           fill="#D4AF37" opacity="0.85"/>
  <!-- flanking dots -->
  <circle cx="17" cy="4" r="0.7" fill="#D4AF37" opacity="0.55"/>
  <circle cx="31" cy="4" r="0.7" fill="#D4AF37" opacity="0.55"/>
  <!-- corner micro-dots at tile edges -->
  <circle cx="16" cy="0.8" r="0.55" fill="#C4980A" opacity="0.4"/>
  <circle cx="16" cy="7.7" r="0.55" fill="#C4980A" opacity="0.4"/>
</svg>
`;

const TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(TILE_SVG)}")`;

const NAV_LINKS = [
  { to: '/',                   label: 'Home'           },
  { to: '/shop',               label: 'Shop'           },
  { to: '/video-shopping',     label: 'Video Shopping' },
  { to: '/collections/cotton', label: 'Cotton'         },
  { to: '/about',              label: 'Our Artisans'   },
];
const MOBILE_LINKS = [
  { to: '/',                   label: 'Home'           },
  { to: '/shop',               label: 'Shop'           },
  { to: '/video-shopping',     label: 'Video Shopping' },
  { to: '/collections/silk',   label: 'Silk'           },
  { to: '/collections/cotton', label: 'Cotton'         },
  { to: '/about',              label: 'Our Artisans'   },
];

export function Header() {
  const { getCartCount }            = useCart();
  const { wishlist }                = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const user                        = authService.getCurrentUser();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <header className={`hd-root ${scrolled ? 'scrolled' : 'top'}`}>

        {/* Nav */}
        <div className="hd-inner">
          <Link to="/" className="hd-logo">
            <div className="hd-logo-mark"><span className="hd-logo-letter">N</span></div>
            <div>
              <span className="hd-logo-name">Neyge Couture</span>
              <span className="hd-logo-sub">Artisan Heritage</span>
            </div>
          </Link>

          <nav className="hd-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="hd-nav-link">{label}</Link>
            ))}
          </nav>

          <div className="hd-icons">
            <button className="hd-icon-btn hd-search" style={{ display:'flex' }} aria-label="Search">
              <Search size={18} />
            </button>
            <Link to="/wishlist" className="hd-icon-btn" aria-label="Wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="hd-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="hd-icon-btn" aria-label="Cart">
              <ShoppingCart size={18} />
              {getCartCount() > 0 && <span className="hd-badge">{getCartCount()}</span>}
            </Link>
            <Link to={user ? '/profile' : '/login'} className="hd-icon-btn" aria-label="Account">
              <User size={18} />
            </Link>
            <button className="hd-icon-btn hd-ham" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Merged border strip ── */}
        <div className="hd-border">
          <div className="hd-border-tile" style={{ backgroundImage: TILE_URL }} />
          <div className="hd-border-shimmer" />
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="hd-mobile">
            <div className="hd-mobile-inner">
              {MOBILE_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="hd-mobile-link" onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

      </header>
    </>
  );
}