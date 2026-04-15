import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { authService } from '@/lib/auth';
import logo from '@/assets/Client_NC_Logo-04.png';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.hd-root {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  font-family: 'Josefin Sans', sans-serif;
  transition: background .45s, box-shadow .45s;
}
.hd-root.top {
  background: rgba(255,249,240,0.88);
  backdrop-filter: blur(14px);
}
.hd-root.scrolled {
  background: rgba(255,249,240,0.98);
  backdrop-filter: blur(22px);
  box-shadow: 0 2px 18px rgba(128,0,32,.07);
}

/* ── INNER ROW ── */
.hd-inner {
  max-width: 1340px; margin: 0 auto;
  padding: 0 64px;
  display: flex; align-items: center; justify-content: space-between;
  transition: height .35s ease;
}
.hd-root.top      .hd-inner { height: 100px; }   /* ⬆ was 88px */
.hd-root.scrolled .hd-inner { height: 76px;  }   /* ⬆ was 68px */

@media(max-width:900px)  { .hd-inner { padding-left:24px !important; padding-right:24px !important; } }
@media(max-width:480px)  { .hd-inner { padding-left:16px !important; padding-right:16px !important; } }
@media(max-width:768px)  {
  .hd-root.top      .hd-inner { height: 80px; }  /* ⬆ was 72px */
  .hd-root.scrolled .hd-inner { height: 64px; }  /* ⬆ was 56px */
}
@media(max-width:480px)  {
  .hd-root.top      .hd-inner { height: 68px; }  /* ⬆ was 60px */
  .hd-root.scrolled .hd-inner { height: 58px; }  /* ⬆ was 52px */
}

/* ── LOGO ── */
.hd-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
}
.hd-logo-img {
  display: block;
  width: auto;
  object-fit: contain;
  object-position: center;
  transition: height .35s ease, opacity .3s;
}

/* Desktop — top state */
.hd-root.top      .hd-logo-img { height: 86px;  } /* ⬆ was 64px */
/* Desktop — scrolled state */
.hd-root.scrolled .hd-logo-img { height: 68px;  } /* ⬆ was 52px */

/* Tablet */
@media(max-width:768px) {
  .hd-root.top      .hd-logo-img { height: 64px; } /* ⬆ was 48px */
  .hd-root.scrolled .hd-logo-img { height: 52px; } /* ⬆ was 40px */
}

/* Mobile */
@media(max-width:480px) {
  .hd-root.top      .hd-logo-img { height: 54px; } /* ⬆ was 42px */
  .hd-root.scrolled .hd-logo-img { height: 46px; } /* ⬆ was 36px */
}

.hd-logo:hover .hd-logo-img { opacity: .8; }

/* ── DECORATIVE BORDER ── */
.hd-border {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 10px; pointer-events: none; z-index: 51; overflow: visible;
}
.hd-border::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(128,0,32,.50) 4%,
    rgba(128,0,32,.50) 96%,
    transparent 100%
  );
}
.hd-border-tile {
  position: absolute; top: 1.5px; left: 0; right: 0; bottom: 0;
  background-repeat: repeat-x; background-position: left center; background-size: auto 100%;
}
@keyframes hdShimmer {
  0%   { transform:translateX(-240px); opacity:0; }
  15%  { opacity:1; }
  85%  { opacity:1; }
  100% { transform:translateX(100vw);  opacity:0; }
}
.hd-border-shimmer {
  position: absolute; top: 0; left: 0;
  width: 240px; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(196,152,10,.42) 50%, transparent 100%);
  animation: hdShimmer 5.5s ease-in-out infinite;
  pointer-events: none;
}

/* ── DESKTOP NAV ── */
.hd-nav { display:flex; align-items:center; gap:30px; }
@media(max-width:1024px){ .hd-nav { display:none; } }

.hd-nav-link {
  position: relative;
  font-family: 'Josefin Sans'; font-size: 11px; letter-spacing: .28em;
  text-transform: uppercase; font-weight: 500;
  color: #4a3828; text-decoration: none;
  transition: color .25s; padding-bottom: 2px; white-space: nowrap;
}
.hd-nav-link:hover { color: #800020; }
.hd-nav-link::after {
  content: ''; position: absolute; left: 0; bottom: -2px;
  width: 0; height: 1px;
  background: #C4980A;
  transition: width .35s cubic-bezier(.4,0,.2,1);
}
.hd-nav-link:hover::after { width: 100%; }

.hd-nav-badge {
  display: inline-block; margin-left: 5px;
  padding: 2px 5px;
  background: #800020; color: #FFF9F0;
  font-size: 8px; letter-spacing: .12em; font-weight: 600; text-transform: uppercase;
  vertical-align: middle;
}

/* ── ICON BUTTONS ── */
.hd-icons { display:flex; align-items:center; gap:2px; }

.hd-icon-btn {
  position: relative; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; cursor: pointer;
  transition: background .25s, transform .2s;
  text-decoration: none;
  color: #4a3828;
}
.hd-icon-btn:hover { background: rgba(128,0,32,.08); transform: scale(1.08); }

@media(max-width:768px){ .hd-search { display:none !important; } }

.hd-badge {
  position: absolute; top: -2px; right: -2px;
  width: 17px; height: 17px;
  background: #800020; color: #FFF9F0;
  font-family: 'Josefin Sans'; font-size: 9px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(128,0,32,.28);
  animation: hdPulse 2.5s ease infinite;
}
@keyframes hdPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }

.hd-ham { display:none !important; }
@media(max-width:1024px){ .hd-ham { display:flex !important; } }

/* ── MOBILE MENU ── */
.hd-mobile {
  border-top: 1px solid rgba(128,0,32,.14);
  background: rgba(255,249,240,.99); backdrop-filter: blur(20px);
  animation: hdSlide .28s cubic-bezier(.4,0,.2,1);
}
@keyframes hdSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

.hd-mobile-inner { max-width:1340px; margin:0 auto; padding:10px 24px 18px; }
@media(max-width:480px){ .hd-mobile-inner { padding:8px 16px 16px; } }

.hd-mobile-link {
  display: block; padding: 13px 0;
  font-family: 'Josefin Sans'; font-size: 11px; letter-spacing: .28em;
  text-transform: uppercase; font-weight: 500;
  color: #4a3828; text-decoration: none;
  border-bottom: 1px solid rgba(128,0,32,.09);
  transition: color .2s, padding-left .2s;
}
.hd-mobile-link:last-child { border-bottom: none; }
.hd-mobile-link:hover { color: #800020; padding-left: 10px; }
`;

const TILE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="8.5" viewBox="0 0 32 8.5">
  <rect width="32" height="8.5" fill="#5a0016" opacity="0.08"/>
  <line x1="0" y1="4" x2="32" y2="4" stroke="#C4980A" stroke-width="0.6" opacity="0.40"/>
  <line x1="8" y1="0" x2="8" y2="2.2" stroke="#C4980A" stroke-width="0.8" opacity="0.65"/>
  <polygon points="8,2.2  10.2,4  8,5.8  5.8,4" fill="#800020" stroke="#C4980A" stroke-width="0.3" opacity="0.90"/>
  <polygon points="8,3   9.2,4  8,5   6.8,4" fill="#FFF9F0" opacity="0.30"/>
  <line x1="8" y1="5.8" x2="8" y2="8.5" stroke="#C4980A" stroke-width="0.8" opacity="0.45"/>
  <circle cx="3"  cy="4" r="0.9" fill="#C4980A" opacity="0.55"/>
  <circle cx="13" cy="4" r="0.9" fill="#C4980A" opacity="0.55"/>
  <polygon points="24,0.8  28,4  24,7.2  20,4" fill="#800020" stroke="#C4980A" stroke-width="0.4" opacity="0.85"/>
  <polygon points="24,2.2  26.6,4  24,5.8  21.4,4" fill="#FFF9F0" opacity="0.28"/>
  <polygon points="24,3   25,4  24,5  23,4" fill="#C4980A" opacity="0.80"/>
  <circle cx="17" cy="4" r="0.7" fill="#C4980A" opacity="0.50"/>
  <circle cx="31" cy="4" r="0.7" fill="#C4980A" opacity="0.50"/>
  <circle cx="16" cy="0.8" r="0.55" fill="#C4980A" opacity="0.35"/>
  <circle cx="16" cy="7.7" r="0.55" fill="#C4980A" opacity="0.35"/>
</svg>
`;

const TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(TILE_SVG)}")`;

const NAV_LINKS = [
  { to: '/',               label: 'Home'           },
  { to: '/shop',           label: 'Shop'           },
  { to: '/video-shopping', label: 'Video Shopping' },
  { to: '/about',          label: 'About US'       },
];
const MOBILE_LINKS = [
  { to: '/',                 label: 'Home'           },
  { to: '/shop',             label: 'Shop'           },
  { to: '/video-shopping',   label: 'Video Shopping' },
  // { to: '/collections/silk', label: 'Silk'           },
  { to: '/about',            label: 'About US'       },
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

        <div className="hd-inner">

          {/* ── Logo ── */}
          <Link to="/" className="hd-logo" aria-label="Neyge Couture — Home">
            <img
              src={logo}
              alt="Neyge Couture"
              className="hd-logo-img"
              draggable={false}
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hd-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="hd-nav-link">{label}</Link>
            ))}
          </nav>

          {/* ── Icon row ── */}
          <div className="hd-icons">
            <button className="hd-icon-btn hd-search" style={{ display: 'flex' }} aria-label="Search">
              <Search size={17} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className="hd-icon-btn" aria-label="Wishlist">
              <Heart size={17} strokeWidth={1.5} />
              {wishlist.length > 0 && <span className="hd-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="hd-icon-btn" aria-label="Cart">
              <ShoppingCart size={17} strokeWidth={1.5} />
              {getCartCount() > 0 && <span className="hd-badge">{getCartCount()}</span>}
            </Link>
            <Link to={user ? '/profile' : '/login'} className="hd-icon-btn" aria-label="Account">
              <User size={17} strokeWidth={1.5} />
            </Link>
            <button className="hd-icon-btn hd-ham" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
              {mobileOpen ? <X size={17} strokeWidth={1.5} /> : <Menu size={17} strokeWidth={1.5} />}
            </button>
          </div>

        </div>

        {/* ── Butta-motif border strip ── */}
        <div className="hd-border">
          <div className="hd-border-tile" style={{ backgroundImage: TILE_URL }} />
          <div className="hd-border-shimmer" />
        </div>

        {/* ── Mobile slide-down ── */}
        {mobileOpen && (
          <div className="hd-mobile">
            <div className="hd-mobile-inner">
              {MOBILE_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="hd-mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
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