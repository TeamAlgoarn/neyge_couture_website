import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { authService } from '@/lib/auth';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

/* ── ROOT ── */
.hd-root {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  transition: background .45s, box-shadow .45s, padding .35s;
  font-family: 'Jost', sans-serif;
}
.hd-root.top {
  background: rgba(255,249,240,.72);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,.3);
  box-shadow: none;
}
.hd-root.scrolled {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(196,152,10,.22);
  box-shadow: 0 4px 32px rgba(0,0,0,.07);
}

/* ── INNER ── */
.hd-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 0 56px;
  display: flex; align-items: center; justify-content: space-between;
  transition: padding .35s;
}
.hd-root.top    .hd-inner { padding-top: 18px; padding-bottom: 18px; }
.hd-root.scrolled .hd-inner { padding-top: 12px; padding-bottom: 12px; }
@media(max-width:900px){ .hd-inner { padding-left: 24px; padding-right: 24px; } }
@media(max-width:480px){ .hd-inner { padding-left: 16px; padding-right: 16px; } }

/* ── LOGO ── */
.hd-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }

.hd-logo-mark {
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px; overflow: hidden;
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
  box-shadow: 0 4px 18px rgba(128,0,32,.3);
  transition: width .35s, height .35s, border-radius .35s, transform .35s;
}
.hd-root.top    .hd-logo-mark { width: 46px; height: 46px; }
.hd-root.scrolled .hd-logo-mark { width: 38px; height: 38px; border-radius: 10px; }
.hd-logo-mark:hover { transform: scale(1.06); }

.hd-logo-letter {
  font-family: 'Cormorant Garamond', serif;
  color: white; font-weight: 500; line-height: 1;
  transition: font-size .35s;
}
.hd-root.top    .hd-logo-letter { font-size: 22px; }
.hd-root.scrolled .hd-logo-letter { font-size: 18px; }

.hd-logo-text {}
.hd-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500; color: #800020; line-height: 1; display: block;
  transition: font-size .35s;
}
.hd-root.top    .hd-logo-name { font-size: 22px; }
.hd-root.scrolled .hd-logo-name { font-size: 18px; }

.hd-logo-sub {
  font-family: 'Jost'; font-size: 9px; letter-spacing: .22em;
  text-transform: uppercase; color: #9a8070; font-weight: 400;
  display: block; margin-top: 2px;
}

/* ── DESKTOP NAV ── */
.hd-nav {
  display: flex; align-items: center; gap: 32px;
}
@media(max-width:1024px){ .hd-nav { display: none; } }

.hd-nav-link {
  position: relative;
  font-family: 'Jost'; font-size: 12px; letter-spacing: .14em;
  text-transform: uppercase; font-weight: 500;
  color: #4a3828; text-decoration: none;
  transition: color .25s;
  padding-bottom: 2px;
}
.hd-nav-link:hover { color: #800020; }
.hd-nav-link::after {
  content: ''; position: absolute; left: 0; bottom: -2px;
  width: 0; height: 1px; background: #C4980A;
  transition: width .35s cubic-bezier(.4,0,.2,1);
}
.hd-nav-link:hover::after { width: 100%; }

/* ── ICONS ── */
.hd-icons { display: flex; align-items: center; gap: 4px; }

.hd-icon-btn {
  position: relative; width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; cursor: pointer;
  transition: background .25s, transform .2s;
  text-decoration: none; color: #4a3828;
}
.hd-icon-btn:hover { background: rgba(196,152,10,.1); transform: scale(1.08); }

/* Search — hide on mobile */
.hd-search { }
@media(max-width:768px){ .hd-search { display: none; } }

/* badge */
.hd-badge {
  position: absolute; top: -2px; right: -2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: linear-gradient(135deg, #800020, #4B0082);
  color: white; font-family: 'Jost'; font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(128,0,32,.3);
  animation: hdBadgePulse 2.5s ease infinite;
}
@keyframes hdBadgePulse {
  0%,100%{ transform: scale(1); }
  50%{ transform: scale(1.12); }
}

/* hamburger */
.hd-hamburger {
  display: none;
}
@media(max-width:1024px){ .hd-hamburger { display: flex; } }

/* ── MOBILE MENU ── */
.hd-mobile {
  border-top: 1px solid rgba(196,152,10,.2);
  background: rgba(255,249,240,.98); backdrop-filter: blur(18px);
  animation: hdSlide .3s cubic-bezier(.4,0,.2,1);
}
@keyframes hdSlide {
  from{ opacity:0; transform:translateY(-10px); }
  to{ opacity:1; transform:translateY(0); }
}
.hd-mobile-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 12px 24px 18px;
}
@media(max-width:480px){ .hd-mobile-inner { padding: 12px 16px 16px; } }

.hd-mobile-link {
  display: block; padding: 11px 0;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
  text-transform: uppercase; font-weight: 500;
  color: #4a3828; text-decoration: none;
  border-bottom: 1px solid rgba(196,152,10,.12);
  transition: color .2s, padding-left .2s;
}
.hd-mobile-link:last-child { border-bottom: none; }
.hd-mobile-link:hover { color: #800020; padding-left: 8px; }

/* ── GOLD ACCENT LINE (bottom of header) ── */
.hd-root.scrolled::after {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(196,152,10,.35) 35%, rgba(196,152,10,.35) 65%, transparent 100%);
}
`;

const NAV_LINKS = [
  { to: '/',               label: 'Home'           },
  { to: '/shop',           label: 'Shop'           },
  { to: '/video-shopping', label: 'Video Shopping' },
  { to: '/collections/cotton', label: 'Cotton'     },
  { to: '/about',          label: 'Our Artisans'   },
];

const MOBILE_LINKS = [
  { to: '/',               label: 'Home'           },
  { to: '/shop',           label: 'Shop'           },
  { to: '/video-shopping', label: 'Video Shopping' },
  { to: '/collections/silk',   label: 'Silk'       },
  { to: '/collections/cotton', label: 'Cotton'     },
  { to: '/about',          label: 'Our Artisans'   },
];

export function Header() {
  const { getCartCount }                   = useCart();
  const { wishlist }                       = useWishlist();
  const [mobileOpen, setMobileOpen]        = useState(false);
  const [scrolled, setScrolled]            = useState(false);
  const user                               = authService.getCurrentUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <header className={`hd-root ${scrolled ? 'scrolled' : 'top'}`}>

        <div className="hd-inner">

          {/* ── Logo ── */}
          <Link to="/" className="hd-logo">
            <div className="hd-logo-mark">
              <span className="hd-logo-letter">N</span>
            </div>
            <div className="hd-logo-text">
              <span className="hd-logo-name">Neyge Couture</span>
              <span className="hd-logo-sub">Artisan Heritage</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hd-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="hd-nav-link">{label}</Link>
            ))}
          </nav>

          {/* ── Icons ── */}
          <div className="hd-icons">

            <button className="hd-icon-btn hd-search" aria-label="Search">
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

            <button
              className="hd-icon-btn hd-hamburger"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
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