import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from '@/assets/g2.png';
import loomimg from '@/assets/g1.png';
import img3 from '@/assets/g3.png';
import img5 from '@/assets/g5.png';
import img6 from '@/assets/g6.png';
import img7 from '@/assets/g7.png';
import img8 from '@/assets/g8.jpg';
import img9 from '@/assets/g9.png';
import img10 from '@/assets/g10.png';
import img11 from '@/assets/g11.png';
import img12 from '@/assets/g12.png';
import img13 from '@/assets/g13.jpg';
import img14 from '@/assets/g14.png';
import img15 from '@/assets/g15.png';
import img16 from '@/assets/g16.jpg';

// ─── Brand Palette ────────────────────────────────────────────────────────────
const C = {
  maroon: "#800020",
  maroonDark: "#5a0016",
  gold: "#C4980A",        // FIXED: darker gold for better visibility on light bg
  goldVibrant: "#D4AF37",        // brighter gold for dark backgrounds
  goldLight: "#e8c84a",
  goldPale: "rgba(196,152,10,0.12)",
  goldBorder: "rgba(196,152,10,0.35)",
  indigo: "#4B0082",
  cream: "#F5E6D3",
  creamLight: "#FFF9F0",
  creamDark: "#e8d0b8",
  charcoal: "#1a1010",
  warmGrey: "#4a3828",
};

// ─── Typography ───────────────────────────────────────────────────────────────
const T = {
  hero: "clamp(48px, 7.5vw, 80px)",
  h2: "clamp(32px, 4vw, 48px)",
  eyebrow: "11px",
  body: "17px",
  bodyLg: "18px",
  small: "14px",
};

// ─── Image map ────────────────────────────────────────────────────────────────
const IMG = {
  hero: img3,
  loom: loomimg,
  collection1: heroImg,
  collection2: img16,
  artisan: img5,
  artisan2: img6,
  saree1: img5,
  saree2: img6,
  saree3: img13,
  saree4: img14,
  texture: img15,
  videoBg: img12,
  ig1: img7, ig2: img8, ig3: img9,
  ig4: img10, ig5: img11, ig6: img16,
};

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView<T extends Element = HTMLElement>(threshold = 0.12): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .neyge-root {
    font-family: 'Jost', sans-serif;
    background: #FFF9F0;
    color: #1a1010;
    overflow-x: hidden;
    line-height: 1;
  }

  /* ── Eyebrow ── */
  .ey {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C4980A;          /* FIXED: darker gold for visibility */
    font-weight: 600;
  }

  /* ── Divider ── */
  .gd  { width: 56px; height: 1px; background: #C4980A; }
  .gd-c { margin: 0 auto; }

  /* ── Container ── */
  .wrap { max-width: 1320px; margin: 0 auto; padding: 0 56px; }
  @media(max-width: 900px) { .wrap { padding: 0 24px; } }

  /* ── Scroll reveal ── */
  .rv   { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1); }
  .rv.on { opacity:1; transform:translateY(0); }
  .rv-l  { opacity:0; transform:translateX(-48px); transition:opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1); }
  .rv-l.on { opacity:1; transform:translateX(0); }
  .rv-r  { opacity:0; transform:translateX(48px); transition:opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1); }
  .rv-r.on { opacity:1; transform:translateX(0); }
  .d1{transition-delay:.08s!important} .d2{transition-delay:.20s!important}
  .d3{transition-delay:.33s!important} .d4{transition-delay:.46s!important}
  .d5{transition-delay:.60s!important} .d6{transition-delay:.74s!important}

  /* ══════════════════════════════════════════════════════════════
     CHANGE 2: Golden Thread — continuous left-to-right loop
  ══════════════════════════════════════════════════════════════ */
  @keyframes threadMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .thread-track {
    display: flex;
    width: 200%;
    animation: threadMarquee 14s linear infinite;
  }
  .thread-track:hover { animation-play-state: paused; }
  .thread-svg-half {
    width: 50%;
    flex-shrink: 0;
  }

  /* ── In-section SVG flowing threads (Quotes, CTA) ── */
  @keyframes flowRight1 {
    0%   { transform: translateX(-8%); }
    100% { transform: translateX(8%); }
  }
  @keyframes flowRight2 {
    0%   { transform: translateX(6%); }
    100% { transform: translateX(-6%); }
  }
  .flowing-thread-1 { animation: flowRight1 7s ease-in-out infinite alternate; }
  .flowing-thread-2 { animation: flowRight2 9s ease-in-out infinite alternate; }

  /* ══════════════════════════════════════════════════════════════
     CHANGE 1: Instagram Marquee — continuous scroll left→right
  ══════════════════════════════════════════════════════════════ */
  @keyframes igMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .ig-marquee-track {
    display: flex;
    gap: 12px;
    width: max-content;
    animation: igMarquee 22s linear infinite;
  }
  .ig-marquee-track:hover { animation-play-state: paused; }
  .ig-marquee-item {
    width: 280px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 16px;
    cursor: pointer;
    position: relative;
  }
  .ig-marquee-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(.4,0,.2,1);
  }
  .ig-marquee-item:hover img { transform: scale(1.06); }
  .ig-marquee-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background .4s;
    border-radius: 16px;
    pointer-events: none;
  }
  .ig-marquee-item:hover::after { background: rgba(128,0,32,.1); }

  /* ── Other animations ── */
  @keyframes silkMove   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
  @keyframes goldOrb    { 0%,100%{transform:scale(1);opacity:.16} 50%{transform:scale(1.3);opacity:.3} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes crossA     { 0%,42%{opacity:1} 52%,94%{opacity:0} 100%{opacity:1} }
  @keyframes crossB     { 0%,42%{opacity:0} 52%,94%{opacity:1} 100%{opacity:0} }
  @keyframes grain      { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-3%)} 40%{transform:translate(3%,2%)} 60%{transform:translate(-1%,4%)} 80%{transform:translate(2%,-2%)} }
  @keyframes shimmerBtn { 0%{left:-80%} 100%{left:120%} }
  @keyframes goldBlink  { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 28px 4px rgba(212,175,55,.3)} }
  
  /* CHANGE 4: goldShimmer — richer, more visible on light bg */
  @keyframes goldShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* ── Buttons ── */
  .btn-gold {
    display:inline-flex; align-items:center; gap:10px;
    padding:16px 40px;
    background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
    color: #800020;
    border-radius:100px;
    font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
    font-weight:600; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s;
    box-shadow:0 6px 28px rgba(212,175,55,.4);
    position:relative; overflow:hidden;
  }
  .btn-gold::after {
    content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
    animation:shimmerBtn 3s ease infinite;
  }
  .btn-gold:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(212,175,55,.55); }

  .btn-outline-white {
    display:inline-flex; align-items:center; gap:10px;
    padding:15px 38px;
    border:1.5px solid rgba(255,255,255,.75); color:white;
    border-radius:100px;
    font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
    font-weight:500; text-transform:uppercase;
    text-decoration:none; background:transparent;
    transition:transform .4s, background .3s;
  }
  .btn-outline-white:hover { transform:translateY(-3px); background:rgba(255,255,255,.12); }

  .btn-maroon {
    display:inline-flex; align-items:center; gap:10px;
    padding:17px 44px;
    background:linear-gradient(135deg, #800020 0%, #4B0082 100%);
    color:white;
    border-radius:100px;
    font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
    font-weight:600; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s;
    box-shadow:0 6px 28px rgba(128,0,32,.3);
  }
  .btn-maroon:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(128,0,32,.45); }

  .link-gold {
    display:inline-flex; align-items:center; gap:8px;
    color:#C4980A; font-family:'Jost'; font-size:14px;
    letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
    font-weight:600;
    transition:gap .3s, color .3s;
  }
  .link-gold:hover { gap:14px; color:#b8960f; }

  /* ── Saree cards ── */
  .saree-card { cursor:pointer; }
  .saree-card-img {
    overflow:hidden; border-radius:20px; position:relative;
    box-shadow: 0 12px 48px rgba(0,0,0,.14);
  }
  .saree-card-img img {
    width:100%; height:420px; object-fit:cover; display:block;
    transition:transform .85s cubic-bezier(.4,0,.2,1);
  }
  .saree-card:hover .saree-card-img img { transform:scale(1.06); }
  .saree-card-img::after {
    content:''; position:absolute; inset:0; border-radius:20px;
    background:rgba(0,0,0,0); transition:background .5s ease;
    pointer-events:none;
  }
  .saree-card:hover .saree-card-img::after { background:rgba(0,0,0,.06); }

  /* ── Gold badge ── */
  .gold-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(196,152,10,.12); border:1px solid rgba(196,152,10,.35);
    padding:8px 18px; border-radius:100px;
  }

  /* ── Feature tag ── */
  .feat-tag {
    padding:8px 16px; border-radius:100px;
    border:1px solid rgba(196,152,10,.4);
    font-family:'Jost'; font-size:11px; letter-spacing:.10em;
    color:#800020; text-transform:uppercase; background: rgba(196,152,10,.08);
    font-weight:500;
  }

  /* ── SVG Thread path — used for decorative one-off paths ── */
  .thread-path {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    opacity: 0;
    transition: stroke-dashoffset 2.5s cubic-bezier(.4,0,.2,1) .4s, opacity .6s ease .4s;
  }
  .thread-path.on { stroke-dashoffset: 0; opacity: 1; }

  /* ── Grain ── */
  .grain-overlay {
    position:absolute; inset:-100%; width:300%; height:300%; opacity:.12;
    animation:grain 9s steps(8) infinite;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    pointer-events:none;
  }

  /* ── Stat pill ── */
  .stat-pill {
    background:rgba(255,249,240,.97); backdrop-filter:blur(10px);
    border:1px solid rgba(196,152,10,.35); padding:14px 22px; border-radius:14px;
  }

  /* ── Collection ── */
  .col-btn {
    display:inline-block; padding:14px 36px;
    border:1.5px solid rgba(255,255,255,.8); color:white;
    border-radius:100px; text-decoration:none;
    font-family:'Jost'; font-size:13px; letter-spacing:.12em; text-transform:uppercase;
    transition:all .4s cubic-bezier(.4,0,.2,1);
  }
  .col-btn:hover { background:#D4AF37; border-color:#D4AF37; color:#800020; transform:translateY(-3px); }

  /* ── Video player ── */
  .video-wrapper {
    position:relative; border-radius:22px; overflow:hidden;
    box-shadow:0 44px 100px rgba(0,0,0,.22);
  }
  .video-wrapper video, .video-wrapper img {
    width:100%; display:block; aspect-ratio:16/9; object-fit:cover;
  }
  .play-btn {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:80px; height:80px; border-radius:50%;
    background:rgba(255,249,240,.96); border:2px solid rgba(212,175,55,.4);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 10px 40px rgba(0,0,0,.22); cursor:pointer;
    animation:goldBlink 3s ease infinite; transition:transform .3s;
  }
  .play-btn:hover { transform:translate(-50%,-50%) scale(1.08); }

  /* ── Quote card ── */
  .quote-card {
    background:rgba(255,249,240,.7); border:1px solid rgba(196,152,10,.3);
    border-radius:20px; padding:36px 32px;
    backdrop-filter:blur(6px);
    transition:transform .4s, box-shadow .4s, border-color .4s;
  }
  .quote-card:hover {
    transform:translateY(-4px);
    box-shadow:0 20px 60px rgba(196,152,10,.15);
    border-color:rgba(196,152,10,.55);
  }

  /* CHANGE 4: Shimmer text — deeper golds, never washes out on cream */
  .shimmer-text {
    background: linear-gradient(90deg,
      #8a6800 0%,
      #C4980A 25%,
      #e8c84a 45%,
      #C4980A 60%,
      #8a6800 80%,
      #C4980A 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: goldShimmer 4s linear infinite;
  }

  /* ── Responsive ── */
  @media(max-width: 900px) {
    .grid-2  { grid-template-columns:1fr!important; gap:48px!important; }
    .grid-4  { grid-template-columns:1fr 1fr!important; gap:20px!important; }
    .grid-6  { grid-template-columns:repeat(3,1fr)!important; gap:8px!important; }
    .col-block-h { height:60vh!important; }
    .hero-content { padding: 0 20px!important; }
    .hero-btns { flex-direction: column!important; align-items:center!important; }
    .loom-grid { gap: 40px!important; }
  }
  @media(max-width: 600px) {
    .grid-4 { grid-template-columns:1fr!important; }
    .grid-6 { grid-template-columns:1fr 1fr!important; }
    .saree-card-img img { height:280px!important; }
  }
`;

// ─── CHANGE 2: Golden Thread — continuous left-to-right marquee ───────────────
function GoldenThread({ className = "" }) {
  // Two identical SVG halves side by side; the track scrolls left at -50%, looping perfectly
  const pathA = "M0,30 C220,5 330,55 550,30 C770,5 880,55 1100,30 C1210,10 1260,40 1320,30";
  const pathB = "M0,40 C180,15 400,60 660,35 C920,10 1100,55 1320,35";

  const HalfSvg = () => (
    <svg className="thread-svg-half" viewBox="0 0 1320 60" preserveAspectRatio="none"
      style={{ height: 60, display: "block" }}>
      <path d={pathA} stroke="rgba(196,152,10,0.7)" strokeWidth="1.2" fill="none" />
      <path d={pathB} stroke="rgba(196,152,10,0.5)" strokeWidth="0.8" fill="none" />
    </svg>
  );

  return (
    <div className={className}
      style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none" }}>
      <div className="thread-track">
        <HalfSvg />
        <HalfSvg />
      </div>
    </div>
  );
}

// ─── 1. HERO ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: "relative", height: "100vh", minHeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
    }}>
      <img src={IMG.hero} alt="Hero" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center top", display: "block"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(60,0,15,.45) 50%, rgba(0,0,0,.65) 100%)"
      }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "38%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
          animation: "silkMove 15s linear infinite", willChange: "transform"
        }} />
      </div>
      <div style={{
        position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,.18) 0%, transparent 70%)",
        animation: "goldOrb 7s ease-in-out infinite", willChange: "transform,opacity", pointerEvents: "none"
      }} />

      <div className="hero-content" style={{
        position: "relative", zIndex: 2, textAlign: "center",
        color: "white", padding: "0 32px", maxWidth: 860, width: "100%"
      }}>
        <div style={{ animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .15s both" }}>
          <span className="ey" style={{ color: "rgba(212,175,55,0.95)" }}>Handwoven Heritage · Est. 2024</span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: T.hero, fontWeight: 300, lineHeight: 1.06,
          animation: "fadeUp 1.1s cubic-bezier(.4,0,.2,1) .4s both",
          marginTop: 20, marginBottom: 24
        }}>
          Woven by Hand,<br />
          <em style={{ fontStyle: "italic" }}>Worn by Soul</em>
        </h1>
        <div style={{ animation: "fadeUp 1s ease .6s both" }}>
          <div style={{ width: 56, height: 1, background: "#D4AF37", margin: "0 auto 24px", opacity: .75 }} />
        </div>
        <p style={{
          fontFamily: "'Jost'", fontSize: T.bodyLg, fontWeight: 300, lineHeight: 1.75,
          color: "rgba(255,255,255,.85)", maxWidth: 500, margin: "0 auto 44px",
          animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .75s both"
        }}>
          Each saree carries the story of an artisan's love — earthy, intimate, timeless.
        </p>
        <div className="hero-btns" style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) 1s both"
        }}>
          <Link to="/shop" className="btn-gold">Discover the Loom</Link>
          <Link to="/artisans" className="btn-outline-white">Meet the Artisans</Link>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 32, right: 40,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fadeUp 1s ease 1.5s both"
      }}>
        <span style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: ".22em", color: "rgba(255,255,255,.38)", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(212,175,55,.6), transparent)" }} />
      </div>
    </section>
  );
}

// ─── 2. LOOM STORY ───────────────────────────────────────────────────────────
function LoomStory() {
  const [ref, on] = useInView(0.15);
  const [svgRef, sv] = useInView<SVGSVGElement>(0.35);
  return (
    // CHANGE 3: gradient background
    <section ref={ref} style={{
      padding: "120px 0",
      background: "linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%)"
    }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -18, right: -18, width: "56%", height: "56%", border: `1px solid rgba(196,152,10,.35)`, borderRadius: 18, pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.18)" }}>
              <img src={IMG.loom} alt="Handloom weaving" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,175,55,.05) 0%, transparent 55%)", pointerEvents: "none" }} />
            </div>
            <div className="stat-pill" style={{ position: "absolute", bottom: -22, left: -16, zIndex: 2 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.maroon, fontWeight: 500, lineHeight: 1 }}>3 Generations</div>
              <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", color: C.warmGrey, marginTop: 4, textTransform: "uppercase" }}>of weaving mastery</div>
            </div>
            <svg ref={svgRef} style={{ position: "absolute", bottom: -40, right: -32, width: 88, height: 88, overflow: "visible", color: C.gold, zIndex: 2 }} viewBox="0 0 100 100">
              <path className={`thread-path ${sv ? "on" : ""}`} d="M8 88 Q 52 8, 92 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>The Craft</span>
            <h2 className={`rv d2 ${on ? "on" : ""}`}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, lineHeight: 1.12, color: C.maroon }}>
              Every Thread<br />is a Prayer
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
              Our looms are not machines — they are extensions of the artisan's soul. Passed down through generations, the rhythm of the shuttle echoes the heartbeat of rural India.
            </p>
            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
              We work directly with weavers in Bengal, Varanasi, and Odisha, preserving techniques that predate written history. When you wear a Neyge saree, you wear a legacy.
            </p>
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              {[
                ["Zero Power Loom", "Every yarn woven by hand"],
                ["Direct from Weaver", "No middlemen involved"],
                ["Heritage Certified", "Govt GI tag holders"],
                ["Fair Wage Pledge", "Artisan-first economics"]
              ].map(([t, s]) => (
                <div key={t} style={{ background: C.cream, border: `1px solid rgba(196,152,10,.35)`, borderRadius: 12, padding: "13px 15px" }}>
                  <div style={{ fontFamily: "'Jost'", fontSize: 11, color: C.gold, letterSpacing: ".1em", marginBottom: 5, fontWeight: 700 }}>✦ {t}</div>
                  <div style={{ fontFamily: "'Jost'", fontSize: 12, color: C.warmGrey, fontWeight: 400 }}>{s}</div>
                </div>
              ))}
            </div>
            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/artisans" className="link-gold">Read the full loom story <span style={{ fontSize: 16 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. COLLECTION BLOCK ─────────────────────────────────────────────────────
function CollectionBlock({ img, title, subtitle, href }: { img: string; title: string; subtitle: string; href: string }) {
  const [ref, on] = useInView<HTMLDivElement>(0.08);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => {
      const r = el.getBoundingClientRect();
      const progress = -r.top / window.innerHeight;
      const imgEl = el.querySelector("img");
      if (imgEl) imgEl.style.transform = `translateY(${Math.min(Math.max(progress * 9, -8), 8)}%)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div ref={scrollRef} className="col-block-h"
      style={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "115%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 45%, rgba(0,0,0,.35) 100%)" }} />
      <div style={{
        position: "relative", zIndex: 2, height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "flex-end", paddingBottom: 80, textAlign: "center", color: "white"
      }}>
        <span className={`ey rv ${on ? "on" : ""}`} style={{ color: "rgba(212,175,55,.95)", marginBottom: 16 }}>Collection</span>
        <h3 className={`rv d2 ${on ? "on" : ""}`}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,7vw,78px)", fontWeight: 300, lineHeight: 1.06, marginBottom: 16 }}>
          {title}
        </h3>
        <p className={`rv d3 ${on ? "on" : ""}`}
          style={{ fontFamily: "'Jost'", fontSize: 17, fontWeight: 300, color: "rgba(255,255,255,.82)", marginBottom: 40, maxWidth: 460 }}>
          {subtitle}
        </p>
        <div className={`rv d4 ${on ? "on" : ""}`}>
          <Link to={href} className="col-btn">Explore Collection</Link>
        </div>
      </div>
    </div>
  );
}

// ─── 4. ARTISAN SPOTLIGHT ────────────────────────────────────────────────────
function ArtisanSpotlight() {
  const [ref, on] = useInView(0.12);
  return (
    // CHANGE 3: gradient background
    <section ref={ref} id="artisans" style={{
      padding: "120px 0",
      background: "linear-gradient(135deg, #F5E6D3 0%, #EED9C4 40%, #F0E0CE 100%)"
    }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 48px 100px rgba(0,0,0,.2)", aspectRatio: "4/5", position: "relative" }}>
              <img src={IMG.artisan} alt="Artisan" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossA 15s ease-in-out infinite" }} />
              <img src={IMG.artisan2} alt="Artisan 2" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossB 15s ease-in-out infinite" }} />
            </div>
            <div style={{
              position: "absolute", bottom: 24, left: -14,
              background: "rgba(255,249,240,.97)", backdropFilter: "blur(12px)",
              border: `1px solid rgba(196,152,10,.35)`, padding: "13px 20px",
              borderRadius: 100, display: "flex", gap: 10, alignItems: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,.12)"
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D4AF37", flexShrink: 0, animation: "goldBlink 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.maroon, fontWeight: 600 }}>
                Master Weaver · 200+ Yr Legacy
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={`gold-badge rv d1 ${on ? "on" : ""}`} style={{ width: "fit-content" }}>
              <span style={{ color: C.gold, fontSize: 13 }}>♥</span>
              <span className="ey">Artisan Spotlight</span>
            </div>
            <h2 className={`rv d2 ${on ? "on" : ""}`}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12 }}>
              Meet Radha Devi
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <blockquote className={`rv d3 ${on ? "on" : ""}`}
              style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic",
                fontWeight: 400, color: "#3a1818", lineHeight: 1.78,
                borderLeft: `2.5px solid rgba(196,152,10,.4)`, paddingLeft: 22, margin: 0
              }}>
              "I learned to weave from my mother when I was seven. The loom is like a third hand to me. Every saree I make carries a piece of my home — the smell of earth, the sound of peacocks, the warmth of the sun on fresh yarn."
            </blockquote>
            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.85, color: C.warmGrey, fontWeight: 400 }}>
              Radha is one of 43 master weavers we collaborate with in the villages of Murshidabad. Her family has been weaving silk for over 200 years.
            </p>
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[["43", "Artisans"], ["6", "States"], ["200+", "Yr Heritage"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center", padding: "14px 20px", background: "rgba(255,249,240,.8)", border: `1px solid rgba(196,152,10,.35)`, borderRadius: 14 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, color: C.maroon, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.warmGrey, marginTop: 4, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/artisans" className="link-gold">Meet all artisans <span style={{ fontSize: 16 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. FEATURED SAREES ──────────────────────────────────────────────────────
const SAREES = [
  { img: IMG.saree1, name: "Banarasi Silk", region: "Varanasi · Zari Brocade", price: "₹18,500", id: "banarasi-silk" },
  { img: IMG.saree2, name: "Kanchipuram", region: "Tamil Nadu · Pure Silk", price: "₹24,000", id: "kanchipuram" },
  { img: IMG.saree3, name: "Handloom Cotton", region: "Bengal · Block Print", price: "₹8,500", id: "handloom-cotton" },
  { img: IMG.saree4, name: "Patola Ikat", region: "Gujarat · Double Ikat", price: "₹32,000", id: "patola-ikat" },
];

function FeaturedSarees() {
  const [ref, on] = useInView(0.08);
  return (
    // CHANGE 3: gradient background
    <section ref={ref} id="shop" style={{
      padding: "120px 0",
      background: "linear-gradient(180deg, #FFF9F0 0%, #FDF5EA 60%, #F8EEE2 100%)"
    }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="ey" style={{ display: "block", marginBottom: 16 }}>Curated Collection</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, marginBottom: 16 }}>
            Featured Sarees
          </h2>
          <div className="gd gd-c" style={{ marginBottom: 18 }} />
          <p style={{ fontFamily: "'Jost'", fontSize: T.body, color: C.warmGrey, fontWeight: 400, maxWidth: 400, margin: "0 auto" }}>
            Each piece handpicked for its soulful craftsmanship
          </p>
        </div>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {SAREES.map((s, i) => (
            <div key={i} className={`saree-card rv d${i + 1} ${on ? "on" : ""}`}>
              <div className="saree-card-img">
                <img src={s.img} alt={s.name} />
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(212,175,55,.95)", padding: "5px 12px", borderRadius: 100, zIndex: 1
                }}>
                  <span style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: ".1em", color: C.maroon, fontWeight: 700, textTransform: "uppercase" }}>Handloom</span>
                </div>
              </div>
              <div style={{ marginTop: 18, padding: "0 4px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: C.maroon, marginBottom: 5 }}>{s.name}</h3>
                <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".08em", marginBottom: 12, fontWeight: 400 }}>{s.region}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: C.gold }}>{s.price}</span>
                  <Link to={`/product/${s.id}`} className="link-gold" style={{ fontSize: 12 }}>View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Link to="/shop" className="btn-maroon">View All Sarees &nbsp;→</Link>
        </div>
      </div>
    </section>
  );
}

// ─── 6. TEXTURE QUOTE ────────────────────────────────────────────────────────
function TextureQuote() {
  const [ref, on] = useInView(0.18);
  return (
    <section ref={ref} style={{ position: "relative", padding: "150px 24px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={IMG.texture} alt="Texture" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(6,1,1,.60)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(212,175,55,.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><div className="grain-overlay" /></div>
      </div>
      <div className={`rv ${on ? "on" : ""}`}
        style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 40 }}>
          <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,.5))" }} />
          <span style={{ color: "#D4AF37", fontSize: 18 }}>✦</span>
          <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,.5))" }} />
        </div>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,5vw,56px)",
          fontStyle: "italic", fontWeight: 300, color: "white", lineHeight: 1.42
        }}>
          "Handmade is not a trend.<br />It is a truth."
        </blockquote>
        <div style={{ width: 60, height: 1, background: "#D4AF37", margin: "36px auto", opacity: .65 }} />
        <p style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(255,255,255,.38)" }}>
          NEYGE COUTURE · Artisan Soul
        </p>
      </div>
    </section>
  );
}

// ─── 7. VIDEO SHOPPING ───────────────────────────────────────────────────────
function VideoShopping() {
  const [ref, on] = useInView(0.12);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    // CHANGE 3: gradient background
    <section ref={ref} style={{
      padding: "120px 0",
      background: "linear-gradient(135deg, #F5E6D3 0%, #EDD8C2 50%, #F0DFC9 100%)"
    }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 72, alignItems: "center" }}>
          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div className="video-wrapper">
              <video ref={videoRef} src="" poster={IMG.videoBg} controls={playing} playsInline
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              {!playing && (
                <button className="play-btn" onClick={handlePlay} aria-label="Play video">
                  <div style={{ width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: `22px solid ${C.maroon}`, marginLeft: 5 }} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>Premium Service</span>
            <h2 className={`rv d2 ${on ? "on" : ""}`}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12 }}>
              Shop with<br />a Stylist
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
              Not sure which saree tells your story? Book a one-on-one video session with our in-house styling experts. We guide you through drapes, fabrics, and occasions — from the comfort of your home.
            </p>
            <div className={`rv d4 ${on ? "on" : ""}`} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["Draping guidance", "Fabric expertise", "Occasion styling", "Free of charge"].map(t => (
                <span key={t} className="feat-tag">{t}</span>
              ))}
            </div>
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ marginTop: 4 }}>
              <Link to="/video-shopping" className="btn-gold">▶&nbsp; Book a Free Session</Link>
            </div>
            <p className={`rv d6 ${on ? "on" : ""}`} style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".06em", fontWeight: 400 }}>
              Over 3,200 sessions completed · Rated 4.9 ★
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. INSTAGRAM — CHANGE 1: Continuous horizontal marquee ──────────────────
const IG_IMGS = [IMG.ig1, IMG.ig2, IMG.ig3, IMG.ig4, IMG.ig5, IMG.ig6];

function InstagramGrid() {
  const [ref, on] = useInView(0.08);
  // Duplicate the array so the loop is seamless
  const doubled = [...IG_IMGS, ...IG_IMGS];

  return (
    // CHANGE 3: gradient background
    <section ref={ref} style={{
      padding: "112px 0",
      background: "linear-gradient(180deg, #FFF9F0 0%, #FDF6EC 60%, #F8EEE2 100%)"
    }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="ey" style={{ display: "block", marginBottom: 16 }}>Visual Diary</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, marginBottom: 10 }}>
            From Our World
          </h2>
          <p style={{ fontFamily: "'Jost'", fontSize: T.small, color: "#9a8070", letterSpacing: ".12em", fontWeight: 500 }}>@neyge.couture</p>
        </div>
      </div>

      {/* Full-bleed overflow marquee — no padding wrapper */}
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div className="ig-marquee-track">
          {doubled.map((src, i) => (
            <div key={i} className="ig-marquee-item">
              <img src={src} alt={`Gallery ${(i % IG_IMGS.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 36 }}>
        <a href="https://instagram.com/neyge.couture" className="link-gold" target="_blank" rel="noreferrer">
          📷 &nbsp;See more on Instagram →
        </a>
      </div>
    </section>
  );
}

// ─── 9. FINAL CTA ────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "She didn't just wear a saree. She wore six yards of someone's lifetime.", attr: "— A Neyge wearer, Mumbai" },
  { text: "Every knot in this loom is a wish my grandmother wove for her daughters.", attr: "— Radha Devi, Master Weaver" },
  { text: "In a world of fast fashion, we choose to be slow. We choose to be woven.", attr: "— The Neyge Story" },
];

function FinalCTA() {
  const [ref, on] = useInView(0.15);
  const [qRef, qOn] = useInView(0.1);
  return (
    <>
      {/* ── Emotional Quotes Strip ── */}
      <section ref={qRef} style={{
        padding: "100px 0",
        // CHANGE 3: gradient background
        background: "linear-gradient(160deg, #F5E6D3 0%, #EDD8C4 50%, #F0DDCC 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* CHANGE 2: continuously flowing threads via CSS translate animation */}
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", opacity: .18, overflow: "visible"
        }}
          viewBox="0 0 1320 300" preserveAspectRatio="none">
          <path className="flowing-thread-1"
            d="M0,150 C200,60 400,240 660,150 C920,60 1100,240 1320,150"
            stroke="#C4980A" strokeWidth="1.5" fill="none" />
          <path className="flowing-thread-2"
            d="M0,100 C300,180 600,20 900,100 C1100,160 1220,60 1320,100"
            stroke="#C4980A" strokeWidth="1" fill="none" />
        </svg>

        <div className="wrap">
          <div className={`rv ${qOn ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey" style={{ display: "block", marginBottom: 16 }}>Voices & Stories</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon }}>
              Words Woven in Time
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="grid-2">
            {QUOTES.map((q, i) => (
              <div key={i} className={`quote-card rv d${i + 1} ${qOn ? "on" : ""}`}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, lineHeight: .8, color: C.gold, opacity: .5, marginBottom: 12, fontWeight: 600 }}>"</div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontStyle: "italic", fontWeight: 400, color: "#3a1818", lineHeight: 1.72, marginBottom: 20 }}>
                  {q.text}
                </p>
                <div style={{ width: 32, height: 1, background: "rgba(196,152,10,.4)", marginBottom: 12 }} />
                <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".08em", fontWeight: 500 }}>{q.attr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Golden Thread Divider ── */}
      <GoldenThread />

      {/* ── Final CTA ── */}
      <section ref={ref} style={{
        padding: "140px 48px",
        // CHANGE 3: gradient background matching the cream/gold theme
        background: "linear-gradient(160deg, #F8EEE2 0%, #F0DFD0 40%, #EDD8C4 70%, #F5E6D3 100%)",
        textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative rings */}
        <div style={{ position: "absolute", left: "8%", top: "50%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", border: `1px solid rgba(196,152,10,.12)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 320, height: 320, borderRadius: "50%", border: `1px solid rgba(196,152,10,.12)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 680, height: 680, borderRadius: "50%", border: `1px solid rgba(196,152,10,.06)`, pointerEvents: "none" }} />

        {/* CHANGE 2: continuously flowing animated threads */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} viewBox="0 0 1320 500" preserveAspectRatio="none">
          <path className="flowing-thread-1"
            d="M100,250 Q400,80 660,250 Q920,420 1220,250"
            stroke="#C4980A" strokeWidth="0.8" fill="none" opacity=".22" />
          <path className="flowing-thread-2"
            d="M0,350 Q330,150 660,300 Q990,450 1320,200"
            stroke="#C4980A" strokeWidth="0.6" fill="none" opacity=".14" />
        </svg>

        <div className={`rv ${on ? "on" : ""}`}
          style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <span className="ey" style={{ marginBottom: 22 }}>Begin Your Journey</span>

          {/* CHANGE 4: shimmer-text — deep golds never wash out on cream */}
          <h2 className="shimmer-text" style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(60px, 11vw, 118px)",
            fontWeight: 300, lineHeight: .95, letterSpacing: "-.02em", marginBottom: 16
          }}>
            Own a Story.
          </h2>

          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", fontWeight: 300, color: "#5a3c28", marginBottom: 8 }}>
            Six yards. One lifetime.
          </p>

          <p style={{ fontFamily: "'Jost'", fontSize: 13, color: "#7a5c44", letterSpacing: ".06em", fontWeight: 400, maxWidth: 420, textAlign: "center", lineHeight: 1.7, marginBottom: 24 }}>
            "When you drape a Neyge saree, you carry the dreams of the weaver who made it, the love of the artisan who dyed it, and the soul of the land it came from."
          </p>

          <div style={{ width: 60, height: 1, background: "#C4980A", marginBottom: 44, opacity: .6 }} />

          <Link to="/shop" className="btn-gold" style={{ fontSize: 15, padding: "18px 52px" }}>
            Explore Neyge &nbsp;→
          </Link>

          <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a7a60", marginTop: 26, letterSpacing: ".08em" }}>
            Free shipping on orders above ₹5,000 · COD available
          </p>
        </div>
      </section>
    </>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="neyge-root">
        <Hero />

        <GoldenThread />

        <LoomStory />

        <div style={{ marginBottom: 0 }}>
          <CollectionBlock
            img={IMG.collection1}
            title="The Terracotta Weave"
            subtitle="Inspired by the red soil of Bengal — raw, earthy, eternal."
            href="/collections"
          />
        </div>
        <GoldenThread />
        <div style={{ marginBottom: 0 }}>
          <CollectionBlock
            img={IMG.collection2}
            title="Indigo Memories"
            subtitle="Deep blues that tell stories of the night sky over the village."
            href="/collections"
          />
        </div>

        <GoldenThread />

        <ArtisanSpotlight />

        <GoldenThread />

        <FeaturedSarees />

        <GoldenThread />

        <TextureQuote />

        <GoldenThread />

        <VideoShopping />

        <GoldenThread />

        <InstagramGrid />

        <FinalCTA />
      </div>
    </>
  );
}