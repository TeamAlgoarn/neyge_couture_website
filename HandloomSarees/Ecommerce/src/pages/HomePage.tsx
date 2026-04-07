import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from '@/assets/bd3.png';
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

// ─── Brand Palette — CORRECTED from Neyge Couture Brand Book PDF ─────────────
// Color bar (final page): Navy → Crimson → Pink → Green
// These are the exact 4 brand colors. Gold/Cream are supporting accents only.
const C = {
  // PRIMARY BRAND COLORS (exact from brand book color bar)
  navy:         "#1E2460",       // Primary dark — hero, artisan section, instagram, CTA
  navyDeep:     "#12163d",       // Deeper navy for gradients
  navyLight:    "#252b72",       // Lighter navy tone
  crimson:      "#8B0000",       // Primary brand red — logo, headings, accents
  crimsonDeep:  "#6e0012",       // Darker crimson for button hover
  pink:         "#F0C4CC",       // Brand blush/pink — accent element
  pinkLight:    "#FAE8EC",
  green:        "#0D2B0D",       // Brand dark green — footer, final CTA gradient end
  greenMid:     "#163516",

  // SUPPORTING PALETTE
  cream:        "#F5EAD9",       // Primary background (from brand book)
  creamDark:    "#EDD8C0",       // Slightly deeper cream for quote section
  gold:         "#C4980A",       // ACCENT ONLY — borders, eyebrows, small details
  goldBright:   "#D4AF37",
  offwhite:     "#FEFAF4",
  warmGrey:     "#4a3828",
  text:         "#1a0808",
  textMid:      "#3a1818",
  textLight:    "#7a5a4a",
};

// ─── Typography scale ──────────────────────────────────────────────────────
const T = {
  hero:   "clamp(52px, 8vw, 92px)",
  h2:     "clamp(34px, 4.5vw, 52px)",
  h3:     "clamp(26px, 3vw, 36px)",
  eyebrow:"11px",
  body:   "16px",
  bodyLg: "18px",
  small:  "13px",
};

// ─── Image map ─────────────────────────────────────────────────────────────
const IMG = {
  hero:        img3,
  loom:        loomimg,
  collection1: heroImg,
  collection2: img16,
  artisan:     img5,
  artisan2:    img6,
  saree1:      img5,
  saree2:      img6,
  saree3:      img13,
  saree4:      img14,
  texture:     img15,
  videoBg:     img12,
  ig1: img7, ig2: img8, ig3: img9,
  ig4: img10, ig5: img11, ig6: img16,
};

// ─── useInView ─────────────────────────────────────────────────────────────
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

// ─── Global CSS ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .nc-root {
    font-family: 'Josefin Sans', sans-serif;
    background: #F5EAD9;
    color: #1a0808;
    overflow-x: hidden;
    line-height: 1;
  }

  .ey {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: #C4980A;
    font-weight: 600;
  }

  .gd   { width: 52px; height: 1px; background: #C4980A; }
  .gd-c { margin: 0 auto; }
  .gd-w { width: 52px; height: 1px; background: rgba(255,255,255,0.55); }

  .wrap { max-width: 1340px; margin: 0 auto; padding: 0 60px; }
  @media(max-width:900px) { .wrap { padding: 0 24px; } }

  .rv    { opacity:0; transform:translateY(28px); transition:opacity .95s cubic-bezier(.4,0,.2,1), transform .95s cubic-bezier(.4,0,.2,1); }
  .rv.on { opacity:1; transform:translateY(0); }
  .rv-l  { opacity:0; transform:translateX(-44px); transition:opacity 1.05s cubic-bezier(.4,0,.2,1), transform 1.05s cubic-bezier(.4,0,.2,1); }
  .rv-l.on { opacity:1; transform:translateX(0); }
  .rv-r  { opacity:0; transform:translateX(44px); transition:opacity 1.05s cubic-bezier(.4,0,.2,1), transform 1.05s cubic-bezier(.4,0,.2,1); }
  .rv-r.on { opacity:1; transform:translateX(0); }
  .d1{transition-delay:.07s!important} .d2{transition-delay:.18s!important}
  .d3{transition-delay:.30s!important} .d4{transition-delay:.43s!important}
  .d5{transition-delay:.57s!important} .d6{transition-delay:.72s!important}

  @keyframes threadMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .thread-track { display:flex; width:200%; animation:threadMarquee 16s linear infinite; }
  .thread-track:hover { animation-play-state:paused; }
  .thread-svg-half { width:50%; flex-shrink:0; }

  @keyframes flowRight1 { 0%{transform:translateX(-6%)} 100%{transform:translateX(6%)} }
  @keyframes flowRight2 { 0%{transform:translateX(5%)} 100%{transform:translateX(-5%)} }
  .flowing-thread-1 { animation:flowRight1 8s ease-in-out infinite alternate; }
  .flowing-thread-2 { animation:flowRight2 11s ease-in-out infinite alternate; }

  @keyframes igMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .ig-marquee-track { display:flex; gap:14px; width:max-content; animation:igMarquee 24s linear infinite; }
  .ig-marquee-track:hover { animation-play-state:paused; }
  .ig-marquee-item { width:290px; flex-shrink:0; overflow:hidden; border-radius:4px; cursor:pointer; position:relative; }
  .ig-marquee-item img { width:100%; height:230px; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.4,0,.2,1); }
  .ig-marquee-item:hover img { transform:scale(1.06); }
  .ig-marquee-item::after { content:''; position:absolute; inset:0; background:rgba(0,0,0,0); transition:background .4s; pointer-events:none; }
  .ig-marquee-item:hover::after { background:rgba(30,36,96,0.10); }

  /* Butta pattern — brand crimson motif */
  .butta-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='40' cy='40' rx='10' ry='15' fill='none' stroke='rgba(139,0,0,0.18)' stroke-width='1.5'/%3E%3Ccircle cx='40' cy='30' r='3' fill='rgba(139,0,0,0.12)'/%3E%3Cpath d='M32,44 Q40,56 48,44' stroke='rgba(139,0,0,0.15)' stroke-width='1' fill='none'/%3E%3Ccircle cx='24' cy='40' r='1.5' fill='rgba(139,0,0,0.10)'/%3E%3Ccircle cx='56' cy='40' r='1.5' fill='rgba(139,0,0,0.10)'/%3E%3C/svg%3E");
    background-size: 80px 80px;
  }

  @keyframes silkMove  { 0%{transform:translateX(-100%) skewX(-10deg)} 100%{transform:translateX(220%) skewX(-10deg)} }
  @keyframes goldOrb   { 0%,100%{transform:scale(1);opacity:.14} 50%{transform:scale(1.35);opacity:.28} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes crossA    { 0%,42%{opacity:1} 52%,94%{opacity:0} 100%{opacity:1} }
  @keyframes crossB    { 0%,42%{opacity:0} 52%,94%{opacity:1} 100%{opacity:0} }
  @keyframes grain     { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-3%)} 40%{transform:translate(3%,2%)} 60%{transform:translate(-1%,4%)} 80%{transform:translate(2%,-2%)} }
  @keyframes shimmerBtn{ 0%{left:-80%} 100%{left:120%} }
  @keyframes pulseDot  { 0%,100%{box-shadow:0 0 0 0 rgba(196,152,10,0)} 50%{box-shadow:0 0 22px 4px rgba(196,152,10,.35)} }
  @keyframes crimsonShimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pathDraw {
    from { stroke-dashoffset:600; opacity:0; }
    to   { stroke-dashoffset:0;   opacity:1; }
  }

  /* ── Buttons ── */
  .btn-crimson {
    display:inline-flex; align-items:center; gap:10px;
    padding:16px 44px;
    background: linear-gradient(135deg, #8B0000 0%, #6e0012 100%);
    color: #F5EAD9;
    border-radius:0;
    font-family:'Josefin Sans',sans-serif; font-size:11px; letter-spacing:.28em;
    font-weight:600; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
    box-shadow: 0 6px 28px rgba(139,0,0,.35);
    position:relative; overflow:hidden;
  }
  .btn-crimson::after {
    content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
    animation:shimmerBtn 3.5s ease infinite;
  }
  .btn-crimson:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(139,0,0,.5); }

  .btn-outline-cream {
    display:inline-flex; align-items:center; gap:10px;
    padding:15px 40px;
    border:1px solid rgba(245,234,217,.75); color:#F5EAD9;
    border-radius:0;
    font-family:'Josefin Sans',sans-serif; font-size:11px; letter-spacing:.28em;
    font-weight:500; text-transform:uppercase;
    text-decoration:none; background:transparent;
    transition:transform .35s, background .3s, border-color .3s;
  }
  .btn-outline-cream:hover { transform:translateY(-3px); background:rgba(245,234,217,.12); }

  /* Navy button — used on cream sections */
  .btn-navy {
    display:inline-flex; align-items:center; gap:10px;
    padding:17px 46px;
    background:linear-gradient(135deg, #1E2460 0%, #12163d 100%);
    color:#F5EAD9;
    border-radius:0;
    font-family:'Josefin Sans',sans-serif; font-size:11px; letter-spacing:.28em;
    font-weight:600; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
    box-shadow:0 6px 28px rgba(30,36,96,.3);
  }
  .btn-navy:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(30,36,96,.5); }

  .link-crimson {
    display:inline-flex; align-items:center; gap:8px;
    color:#8B0000; font-family:'Josefin Sans'; font-size:11px;
    letter-spacing:.24em; text-transform:uppercase; text-decoration:none;
    font-weight:600; transition:gap .3s, color .3s;
  }
  .link-crimson:hover { gap:14px; color:#6e0012; }

  .link-cream {
    display:inline-flex; align-items:center; gap:8px;
    color:#F5EAD9; font-family:'Josefin Sans'; font-size:11px;
    letter-spacing:.24em; text-transform:uppercase; text-decoration:none;
    font-weight:600; border-bottom:1px solid rgba(245,234,217,.4);
    padding-bottom:2px; transition:gap .3s, border-color .3s;
  }
  .link-cream:hover { gap:14px; border-color:rgba(245,234,217,.8); }

  /* ── Saree cards ── */
  .saree-card { cursor:pointer; }
  .saree-card-img {
    overflow:hidden; border-radius:0; position:relative;
    box-shadow:0 12px 48px rgba(0,0,0,.12);
  }
  .saree-card-img img { width:100%; height:430px; object-fit:cover; display:block; transition:transform .85s cubic-bezier(.4,0,.2,1); }
  .saree-card:hover .saree-card-img img { transform:scale(1.05); }
  .saree-card-img::after { content:''; position:absolute; inset:0; background:rgba(0,0,0,0); transition:background .5s; pointer-events:none; }
  .saree-card:hover .saree-card-img::after { background:rgba(0,0,0,.05); }

  .brand-tag {
    padding:7px 16px;
    border:1px solid rgba(139,0,0,.3);
    font-family:'Josefin Sans'; font-size:10px; letter-spacing:.20em;
    color:#8B0000; text-transform:uppercase; background:rgba(139,0,0,.06);
    font-weight:600;
  }

  .thread-path {
    stroke-dasharray:600; stroke-dashoffset:600; opacity:0;
    transition:stroke-dashoffset 2.5s cubic-bezier(.4,0,.2,1) .4s, opacity .6s ease .4s;
  }
  .thread-path.on { stroke-dashoffset:0; opacity:1; }

  .grain-overlay {
    position:absolute; inset:-100%; width:300%; height:300%; opacity:.10;
    animation:grain 10s steps(8) infinite;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    pointer-events:none;
  }

  .stat-pill {
    background:rgba(253,249,243,.98); backdrop-filter:blur(12px);
    border:1px solid rgba(196,152,10,.3); padding:14px 22px;
  }

  .col-btn {
    display:inline-block; padding:14px 38px;
    border:1px solid rgba(255,255,255,.75); color:white;
    text-decoration:none;
    font-family:'Josefin Sans'; font-size:11px; letter-spacing:.26em; text-transform:uppercase;
    transition:all .35s cubic-bezier(.4,0,.2,1);
  }
  .col-btn:hover { background:#8B0000; border-color:#8B0000; color:#F5EAD9; transform:translateY(-3px); }

  .video-wrapper { position:relative; overflow:hidden; box-shadow:0 44px 100px rgba(0,0,0,.22); }
  .video-wrapper video, .video-wrapper img { width:100%; display:block; aspect-ratio:16/9; object-fit:cover; }
  .play-btn {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:76px; height:76px;
    background:rgba(253,249,243,.97); border:1.5px solid rgba(196,152,10,.45);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 10px 40px rgba(0,0,0,.22); cursor:pointer;
    animation:pulseDot 3s ease infinite; transition:transform .3s;
  }
  .play-btn:hover { transform:translate(-50%,-50%) scale(1.08); }

  .quote-card {
    background:rgba(253,249,243,.85); border:1px solid rgba(139,0,0,.18);
    padding:38px 32px; backdrop-filter:blur(6px);
    transition:transform .4s, box-shadow .4s, border-color .4s;
  }
  .quote-card:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(139,0,0,.12); border-color:rgba(139,0,0,.35); }

  /* Shimmer headline — crimson ↔ gold */
  .shimmer-crimson {
    background: linear-gradient(90deg,
      #6e0012 0%, #8B0000 20%, #C4980A 38%,
      #8B0000 55%, #6e0012 72%, #8B0000 88%, #C4980A 100%
    );
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:crimsonShimmer 5s linear infinite;
  }

  .sindoor-dots { display:inline-flex; align-items:center; gap:10px; }
  .sindoor-dot  { width:7px; height:7px; border-radius:50%; background:#8B0000; flex-shrink:0; }

  @media(max-width:900px) {
    .grid-2  { grid-template-columns:1fr!important; gap:52px!important; }
    .grid-4  { grid-template-columns:1fr 1fr!important; gap:20px!important; }
    .col-block-h { height:62vh!important; }
    .hero-content { padding:0 20px!important; }
    .hero-btns { flex-direction:column!important; align-items:center!important; }
  }
  @media(max-width:600px) {
    .grid-4 { grid-template-columns:1fr!important; }
    .saree-card-img img { height:300px!important; }
  }
`;

// ─── Golden Thread Marquee ─────────────────────────────────────────────────
function GoldenThread({ dark = false }: { dark?: boolean }) {
  // On dark (navy) backgrounds: use gold threads
  // On light (cream) backgrounds: use crimson threads
  const stroke1 = dark ? "rgba(196,152,10,0.55)" : "rgba(139,0,0,0.28)";
  const stroke2 = dark ? "rgba(196,152,10,0.35)" : "rgba(139,0,0,0.16)";
  const HalfSvg = () => (
    <svg className="thread-svg-half" viewBox="0 0 1320 60" preserveAspectRatio="none"
      style={{ height: 60, display: "block" }}>
      <path d="M0,30 C220,8 330,52 550,30 C770,8 880,52 1100,30 C1210,12 1265,42 1320,30"
        stroke={stroke1} strokeWidth="1.2" fill="none" />
      <path d="M0,40 C180,18 400,58 660,36 C920,14 1100,52 1320,36"
        stroke={stroke2} strokeWidth="0.8" fill="none" />
    </svg>
  );
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none" }}>
      <div className="thread-track"><HalfSvg /><HalfSvg /></div>
    </div>
  );
}

// ─── Sindoor Dot Logo Wordmark ─────────────────────────────────────────────
function LogoWordmark({ size = 14, color = C.cream }: { size?: number; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div className="sindoor-dots">
        <div className="sindoor-dot" style={{ background: color, width: size * 0.55, height: size * 0.55 }} />
        <span style={{
          fontFamily: "'Cinzel',serif", fontSize: size, letterSpacing: "0.30em",
          color, fontWeight: 600, textTransform: "uppercase"
        }}>NEYGE</span>
        <div className="sindoor-dot" style={{ background: color, width: size * 0.55, height: size * 0.55 }} />
      </div>
      <span style={{
        fontFamily: "'Josefin Sans',sans-serif", fontSize: size * 0.65,
        letterSpacing: "0.38em", color, fontWeight: 400, textTransform: "uppercase", opacity: 0.85
      }}>COUTURE</span>
    </div>
  );
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────
// CORRECTED: Overlay uses navy→crimson gradient (brand colors 1+2 from color bar)
// Hero represents powerful women — navy strength fading to brand crimson warmth
function Hero() {
  return (
    <section style={{
      position: "relative", height: "100vh", minHeight: 620,
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
    }}>
      <img src={IMG.hero} alt="Neyge Couture" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center top"
      }} />
      {/* CORRECTED overlay: navy top → crimson mid → deep navy bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(18,22,61,.55) 0%, rgba(30,36,96,.35) 30%, rgba(139,0,0,.45) 65%, rgba(18,22,61,.75) 100%)"
      }} />
      {/* Silk sheen */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "32%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
          animation: "silkMove 18s linear infinite"
        }} />
      </div>
      {/* Navy glow orb — using brand navy (not crimson) */}
      <div style={{
        position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,36,96,.25) 0%, transparent 70%)",
        animation: "goldOrb 8s ease-in-out infinite", pointerEvents: "none"
      }} />
      {/* Butta pattern overlay */}
      <div className="butta-pattern" style={{
        position: "absolute", inset: 0, opacity: 0.20, pointerEvents: "none"
      }} />

      <div className="hero-content" style={{
        position: "relative", zIndex: 2, textAlign: "center",
        color: "white", padding: "0 32px", maxWidth: 880, width: "100%"
      }}>
        <div style={{ animation: "fadeUp .9s cubic-bezier(.4,0,.2,1) .1s both", marginBottom: 28 }}>
          <LogoWordmark size={16} color={C.cream} />
        </div>

        <div style={{ animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .3s both" }}>
          <span className="ey" style={{ color: "rgba(196,152,10,0.9)", letterSpacing: ".32em" }}>
            Handwoven Heritage · Est. 2026
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: T.hero, fontWeight: 400, lineHeight: 1.08,
          animation: "fadeUp 1.1s cubic-bezier(.4,0,.2,1) .5s both",
          marginTop: 20, marginBottom: 18, letterSpacing: ".02em"
        }}>
          Rooted. Refined.<br />
          <span style={{ fontWeight: 300, fontSize: "0.88em", letterSpacing: ".04em" }}>Powerful.</span>
        </h1>

        <div style={{ animation: "fadeUp 1s ease .7s both" }}>
          <div style={{ width: 52, height: 1, background: "rgba(196,152,10,.7)", margin: "0 auto 22px" }} />
        </div>

        <p style={{
          fontFamily: "'Josefin Sans'", fontSize: T.bodyLg, fontWeight: 300, lineHeight: 1.85,
          color: "rgba(255,255,255,.82)", maxWidth: 480, margin: "0 auto 12px",
          animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .85s both"
        }}>
          Artisan-made sarees that blend cultural depth with modern elegance —
          making every woman feel rooted, refined, and powerful.
        </p>

        <p style={{
          fontFamily: "'Cinzel'", fontSize: 11, fontStyle: "italic", letterSpacing: ".22em",
          color: "rgba(196,152,10,.75)", animation: "fadeUp 1s ease .95s both",
          marginBottom: 44, textTransform: "uppercase"
        }}>
          Crafted Elegance
        </p>

        <div className="hero-btns" style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) 1.1s both"
        }}>
          <Link to="/shop" className="btn-crimson">Explore the Collection</Link>
          <Link to="/artisans" className="btn-outline-cream">Meet the Artisans</Link>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 34, right: 42,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fadeUp 1s ease 1.6s both"
      }}>
        <span style={{ fontFamily: "'Josefin Sans'", fontSize: 9, letterSpacing: ".28em", color: "rgba(245,234,217,.35)", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: 1, height: 42, background: "linear-gradient(to bottom, rgba(196,152,10,.55), transparent)" }} />
      </div>
    </section>
  );
}

// ─── 2. LOOM STORY ─────────────────────────────────────────────────────────
// CORRECTED: Pure cream #F5EAD9 background (not creamLight #FDF9F3)
// Cream is the brand's primary background color from the brand book
function LoomStory() {
  const [ref, on] = useInView(0.15);
  const [svgRef, sv] = useInView<SVGSVGElement>(0.35);
  return (
    <section ref={ref} style={{ padding: "124px 0", background: C.cream }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "center" }}>

          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: -20, right: -20, width: "55%", height: "55%",
              border: `1px solid rgba(139,0,0,.18)`, pointerEvents: "none", zIndex: 0
            }} />
            <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.16)" }}>
              <img src={IMG.loom} alt="Handloom" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
              {/* CORRECTED: Navy tint on image (brand navy as accent overlay, not crimson) */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(30,36,96,.06) 0%,transparent 55%)", pointerEvents: "none" }} />
            </div>
            <div className="stat-pill" style={{ position: "absolute", bottom: -24, left: -18, zIndex: 2 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: C.crimson, fontWeight: 500, lineHeight: 1 }}>
                3 Generations
              </div>
              <div style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: ".18em", color: C.warmGrey, marginTop: 5, textTransform: "uppercase" }}>
                of weaving mastery
              </div>
            </div>
            <svg ref={svgRef} style={{ position: "absolute", bottom: -44, right: -28, width: 80, height: 80, overflow: "visible", color: C.crimson, zIndex: 2 }} viewBox="0 0 100 100">
              <path className={`thread-path ${sv ? "on" : ""}`} d="M8 88 Q 52 8, 92 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>The Craft</span>
            <h2 className={`rv d2 ${on ? "on" : ""}`} style={{
              fontFamily: "'Cinzel',serif", fontSize: T.h2, fontWeight: 400,
              lineHeight: 1.15, color: C.crimson, letterSpacing: ".02em"
            }}>
              Every Thread<br />is a Prayer
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.92, color: C.warmGrey, fontWeight: 300 }}>
              Our looms are not machines — they are extensions of the artisan's soul.
              Passed down through generations, the rhythm of the shuttle echoes the
              heartbeat of rural India.
            </p>
            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.92, color: C.warmGrey, fontWeight: 300 }}>
              We work directly with weavers in Bengal, Varanasi, and Odisha, preserving
              techniques that predate written history. Each Neyge saree is certified by
              the weaver who made it.
            </p>

            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
              {[
                ["Artisan Integrity",   "Certified by the weaver"],
                ["Zero Power Loom",     "Every yarn woven by hand"],
                ["Direct from Artisan", "No middlemen involved"],
                ["Understated Luxury",  "Premium. Thoughtful. Quiet."]
              ].map(([t, s]) => (
                <div key={t} style={{
                  // CORRECTED: Slightly deeper cream for card bg on cream section, border navy-tinted
                  background: C.creamDark, border: `1px solid rgba(30,36,96,.12)`,
                  padding: "13px 15px"
                }}>
                  <div style={{ fontFamily: "'Josefin Sans'", fontSize: 10, color: C.crimson, letterSpacing: ".18em", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>✦ {t}</div>
                  <div style={{ fontFamily: "'Josefin Sans'", fontSize: 12, color: C.warmGrey, fontWeight: 300 }}>{s}</div>
                </div>
              ))}
            </div>

            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/about" className="link-crimson">Read the full loom story <span style={{ fontSize: 15 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. COLLECTION BLOCK ─────────────────────────────────────────────────────
// CORRECTED: Overlay uses navy→crimson gradient correctly (brand colors 1+2)
// Previously was too crimson-heavy (rgba(90,0,22) is not a brand color)
function CollectionBlock({ img, title, subtitle, href }: { img: string; title: string; subtitle: string; href: string }) {
  const [ref, on] = useInView<HTMLDivElement>(0.08);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => {
      const r = el.getBoundingClientRect();
      const progress = -r.top / window.innerHeight;
      const imgEl = el.querySelector("img") as HTMLImageElement;
      if (imgEl) imgEl.style.transform = `translateY(${Math.min(Math.max(progress * 9, -8), 8)}%)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div ref={scrollRef} className="col-block-h" style={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <img src={img} alt={title} style={{ width: "100%", height: "115%", objectFit: "cover", display: "block" }} />
      </div>
      {/* CORRECTED: Navy top, crimson mid, navy-deep bottom — all brand colors */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,22,61,.82) 0%, rgba(139,0,0,.35) 40%, rgba(30,36,96,.40) 100%)" }} />

      <div style={{
        position: "relative", zIndex: 2, height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "flex-end", paddingBottom: 80, textAlign: "center", color: "white"
      }}>
        <span className={`ey rv ${on ? "on" : ""}`} style={{ color: "rgba(196,152,10,.95)", marginBottom: 16 }}>Collection</span>
        <h3 className={`rv d2 ${on ? "on" : ""}`} style={{
          fontFamily: "'Cinzel',serif", fontSize: "clamp(38px,6.5vw,72px)",
          fontWeight: 400, lineHeight: 1.1, marginBottom: 14, letterSpacing: ".03em"
        }}>
          {title}
        </h3>
        <p className={`rv d3 ${on ? "on" : ""}`} style={{
          fontFamily: "'Josefin Sans'", fontSize: 16, fontWeight: 300,
          color: "rgba(255,255,255,.8)", marginBottom: 38, maxWidth: 440
        }}>
          {subtitle}
        </p>
        <div className={`rv d4 ${on ? "on" : ""}`}>
          <Link to={href} className="col-btn">Explore Collection</Link>
        </div>
      </div>
    </div>
  );
}

// ─── 4. ARTISAN SPOTLIGHT — Navy background ───────────────────────────────────
// CORRECTED: Navy section uses pure #1E2460 → #12163d gradient (no green mix here)
// Green is reserved for the final CTA gradient end only
function ArtisanSpotlight() {
  const [ref, on] = useInView(0.12);
  return (
    <section ref={ref} id="artisans" style={{
      padding: "124px 0",
      // CORRECTED: Navy gradient only — #12163d to #1E2460 to #252b72
      background: `linear-gradient(160deg, ${C.navyDeep} 0%, ${C.navy} 60%, ${C.navyLight} 100%)`,
      position: "relative", overflow: "hidden"
    }}>
      {/* Butta pattern overlay — inverted for dark bg */}
      <div className="butta-pattern" style={{ position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none", filter: "invert(1)" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "center" }}>

          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div style={{ overflow: "hidden", boxShadow: "0 48px 100px rgba(0,0,0,.35)", aspectRatio: "4/5", position: "relative" }}>
              <img src={IMG.artisan} alt="Artisan" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossA 15s ease-in-out infinite" }} />
              <img src={IMG.artisan2} alt="Artisan 2" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossB 15s ease-in-out infinite" }} />
            </div>
            <div style={{
              position: "absolute", bottom: 22, left: -14,
              background: "rgba(245,234,217,.97)", backdropFilter: "blur(12px)",
              border: `1px solid rgba(196,152,10,.35)`, padding: "12px 20px",
              display: "flex", gap: 10, alignItems: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,.22)"
            }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.crimson, flexShrink: 0, animation: "pulseDot 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: ".20em", textTransform: "uppercase", color: C.crimson, fontWeight: 600 }}>
                Master Weaver · 200+ Yr Legacy
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={`rv d1 ${on ? "on" : ""}`} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(196,152,10,.15)", border: "1px solid rgba(196,152,10,.3)",
              padding: "8px 18px", width: "fit-content"
            }}>
              <span style={{ color: C.gold, fontSize: 12 }}>✦</span>
              <span className="ey" style={{ color: C.gold }}>Artisan Spotlight</span>
            </div>

            <h2 className={`rv d2 ${on ? "on" : ""}`} style={{
              fontFamily: "'Cinzel',serif", fontSize: T.h2, fontWeight: 400,
              color: C.cream, lineHeight: 1.14, letterSpacing: ".02em"
            }}>
              Meet Radha Devi
            </h2>
            <div className={`gd-w rv d3 ${on ? "on" : ""}`} />

            <blockquote className={`rv d3 ${on ? "on" : ""}`} style={{
              fontFamily: "'Cinzel',serif", fontSize: 17, fontStyle: "italic",
              fontWeight: 400, color: "rgba(245,234,217,.88)", lineHeight: 1.82,
              borderLeft: `2px solid rgba(196,152,10,.45)`, paddingLeft: 22, margin: 0, letterSpacing: ".01em"
            }}>
              "I learned to weave from my mother when I was seven. The loom is like a third hand to me. Every saree I make carries a piece of my home."
            </blockquote>

            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: "rgba(245,234,217,.7)", fontWeight: 300 }}>
              Radha is one of 43 master weavers we collaborate with in Murshidabad. Her family has woven silk for over 200 years — each piece carrying a certificate of authenticity.
            </p>

            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[["43", "Artisans"], ["6", "States"], ["200+", "Yr Heritage"]].map(([n, l]) => (
                <div key={l} style={{
                  textAlign: "center", padding: "14px 20px",
                  // CORRECTED: navy-tinted background on navy section (not cream tint)
                  background: "rgba(255,255,255,.06)", border: `1px solid rgba(196,152,10,.3)`
                }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 500, color: C.cream, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: ".20em", textTransform: "uppercase", color: "rgba(196,152,10,.85)", marginTop: 5, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>

            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/artisans" className="link-cream">Meet all artisans <span style={{ fontSize: 15 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. FEATURED SAREES — Cream section ──────────────────────────────────────
// CORRECTED: Pure cream #F5EAD9 background. Alternating navy/cream pattern maintained.
const SAREES = [
  { img: IMG.saree1, name: "Banarasi Silk",    region: "Varanasi · Zari Brocade", price: "₹18,500", id: "banarasi-silk" },
  { img: IMG.saree2, name: "Kanchipuram",      region: "Tamil Nadu · Pure Silk",  price: "₹24,000", id: "kanchipuram" },
  { img: IMG.saree3, name: "Handloom Cotton",  region: "Bengal · Block Print",    price: "₹8,500",  id: "handloom-cotton" },
  { img: IMG.saree4, name: "Patola Ikat",      region: "Gujarat · Double Ikat",   price: "₹32,000", id: "patola-ikat" },
];

function FeaturedSarees() {
  const [ref, on] = useInView(0.08);
  return (
    <section ref={ref} id="shop" style={{ padding: "124px 0", background: C.cream }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 68 }}>
          <span className="ey" style={{ display: "block", marginBottom: 16 }}>Curated Collection</span>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <LogoWordmark size={13} color={C.crimson} />
          </div>
          <div className="gd gd-c" style={{ marginTop: 14, marginBottom: 18 }} />
          <p style={{ fontFamily: "'Josefin Sans'", fontSize: T.body, color: C.warmGrey, fontWeight: 300, maxWidth: 380, margin: "0 auto" }}>
            Each piece handpicked for its soulful craftsmanship and artisan legacy
          </p>
        </div>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
          {SAREES.map((s, i) => (
            <div key={i} className={`saree-card rv d${i + 1} ${on ? "on" : ""}`}>
              <div className="saree-card-img">
                <img src={s.img} alt={s.name} />
                {/* Badge: crimson bg, cream text — brand combination */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: C.crimson, padding: "5px 12px", zIndex: 1
                }}>
                  <span style={{ fontFamily: "'Josefin Sans'", fontSize: 9, letterSpacing: ".18em", color: C.cream, fontWeight: 600, textTransform: "uppercase" }}>Handloom</span>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: "0 2px" }}>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 500, color: C.crimson, marginBottom: 5, letterSpacing: ".02em" }}>{s.name}</h3>
                <p style={{ fontFamily: "'Josefin Sans'", fontSize: 11, color: C.textLight, letterSpacing: ".12em", marginBottom: 12, fontWeight: 400 }}>{s.region}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: C.crimsonDeep }}>{s.price}</span>
                  <Link to={`/product/${s.id}`} className="link-crimson" style={{ fontSize: 11 }}>View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 62 }}>
          {/* CORRECTED: Navy button on cream section — good contrast, uses brand color 1 */}
          <Link to="/shop" className="btn-navy">View All Sarees &nbsp;→</Link>
        </div>
      </div>
    </section>
  );
}

// ─── 6. TEXTURE QUOTE — Crimson overlay on image ─────────────────────────────
// CORRECTED: Overlay uses brand crimson #8B0000 at proper opacity
// Previously used #5a0016 which is NOT a brand color — too dark and purple-ish
function TextureQuote() {
  const [ref, on] = useInView(0.18);
  return (
    <section ref={ref} style={{ position: "relative", padding: "152px 24px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={IMG.texture} alt="Texture" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* CORRECTED: Brand crimson #8B0000 overlay — not the non-brand #5a0016 */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(139,0,0,.68)" }} />
        {/* Navy vignette at edges for depth — using brand navy */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(18,22,61,.30) 100%)" }} />
        <div className="butta-pattern" style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none", filter: "invert(1)" }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><div className="grain-overlay" /></div>
      </div>

      <div className={`rv ${on ? "on" : ""}`} style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 42 }}>
          <div style={{ flex: 1, maxWidth: 64, height: 1, background: "linear-gradient(to right,transparent,rgba(196,152,10,.5))" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(245,234,217,.6)" }} />
            <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(245,234,217,.6)" }} />
          </div>
          <div style={{ flex: 1, maxWidth: 64, height: 1, background: "linear-gradient(to left,transparent,rgba(196,152,10,.5))" }} />
        </div>

        <blockquote style={{
          fontFamily: "'Cinzel',serif",
          fontSize: "clamp(26px,4.5vw,50px)",
          fontStyle: "italic", fontWeight: 400, color: "white", lineHeight: 1.45, letterSpacing: ".02em"
        }}>
          "Handmade is not a trend.<br />It is a truth."
        </blockquote>

        <div style={{ width: 52, height: 1, background: "rgba(196,152,10,.6)", margin: "38px auto" }} />
        <p style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(245,234,217,.38)" }}>
          NEYGE COUTURE · CRAFTED ELEGANCE · EST. 2026
        </p>
      </div>
    </section>
  );
}

// ─── 7. VIDEO SHOPPING — Cream background ────────────────────────────────────
// CORRECTED: Pure cream #F5EAD9 background (same as LoomStory — both are cream sections)
function VideoShopping() {
  const [ref, on] = useInView(0.12);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section ref={ref} style={{ padding: "124px 0", background: C.cream }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 76, alignItems: "center" }}>

          <div className={`rv-l ${on ? "on" : ""}`}>
            <div className="video-wrapper">
              <video ref={videoRef} src="" poster={IMG.videoBg} controls={playing} playsInline
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
              {!playing && (
                <button className="play-btn" onClick={() => { setPlaying(true); videoRef.current?.play(); }} aria-label="Play">
                  <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `20px solid ${C.crimson}`, marginLeft: 5 }} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>Premium Service</span>
            <h2 className={`rv d2 ${on ? "on" : ""}`} style={{
              fontFamily: "'Cinzel',serif", fontSize: T.h2, fontWeight: 400,
              color: C.crimson, lineHeight: 1.14, letterSpacing: ".02em"
            }}>
              Shop with<br />a Stylist
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.92, color: C.warmGrey, fontWeight: 300 }}>
              Not sure which saree tells your story? Book a one-on-one video session
              with our in-house styling experts. We guide you through drapes, fabrics,
              and occasions — from the comfort of your home.
            </p>
            <div className={`rv d4 ${on ? "on" : ""}`} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Draping guidance", "Fabric expertise", "Occasion styling", "Free of charge"].map(t => (
                <span key={t} className="brand-tag">{t}</span>
              ))}
            </div>
            <div className={`rv d5 ${on ? "on" : ""}`}>
              <Link to="/video-shopping" className="btn-crimson">▶ &nbsp;Book a Free Session</Link>
            </div>
            <p className={`rv d6 ${on ? "on" : ""}`} style={{ fontFamily: "'Josefin Sans'", fontSize: 11, color: C.textLight, letterSpacing: ".08em", fontWeight: 300 }}>
              Over 3,200 sessions completed · Rated 4.9 ★
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. INSTAGRAM — Navy backdrop ────────────────────────────────────────────
// CORRECTED: Pure navy gradient #12163d → #1E2460 (no green in this section)
const IG_IMGS = [IMG.ig1, IMG.ig2, IMG.ig3, IMG.ig4, IMG.ig5, IMG.ig6];

function InstagramGrid() {
  const [ref, on] = useInView(0.08);
  const doubled = [...IG_IMGS, ...IG_IMGS];

  return (
    <section ref={ref} style={{
      padding: "112px 0",
      // CORRECTED: Clean navy gradient only — green is for CTA only
      background: `linear-gradient(180deg, ${C.navyDeep} 0%, ${C.navy} 100%)`,
      position: "relative", overflow: "hidden"
    }}>
      <div className="butta-pattern" style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none", filter: "invert(1)" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="ey" style={{ display: "block", marginBottom: 16, color: C.gold }}>Visual Diary</span>
          <h2 style={{
            fontFamily: "'Cinzel',serif", fontSize: T.h2, fontWeight: 400,
            color: C.cream, marginBottom: 10, letterSpacing: ".03em"
          }}>
            From Our World
          </h2>
          <p style={{ fontFamily: "'Josefin Sans'", fontSize: T.small, color: "rgba(196,152,10,.75)", letterSpacing: ".20em", fontWeight: 500 }}>@neyge_couture</p>
        </div>
      </div>

      <div style={{ overflow: "hidden", width: "100%" }}>
        <div className="ig-marquee-track">
          {doubled.map((src, i) => (
            <div key={i} className="ig-marquee-item">
              <img src={src} alt={`Gallery ${(i % IG_IMGS.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 38 }}>
        <a href="https://instagram.com/neyge_couture" className="link-cream" target="_blank" rel="noreferrer">
          Follow on Instagram →
        </a>
      </div>
    </section>
  );
}

// ─── 9. QUOTES — Cream-dark background ───────────────────────────────────────
// CORRECTED: Using creamDark (#EDD8C0) for subtle depth variation on cream section
const QUOTES = [
  { text: "She didn't just wear a saree. She wore six yards of someone's lifetime.", attr: "— A Neyge wearer, Mumbai" },
  { text: "Every knot in this loom is a wish my grandmother wove for her daughters.", attr: "— Radha Devi, Master Weaver" },
  { text: "In a world of fast fashion, we choose to be slow. We choose to be woven.", attr: "— The Neyge Story" },
];

function QuotesSection() {
  const [ref, on] = useInView(0.1);
  return (
    <section ref={ref} style={{ padding: "110px 0", background: C.creamDark, position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: .15 }}
        viewBox="0 0 1320 300" preserveAspectRatio="none">
        {/* CORRECTED: Using brand crimson for decorative threads */}
        <path className="flowing-thread-1" d="M0,150 C200,60 400,240 660,150 C920,60 1100,240 1320,150"
          stroke="#8B0000" strokeWidth="1.5" fill="none" />
        <path className="flowing-thread-2" d="M0,100 C300,180 600,20 900,100 C1100,160 1220,60 1320,100"
          stroke="#8B0000" strokeWidth="1" fill="none" />
      </svg>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="ey" style={{ display: "block", marginBottom: 14 }}>Voices & Stories</span>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: T.h2, fontWeight: 400, color: C.crimson, letterSpacing: ".02em" }}>
            Words Woven in Time
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="grid-2">
          {QUOTES.map((q, i) => (
            <div key={i} className={`quote-card rv d${i + 1} ${on ? "on" : ""}`}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 56, lineHeight: .8, color: C.crimson, opacity: .25, marginBottom: 14, fontWeight: 700 }}>"</div>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontStyle: "italic", fontWeight: 400, color: C.textMid, lineHeight: 1.75, marginBottom: 20, letterSpacing: ".01em" }}>
                {q.text}
              </p>
              <div style={{ width: 28, height: 1, background: "rgba(139,0,0,.3)", marginBottom: 12 }} />
              <p style={{ fontFamily: "'Josefin Sans'", fontSize: 11, color: C.textLight, letterSpacing: ".12em", fontWeight: 500 }}>{q.attr}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 10. FINAL CTA — Navy to Green gradient ───────────────────────────────────
// CORRECTED: Brand color bar order is Navy → Crimson → Pink → Green
// The final CTA should use navy→green (colors 1+4) as a bookend gradient
// Previously was navy→navy which lost the green brand color entirely
function FinalCTA() {
  const [ref, on] = useInView(0.15);
  return (
    <section ref={ref} style={{
      padding: "148px 48px",
      // CORRECTED: Navy deep → Navy → Green deep — using brand colors 1 and 4
      background: `linear-gradient(160deg, ${C.navyDeep} 0%, ${C.navy} 45%, ${C.green} 100%)`,
      textAlign: "center", position: "relative", overflow: "hidden"
    }}>
      {/* Butta pattern */}
      <div className="butta-pattern" style={{ position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none", filter: "invert(1)" }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><div className="grain-overlay" /></div>

      {/* Decorative rings */}
      <div style={{ position: "absolute", left: "6%", top: "50%", transform: "translateY(-50%)", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(245,234,217,.10)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(245,234,217,.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", border: "1px solid rgba(245,234,217,.05)", pointerEvents: "none" }} />

      {/* CORRECTED: Flowing threads in gold on dark bg */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1320 500" preserveAspectRatio="none">
        <path className="flowing-thread-1" d="M100,250 Q400,80 660,250 Q920,420 1220,250"
          stroke="rgba(196,152,10,0.22)" strokeWidth="0.8" fill="none" />
        <path className="flowing-thread-2" d="M0,350 Q330,150 660,300 Q990,450 1320,200"
          stroke="rgba(196,152,10,0.14)" strokeWidth="0.6" fill="none" />
      </svg>

      <div className={`rv ${on ? "on" : ""}`} style={{
        position: "relative", zIndex: 1, maxWidth: 660, margin: "0 auto",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <div style={{ marginBottom: 28 }}>
          <LogoWordmark size={15} color={C.cream} />
        </div>

        <span className="ey" style={{ color: "rgba(196,152,10,.85)", marginBottom: 24, letterSpacing: ".32em" }}>Begin Your Journey</span>

        <h2 className="shimmer-crimson" style={{
          fontFamily: "'Cinzel',serif",
          fontSize: "clamp(58px,10vw,112px)",
          fontWeight: 400, lineHeight: .95, letterSpacing: ".01em", marginBottom: 16
        }}>
          Own a Story.
        </h2>

        <p style={{ fontFamily: "'Cinzel',serif", fontSize: 19, fontStyle: "italic", fontWeight: 300, color: "rgba(245,234,217,.8)", marginBottom: 8, letterSpacing: ".02em" }}>
          Six yards. One lifetime.
        </p>

        <p style={{ fontFamily: "'Josefin Sans'", fontSize: 13, color: "rgba(245,234,217,.55)", letterSpacing: ".06em", fontWeight: 300, maxWidth: 440, textAlign: "center", lineHeight: 1.78, marginBottom: 24 }}>
          "When you drape a Neyge saree, you carry the dreams of the weaver who made it, the love of the artisan who dyed it, and the soul of the land it came from."
        </p>

        <div style={{ width: 52, height: 1, background: "rgba(196,152,10,.45)", marginBottom: 44 }} />

        <Link to="/shop" className="btn-outline-cream" style={{ fontSize: 11, padding: "17px 50px", letterSpacing: ".30em" }}>
          Explore Neyge &nbsp;→
        </Link>

        <p style={{ fontFamily: "'Josefin Sans'", fontSize: 11, color: "rgba(245,234,217,.38)", marginTop: 28, letterSpacing: ".12em" }}>
          Free shipping above ₹5,000 · COD available · Authenticity certified
        </p>

        <div style={{ marginTop: 56, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {["admin@neygecouture.com", "neyge_couture", "+91-9113991711"].map((d, i) => (
            <span key={i} style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: ".18em", color: "rgba(245,234,217,.32)", textTransform: "uppercase" }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="nc-root">
        <Hero />

        <GoldenThread />

        <LoomStory />

        <CollectionBlock
          img={IMG.collection1}
          title="The Terracotta Weave"
          subtitle="Inspired by the red soil of Bengal — raw, earthy, eternal."
          href="/collections"
        />
        <GoldenThread dark />
        <CollectionBlock
          img={IMG.collection2}
          title="Indigo Memories"
          subtitle="Deep blues that tell stories of the night sky over the village."
          href="/collections"
        />

        <GoldenThread />

        <ArtisanSpotlight />

        <GoldenThread dark />

        <FeaturedSarees />

        <GoldenThread />

        <TextureQuote />

        <GoldenThread dark />

        <VideoShopping />

        <GoldenThread />

        <InstagramGrid />

        <GoldenThread dark />

        <QuotesSection />

        <FinalCTA />
      </div>
    </>
  );
}