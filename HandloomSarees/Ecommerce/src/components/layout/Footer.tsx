import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

.ft-root {
  position: relative;
  background: linear-gradient(160deg, #180808 0%, #2a0010 45%, #1a0035 100%);
  color: white;
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}

/* ── decorative elements ── */
.ft-orb-a {
  position: absolute; top: -80px; right: -80px;
  width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(196,152,10,.10) 0%, transparent 65%);
  pointer-events: none;
}
.ft-orb-b {
  position: absolute; bottom: -100px; left: -100px;
  width: 520px; height: 520px; border-radius: 50%;
  background: radial-gradient(circle, rgba(128,0,32,.14) 0%, transparent 65%);
  pointer-events: none;
}
/* gold thread lines */
.ft-thread-a {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.45), transparent);
}
.ft-thread-b {
  position: absolute; top: 80px; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.1), transparent);
}

/* ── WRAP ── */
.ft-wrap {
  max-width: 1280px; margin: 0 auto;
  padding: 72px 56px 0;
  position: relative; z-index: 1;
}
@media(max-width:900px){ .ft-wrap { padding: 56px 24px 0; } }
@media(max-width:480px){ .ft-wrap { padding: 44px 16px 0; } }

/* ── GRID ── */
.ft-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 48px;
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
@media(max-width:1024px){ .ft-grid { grid-template-columns: 1fr 1fr; gap: 36px; } }
@media(max-width:560px)  { .ft-grid { grid-template-columns: 1fr; gap: 32px; } }

/* ── BRAND COLUMN ── */
.ft-brand {}

/* logo mark */
.ft-logo {
  display: flex; align-items: center; gap: 12px;
  text-decoration: none; margin-bottom: 20px;
}
.ft-logo-mark {
  width: 46px; height: 46px; border-radius: 14px;
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 18px rgba(128,0,32,.4);
  flex-shrink: 0;
}
.ft-logo-letter {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 500; color: white; line-height: 1;
}
.ft-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 500; color: white; display: block; line-height: 1; margin-bottom: 3px;
}
.ft-logo-sub {
  font-family: 'Jost'; font-size: 9px; letter-spacing: .22em;
  text-transform: uppercase; color: rgba(196,152,10,.7); display: block;
}

.ft-brand-desc {
  font-family: 'Jost'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.55); line-height: 1.85; margin-bottom: 24px;
}

/* gold divider */
.ft-gd { width: 48px; height: 1px; background: rgba(196,152,10,.5); margin-bottom: 22px; }

/* socials */
.ft-socials { display: flex; gap: 10px; }
.ft-social-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; transition: background .3s, border-color .3s, transform .3s;
}
.ft-social-btn:hover {
  background: rgba(196,152,10,.25); border-color: rgba(196,152,10,.5);
  transform: scale(1.12) translateY(-2px);
}

/* ── COLUMNS ── */
.ft-col-head {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Jost'; font-size: 11px; letter-spacing: .22em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
  margin-bottom: 20px;
}
.ft-col-line { width: 22px; height: 1px; background: rgba(196,152,10,.4); }

.ft-links { list-style: none; padding: 0; margin: 0; }
.ft-links li { margin-bottom: 11px; }
.ft-link {
  font-family: 'Jost'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.5); text-decoration: none;
  transition: color .25s, padding-left .25s;
  display: inline-block;
}
.ft-link:hover { color: #D4AF37; padding-left: 6px; }

/* ── CONTACT ── */
.ft-contact { list-style: none; padding: 0; margin: 0; }
.ft-contact li {
  display: flex; align-items: flex-start; gap: 10px;
  margin-bottom: 14px;
}
.ft-contact-icon { flex-shrink: 0; margin-top: 1px; }
.ft-contact-text {
  font-family: 'Jost'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.5); line-height: 1.55;
}

/* ── BOTTOM BAR ── */
.ft-bottom {
  max-width: 1280px; margin: 0 auto;
  padding: 20px 56px 28px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  position: relative; z-index: 1;
}
@media(max-width:900px){ .ft-bottom { padding: 18px 24px 24px; } }
@media(max-width:480px){ .ft-bottom { padding: 16px 16px 22px; flex-direction: column; text-align: center; } }

.ft-copy {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .06em;
  color: rgba(255,255,255,.3); font-weight: 300;
}
.ft-copy span { color: rgba(196,152,10,.55); }

.ft-bottom-links { display: flex; gap: 20px; }
.ft-bottom-link {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .08em;
  color: rgba(255,255,255,.3); text-decoration: none;
  transition: color .2s;
}
.ft-bottom-link:hover { color: rgba(196,152,10,.7); }

@media(max-width:480px){ .ft-bottom-links { display: none; } }
`;

const SOCIAL_ICONS = [Facebook, Instagram, Twitter, Youtube];

const EXPLORE = ['Shop', 'Silk Collection', 'Cotton Weaves', 'Our Artisans', 'Track Order'];
const SUPPORT  = ['Contact Us', 'Shipping Info', 'Returns Policy', 'FAQ', 'Privacy Policy'];

const CONTACT = [
  { Icon: MapPin, text: 'Bangalore, Karnataka, India' },
  { Icon: Phone,  text: '+91 1800-123-456' },
  { Icon: Mail,   text: 'hello@neygecouture.com' },
];

export function Footer() {
  return (
    <>
      <style>{CSS}</style>
      <footer className="ft-root">
        <div className="ft-orb-a" /><div className="ft-orb-b" />
        <div className="ft-thread-a" /><div className="ft-thread-b" />

        <div className="ft-wrap">
          <div className="ft-grid">

            {/* ── Brand ── */}
            <div className="ft-brand">
              <Link to="/" className="ft-logo">
                <div className="ft-logo-mark">
                  <span className="ft-logo-letter">N</span>
                </div>
                <div>
                  <span className="ft-logo-name">Neyge Couture</span>
                  <span className="ft-logo-sub">Artisan Heritage</span>
                </div>
              </Link>

              <p className="ft-brand-desc">
                Celebrating India's weaving heritage by empowering artisan families
                and delivering timeless elegance — one thread at a time.
              </p>

              <div className="ft-gd" />

              <div className="ft-socials">
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className="ft-social-btn" aria-label="Social link">
                    <Icon size={15} color="rgba(255,255,255,.7)" />
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
                {EXPLORE.map(item => (
                  <li key={item}>
                    <Link to="/" className="ft-link">{item}</Link>
                  </li>
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
                {SUPPORT.map(item => (
                  <li key={item}>
                    <Link to="/" className="ft-link">{item}</Link>
                  </li>
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
                    <Icon size={15} color="#C4980A" className="ft-contact-icon" />
                    <span className="ft-contact-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <span className="ft-copy">
            © {new Date().getFullYear()} <span>Neyge Couture</span> — Empowering artisans, one weave at a time.
          </span>
          <div className="ft-bottom-links">
            {['Terms', 'Privacy', 'Cookies'].map(l => (
              <Link key={l} to="/" className="ft-bottom-link">{l}</Link>
            ))}
          </div>
        </div>

      </footer>
    </>
  );
}