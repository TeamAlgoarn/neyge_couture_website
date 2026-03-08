import { Sparkles } from 'lucide-react';

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  maroon:   "#800020",
  gold:     "#C4980A",
  goldV:    "#D4AF37",
  cream:    "#F5E6D3",
  creamLt:  "#FFF9F0",
  warmGrey: "#4a3828",
  indigo:   "#4B0082",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ap-root {
  font-family: 'Jost', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}

/* ── Wrap ── */
.ap-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 56px;
}
@media(max-width: 900px) { .ap-wrap { padding: 0 24px; } }
@media(max-width: 480px) { .ap-wrap { padding: 0 16px; } }

/* ── Eyebrow ── */
.ap-ey {
  font-family: 'Jost'; font-size: 11px;
  letter-spacing: .25em; text-transform: uppercase;
  color: #C4980A; font-weight: 600;
}

/* ── Dividers ── */
.ap-gd   { width: 56px; height: 1px; background: #C4980A; display: block; }
.ap-gd-c { margin: 0 auto; }

/* ─────────────────────────────
   ANIMATIONS
───────────────────────────── */
@keyframes apFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes apShimmer { 0%{left:-80%} 100%{left:120%} }
@keyframes apOrb     { 0%,100%{transform:scale(1);opacity:.12} 50%{transform:scale(1.25);opacity:.22} }
@keyframes apCounter { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

.ap-fade { animation: apFadeUp .85s cubic-bezier(.4,0,.2,1) both; }
.ap-d0 { animation-delay:0s    }
.ap-d1 { animation-delay:.12s  }
.ap-d2 { animation-delay:.22s  }
.ap-d3 { animation-delay:.33s  }
.ap-d4 { animation-delay:.44s  }

/* ─────────────────────────────
   PAGE HEADER
───────────────────────────── */
.ap-header {
  text-align: center;
  padding: 140px 24px 72px;
  position: relative; overflow: hidden;
}
.ap-header-orb {
  position: absolute; top: 30px; left: 50%; transform: translateX(-50%);
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(196,152,10,.07) 0%, transparent 70%);
  animation: apOrb 9s ease-in-out infinite; pointer-events: none;
}
.ap-header-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
  padding: 8px 20px; border-radius: 100px; margin-bottom: 22px;
}
.ap-header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(34px, 5.5vw, 62px);
  font-weight: 400; line-height: 1.08;
  color: #800020; margin-bottom: 22px;
}
.ap-header-sub {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: #4a3828; line-height: 1.88;
  max-width: 620px; margin: 0 auto;
}

/* ─────────────────────────────
   SECTION BASE
───────────────────────────── */
.ap-section { margin-bottom: 48px; }

/* ─────────────────────────────
   CARD VARIANTS
───────────────────────────── */

/* ── White card (standard prose) ── */
.ap-card {
  background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 28px;
  padding: 52px 56px;
  box-shadow: 0 12px 56px rgba(0,0,0,.07);
  position: relative; overflow: hidden;
}
.ap-card::before {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 180px; height: 180px; border-radius: 50%;
  border: 1px solid rgba(196,152,10,.1); pointer-events: none;
}
@media(max-width: 700px)  { .ap-card { padding: 32px 24px; } }
@media(max-width: 480px)  { .ap-card { padding: 26px 18px; border-radius: 20px; } }

/* ── Card section heading ── */
.ap-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 400; color: #800020; margin-bottom: 10px; line-height: 1.12;
}
.ap-card-title-wrap {
  margin-bottom: 28px;
}

/* ── Body text ── */
.ap-body {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: #4a3828; line-height: 1.88; margin-bottom: 18px;
}
.ap-body:last-child { margin-bottom: 0; }

/* ── Italic pull quote ── */
.ap-pull {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-style: italic; font-weight: 400;
  color: #5a3020; line-height: 1.7;
  padding: 18px 24px;
  border-left: 2.5px solid rgba(196,152,10,.45);
  background: rgba(196,152,10,.05);
  border-radius: 0 12px 12px 0;
  margin-top: 8px;
}

/* ─────────────────────────────
   FEATURE GRID (4-up tiles)
───────────────────────────── */
.ap-feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; margin-top: 28px;
}
@media(max-width: 480px) { .ap-feature-grid { grid-template-columns: 1fr; gap: 12px; } }

.ap-feature-tile {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.28);
  border-radius: 18px; padding: 22px 20px;
  display: flex; align-items: flex-start; gap: 12px;
  transition: transform .35s, box-shadow .35s, border-color .3s;
}
.ap-feature-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(128,0,32,.1);
  border-color: rgba(196,152,10,.5);
}
.ap-feature-icon {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.ap-feature-text {
  font-family: 'Jost'; font-size: 13px; font-weight: 500;
  color: #800020; line-height: 1.5;
}

/* ─────────────────────────────
   TWO-COLUMN LAYOUT (text + quote)
───────────────────────────── */
.ap-two-col {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 28px; align-items: start;
}
@media(max-width: 700px) { .ap-two-col { grid-template-columns: 1fr; } }

/* ─────────────────────────────
   STATS CARD
───────────────────────────── */
.ap-stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 40px;
}
@media(max-width: 600px) { .ap-stats-grid { grid-template-columns: repeat(2, 1fr); } }

.ap-stat {
  text-align: center; padding: 28px 16px;
  border-right: 1px solid rgba(196,152,10,.2);
  border-bottom: 1px solid rgba(196,152,10,.2);
}
.ap-stat:nth-child(4n)  { border-right: none; }
.ap-stat:nth-last-child(-n+4) { border-bottom: none; }
@media(max-width: 600px) {
  .ap-stat:nth-child(2n)    { border-right: none; }
  .ap-stat:nth-child(4n)    { border-right: none; }
  .ap-stat:nth-last-child(-n+2) { border-bottom: none; }
  .ap-stat:nth-child(3),
  .ap-stat:nth-child(4)     { border-bottom: none; }
}
.ap-stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px; font-weight: 500; color: #800020; line-height: 1;
  margin-bottom: 8px;
  animation: apCounter .8s ease both;
}
.ap-stat-lbl {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .12em;
  text-transform: uppercase; color: #9a8070; font-weight: 500;
  line-height: 1.5;
}

/* ─────────────────────────────
   FINAL CTA CARD (dark maroon)
───────────────────────────── */
.ap-cta {
  background: linear-gradient(135deg, #800020 0%, #5a0016 50%, #4B0082 100%);
  border-radius: 28px;
  padding: 72px 56px;
  text-align: center;
  position: relative; overflow: hidden;
  box-shadow: 0 24px 80px rgba(128,0,32,.3);
}
.ap-cta::before {
  content: ''; position: absolute; top: -80px; right: -80px;
  width: 280px; height: 280px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.12); pointer-events: none;
}
.ap-cta::after {
  content: ''; position: absolute; bottom: -100px; left: -80px;
  width: 320px; height: 320px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.08); pointer-events: none;
}
.ap-cta-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(212,175,55,.15); border: 1px solid rgba(212,175,55,.35);
  padding: 7px 18px; border-radius: 100px; margin-bottom: 22px;
}
.ap-cta-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 400; color: white; margin-bottom: 20px; line-height: 1.12;
}
.ap-cta-body {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: rgba(255,255,255,.8); line-height: 1.88;
  max-width: 600px; margin: 0 auto 28px;
}
.ap-cta-italic {
  font-family: 'Cormorant Garamond', serif;
  font-size: 21px; font-style: italic; font-weight: 400;
  color: #D4AF37; line-height: 1.6;
  position: relative; z-index: 1;
}
@media(max-width: 700px)  { .ap-cta { padding: 48px 28px; } }
@media(max-width: 480px)  { .ap-cta { padding: 40px 20px; border-radius: 20px; } }
@media(max-width: 640px) {
  .ap-header { padding-top: 160px; }  /* ← add this */
}
/* ── Section label row (eyebrow + divider) ── */
.ap-section-label {
  display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
}
.ap-section-label-line {
  flex: 1; height: 1px; background: rgba(196,152,10,.2);
}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function ArtisanPage() {
  const FEATURES = [
    { icon: "🧵", text: "Ancient weaving techniques preserved across generations" },
    { icon: "🌿", text: "Sustainable production practices & natural materials"   },
    { icon: "🎨", text: "Cultural storytelling through fabric and colour"         },
    { icon: "♻️", text: "Deep respect for the environment & fair trade"           },
  ];

  const STATS = [
    { num: "500+", lbl: "Artisans Empowered" },
    { num: "12",   lbl: "Weaving Regions"    },
    { num: "100%", lbl: "Handloom Certified" },
    { num: "0",    lbl: "Machine Production" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ap-root">

        {/* ── Page Header ── */}
        <header className="ap-header">
          <div className="ap-header-orb" />

          <div className="ap-fade ap-d0">
            <div className="ap-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="ap-ey">Our Legacy</span>
            </div>
          </div>

          <h1 className="ap-header-title ap-fade ap-d1">
            Weaving Stories,<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Not Just Sarees</em>
          </h1>

          <div className="ap-fade ap-d1" style={{ marginBottom: 22 }}>
            <span className="ap-gd ap-gd-c" />
          </div>

          <p className="ap-header-sub ap-fade ap-d2">
            Every thread carries a legacy. Every weave preserves a tradition.
            Behind every saree lies the skilled hands of master artisans who
            have inherited their craft across generations.
          </p>
        </header>

        {/* ── Sections ── */}
        <div className="ap-wrap" style={{ paddingBottom: 80 }}>

          {/* ── Section 1 — Heritage Meets Craftsmanship ── */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">The Craft</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">Where Heritage Meets Craftsmanship</h2>
                <span className="ap-gd" />
              </div>

              <div className="ap-two-col">
                <div>
                  <p className="ap-body">
                    For centuries, India's weaving communities have preserved techniques
                    passed down through generations. From intricate zari borders to
                    hand-dyed natural fabrics, each saree reflects patience, precision, and pride.
                  </p>
                  <p className="ap-body">
                    Our artisans do not just create garments — they create heirlooms.
                    Every piece is woven on traditional looms, often taking days or even
                    weeks to complete.
                  </p>
                </div>
                <div>
                  <blockquote className="ap-pull">
                    "The rhythm of the loom is not just work — it is tradition in motion."
                  </blockquote>
                  <div style={{ marginTop: 20, padding: '18px 20px', background: 'rgba(196,152,10,.07)', borderRadius: 16, border: '1px solid rgba(196,152,10,.2)' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, color: C.maroon, lineHeight: 1 }}>3 Generations</div>
                    <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '.1em', color: '#9a8070', marginTop: 5, textTransform: 'uppercase', fontWeight: 500 }}>of weaving mastery</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2 — Hands Behind the Heritage ── */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">The Artisans</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">The Hands Behind the Heritage</h2>
                <span className="ap-gd" />
              </div>

              <p className="ap-body">
                Our artisans come from renowned weaving regions across India — where
                craftsmanship is not a profession, but a way of life.
              </p>
              <p className="ap-body">
                Many began learning the art as children, sitting beside their elders,
                understanding the dance between thread and tension.
              </p>

              <div className="ap-feature-grid">
                {FEATURES.map(f => (
                  <div key={f.text} className="ap-feature-tile">
                    <div className="ap-feature-icon">{f.icon}</div>
                    <span className="ap-feature-text">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 3 — Crafting Change ── */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">Our Impact</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">Crafting Change,<br />One Loom at a Time</h2>
                <span className="ap-gd" />
              </div>

              <p className="ap-body">
                When you choose handloom, you support rural artisan families,
                fair wages, ethical sourcing, and the preservation of disappearing crafts.
              </p>

              {/* Stats */}
              <div style={{ border: '1px solid rgba(196,152,10,.2)', borderRadius: 20, overflow: 'hidden', marginTop: 32 }}>
                <div className="ap-stats-grid">
                  {STATS.map((s, i) => (
                    <div key={s.lbl} className="ap-stat" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="ap-stat-num">{s.num}</div>
                      <div className="ap-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 4 — Final CTA ── */}
          <section className="ap-fade ap-d3">
            <div className="ap-cta">
              <div className="ap-cta-eyebrow">
                <Sparkles size={13} color={C.goldV} />
                <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: C.goldV, fontWeight: 600 }}>
                  Our Commitment
                </span>
              </div>
              <h2 className="ap-cta-title">
                A Commitment<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>to Authenticity</em>
              </h2>
              <div style={{ width: 56, height: 1, background: 'rgba(212,175,55,.5)', margin: '0 auto 24px' }} />
              <p className="ap-cta-body">
                Every saree you wear carries a human story — a legacy woven with
                dedication, resilience, and artistry.
              </p>
              <p className="ap-cta-italic">
                "When you drape our sarees, you don't just wear elegance —<br />
                you wear tradition."
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}