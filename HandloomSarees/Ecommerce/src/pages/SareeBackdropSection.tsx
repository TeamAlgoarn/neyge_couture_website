import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// Uses one of the existing project images as the saree fabric backdrop
// Swap `backdropImg` to any saree close-up / texture image in your assets
import backdropImg from '@/assets/g3.png';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

/* ══════════════════════════════════════════
   SAREE BACKDROP SECTION
══════════════════════════════════════════ */
.sb-root {
  position: relative;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}

/* ── Backdrop image ── */
.sb-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  transform: scale(1.04);
  transition: transform 8s cubic-bezier(.4,0,.2,1);
}
.sb-root.visible .sb-img { transform: scale(1); }

/* ── Layered overlay ── */
/* 1. Dark vignette so text always reads */
.sb-overlay-1 {
  position: absolute; inset: 0;
  background: linear-gradient(
    160deg,
    rgba(10,2,2,.82) 0%,
    rgba(128,0,32,.55) 38%,
    rgba(75,0,130,.45) 65%,
    rgba(10,2,2,.88) 100%
  );
}
/* 2. Subtle fabric grain feel */
.sb-overlay-2 {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 3px,
    rgba(196,152,10,.03) 3px,
    rgba(196,152,10,.03) 4px
  );
  pointer-events: none;
}
/* 3. Gold top & bottom border glow */
.sb-overlay-3 {
  position: absolute; inset: 0; pointer-events: none;
}
.sb-overlay-3::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.7), transparent);
}
.sb-overlay-3::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.7), transparent);
}

/* ── Content ── */
.sb-content {
  position: relative; z-index: 2;
  max-width: 900px; margin: 0 auto;
  padding: 100px 56px;
  text-align: center;
  opacity: 0; transform: translateY(32px);
  transition: opacity .9s cubic-bezier(.4,0,.2,1), transform .9s cubic-bezier(.4,0,.2,1);
}
.sb-root.visible .sb-content { opacity: 1; transform: translateY(0); }
@media(max-width:900px){ .sb-content { padding: 80px 32px; } }
@media(max-width:480px){ .sb-content { padding: 64px 20px; } }

/* decorative top ornament */
.sb-ornament {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-bottom: 24px;
}
.sb-orn-line { width: 56px; height: 1px; background: rgba(196,152,10,.55); }
.sb-orn-diamond {
  width: 8px; height: 8px; border-radius: 1px;
  background: #C4980A;
  transform: rotate(45deg);
  box-shadow: 0 0 12px rgba(196,152,10,.5);
}

/* eyebrow badge */
.sb-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(196,152,10,.15); border: 1px solid rgba(196,152,10,.45);
  backdrop-filter: blur(8px);
  padding: 7px 20px; border-radius: 100px; margin-bottom: 22px;
}
.sb-ey {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .28em;
  text-transform: uppercase; color: #D4AF37; font-weight: 600;
}

/* main heading */
.sb-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 7vw, 82px);
  font-weight: 400; color: white;
  line-height: 1.05; margin-bottom: 6px;
  text-shadow: 0 2px 24px rgba(0,0,0,.4);
}
.sb-title-em {
  font-style: italic; color: #D4AF37;
}

/* gold divider */
.sb-gd {
  width: 64px; height: 1.5px;
  background: linear-gradient(90deg, transparent, #C4980A, transparent);
  margin: 22px auto;
}

/* subtitle */
.sb-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(17px, 2.5vw, 22px); font-style: italic;
  color: rgba(255,255,255,.72); line-height: 1.75;
  max-width: 580px; margin: 0 auto 36px; font-weight: 300;
}

/* stat pills */
.sb-stats {
  display: flex; align-items: center; justify-content: center;
  gap: 0; flex-wrap: wrap; margin-bottom: 44px;
}
.sb-stat {
  padding: 14px 28px; text-align: center;
  border-right: 1px solid rgba(196,152,10,.22);
}
.sb-stat:last-child { border-right: none; }
.sb-stat-n {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 500; color: #D4AF37; line-height: 1;
}
.sb-stat-l {
  font-family: 'Jost'; font-size: 10px; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(255,255,255,.45);
  margin-top: 4px; font-weight: 400;
}
@media(max-width:480px){
  .sb-stat { padding: 10px 18px; }
  .sb-stat-n { font-size: 26px; }
}

/* CTA row */
.sb-cta-row {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; flex-wrap: wrap;
}

/* primary gold button */
.sb-btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 44px; border: none; border-radius: 100px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .14em;
  font-weight: 600; text-transform: uppercase; text-decoration: none;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 28px rgba(212,175,55,.4);
  position: relative; overflow: hidden; cursor: pointer;
}
.sb-btn-primary::after {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: sbShimmer 3s ease infinite;
}
.sb-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(212,175,55,.55); }

/* secondary ghost button */
.sb-btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 15px 36px; border-radius: 100px;
  border: 1.5px solid rgba(196,152,10,.5);
  background: rgba(255,255,255,.07); backdrop-filter: blur(8px);
  color: rgba(255,255,255,.85);
  font-family: 'Jost'; font-size: 13px; letter-spacing: .14em;
  font-weight: 500; text-transform: uppercase; text-decoration: none;
  transition: border-color .3s, background .3s, color .3s, transform .35s;
}
.sb-btn-ghost:hover {
  border-color: #D4AF37; color: #D4AF37;
  background: rgba(196,152,10,.1); transform: translateY(-3px);
}

@keyframes sbShimmer { 0%{left:-80%} 100%{left:120%} }

/* ── bottom tassel ornament ── */
.sb-bottom-orn {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: center; align-items: flex-start;
  border-top: 1px solid rgba(196,152,10,.3);
  z-index: 2;
}
.sb-b-tassel { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 40px; }
.sb-b-thread { width: 1px; height: 16px; background: linear-gradient(to bottom, rgba(196,152,10,.55), rgba(196,152,10,.15)); }
.sb-b-bead {
  width: 5px; height: 5px; border-radius: 50%;
  background: radial-gradient(circle at 35% 32%, #e8cc60, #C4980A, #7a6000);
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.sb-b-tassel:nth-child(4n) .sb-b-bead { width: 7px; height: 7px; background: radial-gradient(circle at 35% 32%, #fff0b0, #D4AF37, #8a6800); }
`;

const STATS = [
  { n: '500+',  l: 'Artisan Families'   },
  { n: '200+',  l: 'Saree Styles'       },
  { n: '15+',   l: 'States Represented' },
  { n: '50K+',  l: 'Happy Customers'    },
];

export function SareeBackdropSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className={`sb-root ${visible ? 'visible' : ''}`} ref={ref}>

        {/* Saree fabric backdrop */}
        <img src={backdropImg} alt="" aria-hidden className="sb-img" />

        {/* Overlays */}
        <div className="sb-overlay-1" />
        <div className="sb-overlay-2" />
        <div className="sb-overlay-3" />

        {/* Content */}
        <div className="sb-content">

          {/* ornament */}
          <div className="sb-ornament">
            <div className="sb-orn-line" />
            <div className="sb-orn-diamond" />
            <div className="sb-orn-line" />
          </div>

          {/* badge */}
          <div className="sb-badge" style={{ display: 'inline-flex' }}>
            <Sparkles size={13} color="#D4AF37" />
            <span className="sb-ey">Timeless Craftsmanship</span>
          </div>

          {/* heading */}
          <h2 className="sb-title">
            Woven with<br />
            <span className="sb-title-em">Soul &amp; Tradition</span>
          </h2>

          <div className="sb-gd" />

          {/* subtitle */}
          <p className="sb-sub">
            Every thread tells a story — of master weavers, ancient looms,
            and a heritage passed down through generations across India.
          </p>

          {/* stats */}
          <div className="sb-stats">
            {STATS.map(({ n, l }) => (
              <div key={l} className="sb-stat">
                <div className="sb-stat-n">{n}</div>
                <div className="sb-stat-l">{l}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="sb-cta-row">
            <Link to="/shop" className="sb-btn-primary">
              Shop the Collection <ArrowRight size={15} />
            </Link>
            <Link to="/about" className="sb-btn-ghost">
              Our Artisans
            </Link>
          </div>
        </div>

        {/* Bottom tassel border */}
        <div className="sb-bottom-orn">
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} className="sb-b-tassel">
              <div className="sb-b-thread" />
              <div className="sb-b-bead" />
            </div>
          ))}
        </div>

      </section>
    </>
  );
}