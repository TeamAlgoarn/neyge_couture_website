import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/Client_NC_Logo-03.png';
import patternBg from '@/assets/Client_NC_Pattern-01.png';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND PALETTE — exact match to HomePage
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

/* ─────────────────────────────────────────
   ROOT — NEW GRADIENT: Maroon deep → Maroon → Navy
   Perfectly matches the dark brand sections (CorePillars navy + FinalCTA maroon)
───────────────────────────────────────── */
.ft-root {
  position: relative;
  background: linear-gradient(160deg, #5a0016 0%, #800020 45%, #1B2A6B 100%);
  color: white;
  overflow: hidden;
  font-family: 'Josefin Sans', sans-serif;
}

/* ── Background pattern image ── */
.ft-butta {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  background-size: 180px 180px;
  background-position: top left;
  opacity: 0.13;
  pointer-events: none;
  z-index: 0;
}

/* ── Ambient orbs — forest green + blush (accents) ── */
.ft-orb-a {
  position: absolute; top: -100px; right: -80px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(20,64,42,.15) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}
.ft-orb-b {
  position: absolute; bottom: -120px; left: -100px;
  width: 540px; height: 540px; border-radius: 50%;
  background: radial-gradient(circle, rgba(242,196,206,.12) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

/* ── Top border — maroon → gold → maroon ── */
.ft-top-border {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(128,0,32,.55) 15%,
    rgba(196,152,10,.65) 50%,
    rgba(128,0,32,.55) 85%,
    transparent 100%
  );
  z-index: 1;
}

/* ── Logo image ── */
.ft-logo { display:inline-block; text-decoration:none; margin-bottom:20px; }
.ft-logo-img {
  display:block; height:90px; width:auto; object-fit:contain;
  filter: brightness(0) invert(1) drop-shadow(0 2px 10px rgba(196,152,10,.20));
  transition: opacity .3s;
}
.ft-logo:hover .ft-logo-img { opacity: .8; }

/* ── WRAP ── */
.ft-wrap {
  max-width: 1340px; margin: 0 auto;
  padding: 72px 64px 0;
  position: relative; z-index: 2;
}
@media(max-width:900px){ .ft-wrap { padding: 56px 24px 0; } }
@media(max-width:480px){ .ft-wrap { padding: 44px 16px 0; } }

/* ── GRID ── */
.ft-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1.3fr;
  gap: 52px;
  padding-bottom: 58px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
@media(max-width:1024px){ .ft-grid { grid-template-columns:1fr 1fr; gap:36px; } }
@media(max-width:560px)  { .ft-grid { grid-template-columns:1fr; gap:30px; } }

/* ── Brand tagline ── */
.ft-tagline {
  font-family: 'Cinzel', serif; font-size: 10px;
  letter-spacing: .22em; color: rgba(196,152,10,.60); text-transform: uppercase;
  margin-bottom: 16px; font-weight: 400;
}

/* ── Brand description ── */
.ft-brand-desc {
  font-family: 'Josefin Sans'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.46); line-height: 1.90; margin-bottom: 26px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.18);
  letter-spacing: .025em;
}

/* ── Gold divider ── */
.ft-gd { width: 44px; height: 1px; background: rgba(196,152,10,.44); margin-bottom: 22px; }

/* ── Socials — maroon hover ── */
.ft-socials { display:flex; gap:10px; }
.ft-social-btn {
  width: 36px; height: 36px;
  background: rgba(255,249,240,.06); border: 1px solid rgba(255,249,240,.12);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; transition: background .3s, border-color .3s, transform .3s;
}
.ft-social-btn:hover {
  background: rgba(128,0,32,.28); border-color: rgba(128,0,32,.55);
  transform: scale(1.12) translateY(-2px);
}

/* ── Column heading ── */
.ft-col-head {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .28em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
  margin-bottom: 22px;
}
.ft-col-line { width: 20px; height: 1px; background: rgba(196,152,10,.38); }

/* ── Nav links ── */
.ft-links { list-style:none; padding:0; margin:0; }
.ft-links li { margin-bottom: 12px; }
.ft-link {
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.44); text-decoration: none;
  letter-spacing: .08em;
  transition: color .25s, padding-left .25s; display: inline-block;
  text-shadow: 0 1px 1px rgba(0,0,0,0.14);
}
.ft-link:hover { color: #C4980A; padding-left: 6px; }

/* ── Contact list ── */
.ft-contact { list-style:none; padding:0; margin:0; }
.ft-contact li { display:flex; align-items:flex-start; gap:11px; margin-bottom:15px; }
.ft-contact-icon { flex-shrink:0; margin-top:1px; }
.ft-contact-text {
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.44); line-height: 1.6; letter-spacing: .04em;
  text-shadow: 0 1px 1px rgba(0,0,0,0.14);
}

/* ── Newsletter strip (maroon tint) ── */
.ft-newsletter {
  margin: 0 -64px; padding: 32px 64px;
  background: rgba(128,0,32,.18); border-top: 1px solid rgba(128,0,32,.32);
  border-bottom: 1px solid rgba(128,0,32,.18);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  flex-wrap: wrap; position: relative; z-index: 2;
}
@media(max-width:900px){ .ft-newsletter { margin:0 -24px; padding:24px 24px; } }
@media(max-width:480px){ .ft-newsletter { margin:0 -16px; padding:20px 16px; flex-direction:column; } }

.ft-newsletter-text h4 {
  font-family: 'Cinzel', serif; font-size: 16px; font-weight: 500;
  color: #F5E6D3; letter-spacing: .06em; margin-bottom: 4px;
}
.ft-newsletter-text p {
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.44); letter-spacing: .06em;
}
.ft-newsletter-form { display: flex; gap: 0; flex-shrink: 0; }
.ft-newsletter-input {
  padding: 12px 18px;
  background: rgba(255,249,240,.08);
  border: 1px solid rgba(255,249,240,.18); border-right: none;
  color: #F5E6D3; font-family: 'Josefin Sans'; font-size: 12px;
  letter-spacing: .08em; outline: none; width: 240px;
}
.ft-newsletter-input::placeholder { color: rgba(245,230,211,.34); }
.ft-newsletter-btn {
  padding: 12px 22px;
  background: #800020; color: #FFF9F0;
  border: 1px solid #800020;
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .22em;
  font-weight: 700; text-transform: uppercase; cursor: pointer;
  transition: background .3s, box-shadow .3s;
}
.ft-newsletter-btn:hover { background: #5a0016; box-shadow: 0 4px 18px rgba(128,0,32,.36); }

/* ── Bottom bar ── */
.ft-bottom {
  max-width: 1340px; margin: 0 auto;
  padding: 20px 64px 30px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; position: relative; z-index: 2;
}
@media(max-width:900px){ .ft-bottom { padding:18px 24px 26px; } }
@media(max-width:480px){ .ft-bottom { padding:16px 16px 22px; flex-direction:column; text-align:center; } }

.ft-copy {
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .10em;
  color: rgba(255,255,255,.26); font-weight: 300;
}
.ft-copy em { color: rgba(196,152,10,.55); font-style: normal; }

.ft-bottom-links { display:flex; gap:20px; }
.ft-bottom-link {
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .12em;
  color: rgba(255,255,255,.26); text-decoration:none; transition:color .2s;
}
.ft-bottom-link:hover { color: rgba(196,152,10,.65); }

/* ── GI / Artisan integrity badge ── */
.ft-integrity {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  border: 1px solid rgba(196,152,10,.22);
  background: rgba(196,152,10,.07); margin-top: 18px; width: fit-content;
}
.ft-integrity-dot { width: 6px; height: 6px; border-radius: 50%; background: #C4980A; flex-shrink: 0; }
.ft-integrity-text {
  font-family: 'Josefin Sans'; font-size: 9px; letter-spacing: .20em;
  color: rgba(196,152,10,.70); text-transform: uppercase; font-weight: 600;
}

/* ── Palette accent bar — Navy | Maroon | Blush | Forest ── */
.ft-palette-bar {
  height: 3px;
  display: flex;
  position: relative; z-index: 2;
  opacity: .55;
}
.ft-palette-bar-navy   { flex: 1; background: #1B2A6B; }
.ft-palette-bar-maroon { flex: 1; background: #800020; }
.ft-palette-bar-blush  { flex: 1; background: #F2C4CE; }
.ft-palette-bar-forest { flex: 1; background: #14402A; }

@media(max-width:480px){ .ft-bottom-links { display:none; } }
`;

const SOCIAL_ICONS = [Facebook, Instagram, Twitter, Youtube];

const EXPLORE = [
  { label: 'Shop All',        to: '/shop'             },
  { label: 'Silk Collection', to: '/collections/silk' },
  { label: 'Our Artisans',    to: '/about'            },
  { label: 'Track Order',     to: '/track'            },
];
const SUPPORT = [
  { label: 'Contact Us',    to: '/contact'  },
  { label: 'Shipping Info', to: '/shipping' },
  { label: 'Returns Policy',to: '/returns'  },
  { label: 'FAQ',           to: '/faq'      },
  { label: 'Privacy Policy',to: '/privacy'  },
];
const CONTACT = [
  { Icon: MapPin, text: 'Gadag, Karnataka, India — 582103' },
  { Icon: Phone,  text: '+91-9113991711'                   },
  { Icon: Mail,   text: 'admin@neygecouture.com'           },
];

export function Footer() {
  return (
    <>
      <style>{CSS}</style>
      <footer className="ft-root">

        {/* Background pattern */}
        <div
          className="ft-butta"
          style={{ backgroundImage: `url(${patternBg})` }}
        />

        {/* Ambient orbs */}
        <div className="ft-orb-a" />
        <div className="ft-orb-b" />

        {/* Top border */}
        <div className="ft-top-border" />

        <div className="ft-wrap">
          <div className="ft-grid">

            {/* ── Brand column ── */}
            <div>
              <Link to="/" className="ft-logo" aria-label="Neyge Couture">
                <img src={logo} alt="Neyge Couture" className="ft-logo-img" draggable={false} />
              </Link>

              <p className="ft-tagline">Crafted Elegance · Est. 2026</p>

              <p className="ft-brand-desc">
                Preserving India's handloom heritage by empowering artisan families
                and delivering timeless sarees — one thread, one soul at a time.
              </p>

              <div className="ft-gd" />

              <div className="ft-integrity">
                <div className="ft-integrity-dot" />
                <span className="ft-integrity-text">GI Certified · Artisan Integrity Pledge</span>
              </div>

              <div className="ft-socials" style={{ marginTop: 20 }}>
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className="ft-social-btn" aria-label="Social link">
                    <Icon size={15} color="rgba(255,249,240,.60)" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Explore ── */}
            <div>
              <div className="ft-col-head">
                <div className="ft-col-line" />
                Explore
              </div>
              <ul className="ft-links">
                {EXPLORE.map(({ label, to }) => (
                  <li key={label}><Link to={to} className="ft-link">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Support ── */}
            <div>
              <div className="ft-col-head">
                <div className="ft-col-line" />
                Support
              </div>
              <ul className="ft-links">
                {SUPPORT.map(({ label, to }) => (
                  <li key={label}><Link to={to} className="ft-link">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div>
              <div className="ft-col-head">
                <div className="ft-col-line" />
                Contact
              </div>
              <ul className="ft-contact">
                {CONTACT.map(({ Icon, text }) => (
                  <li key={text}>
                    <Icon size={14} color="#C4980A" className="ft-contact-icon" strokeWidth={1.5} />
                    <span className="ft-contact-text">{text}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 14 }}>
                <a
                  href="https://www.neygecouture.com"
                  className="ft-link"
                  style={{ color: 'rgba(196,152,10,.55)', letterSpacing: '.10em' }}
                >
                  www.neygecouture.com
                </a>
              </div>
            </div>
          </div>

          {/* ── Newsletter strip ── */}
          <div className="ft-newsletter">
            <div className="ft-newsletter-text">
              <h4>Join the Couture Club</h4>
              <p>New collections, artisan stories &amp; exclusive access — delivered to you.</p>
            </div>
            <div className="ft-newsletter-form">
              <input
                className="ft-newsletter-input"
                type="email"
                placeholder="Your email address"
                aria-label="Email for newsletter"
              />
              <button className="ft-newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <span className="ft-copy">
            © {new Date().getFullYear()} <em>Neyge Couture</em> — Rooted. Refined. Powerful.
          </span>
          <div className="ft-bottom-links">
            {[
              { l: 'Terms',   to: '/terms'   },
              { l: 'Privacy', to: '/privacy' },
              { l: 'Cookies', to: '/cookies' },
            ].map(({ l, to }) => (
              <Link key={l} to={to} className="ft-bottom-link">{l}</Link>
            ))}
          </div>
        </div>

        {/* ── Palette accent bar ── */}
        <div className="ft-palette-bar">
          <div className="ft-palette-bar-navy"   />
          <div className="ft-palette-bar-maroon" />
          <div className="ft-palette-bar-blush"  />
          <div className="ft-palette-bar-forest" />
        </div>

      </footer>
    </>
  );
}