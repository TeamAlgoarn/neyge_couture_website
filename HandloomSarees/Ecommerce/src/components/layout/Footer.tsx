import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/Client_NC_Logo-03.png';
 
// ─── Brand Colors — from PDF brand book color bar ─────────────────────────────
// Color bar order: Navy #1E2460 → Crimson #8B0000 → Pink #F0C4CC → Green #0D2B0D
// Footer uses navy + green (colors 1 and 4) as the primary dark background gradient
 
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
 
/* ─────────────────────────────────────────
   ROOT — CORRECTED: Navy → Green gradient
   Matching brand color bar (colors 1 + 4)
   Navy #1E2460 / navyDeep #12163d / green #0D2B0D
───────────────────────────────────────── */
.ft-root {
  position: relative;
  /* CORRECTED: Navy deep → Navy → Green dark gradient (brand colors 1+4) */
  background: linear-gradient(160deg, #12163d 0%, #1E2460 50%, #0D2B0D 100%);
  color: white;
  overflow: hidden;
  font-family: 'Josefin Sans', sans-serif;
}
 
/* ── Butta-pattern overlay in brand gold (not red) on dark bg ── */
.ft-butta {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='40' cy='40' rx='10' ry='15' fill='none' stroke='rgba(196,152,10,0.12)' stroke-width='1.5'/%3E%3Ccircle cx='40' cy='30' r='3' fill='rgba(196,152,10,0.08)'/%3E%3Cpath d='M32,44 Q40,56 48,44' stroke='rgba(196,152,10,0.10)' stroke-width='1' fill='none'/%3E%3Ccircle cx='24' cy='40' r='1.5' fill='rgba(196,152,10,0.07)'/%3E%3Ccircle cx='56' cy='40' r='1.5' fill='rgba(196,152,10,0.07)'/%3E%3C/svg%3E");
  background-size: 80px 80px;
  pointer-events: none; opacity: 1;
}
 
/* ── Ambient orbs — use brand crimson and gold (not generic colors) ── */
.ft-orb-a {
  position: absolute; top: -100px; right: -80px;
  width: 500px; height: 500px; border-radius: 50%;
  /* CORRECTED: Brand crimson orb */
  background: radial-gradient(circle, rgba(139,0,0,.10) 0%, transparent 65%);
  pointer-events: none;
}
.ft-orb-b {
  position: absolute; bottom: -120px; left: -100px;
  width: 540px; height: 540px; border-radius: 50%;
  /* CORRECTED: Brand green orb (matches gradient end color) */
  background: radial-gradient(circle, rgba(13,43,13,.55) 0%, transparent 65%);
  pointer-events: none;
}
 
/* ── Top border — brand crimson → gold → crimson ── */
.ft-top-border {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  /* CORRECTED: Using brand crimson + gold for the decorative top line */
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(139,0,0,.5) 15%,
    rgba(196,152,10,.6) 50%,
    rgba(139,0,0,.5) 85%,
    transparent 100%
  );
}
 
/* ── Logo image ── */
.ft-logo { display:inline-block; text-decoration:none; margin-bottom:20px; }
.ft-logo-img {
  display:block; height:90px; width:auto; object-fit:contain;
  /* CORRECTED: White invert + gold drop shadow (brand gold accent) */
  filter: brightness(0) invert(1) drop-shadow(0 2px 10px rgba(196,152,10,.22));
  transition: opacity .3s;
}
.ft-logo:hover .ft-logo-img { opacity: .8; }
 
/* ── WRAP ── */
.ft-wrap {
  max-width: 1340px; margin: 0 auto;
  padding: 72px 60px 0;
  position: relative; z-index: 1;
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
  font-family: 'Cinzel', serif; font-size: 10px; font-style: italic;
  letter-spacing: .22em; color: rgba(196,152,10,.6); text-transform: uppercase;
  margin-bottom: 16px; font-weight: 400;
}
 
/* ── Brand description ── */
.ft-brand-desc {
  font-family: 'Josefin Sans'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.48); line-height: 1.88; margin-bottom: 26px;
}
 
/* ── Gold divider ── */
.ft-gd { width: 44px; height: 1px; background: rgba(196,152,10,.45); margin-bottom: 22px; }
 
/* ── Socials — crimson hover on dark bg ── */
.ft-socials { display:flex; gap:10px; }
.ft-social-btn {
  width: 36px; height: 36px;
  background: rgba(245,234,217,.06); border: 1px solid rgba(245,234,217,.12);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; transition: background .3s, border-color .3s, transform .3s;
}
.ft-social-btn:hover {
  /* CORRECTED: Brand crimson hover (not generic dark) */
  background: rgba(139,0,0,.25); border-color: rgba(139,0,0,.5);
  transform: scale(1.12) translateY(-2px);
}
 
/* ── Column heading — brand gold ── */
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
  color: rgba(255,255,255,.45); text-decoration: none;
  letter-spacing: .08em;
  transition: color .25s, padding-left .25s; display: inline-block;
}
/* CORRECTED: Gold hover on dark bg (better contrast than any other color) */
.ft-link:hover { color: #C4980A; padding-left: 6px; }
 
/* ── Contact list ── */
.ft-contact { list-style:none; padding:0; margin:0; }
.ft-contact li { display:flex; align-items:flex-start; gap:11px; margin-bottom:15px; }
.ft-contact-icon { flex-shrink:0; margin-top:1px; }
.ft-contact-text {
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.45); line-height: 1.6; letter-spacing: .04em;
}
 
/* ── Newsletter strip — crimson accent on dark bg ── */
.ft-newsletter {
  margin: 0 -60px; padding: 32px 60px;
  /* CORRECTED: Brand crimson for the newsletter strip (brand color 2) */
  background: rgba(139,0,0,.12); border-top: 1px solid rgba(139,0,0,.25);
  border-bottom: 1px solid rgba(139,0,0,.15);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  flex-wrap: wrap; position: relative; z-index: 1;
}
@media(max-width:900px){ .ft-newsletter { margin:0 -24px; padding:24px 24px; } }
@media(max-width:480px){ .ft-newsletter { margin:0 -16px; padding:20px 16px; flex-direction:column; } }
 
.ft-newsletter-text h4 {
  font-family: 'Cinzel', serif; font-size: 16px; font-weight: 500;
  color: #F5EAD9; letter-spacing: .06em; margin-bottom: 4px;
}
.ft-newsletter-text p {
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.45); letter-spacing: .06em;
}
.ft-newsletter-form {
  display: flex; gap: 0; flex-shrink: 0;
}
.ft-newsletter-input {
  padding: 12px 18px; background: rgba(245,234,217,.08);
  border: 1px solid rgba(245,234,217,.18); border-right: none;
  color: #F5EAD9; font-family: 'Josefin Sans'; font-size: 12px;
  letter-spacing: .08em; outline: none; width: 240px;
}
.ft-newsletter-input::placeholder { color: rgba(245,234,217,.35); }
.ft-newsletter-btn {
  padding: 12px 22px;
  /* CORRECTED: Brand crimson button in newsletter */
  background: #8B0000; color: #F5EAD9;
  border: 1px solid #8B0000;
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .24em;
  font-weight: 600; text-transform: uppercase; cursor: pointer;
  transition: background .3s;
}
.ft-newsletter-btn:hover { background: #6e0012; }
 
/* ── Bottom bar ── */
.ft-bottom {
  max-width: 1340px; margin: 0 auto;
  padding: 20px 60px 30px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; position: relative; z-index: 1;
}
@media(max-width:900px){ .ft-bottom { padding:18px 24px 26px; } }
@media(max-width:480px){ .ft-bottom { padding:16px 16px 22px; flex-direction:column; text-align:center; } }
 
.ft-copy {
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .10em;
  color: rgba(255,255,255,.28); font-weight: 300;
}
/* CORRECTED: Gold for brand name emphasis in copyright (brand accent color) */
.ft-copy em { color: rgba(196,152,10,.5); font-style: normal; }
 
.ft-bottom-links { display:flex; gap:20px; }
.ft-bottom-link {
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .12em;
  color: rgba(255,255,255,.28); text-decoration:none; transition:color .2s;
}
.ft-bottom-link:hover { color: rgba(196,152,10,.65); }
 
/* ── GI / Artisan integrity badge — gold accent ── */
.ft-integrity {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border: 1px solid rgba(196,152,10,.22);
  background: rgba(196,152,10,.06); margin-top: 18px; width: fit-content;
}
.ft-integrity-dot { width: 6px; height: 6px; border-radius: 50%; background: #C4980A; flex-shrink: 0; }
.ft-integrity-text {
  font-family: 'Josefin Sans'; font-size: 9px; letter-spacing: .20em;
  color: rgba(196,152,10,.7); text-transform: uppercase; font-weight: 600;
}
 
/* ── Pink accent bar at very bottom — brand color 3 ── */
.ft-pink-accent {
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(240,196,204,.35) 30%, rgba(240,196,204,.55) 50%, rgba(240,196,204,.35) 70%, transparent 100%);
  position: relative; z-index: 1;
}
 
@media(max-width:480px){ .ft-bottom-links { display:none; } }
`;
 
const SOCIAL_ICONS = [Facebook, Instagram, Twitter, Youtube];
 
const EXPLORE = [
  { label: 'Shop All',         to: '/shop' },
  { label: 'Silk Collection',  to: '/collections/silk' },

  { label: 'Our Artisans',     to: '/about' },
  { label: 'Track Order',      to: '/track' },
];
const SUPPORT = [
  { label: 'Contact Us',       to: '/contact' },
  { label: 'Shipping Info',    to: '/shipping' },
  { label: 'Returns Policy',   to: '/returns' },
  { label: 'FAQ',              to: '/faq' },
  { label: 'Privacy Policy',   to: '/privacy' },
];
const CONTACT = [
  { Icon: MapPin, text: 'Gadag, Karnataka, India — 582103' },
  { Icon: Phone,  text: '+91-9113991711' },
  { Icon: Mail,   text: 'admin@neygecouture.com' },
];
 
export function Footer() {
  return (
    <>
      <style>{CSS}</style>
      <footer className="ft-root">
 
        {/* Decorative layers */}
        <div className="ft-butta" />
        <div className="ft-orb-a" />
        <div className="ft-orb-b" />
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
 
              {/* GI badge — gold accent */}
              <div className="ft-integrity">
                <div className="ft-integrity-dot" />
                <span className="ft-integrity-text">GI Certified · Artisan Integrity Pledge</span>
              </div>
 
              {/* Socials */}
              <div className="ft-socials" style={{ marginTop: 20 }}>
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className="ft-social-btn" aria-label="Social link">
                    <Icon size={15} color="rgba(245,234,217,.65)" strokeWidth={1.5} />
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
                <a href="https://www.neygecouture.com" className="ft-link"
                  style={{ color: 'rgba(196,152,10,.55)', letterSpacing: '.10em' }}>
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
 
        {/* ── Pink accent bar — brand color 3 as subtle closing element ── */}
        <div className="ft-pink-accent" />
 
      </footer>
    </>
  );
}
 