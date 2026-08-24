import craftsmanshipImg from '@/assets/img9.jpg';
import { Sparkles } from 'lucide-react';

const C = {
  maroon: '#800020', maroonDk: '#5a0016',
  gold: '#C4980A', goldV: '#D4AF37',
  cream: '#F5E6D3', creamLt: '#FFF9F0',
  warmGrey: '#4a3828', indigo: '#4B0082',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

.as-root {
  position: relative;
  padding: 100px 0;
  background: linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}

/* background orbs */
.as-orb-a {
  position: absolute; top: -80px; right: -80px;
  width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(128,0,32,.10) 0%, transparent 70%);
  pointer-events: none;
}
.as-orb-b {
  position: absolute; bottom: -80px; left: -80px;
  width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(75,0,130,.09) 0%, transparent 70%);
  pointer-events: none;
}
/* decorative thread lines */
.as-thread {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; overflow: hidden;
}
.as-thread::before {
  content: '';
  position: absolute; top: 30%; left: -10%; width: 120%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.12), transparent);
}
.as-thread::after {
  content: '';
  position: absolute; top: 68%; left: -10%; width: 120%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(128,0,32,.08), transparent);
}

/* ── WRAP ── */
.as-wrap {
  max-width: 1280px; margin: 0 auto;
  padding: 0 56px; position: relative; z-index: 1;
}
@media(max-width:900px){ .as-wrap { padding: 0 24px; } }
@media(max-width:480px){ .as-wrap { padding: 0 16px; } }

/* ── GRID ── */
.as-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
@media(max-width:960px){
  .as-grid { grid-template-columns: 1fr; gap: 56px; }
}

/* ── ANIMATIONS ── */
@keyframes asFadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes asFadeIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes asShimmer  { 0%{left:-80%} 100%{left:120%} }
@keyframes asGoldLine { from{width:0} to{width:48px} }

.as-fadein { animation: asFadeIn  .9s cubic-bezier(.4,0,.2,1) both; }
.as-fadeup { animation: asFadeUp  .9s cubic-bezier(.4,0,.2,1) both; }
.as-d1 { animation-delay: .1s }
.as-d2 { animation-delay: .18s }
.as-d3 { animation-delay: .28s }

/* ── TEXT COLUMN ── */
.as-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.75); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.4);
  padding: 7px 18px; border-radius: 100px;
  margin-bottom: 18px;
}
.as-ey {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .26em;
  text-transform: uppercase; color: #800020; font-weight: 600;
}

.as-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(34px, 4.5vw, 54px);
  font-weight: 400; color: #800020;
  line-height: 1.08; margin-bottom: 22px;
}

.as-gd {
  width: 0; height: 1px; background: #C4980A;
  margin-bottom: 28px;
  animation: asGoldLine .9s .3s cubic-bezier(.4,0,.2,1) forwards;
}

.as-body {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: #4a3828; line-height: 1.85; margin-bottom: 14px;
}

/* ── STATS ── */
.as-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 18px; overflow: hidden;
  margin: 28px 0 36px;
}
.as-stat {
  padding: 20px 16px; text-align: center;
  border-right: 1px solid rgba(196,152,10,.2);
  background: rgba(255,249,240,.8);
  transition: background .25s;
}
.as-stat:last-child { border-right: none; }
.as-stat:hover { background: rgba(255,249,240,1); }
.as-stat-n {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px; font-weight: 500; color: #C4980A;
  line-height: 1; margin-bottom: 5px;
}
.as-stat-l {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .1em;
  text-transform: uppercase; color: #4a3828; font-weight: 400;
}

/* ── CTA BUTTON ── */
.as-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 15px 40px; border: none; border-radius: 100px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .14em;
  font-weight: 600; text-transform: uppercase; cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  position: relative; overflow: hidden;
}
.as-btn::after {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: asShimmer 3s ease infinite;
}
.as-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }

/* ── IMAGE COLUMN ── */
.as-img-col {
  position: relative;
}

/* Gold glow behind image */
.as-img-glow {
  position: absolute; top: -20px; left: -20px;
  width: calc(100% + 40px); height: calc(100% + 40px);
  border-radius: 32px;
  background: rgba(196,152,10,.12);
  filter: blur(32px);
  z-index: 0; pointer-events: none;
}

/* Image frame */
.as-img-frame {
  position: relative; z-index: 1;
  border-radius: 28px; overflow: hidden;
  border: 1px solid rgba(196,152,10,.3);
  box-shadow: 0 28px 80px rgba(0,0,0,.14);
}
.as-img-frame img {
  width: 100%; aspect-ratio: 4 / 5;
  object-fit: cover; display: block;
  transition: transform .8s cubic-bezier(.4,0,.2,1);
}
.as-img-col:hover .as-img-frame img { transform: scale(1.04); }

/* Gold border glow on hover */
.as-img-frame::after {
  content: ''; position: absolute; inset: 0;
  border-radius: 28px;
  border: 1.5px solid transparent;
  transition: border-color .4s;
  pointer-events: none;
}
.as-img-col:hover .as-img-frame::after { border-color: rgba(196,152,10,.55); }

/* Quote card */
.as-quote-card {
  position: absolute; bottom: 28px; right: -16px; z-index: 2;
  background: rgba(255,249,240,.97); backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.3);
  border-radius: 20px; padding: 20px 22px;
  max-width: 260px;
  box-shadow: 0 12px 40px rgba(0,0,0,.12);
}
@media(max-width:960px){ .as-quote-card { right: 12px; } }
@media(max-width:480px){ .as-quote-card { display: none; } }

.as-quote-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; color: rgba(196,152,10,.4);
  line-height: 1; margin-bottom: 6px;
}
.as-quote-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-style: italic;
  color: #4a3828; line-height: 1.6; margin-bottom: 10px;
}
.as-quote-divider {
  width: 32px; height: 1px; background: #C4980A; margin-bottom: 10px;
}
.as-quote-attr {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .1em;
  text-transform: uppercase; color: #800020; font-weight: 600;
}
`;

const STATS = [
  { value: '500+', label: 'Artisan Families'  },
  { value: '15+',  label: 'States Represented' },
  { value: '50+',  label: 'Weaving Techniques' },
];

export function ArtisanStory() {
  return (
    <>
      <style>{CSS}</style>
      <section className="as-root">
        <div className="as-orb-a" />
        <div className="as-orb-b" />
        <div className="as-thread" />

        <div className="as-wrap">
          <div className="as-grid">

            {/* ── Text ── */}
            <div className="as-fadeup">
              <div className="as-badge">
                <Sparkles size={13} color={C.gold} />
                <span className="as-ey">Our Heritage</span>
              </div>

              <h2 className="as-title">
                Empowering<br />Traditional Artisans
              </h2>

              <div className="as-gd" />

              <p className="as-body as-d1">
                Every saree is a living testament to devotion, discipline, and
                generations of artistry. We collaborate directly with master
                weavers to preserve India's textile heritage while ensuring
                fair, sustainable livelihoods.
              </p>
              <p className="as-body as-d2">
                From Kanchipuram's silk looms to Gujarat's khadi workshops,
                each creation carries the soul of craftsmanship.
              </p>

              {/* Stats */}
              <div className="as-stats as-d3">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="as-stat">
                    <div className="as-stat-n">{value}</div>
                    <div className="as-stat-l">{label}</div>
                  </div>
                ))}
              </div>

              <button className="as-btn">
                Meet Our Artisans ✦
              </button>
            </div>

            {/* ── Image ── */}
            <div className="as-img-col as-fadein">
              <div className="as-img-glow" />
              <div className="as-img-frame">
                <img src={craftsmanshipImg} alt="Handloom weaving craftsmanship" />
              </div>
              <div className="as-quote-card">
                <div className="as-quote-mark">"</div>
                <p className="as-quote-text">
                  Each thread carries centuries of heritage and pride.
                </p>
                <div className="as-quote-divider" />
                <span className="as-quote-attr">Master Weaver, Kanchipuram</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}