// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import heroImg from '@/assets/bd3.png';
// import loomimg from '@/assets/g1.png';
// import img3 from '@/assets/g3.png';
// import img5 from '@/assets/g5.png';
// import img6 from '@/assets/g6.png';
// import img7 from '@/assets/g7.png';
// import img8 from '@/assets/g8.jpg';
// import img9 from '@/assets/g9.png';
// import img10 from '@/assets/g10.png';
// import img11 from '@/assets/g11.png';
// import img12 from '@/assets/g12.png';
// import img13 from '@/assets/g13.jpg';
// import img14 from '@/assets/g14.png';
// import img15 from '@/assets/g15.png';
// import img16 from '@/assets/g16.jpg';

// // ─── Brand Palette ────────────────────────────────────────────────────────────
// const C = {
//   maroon: "#800020",
//   maroonDark: "#5a0016",
//   gold: "#C4980A",        // FIXED: darker gold for better visibility on light bg
//   goldVibrant: "#D4AF37",        // brighter gold for dark backgrounds
//   goldLight: "#e8c84a",
//   goldPale: "rgba(196,152,10,0.12)",
//   goldBorder: "rgba(196,152,10,0.35)",
//   indigo: "#4B0082",
//   cream: "#F5E6D3",
//   creamLight: "#FFF9F0",
//   creamDark: "#e8d0b8",
//   charcoal: "#1a1010",
//   warmGrey: "#4a3828",
// };

// // ─── Typography ───────────────────────────────────────────────────────────────
// const T = {
//   hero: "clamp(48px, 7.5vw, 80px)",
//   h2: "clamp(32px, 4vw, 48px)",
//   eyebrow: "11px",
//   body: "17px",
//   bodyLg: "18px",
//   small: "14px",
// };

// // ─── Image map ────────────────────────────────────────────────────────────────
// const IMG = {
//   hero: img3,
//   loom: loomimg,
//   collection1: heroImg,
//   collection2: img16,
//   artisan: img5,
//   artisan2: img6,
//   saree1: img5,
//   saree2: img6,
//   saree3: img13,
//   saree4: img14,
//   texture: img15,
//   videoBg: img12,
//   ig1: img7, ig2: img8, ig3: img9,
//   ig4: img10, ig5: img11, ig6: img16,
// };

// // ─── useInView ────────────────────────────────────────────────────────────────
// function useInView<T extends Element = HTMLElement>(threshold = 0.12): [React.RefObject<T | null>, boolean] {
//   const ref = useRef<T | null>(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     if (!ref.current) return;
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return [ref, visible];
// }

// // ─── Global CSS ───────────────────────────────────────────────────────────────
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   html { scroll-behavior: smooth; }

//   .neyge-root {
//     font-family: 'Jost', sans-serif;
//     background: #FFF9F0;
//     color: #1a1010;
//     overflow-x: hidden;
//     line-height: 1;
//   }

//   /* ── Eyebrow ── */
//   .ey {
//     font-family: 'Jost', sans-serif;
//     font-size: 11px;
//     letter-spacing: 0.25em;
//     text-transform: uppercase;
//     color: #C4980A;          /* FIXED: darker gold for visibility */
//     font-weight: 600;
//   }

//   /* ── Divider ── */
//   .gd  { width: 56px; height: 1px; background: #C4980A; }
//   .gd-c { margin: 0 auto; }

//   /* ── Container ── */
//   .wrap { max-width: 1320px; margin: 0 auto; padding: 0 56px; }
//   @media(max-width: 900px) { .wrap { padding: 0 24px; } }

//   /* ── Scroll reveal ── */
//   .rv   { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1); }
//   .rv.on { opacity:1; transform:translateY(0); }
//   .rv-l  { opacity:0; transform:translateX(-48px); transition:opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1); }
//   .rv-l.on { opacity:1; transform:translateX(0); }
//   .rv-r  { opacity:0; transform:translateX(48px); transition:opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1); }
//   .rv-r.on { opacity:1; transform:translateX(0); }
//   .d1{transition-delay:.08s!important} .d2{transition-delay:.20s!important}
//   .d3{transition-delay:.33s!important} .d4{transition-delay:.46s!important}
//   .d5{transition-delay:.60s!important} .d6{transition-delay:.74s!important}

//   /* ══════════════════════════════════════════════════════════════
//      CHANGE 2: Golden Thread — continuous left-to-right loop
//   ══════════════════════════════════════════════════════════════ */
//   @keyframes threadMarquee {
//     from { transform: translateX(0); }
//     to   { transform: translateX(-50%); }
//   }
//   .thread-track {
//     display: flex;
//     width: 200%;
//     animation: threadMarquee 14s linear infinite;
//   }
//   .thread-track:hover { animation-play-state: paused; }
//   .thread-svg-half {
//     width: 50%;
//     flex-shrink: 0;
//   }

//   /* ── In-section SVG flowing threads (Quotes, CTA) ── */
//   @keyframes flowRight1 {
//     0%   { transform: translateX(-8%); }
//     100% { transform: translateX(8%); }
//   }
//   @keyframes flowRight2 {
//     0%   { transform: translateX(6%); }
//     100% { transform: translateX(-6%); }
//   }
//   .flowing-thread-1 { animation: flowRight1 7s ease-in-out infinite alternate; }
//   .flowing-thread-2 { animation: flowRight2 9s ease-in-out infinite alternate; }

//   /* ══════════════════════════════════════════════════════════════
//      CHANGE 1: Instagram Marquee — continuous scroll left→right
//   ══════════════════════════════════════════════════════════════ */
//   @keyframes igMarquee {
//     from { transform: translateX(0); }
//     to   { transform: translateX(-50%); }
//   }
//   .ig-marquee-track {
//     display: flex;
//     gap: 12px;
//     width: max-content;
//     animation: igMarquee 22s linear infinite;
//   }
//   .ig-marquee-track:hover { animation-play-state: paused; }
//   .ig-marquee-item {
//     width: 280px;
//     flex-shrink: 0;
//     overflow: hidden;
//     border-radius: 16px;
//     cursor: pointer;
//     position: relative;
//   }
//   .ig-marquee-item img {
//     width: 100%;
//     height: 220px;
//     object-fit: cover;
//     display: block;
//     transition: transform 0.7s cubic-bezier(.4,0,.2,1);
//   }
//   .ig-marquee-item:hover img { transform: scale(1.06); }
//   .ig-marquee-item::after {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: rgba(0,0,0,0);
//     transition: background .4s;
//     border-radius: 16px;
//     pointer-events: none;
//   }
//   .ig-marquee-item:hover::after { background: rgba(128,0,32,.1); }

//   /* ── Other animations ── */
//   @keyframes silkMove   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
//   @keyframes goldOrb    { 0%,100%{transform:scale(1);opacity:.16} 50%{transform:scale(1.3);opacity:.3} }
//   @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//   @keyframes crossA     { 0%,42%{opacity:1} 52%,94%{opacity:0} 100%{opacity:1} }
//   @keyframes crossB     { 0%,42%{opacity:0} 52%,94%{opacity:1} 100%{opacity:0} }
//   @keyframes grain      { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-3%)} 40%{transform:translate(3%,2%)} 60%{transform:translate(-1%,4%)} 80%{transform:translate(2%,-2%)} }
//   @keyframes shimmerBtn { 0%{left:-80%} 100%{left:120%} }
//   @keyframes goldBlink  { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 28px 4px rgba(212,175,55,.3)} }
  
//   /* CHANGE 4: goldShimmer — richer, more visible on light bg */
//   @keyframes goldShimmer {
//     0%   { background-position: -200% center; }
//     100% { background-position:  200% center; }
//   }

//   /* ── Buttons ── */
//   .btn-gold {
//     display:inline-flex; align-items:center; gap:10px;
//     padding:16px 40px;
//     background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
//     color: #800020;
//     border-radius:100px;
//     font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
//     font-weight:600; text-transform:uppercase;
//     text-decoration:none; border:none; cursor:pointer;
//     transition:transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s;
//     box-shadow:0 6px 28px rgba(212,175,55,.4);
//     position:relative; overflow:hidden;
//   }
//   .btn-gold::after {
//     content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
//     background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
//     animation:shimmerBtn 3s ease infinite;
//   }
//   .btn-gold:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(212,175,55,.55); }

//   .btn-outline-white {
//     display:inline-flex; align-items:center; gap:10px;
//     padding:15px 38px;
//     border:1.5px solid rgba(255,255,255,.75); color:white;
//     border-radius:100px;
//     font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
//     font-weight:500; text-transform:uppercase;
//     text-decoration:none; background:transparent;
//     transition:transform .4s, background .3s;
//   }
//   .btn-outline-white:hover { transform:translateY(-3px); background:rgba(255,255,255,.12); }

//   .btn-maroon {
//     display:inline-flex; align-items:center; gap:10px;
//     padding:17px 44px;
//     background:linear-gradient(135deg, #800020 0%, #4B0082 100%);
//     color:white;
//     border-radius:100px;
//     font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.12em;
//     font-weight:600; text-transform:uppercase;
//     text-decoration:none; border:none; cursor:pointer;
//     transition:transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s;
//     box-shadow:0 6px 28px rgba(128,0,32,.3);
//   }
//   .btn-maroon:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(128,0,32,.45); }

//   .link-gold {
//     display:inline-flex; align-items:center; gap:8px;
//     color:#C4980A; font-family:'Jost'; font-size:14px;
//     letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
//     font-weight:600;
//     transition:gap .3s, color .3s;
//   }
//   .link-gold:hover { gap:14px; color:#b8960f; }

//   /* ── Saree cards ── */
//   .saree-card { cursor:pointer; }
//   .saree-card-img {
//     overflow:hidden; border-radius:20px; position:relative;
//     box-shadow: 0 12px 48px rgba(0,0,0,.14);
//   }
//   .saree-card-img img {
//     width:100%; height:420px; object-fit:cover; display:block;
//     transition:transform .85s cubic-bezier(.4,0,.2,1);
//   }
//   .saree-card:hover .saree-card-img img { transform:scale(1.06); }
//   .saree-card-img::after {
//     content:''; position:absolute; inset:0; border-radius:20px;
//     background:rgba(0,0,0,0); transition:background .5s ease;
//     pointer-events:none;
//   }
//   .saree-card:hover .saree-card-img::after { background:rgba(0,0,0,.06); }

//   /* ── Gold badge ── */
//   .gold-badge {
//     display:inline-flex; align-items:center; gap:8px;
//     background:rgba(196,152,10,.12); border:1px solid rgba(196,152,10,.35);
//     padding:8px 18px; border-radius:100px;
//   }

//   /* ── Feature tag ── */
//   .feat-tag {
//     padding:8px 16px; border-radius:100px;
//     border:1px solid rgba(196,152,10,.4);
//     font-family:'Jost'; font-size:11px; letter-spacing:.10em;
//     color:#800020; text-transform:uppercase; background: rgba(196,152,10,.08);
//     font-weight:500;
//   }

//   /* ── SVG Thread path — used for decorative one-off paths ── */
//   .thread-path {
//     stroke-dasharray: 600;
//     stroke-dashoffset: 600;
//     opacity: 0;
//     transition: stroke-dashoffset 2.5s cubic-bezier(.4,0,.2,1) .4s, opacity .6s ease .4s;
//   }
//   .thread-path.on { stroke-dashoffset: 0; opacity: 1; }

//   /* ── Grain ── */
//   .grain-overlay {
//     position:absolute; inset:-100%; width:300%; height:300%; opacity:.12;
//     animation:grain 9s steps(8) infinite;
//     background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
//     pointer-events:none;
//   }

//   /* ── Stat pill ── */
//   .stat-pill {
//     background:rgba(255,249,240,.97); backdrop-filter:blur(10px);
//     border:1px solid rgba(196,152,10,.35); padding:14px 22px; border-radius:14px;
//   }

//   /* ── Collection ── */
//   .col-btn {
//     display:inline-block; padding:14px 36px;
//     border:1.5px solid rgba(255,255,255,.8); color:white;
//     border-radius:100px; text-decoration:none;
//     font-family:'Jost'; font-size:13px; letter-spacing:.12em; text-transform:uppercase;
//     transition:all .4s cubic-bezier(.4,0,.2,1);
//   }
//   .col-btn:hover { background:#D4AF37; border-color:#D4AF37; color:#800020; transform:translateY(-3px); }

//   /* ── Video player ── */
//   .video-wrapper {
//     position:relative; border-radius:22px; overflow:hidden;
//     box-shadow:0 44px 100px rgba(0,0,0,.22);
//   }
//   .video-wrapper video, .video-wrapper img {
//     width:100%; display:block; aspect-ratio:16/9; object-fit:cover;
//   }
//   .play-btn {
//     position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
//     width:80px; height:80px; border-radius:50%;
//     background:rgba(255,249,240,.96); border:2px solid rgba(212,175,55,.4);
//     display:flex; align-items:center; justify-content:center;
//     box-shadow:0 10px 40px rgba(0,0,0,.22); cursor:pointer;
//     animation:goldBlink 3s ease infinite; transition:transform .3s;
//   }
//   .play-btn:hover { transform:translate(-50%,-50%) scale(1.08); }

//   /* ── Quote card ── */
//   .quote-card {
//     background:rgba(255,249,240,.7); border:1px solid rgba(196,152,10,.3);
//     border-radius:20px; padding:36px 32px;
//     backdrop-filter:blur(6px);
//     transition:transform .4s, box-shadow .4s, border-color .4s;
//   }
//   .quote-card:hover {
//     transform:translateY(-4px);
//     box-shadow:0 20px 60px rgba(196,152,10,.15);
//     border-color:rgba(196,152,10,.55);
//   }

//   /* CHANGE 4: Shimmer text — deeper golds, never washes out on cream */
//   .shimmer-text {
//     background: linear-gradient(90deg,
//       #8a6800 0%,
//       #C4980A 25%,
//       #e8c84a 45%,
//       #C4980A 60%,
//       #8a6800 80%,
//       #C4980A 100%
//     );
//     background-size: 200% auto;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     animation: goldShimmer 4s linear infinite;
//   }

//   /* ── Responsive ── */
//   @media(max-width: 900px) {
//     .grid-2  { grid-template-columns:1fr!important; gap:48px!important; }
//     .grid-4  { grid-template-columns:1fr 1fr!important; gap:20px!important; }
//     .grid-6  { grid-template-columns:repeat(3,1fr)!important; gap:8px!important; }
//     .col-block-h { height:60vh!important; }
//     .hero-content { padding: 0 20px!important; }
//     .hero-btns { flex-direction: column!important; align-items:center!important; }
//     .loom-grid { gap: 40px!important; }
//   }
//   @media(max-width: 600px) {
//     .grid-4 { grid-template-columns:1fr!important; }
//     .grid-6 { grid-template-columns:1fr 1fr!important; }
//     .saree-card-img img { height:280px!important; }
//   }
// `;

// // ─── CHANGE 2: Golden Thread — continuous left-to-right marquee ───────────────
// function GoldenThread({ className = "" }) {
//   // Two identical SVG halves side by side; the track scrolls left at -50%, looping perfectly
//   const pathA = "M0,30 C220,5 330,55 550,30 C770,5 880,55 1100,30 C1210,10 1260,40 1320,30";
//   const pathB = "M0,40 C180,15 400,60 660,35 C920,10 1100,55 1320,35";

//   const HalfSvg = () => (
//     <svg className="thread-svg-half" viewBox="0 0 1320 60" preserveAspectRatio="none"
//       style={{ height: 60, display: "block" }}>
//       <path d={pathA} stroke="rgba(196,152,10,0.7)" strokeWidth="1.2" fill="none" />
//       <path d={pathB} stroke="rgba(196,152,10,0.5)" strokeWidth="0.8" fill="none" />
//     </svg>
//   );

//   return (
//     <div className={className}
//       style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none" }}>
//       <div className="thread-track">
//         <HalfSvg />
//         <HalfSvg />
//       </div>
//     </div>
//   );
// }

// // ─── 1. HERO ─────────────────────────────────────────────────────────────────
// function Hero() {
//   return (
//     <section style={{
//       position: "relative", height: "100vh", minHeight: 600,
//       display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
//     }}>
//       <img src={IMG.hero} alt="Hero" style={{
//         position: "absolute", inset: 0, width: "100%", height: "100%",
//         objectFit: "cover", objectPosition: "center top", display: "block"
//       }} />
//       <div style={{
//         position: "absolute", inset: 0,
//         background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(60,0,15,.45) 50%, rgba(0,0,0,.65) 100%)"
//       }} />
//       <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
//         <div style={{
//           position: "absolute", top: 0, bottom: 0, width: "38%",
//           background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
//           animation: "silkMove 15s linear infinite", willChange: "transform"
//         }} />
//       </div>
//       <div style={{
//         position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
//         width: 280, height: 280, borderRadius: "50%",
//         background: "radial-gradient(circle, rgba(212,175,55,.18) 0%, transparent 70%)",
//         animation: "goldOrb 7s ease-in-out infinite", willChange: "transform,opacity", pointerEvents: "none"
//       }} />

//       <div className="hero-content" style={{
//         position: "relative", zIndex: 2, textAlign: "center",
//         color: "white", padding: "0 32px", maxWidth: 860, width: "100%"
//       }}>
//         <div style={{ animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .15s both" }}>
//           <span className="ey" style={{ color: "rgba(212,175,55,0.95)" }}>Handwoven Heritage · Est. 2024</span>
//         </div>
//         <h1 style={{
//           fontFamily: "'Cormorant Garamond', serif",
//           fontSize: T.hero, fontWeight: 300, lineHeight: 1.06,
//           animation: "fadeUp 1.1s cubic-bezier(.4,0,.2,1) .4s both",
//           marginTop: 20, marginBottom: 24
//         }}>
//           Woven by Hand,<br />
//           <em style={{ fontStyle: "italic" }}>Worn by Soul</em>
//         </h1>
//         <div style={{ animation: "fadeUp 1s ease .6s both" }}>
//           <div style={{ width: 56, height: 1, background: "#D4AF37", margin: "0 auto 24px", opacity: .75 }} />
//         </div>
//         <p style={{
//           fontFamily: "'Jost'", fontSize: T.bodyLg, fontWeight: 300, lineHeight: 1.75,
//           color: "rgba(255,255,255,.85)", maxWidth: 500, margin: "0 auto 44px",
//           animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) .75s both"
//         }}>
//           Each saree carries the story of an artisan's love — earthy, intimate, timeless.
//         </p>
//         <div className="hero-btns" style={{
//           display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
//           animation: "fadeUp 1s cubic-bezier(.4,0,.2,1) 1s both"
//         }}>
//           <Link to="/shop" className="btn-gold">Discover the Loom</Link>
//           <Link to="/artisans" className="btn-outline-white">Meet the Artisans</Link>
//         </div>
//       </div>

//       <div style={{
//         position: "absolute", bottom: 32, right: 40,
//         display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
//         animation: "fadeUp 1s ease 1.5s both"
//       }}>
//         <span style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: ".22em", color: "rgba(255,255,255,.38)", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
//         <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(212,175,55,.6), transparent)" }} />
//       </div>
//     </section>
//   );
// }

// // ─── 2. LOOM STORY ───────────────────────────────────────────────────────────
// function LoomStory() {
//   const [ref, on] = useInView(0.15);
//   const [svgRef, sv] = useInView<SVGSVGElement>(0.35);
//   return (
//     // CHANGE 3: gradient background
//     <section ref={ref} style={{
//       padding: "120px 0",
//       background: "linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%)"
//     }}>
//       <div className="wrap">
//         <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
//           <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
//             <div style={{ position: "absolute", top: -18, right: -18, width: "56%", height: "56%", border: `1px solid rgba(196,152,10,.35)`, borderRadius: 18, pointerEvents: "none", zIndex: 0 }} />
//             <div style={{ position: "relative", zIndex: 1, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.18)" }}>
//               <img src={IMG.loom} alt="Handloom weaving" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
//               <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,175,55,.05) 0%, transparent 55%)", pointerEvents: "none" }} />
//             </div>
//             <div className="stat-pill" style={{ position: "absolute", bottom: -22, left: -16, zIndex: 2 }}>
//               <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.maroon, fontWeight: 500, lineHeight: 1 }}>3 Generations</div>
//               <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", color: C.warmGrey, marginTop: 4, textTransform: "uppercase" }}>of weaving mastery</div>
//             </div>
//             <svg ref={svgRef} style={{ position: "absolute", bottom: -40, right: -32, width: 88, height: 88, overflow: "visible", color: C.gold, zIndex: 2 }} viewBox="0 0 100 100">
//               <path className={`thread-path ${sv ? "on" : ""}`} d="M8 88 Q 52 8, 92 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
//             </svg>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             <span className={`ey rv d1 ${on ? "on" : ""}`}>The Craft</span>
//             <h2 className={`rv d2 ${on ? "on" : ""}`}
//               style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, lineHeight: 1.12, color: C.maroon }}>
//               Every Thread<br />is a Prayer
//             </h2>
//             <div className={`gd rv d3 ${on ? "on" : ""}`} />
//             <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
//               Our looms are not machines — they are extensions of the artisan's soul. Passed down through generations, the rhythm of the shuttle echoes the heartbeat of rural India.
//             </p>
//             <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
//               We work directly with weavers in Bengal, Varanasi, and Odisha, preserving techniques that predate written history. When you wear a Neyge saree, you wear a legacy.
//             </p>
//             <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
//               {[
//                 ["Zero Power Loom", "Every yarn woven by hand"],
//                 ["Direct from Weaver", "No middlemen involved"],
//                 ["Heritage Certified", "Govt GI tag holders"],
//                 ["Fair Wage Pledge", "Artisan-first economics"]
//               ].map(([t, s]) => (
//                 <div key={t} style={{ background: C.cream, border: `1px solid rgba(196,152,10,.35)`, borderRadius: 12, padding: "13px 15px" }}>
//                   <div style={{ fontFamily: "'Jost'", fontSize: 11, color: C.gold, letterSpacing: ".1em", marginBottom: 5, fontWeight: 700 }}>✦ {t}</div>
//                   <div style={{ fontFamily: "'Jost'", fontSize: 12, color: C.warmGrey, fontWeight: 400 }}>{s}</div>
//                 </div>
//               ))}
//             </div>
//             <div className={`rv d6 ${on ? "on" : ""}`}>
//               <Link to="/about" className="link-gold">Read the full loom story <span style={{ fontSize: 16 }}>→</span></Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── 3. COLLECTION BLOCK ─────────────────────────────────────────────────────
// function CollectionBlock({ img, title, subtitle, href }: { img: string; title: string; subtitle: string; href: string }) {
//   const [ref, on] = useInView<HTMLDivElement>(0.08);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const h = () => {
//       const r = el.getBoundingClientRect();
//       const progress = -r.top / window.innerHeight;
//       const imgEl = el.querySelector("img");
//       if (imgEl) imgEl.style.transform = `translateY(${Math.min(Math.max(progress * 9, -8), 8)}%)`;
//     };
//     window.addEventListener("scroll", h, { passive: true });
//     return () => window.removeEventListener("scroll", h);
//   }, []);

//   return (
//     <div ref={scrollRef} className="col-block-h"
//       style={{ position: "relative", height: "80vh", overflow: "hidden" }}>
//       <div ref={ref} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
//         <img src={img} alt={title} style={{ width: "100%", height: "115%", objectFit: "cover", display: "block" }} />
//       </div>
//       <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 45%, rgba(0,0,0,.35) 100%)" }} />
//       <div style={{
//         position: "relative", zIndex: 2, height: "100%",
//         display: "flex", flexDirection: "column", alignItems: "center",
//         justifyContent: "flex-end", paddingBottom: 80, textAlign: "center", color: "white"
//       }}>
//         <span className={`ey rv ${on ? "on" : ""}`} style={{ color: "rgba(212,175,55,.95)", marginBottom: 16 }}>Collection</span>
//         <h3 className={`rv d2 ${on ? "on" : ""}`}
//           style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,7vw,78px)", fontWeight: 300, lineHeight: 1.06, marginBottom: 16 }}>
//           {title}
//         </h3>
//         <p className={`rv d3 ${on ? "on" : ""}`}
//           style={{ fontFamily: "'Jost'", fontSize: 17, fontWeight: 300, color: "rgba(255,255,255,.82)", marginBottom: 40, maxWidth: 460 }}>
//           {subtitle}
//         </p>
//         <div className={`rv d4 ${on ? "on" : ""}`}>
//           <Link to={href} className="col-btn">Explore Collection</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── 4. ARTISAN SPOTLIGHT ────────────────────────────────────────────────────
// function ArtisanSpotlight() {
//   const [ref, on] = useInView(0.12);
//   return (
//     // CHANGE 3: gradient background
//     <section ref={ref} id="artisans" style={{
//       padding: "120px 0",
//       background: "linear-gradient(135deg, #F5E6D3 0%, #EED9C4 40%, #F0E0CE 100%)"
//     }}>
//       <div className="wrap">
//         <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
//           <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
//             <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 48px 100px rgba(0,0,0,.2)", aspectRatio: "4/5", position: "relative" }}>
//               <img src={IMG.artisan} alt="Artisan" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossA 15s ease-in-out infinite" }} />
//               <img src={IMG.artisan2} alt="Artisan 2" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossB 15s ease-in-out infinite" }} />
//             </div>
//             <div style={{
//               position: "absolute", bottom: 24, left: -14,
//               background: "rgba(255,249,240,.97)", backdropFilter: "blur(12px)",
//               border: `1px solid rgba(196,152,10,.35)`, padding: "13px 20px",
//               borderRadius: 100, display: "flex", gap: 10, alignItems: "center",
//               boxShadow: "0 8px 32px rgba(0,0,0,.12)"
//             }}>
//               <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D4AF37", flexShrink: 0, animation: "goldBlink 2.5s ease infinite" }} />
//               <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.maroon, fontWeight: 600 }}>
//                 Master Weaver · 200+ Yr Legacy
//               </span>
//             </div>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             <div className={`gold-badge rv d1 ${on ? "on" : ""}`} style={{ width: "fit-content" }}>
//               <span style={{ color: C.gold, fontSize: 13 }}>♥</span>
//               <span className="ey">Artisan Spotlight</span>
//             </div>
//             <h2 className={`rv d2 ${on ? "on" : ""}`}
//               style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12 }}>
//               Meet Radha Devi
//             </h2>
//             <div className={`gd rv d3 ${on ? "on" : ""}`} />
//             <blockquote className={`rv d3 ${on ? "on" : ""}`}
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic",
//                 fontWeight: 400, color: "#3a1818", lineHeight: 1.78,
//                 borderLeft: `2.5px solid rgba(196,152,10,.4)`, paddingLeft: 22, margin: 0
//               }}>
//               "I learned to weave from my mother when I was seven. The loom is like a third hand to me. Every saree I make carries a piece of my home — the smell of earth, the sound of peacocks, the warmth of the sun on fresh yarn."
//             </blockquote>
//             <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.85, color: C.warmGrey, fontWeight: 400 }}>
//               Radha is one of 43 master weavers we collaborate with in the villages of Murshidabad. Her family has been weaving silk for over 200 years.
//             </p>
//             <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//               {[["43", "Artisans"], ["6", "States"], ["200+", "Yr Heritage"]].map(([n, l]) => (
//                 <div key={l} style={{ textAlign: "center", padding: "14px 20px", background: "rgba(255,249,240,.8)", border: `1px solid rgba(196,152,10,.35)`, borderRadius: 14 }}>
//                   <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, color: C.maroon, lineHeight: 1 }}>{n}</div>
//                   <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.warmGrey, marginTop: 4, fontWeight: 500 }}>{l}</div>
//                 </div>
//               ))}
//             </div>
//             <div className={`rv d6 ${on ? "on" : ""}`}>
//               <Link to="/artisans" className="link-gold">Meet all artisans <span style={{ fontSize: 16 }}>→</span></Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── 5. FEATURED SAREES ──────────────────────────────────────────────────────
// const SAREES = [
//   { img: IMG.saree1, name: "Banarasi Silk", region: "Varanasi · Zari Brocade", price: "₹18,500", id: "banarasi-silk" },
//   { img: IMG.saree2, name: "Kanchipuram", region: "Tamil Nadu · Pure Silk", price: "₹24,000", id: "kanchipuram" },
//   { img: IMG.saree3, name: "Handloom Cotton", region: "Bengal · Block Print", price: "₹8,500", id: "handloom-cotton" },
//   { img: IMG.saree4, name: "Patola Ikat", region: "Gujarat · Double Ikat", price: "₹32,000", id: "patola-ikat" },
// ];

// function FeaturedSarees() {
//   const [ref, on] = useInView(0.08);
//   return (
//     // CHANGE 3: gradient background
//     <section ref={ref} id="shop" style={{
//       padding: "120px 0",
//       background: "linear-gradient(180deg, #FFF9F0 0%, #FDF5EA 60%, #F8EEE2 100%)"
//     }}>
//       <div className="wrap">
//         <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
//           <span className="ey" style={{ display: "block", marginBottom: 16 }}>Curated Collection</span>
//           <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, marginBottom: 16 }}>
//             Featured Sarees
//           </h2>
//           <div className="gd gd-c" style={{ marginBottom: 18 }} />
//           <p style={{ fontFamily: "'Jost'", fontSize: T.body, color: C.warmGrey, fontWeight: 400, maxWidth: 400, margin: "0 auto" }}>
//             Each piece handpicked for its soulful craftsmanship
//           </p>
//         </div>

//         <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
//           {SAREES.map((s, i) => (
//             <div key={i} className={`saree-card rv d${i + 1} ${on ? "on" : ""}`}>
//               <div className="saree-card-img">
//                 <img src={s.img} alt={s.name} />
//                 <div style={{
//                   position: "absolute", top: 14, right: 14,
//                   background: "rgba(212,175,55,.95)", padding: "5px 12px", borderRadius: 100, zIndex: 1
//                 }}>
//                   <span style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: ".1em", color: C.maroon, fontWeight: 700, textTransform: "uppercase" }}>Handloom</span>
//                 </div>
//               </div>
//               <div style={{ marginTop: 18, padding: "0 4px" }}>
//                 <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: C.maroon, marginBottom: 5 }}>{s.name}</h3>
//                 <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".08em", marginBottom: 12, fontWeight: 400 }}>{s.region}</p>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: C.gold }}>{s.price}</span>
//                   <Link to={`/product/${s.id}`} className="link-gold" style={{ fontSize: 12 }}>View →</Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div style={{ textAlign: "center", marginTop: 60 }}>
//           <Link to="/shop" className="btn-maroon">View All Sarees &nbsp;→</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── 6. TEXTURE QUOTE ────────────────────────────────────────────────────────
// function TextureQuote() {
//   const [ref, on] = useInView(0.18);
//   return (
//     <section ref={ref} style={{ position: "relative", padding: "150px 24px", overflow: "hidden" }}>
//       <div style={{ position: "absolute", inset: 0 }}>
//         <img src={IMG.texture} alt="Texture" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//         <div style={{ position: "absolute", inset: 0, background: "rgba(6,1,1,.60)" }} />
//         <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(212,175,55,.08) 0%, transparent 70%)" }} />
//         <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><div className="grain-overlay" /></div>
//       </div>
//       <div className={`rv ${on ? "on" : ""}`}
//         style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 40 }}>
//           <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,.5))" }} />
//           <span style={{ color: "#D4AF37", fontSize: 18 }}>✦</span>
//           <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,.5))" }} />
//         </div>
//         <blockquote style={{
//           fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,5vw,56px)",
//           fontStyle: "italic", fontWeight: 300, color: "white", lineHeight: 1.42
//         }}>
//           "Handmade is not a trend.<br />It is a truth."
//         </blockquote>
//         <div style={{ width: 60, height: 1, background: "#D4AF37", margin: "36px auto", opacity: .65 }} />
//         <p style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(255,255,255,.38)" }}>
//           NEYGE COUTURE · Artisan Soul
//         </p>
//       </div>
//     </section>
//   );
// }

// // ─── 7. VIDEO SHOPPING ───────────────────────────────────────────────────────
// function VideoShopping() {
//   const [ref, on] = useInView(0.12);
//   const [playing, setPlaying] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handlePlay = () => {
//     setPlaying(true);
//     videoRef.current?.play();
//   };

//   return (
//     // CHANGE 3: gradient background
//     <section ref={ref} style={{
//       padding: "120px 0",
//       background: "linear-gradient(135deg, #F5E6D3 0%, #EDD8C2 50%, #F0DFC9 100%)"
//     }}>
//       <div className="wrap">
//         <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 72, alignItems: "center" }}>
//           <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
//             <div className="video-wrapper">
//               <video ref={videoRef} src="" poster={IMG.videoBg} controls={playing} playsInline
//                 style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
//               {!playing && (
//                 <button className="play-btn" onClick={handlePlay} aria-label="Play video">
//                   <div style={{ width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: `22px solid ${C.maroon}`, marginLeft: 5 }} />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             <span className={`ey rv d1 ${on ? "on" : ""}`}>Premium Service</span>
//             <h2 className={`rv d2 ${on ? "on" : ""}`}
//               style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12 }}>
//               Shop with<br />a Stylist
//             </h2>
//             <div className={`gd rv d3 ${on ? "on" : ""}`} />
//             <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontSize: T.body, lineHeight: 1.88, color: C.warmGrey, fontWeight: 400 }}>
//               Not sure which saree tells your story? Book a one-on-one video session with our in-house styling experts. We guide you through drapes, fabrics, and occasions — from the comfort of your home.
//             </p>
//             <div className={`rv d4 ${on ? "on" : ""}`} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//               {["Draping guidance", "Fabric expertise", "Occasion styling", "Free of charge"].map(t => (
//                 <span key={t} className="feat-tag">{t}</span>
//               ))}
//             </div>
//             <div className={`rv d5 ${on ? "on" : ""}`} style={{ marginTop: 4 }}>
//               <Link to="/video-shopping" className="btn-gold">▶&nbsp; Book a Free Session</Link>
//             </div>
//             <p className={`rv d6 ${on ? "on" : ""}`} style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".06em", fontWeight: 400 }}>
//               Over 3,200 sessions completed · Rated 4.9 ★
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── 8. INSTAGRAM — CHANGE 1: Continuous horizontal marquee ──────────────────
// const IG_IMGS = [IMG.ig1, IMG.ig2, IMG.ig3, IMG.ig4, IMG.ig5, IMG.ig6];

// function InstagramGrid() {
//   const [ref, on] = useInView(0.08);
//   // Duplicate the array so the loop is seamless
//   const doubled = [...IG_IMGS, ...IG_IMGS];

//   return (
//     // CHANGE 3: gradient background
//     <section ref={ref} style={{
//       padding: "112px 0",
//       background: "linear-gradient(180deg, #FFF9F0 0%, #FDF6EC 60%, #F8EEE2 100%)"
//     }}>
//       <div className="wrap">
//         <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
//           <span className="ey" style={{ display: "block", marginBottom: 16 }}>Visual Diary</span>
//           <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon, marginBottom: 10 }}>
//             From Our World
//           </h2>
//           <p style={{ fontFamily: "'Jost'", fontSize: T.small, color: "#9a8070", letterSpacing: ".12em", fontWeight: 500 }}>@neyge.couture</p>
//         </div>
//       </div>

//       {/* Full-bleed overflow marquee — no padding wrapper */}
//       <div style={{ overflow: "hidden", width: "100%" }}>
//         <div className="ig-marquee-track">
//           {doubled.map((src, i) => (
//             <div key={i} className="ig-marquee-item">
//               <img src={src} alt={`Gallery ${(i % IG_IMGS.length) + 1}`} />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ textAlign: "center", marginTop: 36 }}>
//         <a href="https://instagram.com/neyge.couture" className="link-gold" target="_blank" rel="noreferrer">
//           📷 &nbsp;See more on Instagram →
//         </a>
//       </div>
//     </section>
//   );
// }

// // ─── 9. FINAL CTA ────────────────────────────────────────────────────────────
// const QUOTES = [
//   { text: "She didn't just wear a saree. She wore six yards of someone's lifetime.", attr: "— A Neyge wearer, Mumbai" },
//   { text: "Every knot in this loom is a wish my grandmother wove for her daughters.", attr: "— Radha Devi, Master Weaver" },
//   { text: "In a world of fast fashion, we choose to be slow. We choose to be woven.", attr: "— The Neyge Story" },
// ];

// function FinalCTA() {
//   const [ref, on] = useInView(0.15);
//   const [qRef, qOn] = useInView(0.1);
//   return (
//     <>
//       {/* ── Emotional Quotes Strip ── */}
//       <section ref={qRef} style={{
//         padding: "100px 0",
//         // CHANGE 3: gradient background
//         background: "linear-gradient(160deg, #F5E6D3 0%, #EDD8C4 50%, #F0DDCC 100%)",
//         position: "relative", overflow: "hidden"
//       }}>
//         {/* CHANGE 2: continuously flowing threads via CSS translate animation */}
//         <svg style={{
//           position: "absolute", inset: 0, width: "100%", height: "100%",
//           pointerEvents: "none", opacity: .18, overflow: "visible"
//         }}
//           viewBox="0 0 1320 300" preserveAspectRatio="none">
//           <path className="flowing-thread-1"
//             d="M0,150 C200,60 400,240 660,150 C920,60 1100,240 1320,150"
//             stroke="#C4980A" strokeWidth="1.5" fill="none" />
//           <path className="flowing-thread-2"
//             d="M0,100 C300,180 600,20 900,100 C1100,160 1220,60 1320,100"
//             stroke="#C4980A" strokeWidth="1" fill="none" />
//         </svg>

//         <div className="wrap">
//           <div className={`rv ${qOn ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
//             <span className="ey" style={{ display: "block", marginBottom: 16 }}>Voices & Stories</span>
//             <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: T.h2, fontWeight: 400, color: C.maroon }}>
//               Words Woven in Time
//             </h2>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="grid-2">
//             {QUOTES.map((q, i) => (
//               <div key={i} className={`quote-card rv d${i + 1} ${qOn ? "on" : ""}`}>
//                 <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, lineHeight: .8, color: C.gold, opacity: .5, marginBottom: 12, fontWeight: 600 }}>"</div>
//                 <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontStyle: "italic", fontWeight: 400, color: "#3a1818", lineHeight: 1.72, marginBottom: 20 }}>
//                   {q.text}
//                 </p>
//                 <div style={{ width: 32, height: 1, background: "rgba(196,152,10,.4)", marginBottom: 12 }} />
//                 <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a8070", letterSpacing: ".08em", fontWeight: 500 }}>{q.attr}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Golden Thread Divider ── */}
//       <GoldenThread />

//       {/* ── Final CTA ── */}
//       <section ref={ref} style={{
//         padding: "140px 48px",
//         // CHANGE 3: gradient background matching the cream/gold theme
//         background: "linear-gradient(160deg, #F8EEE2 0%, #F0DFD0 40%, #EDD8C4 70%, #F5E6D3 100%)",
//         textAlign: "center", position: "relative", overflow: "hidden"
//       }}>
//         {/* Decorative rings */}
//         <div style={{ position: "absolute", left: "8%", top: "50%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", border: `1px solid rgba(196,152,10,.12)`, pointerEvents: "none" }} />
//         <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 320, height: 320, borderRadius: "50%", border: `1px solid rgba(196,152,10,.12)`, pointerEvents: "none" }} />
//         <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 680, height: 680, borderRadius: "50%", border: `1px solid rgba(196,152,10,.06)`, pointerEvents: "none" }} />

//         {/* CHANGE 2: continuously flowing animated threads */}
//         <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} viewBox="0 0 1320 500" preserveAspectRatio="none">
//           <path className="flowing-thread-1"
//             d="M100,250 Q400,80 660,250 Q920,420 1220,250"
//             stroke="#C4980A" strokeWidth="0.8" fill="none" opacity=".22" />
//           <path className="flowing-thread-2"
//             d="M0,350 Q330,150 660,300 Q990,450 1320,200"
//             stroke="#C4980A" strokeWidth="0.6" fill="none" opacity=".14" />
//         </svg>

//         <div className={`rv ${on ? "on" : ""}`}
//           style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

//           <span className="ey" style={{ marginBottom: 22 }}>Begin Your Journey</span>

//           {/* CHANGE 4: shimmer-text — deep golds never wash out on cream */}
//           <h2 className="shimmer-text" style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: "clamp(60px, 11vw, 118px)",
//             fontWeight: 300, lineHeight: .95, letterSpacing: "-.02em", marginBottom: 16
//           }}>
//             Own a Story.
//           </h2>

//           <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", fontWeight: 300, color: "#5a3c28", marginBottom: 8 }}>
//             Six yards. One lifetime.
//           </p>

//           <p style={{ fontFamily: "'Jost'", fontSize: 13, color: "#7a5c44", letterSpacing: ".06em", fontWeight: 400, maxWidth: 420, textAlign: "center", lineHeight: 1.7, marginBottom: 24 }}>
//             "When you drape a Neyge saree, you carry the dreams of the weaver who made it, the love of the artisan who dyed it, and the soul of the land it came from."
//           </p>

//           <div style={{ width: 60, height: 1, background: "#C4980A", marginBottom: 44, opacity: .6 }} />

//           <Link to="/shop" className="btn-gold" style={{ fontSize: 15, padding: "18px 52px" }}>
//             Explore Neyge &nbsp;→
//           </Link>

//           <p style={{ fontFamily: "'Jost'", fontSize: 12, color: "#9a7a60", marginTop: 26, letterSpacing: ".08em" }}>
//             Free shipping on orders above ₹5,000 · COD available
//           </p>
//         </div>
//       </section>
//     </>
//   );
// }

// // ─── ROOT ────────────────────────────────────────────────────────────────────
// export default function HomePage() {
//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="neyge-root">
//         <Hero />

//         <GoldenThread />

//         <LoomStory />

//         <div style={{ marginBottom: 0 }}>
//           <CollectionBlock
//             img={IMG.collection1}
//             title="The Terracotta Weave"
//             subtitle="Inspired by the red soil of Bengal — raw, earthy, eternal."
//             href="/collections"
//           />
//         </div>
//         <GoldenThread />
//         <div style={{ marginBottom: 0 }}>
//           <CollectionBlock
//             img={IMG.collection2}
//             title="Indigo Memories"
//             subtitle="Deep blues that tell stories of the night sky over the village."
//             href="/collections"
//           />
//         </div>

//         <GoldenThread />

//         <ArtisanSpotlight />

//         <GoldenThread />

//         <FeaturedSarees />

//         <GoldenThread />

//         <TextureQuote />

//         <GoldenThread />

//         <VideoShopping />

//         <GoldenThread />

//         <InstagramGrid />

//         <FinalCTA />
//       </div>
//     </>
//   );
// }


//below code is updated with new changes as per the instructions, please check and let me know if you need any changes.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/bd3.png";
import loomimg from "@/assets/g1.png";
import img3 from "@/assets/g3.png";
import img5 from "@/assets/g5.png";
import img6 from "@/assets/g6.png";
import img7 from "@/assets/g7.png";
import img8 from "@/assets/g8.jpg";
import img9 from "@/assets/g9.png";
import img10 from "@/assets/g10.png";
import img11 from "@/assets/g11.png";
import img12 from "@/assets/g12.png";
import img15 from "@/assets/g15.png";
import img16 from "@/assets/g16.jpg";
import img17 from "@/assets/i.png";
import img18 from "@/assets/i2.png";
import { getProducts } from "@/api/products";
import { SareeCard } from "@/components/features/SareeCard";
import type { Saree } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// BRAND PALETTE — extracted pixel-accurately from Neyge brand book PDFs
// Final colour bar (last page): Navy | Maroon | Blush | Forest Green
// Logo colours: Dark Forest Green wordmark, Maroon sindoor dots
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // ── PRIMARY ──
  maroon:      "#800020",   // brand primary — sindoor dots, main CTA
  maroonDeep:  "#5a0016",   // deep maroon for dark sections
  maroonLight: "#a0002a",   // lighter maroon hover

  // ── SECONDARY ──
  navy:        "#1B2A6B",   // from brandbook palette bar
  navyDeep:    "#0E1A4A",   // deep navy for dark bg
  navyMid:     "#263580",   // mid navy

  // ── FOREST GREEN ──
  forest:      "#14402A",   // from brandbook — logo wordmark colour
  forestMid:   "#1e5c3c",   // mid green
  forestLight: "#2a7a50",   // lighter green accent

  // ── GOLD / ACCENT ──
  gold:        "#C4980A",   // muted gold — borders, eyebrow labels
  goldVibrant: "#D4AF37",   // bright gold — buttons, shimmer
  goldLight:   "#e8c84a",   // lightest gold
  goldPale:    "rgba(196,152,10,0.12)",
  goldBorder:  "rgba(196,152,10,0.35)",

  // ── BLUSH / PINK ──
  blush:       "#F2C4CE",   // from brandbook palette bar — soft accent
  blushMid:    "#d9a0ab",   // mid blush

  // ── CREAM / BACKGROUND ──
  cream:       "#F5E6D3",   // warm cream — primary background
  creamLight:  "#FFF9F0",   // near-white cream
  creamMid:    "#F8EEE2",   // mid cream
  creamDark:   "#EDD8C4",   // darker cream

  // ── NEUTRALS ──
  charcoal:    "#1a1010",
  warmGrey:    "#4a3828",
  warmGreyLt:  "#7a5c44",
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY — Brand book specifies:
//   Heading : Copperplate (Regular / Light / Bold)
//   Body    : Josefin Sans (Regular / Light / Medium)
// Copperplate is not on Google Fonts — Cinzel is the closest web-safe match
// (same geometric all-caps serif, used in premium luxury branding)
// ─────────────────────────────────────────────────────────────────────────────
const FONT = {
  heading: "'Cinzel', serif",             // Copperplate replacement
  body:    "'Josefin Sans', sans-serif",  // brand-specified body font
  serif:   "'Cormorant Garamond', serif", // editorial italic quotes only
};

const T = {
  hero:    "clamp(44px, 7vw, 80px)",
  h2:      "clamp(28px, 3.8vw, 46px)",
  h3:      "clamp(18px, 2vw, 26px)",
  body:    "15px",
  bodyLg:  "17px",
  small:   "12px",
  eyebrow: "10px",
};

const IMG = {
  hero:        img3,
  loom:        loomimg,
  collection1: heroImg,
  collection2: img18,
  artisan:     img5,
  artisan2:    img6,
  texture:     img15,
  texture2:     img17,
  videoBg:     img12,
  ig1: img7, ig2: img8, ig3: img9,
  ig4: img10, ig5: img11, ig6: img16,
};

// ─── Types (unchanged) ───────────────────────────────────────────────────────
type BackendProduct = {
  id: string; name: string; slug?: string; price: number;
  discount_price?: number | null; thumbnail?: string | null;
  images?: string[]; short_description?: string | null;
  color?: string | null; fabric?: string | null; stock?: number | null;
  technique?: string | null;
  artisan?: { name?: string; region?: string; experience?: string } | null;
  occasion?: string[]; care_instructions?: string | null; is_featured?: boolean;
};
type ProductsApiResponse = {
  success: boolean; message: string; data: { items: BackendProduct[] };
};

function mapProductToSaree(p: BackendProduct): Saree {
  const primary = p.thumbnail || p.images?.[0] || "";
  const imgs = p.images?.length ? p.images.filter(Boolean) : primary ? [primary] : [];
  return {
    id: p.id, slug: p.slug || "", name: p.name,
    price: p.discount_price ?? p.price, originalPrice: p.price,
    image: primary, images: imgs,
    description: p.short_description || "", color: p.color || "",
    fabric: p.fabric || "", occasion: p.occasion || [],
    weavingTechnique: p.technique || "",
    artisanDetails: p.artisan?.name
      ? `${p.artisan.name}${p.artisan.region ? ` - ${p.artisan.region}` : ""}${p.artisan.experience ? ` · ${p.artisan.experience}` : ""}`
      : "",
    careInstructions: p.care_instructions || "Handle with care.",
    stock: p.stock || 0, rating: 4.8, reviews: 24,
    featured: p.is_featured || false, blousePiece: false,
    length: "5.5 meters", newArrival: false, bestSeller: false,
  };
}

function useInView<T extends Element = HTMLElement>(
  threshold = 0.12
): [React.RefObject<T | null>, boolean] {
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

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
  /* ── Brand fonts: Cinzel (Copperplate equiv) + Josefin Sans + Cormorant ── */
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  /* ── CSS Custom Properties — all 4 brand palette colours + full range ── */
  :root {
    --maroon:       #800020;
    --maroon-deep:  #5a0016;
    --maroon-light: #a0002a;
    --navy:         #1B2A6B;
    --navy-deep:    #0E1A4A;
    --navy-mid:     #263580;
    --forest:       #14402A;
    --forest-mid:   #1e5c3c;
    --forest-light: #2a7a50;
    --blush:        #F2C4CE;
    --blush-mid:    #d9a0ab;
    --gold:         #C4980A;
    --gold-v:       #D4AF37;
    --gold-pale:    rgba(196,152,10,0.12);
    --gold-border:  rgba(196,152,10,0.35);
    --cream:        #F5E6D3;
    --cream-lt:     #FFF9F0;
    --cream-mid:    #F8EEE2;
    --cream-dk:     #EDD8C4;
    --warm-grey:    #4a3828;
    --warm-grey-lt: #7a5c44;
  }

  .neyge-root {
    font-family: 'Josefin Sans', sans-serif;
    background: var(--cream-lt);
    color: var(--maroon-deep);
    overflow-x: hidden;
    line-height: 1;
  }

  /* ── Eyebrow label — Josefin Sans, gold ── */
  .ey {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
  }

  /* ── Cinzel heading class ── */
  .cinzel { font-family: 'Cinzel', serif; font-weight: 400; letter-spacing: 0.04em; }

  /* ── Gold rule divider ── */
  .gd   { width: 44px; height: 1px; background: var(--gold); }
  .gd-c { margin: 0 auto; }

  /* ── Container ── */
  .wrap { max-width: 1320px; margin: 0 auto; padding: 0 64px; }
  @media(max-width:900px) { .wrap { padding: 0 24px; } }

  /* ── Scroll reveal ── */
  .rv    { opacity:0; transform:translateY(26px); transition:opacity .9s cubic-bezier(.4,0,.2,1), transform .9s cubic-bezier(.4,0,.2,1); }
  .rv.on { opacity:1; transform:translateY(0); }
  .rv-l    { opacity:0; transform:translateX(-42px); transition:opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1); }
  .rv-l.on { opacity:1; transform:translateX(0); }
  .rv-r    { opacity:0; transform:translateX(42px); transition:opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1); }
  .rv-r.on { opacity:1; transform:translateX(0); }
  .d1{transition-delay:.07s!important} .d2{transition-delay:.17s!important}
  .d3{transition-delay:.29s!important} .d4{transition-delay:.42s!important}
  .d5{transition-delay:.56s!important} .d6{transition-delay:.70s!important}

  /* ── Keyframes ── */
  @keyframes threadMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes igMarquee     { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes flowR1 { 0%{transform:translateX(-8%)} 100%{transform:translateX(8%)} }
  @keyframes flowR2 { 0%{transform:translateX(6%)}  100%{transform:translateX(-6%)} }
  @keyframes silkMove  { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
  @keyframes goldOrb   { 0%,100%{transform:scale(1);opacity:.13} 50%{transform:scale(1.25);opacity:.26} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes crossA    { 0%,42%{opacity:1} 52%,94%{opacity:0} 100%{opacity:1} }
  @keyframes crossB    { 0%,42%{opacity:0} 52%,94%{opacity:1} 100%{opacity:0} }
  @keyframes grain     { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-3%)} 40%{transform:translate(3%,2%)} 60%{transform:translate(-1%,4%)} 80%{transform:translate(2%,-2%)} }
  @keyframes shimBtn   { 0%{left:-80%} 100%{left:120%} }
  @keyframes goldBlink { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 22px 4px rgba(212,175,55,.26)} }
  @keyframes goldShim  { 0%{background-position:-200% center} 100%{background-position:200% center} }

  /* ── Golden thread marquee ── */
  .thread-track    { display:flex; width:200%; animation:threadMarquee 14s linear infinite; }
  .thread-svg-half { width:50%; flex-shrink:0; }
  .flowing-thread-1 { animation:flowR1 7s ease-in-out infinite alternate; }
  .flowing-thread-2 { animation:flowR2 9s ease-in-out infinite alternate; }

  /* ── Thread draw-on SVG path ── */
  .thread-path { stroke-dasharray:600; stroke-dashoffset:600; opacity:0; transition:stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) .4s, opacity .6s ease .4s; }
  .thread-path.on { stroke-dashoffset:0; opacity:1; }

  /* ── Instagram marquee ── */
  .ig-track { display:flex; gap:10px; width:max-content; animation:igMarquee 22s linear infinite; }
  .ig-item  { width:284px; flex-shrink:0; overflow:hidden; position:relative; cursor:pointer; }
  .ig-item img { width:100%; height:220px; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.4,0,.2,1); }
  .ig-item:hover img { transform:scale(1.05); }
  .ig-item::after { content:''; position:absolute; inset:0; background:rgba(128,0,32,0); transition:background .4s; pointer-events:none; }
  .ig-item:hover::after { background:rgba(128,0,32,.07); }

  /* ── Heritage band (navy strip) ── */
  .heritage-band { background:var(--navy); padding:14px 0; overflow:hidden; }
  .heritage-scroll { display:flex; width:max-content; animation:igMarquee 30s linear infinite; }
  .heritage-item {
    display:flex; align-items:center; gap:26px; padding:0 32px;
    font-family:'Josefin Sans'; font-size:9px; letter-spacing:.26em;
    text-transform:uppercase; color:rgba(255,255,255,.72); white-space:nowrap;
  }
  .heritage-dot { color:var(--gold-v); font-size:12px; }

  /* ── Grain overlay ── */
  .grain-overlay {
    position:absolute; inset:-100%; width:300%; height:300%; opacity:.09;
    animation:grain 9s steps(8) infinite;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    pointer-events:none;
  }

  /* ── Value strip (hero brand label row) ── */
  .value-strip {
    display:flex; align-items:center; gap:8px;
    font-family:'Josefin Sans'; font-size:9px; letter-spacing:.26em;
    text-transform:uppercase; color:rgba(255,255,255,.5);
  }
  .value-dot { width:3px; height:3px; border-radius:50%; background:rgba(212,175,55,.65); flex-shrink:0; }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BUTTONS — square corners (matches brand card / cert / packaging style)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  .btn-gold {
    display:inline-flex; align-items:center; gap:10px;
    padding:14px 38px;
    background:linear-gradient(135deg, #D4AF37 0%, #b89a0c 100%);
    color:var(--maroon-deep);
    font-family:'Josefin Sans'; font-size:10px; letter-spacing:.22em;
    font-weight:700; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
    box-shadow:0 5px 24px rgba(196,152,10,.32);
    position:relative; overflow:hidden;
  }
  .btn-gold::after {
    content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
    animation:shimBtn 3s ease infinite;
  }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(196,152,10,.48); }

  .btn-outline-white {
    display:inline-flex; align-items:center; gap:10px;
    padding:13px 36px;
    border:1px solid rgba(255,255,255,.6); color:white;
    font-family:'Josefin Sans'; font-size:10px; letter-spacing:.22em;
    font-weight:500; text-transform:uppercase;
    text-decoration:none; background:transparent;
    transition:transform .35s, background .3s, border-color .3s;
  }
  .btn-outline-white:hover { transform:translateY(-2px); background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.88); }

  /* Maroon = brand primary CTA */
  .btn-maroon {
    display:inline-flex; align-items:center; gap:10px;
    padding:14px 42px;
    background:var(--maroon);
    color:white;
    font-family:'Josefin Sans'; font-size:10px; letter-spacing:.22em;
    font-weight:700; text-transform:uppercase;
    text-decoration:none; border:none; cursor:pointer;
    transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s, background .3s;
    box-shadow:0 5px 24px rgba(128,0,32,.2);
  }
  .btn-maroon:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(128,0,32,.36); background:var(--maroon-deep); }

  /* Gold text link */
  .link-gold {
    display:inline-flex; align-items:center; gap:7px;
    color:var(--gold); font-family:'Josefin Sans'; font-size:10px;
    letter-spacing:.20em; text-transform:uppercase; text-decoration:none;
    font-weight:700; transition:gap .3s, color .3s;
  }
  .link-gold:hover { gap:13px; color:#b8960f; }

  /* Collection block CTA */
  .col-btn {
    display:inline-block; padding:12px 32px;
    border:1px solid rgba(255,255,255,.7); color:white;
    font-family:'Josefin Sans'; font-size:10px; letter-spacing:.20em; text-transform:uppercase;
    font-weight:600; text-decoration:none;
    transition:all .35s cubic-bezier(.4,0,.2,1);
  }
  .col-btn:hover { background:var(--gold-v); border-color:var(--gold-v); color:var(--maroon-deep); transform:translateY(-2px); }

  /* Stat pill (over image) */
  .stat-pill {
    background:rgba(255,249,240,.97); backdrop-filter:blur(10px);
    border:1px solid rgba(196,152,10,.3); padding:13px 18px;
    box-shadow:0 8px 28px rgba(0,0,0,.12);
  }

  /* Artisan stat block */
  .stat-block {
    text-align:center; padding:14px 20px;
    background:rgba(255,249,240,.85);
    border:1px solid rgba(196,152,10,.28);
    transition:border-color .3s, box-shadow .3s;
  }
  .stat-block:hover { border-color:rgba(128,0,32,.32); box-shadow:0 5px 20px rgba(128,0,32,.07); }

  /* Gold badge chip */
  .gold-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(196,152,10,.1); border:1px solid rgba(196,152,10,.28);
    padding:6px 14px;
  }

  /* Feature tag — forest green border/text */
  .feat-tag {
    padding:6px 13px;
    border:1px solid rgba(20,64,42,.28);
    font-family:'Josefin Sans'; font-size:9px; letter-spacing:.14em;
    color:var(--forest); text-transform:uppercase;
    background:rgba(20,64,42,.05); font-weight:600;
  }

  /* Pillar card (navy bg section) */
  .pillar-card {
    padding:32px 24px;
    background:rgba(14,26,74,.55);
    border-right:1px solid rgba(255,255,255,.06);
    transition:background .3s;
  }
  .pillar-card:hover { background:rgba(128,0,32,.45); }

  /* Quote card */
  .quote-card {
    background:rgba(255,249,240,.8);
    border:1px solid rgba(196,152,10,.22);
    padding:34px 28px;
    transition:transform .4s, box-shadow .4s, border-color .4s;
    position:relative;
  }
  .quote-card::before {
    content:''; position:absolute; top:0; left:0; width:2px; height:0;
    background:var(--maroon);
    transition:height .5s cubic-bezier(.4,0,.2,1);
  }
  .quote-card:hover { transform:translateY(-4px); box-shadow:0 18px 52px rgba(128,0,32,.1); border-color:rgba(196,152,10,.42); }
  .quote-card:hover::before { height:100%; }

  /* Video wrapper */
  .video-wrapper {
    position:relative; overflow:hidden;
    box-shadow:0 40px 90px rgba(0,0,0,.2);
  }
  .video-wrapper video { width:100%; display:block; aspect-ratio:16/9; object-fit:cover; }
  .play-btn {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:68px; height:68px; border-radius:50%;
    background:rgba(255,249,240,.96); border:1.5px solid rgba(212,175,55,.38);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 32px rgba(0,0,0,.18); cursor:pointer;
    animation:goldBlink 3s ease infinite; transition:transform .3s;
  }
  .play-btn:hover { transform:translate(-50%,-50%) scale(1.08); }

  /* Shimmer text — gold gradient on dark bg */
  .shimmer-text {
    background:linear-gradient(90deg, #6b4e00 0%, #C4980A 20%, #e8c84a 40%, #D4AF37 55%, #8a6800 74%, #C4980A 100%);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:goldShim 4s linear infinite;
  }

  /* ── Section backgrounds — all using EXACT brand palette colours ── */
  .bg-cream   { background:linear-gradient(160deg, var(--cream-lt) 0%, var(--cream-mid) 55%, var(--cream) 100%); }
  .bg-cream-2 { background:linear-gradient(140deg, var(--cream) 0%, var(--cream-dk) 45%, #F0E0CE 100%); }
  .bg-cream-3 { background:linear-gradient(180deg, var(--cream-lt) 0%, #FDF5EA 60%, var(--cream-mid) 100%); }
  .bg-navy    { background:linear-gradient(140deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-mid) 100%); }
  .bg-maroon  { background:linear-gradient(155deg, var(--maroon-deep) 0%, var(--maroon) 45%, var(--maroon-light) 80%, var(--maroon-deep) 100%); }
  .bg-forest  { background:linear-gradient(140deg, var(--forest) 0%, var(--forest-mid) 60%, var(--forest-light) 100%); }

  /* ── Responsive ── */
  @media(max-width:900px) {
    .grid-2 { grid-template-columns:1fr!important; gap:44px!important; }
    .grid-4 { grid-template-columns:1fr 1fr!important; gap:14px!important; }
    .col-block-h { height:60vh!important; }
    .hero-content { padding:0 20px!important; }
    .hero-btns { flex-direction:column!important; align-items:center!important; }
    .pillars-grid { grid-template-columns:1fr 1fr!important; }
  }
  @media(max-width:600px) {
    .grid-4 { grid-template-columns:1fr!important; }
    .pillars-grid { grid-template-columns:1fr!important; }
  }
`;

// ─── Golden Thread marquee divider ───────────────────────────────────────────
function GoldenThread({ className = "" }: { className?: string }) {
  const pA = "M0,28 C220,5 330,52 550,28 C770,5 880,52 1100,28 C1210,8 1260,38 1320,28";
  const pB = "M0,40 C180,16 400,58 660,36 C920,12 1100,54 1320,36";
  const Half = () => (
    <svg className="thread-svg-half" viewBox="0 0 1320 58" preserveAspectRatio="none" style={{ height: 52, display: "block" }}>
      <path d={pA} stroke="rgba(196,152,10,0.62)" strokeWidth="1.2" fill="none" />
      <path d={pB} stroke="rgba(196,152,10,0.38)" strokeWidth="0.8" fill="none" />
    </svg>
  );
  return (
    <div className={className} style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none", background: "var(--cream-lt)" }}>
      <div className="thread-track"><Half /><Half /></div>
    </div>
  );
}

// ─── Heritage scrolling band — navy bg, brand pillars text ───────────────────
function HeritageBand() {
  const items = [
    "Neyge Couture", "Est. 2026", "Crafted Elegance",
    "Artisan Integrity", "GI Certified", "Zero Power Loom",
    "Direct from Weaver", "Woven in Indian Pride", "Fair Wage Pledge",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="heritage-band">
      <div style={{ overflow: "hidden" }}>
        <div className="heritage-scroll">
          {doubled.map((item, i) => (
            <div key={i} className="heritage-item">
              <span className="heritage-dot">✦</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO
// Overlays: maroon (primary) + navy radial (secondary)
// Heading: Cinzel (Copperplate brand font)
// Tagline: "CRAFTED ELEGANCE · ESTD 2026" from brand book
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 640, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <img src={IMG.hero} alt="Neyge Couture" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />

      {/* Maroon + navy brand overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(90,0,22,.40) 0%, rgba(128,0,32,.46) 42%, rgba(14,26,74,.68) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 65% 35%, rgba(27,42,107,.18) 0%, transparent 62%)" }} />

      {/* Silk shimmer sweep */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "34%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent)", animation: "silkMove 17s linear infinite", willChange: "transform" }} />
      </div>

      {/* Gold orb */}
      <div style={{ position: "absolute", bottom: "16%", left: "50%", transform: "translateX(-50%)", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,.14) 0%, transparent 70%)", animation: "goldOrb 8s ease-in-out infinite", pointerEvents: "none" }} />

      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: .35 }}>
        <div className="grain-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content" style={{ position: "relative", zIndex: 2, textAlign: "center", color: "white", padding: "0 32px", maxWidth: 860, width: "100%" }}>

        {/* Brand tagline strip */}
        <div className="value-strip" style={{ justifyContent: "center", marginBottom: 30, animation: "fadeUp 1s ease .1s both" }}>
          <span style={{ letterSpacing: ".28em", fontWeight: 600 }}>NEYGE COUTURE</span>
          <span className="value-dot" />
          <span>CRAFTED ELEGANCE</span>
          <span className="value-dot" />
          <span>EST. 2026</span>
        </div>

        {/* Cinzel heading — brand Copperplate font */}
        <h1 className="cinzel" style={{ fontSize: T.hero, fontWeight: 400, lineHeight: 1.08, animation: "fadeUp 1.1s cubic-bezier(.4,0,.2,1) .28s both", marginBottom: 6, letterSpacing: ".06em" }}>
          WOVEN BY HAND,
        </h1>
        {/* Cormorant italic contrast line */}
        <h1 style={{ fontFamily: FONT.serif, fontSize: `calc(${T.hero} * 1.05)`, fontWeight: 300, lineHeight: 1.08, fontStyle: "italic", animation: "fadeUp 1.1s cubic-bezier(.4,0,.2,1) .44s both", marginBottom: 32, color: "rgba(255,255,255,.9)" }}>
          Worn by Soul
        </h1>

        <div style={{ animation: "fadeUp 1s ease .60s both" }}>
          <div style={{ width: 44, height: 1, background: "rgba(212,175,55,.8)", margin: "0 auto 30px" }} />
        </div>

        {/* Josefin Sans body */}
        <p style={{ fontFamily: FONT.body, fontSize: T.bodyLg, fontWeight: 300, lineHeight: 1.88, color: "rgba(255,255,255,.78)", maxWidth: 460, margin: "0 auto 46px", letterSpacing: ".04em", animation: "fadeUp 1s ease .76s both" }}>
          Each saree carries the story of an artisan&apos;s love —<br />earthy, intimate, and timeless.
        </p>

        <div className="hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s ease .98s both" }}>
          <Link to="/shop" className="btn-gold">Discover the Collection</Link>
          <Link to="/artisans" className="btn-outline-white">Meet the Artisans</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "fadeUp 1s ease 1.4s both" }}>
        <div style={{ width: 1, height: 46, background: "linear-gradient(to bottom, rgba(212,175,55,.7), transparent)" }} />
        <span style={{ fontFamily: FONT.body, fontSize: 8, letterSpacing: ".30em", color: "rgba(255,255,255,.32)", textTransform: "uppercase" }}>SCROLL</span>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOOM STORY — cream bg, forest green heading + accent
// ─────────────────────────────────────────────────────────────────────────────
function LoomStory() {
  const [ref, on] = useInView(0.15);
  const [svgRef, sv] = useInView<SVGSVGElement>(0.35);

  return (
    <section ref={ref} className="bg-cream" style={{ padding: "130px 0" }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 90, alignItems: "center" }}>

          {/* Image */}
          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            {/* Forest green corner brackets */}
            <div style={{ position: "absolute", top: -16, left: -16, width: 56, height: 56, borderTop: `2px solid ${C.forest}`, borderLeft: `2px solid ${C.forest}`, opacity: .55, pointerEvents: "none", zIndex: 3 }} />
            <div style={{ position: "absolute", bottom: -16, right: -16, width: 56, height: 56, borderBottom: `2px solid ${C.forest}`, borderRight: `2px solid ${C.forest}`, opacity: .55, pointerEvents: "none", zIndex: 3 }} />

            <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 44px 88px rgba(0,0,0,.15)" }}>
              <img src={IMG.loom} alt="Handloom weaving" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(20,64,42,.04) 0%, transparent 50%)", pointerEvents: "none" }} />
            </div>

            <div className="stat-pill" style={{ position: "absolute", bottom: -22, left: -14, zIndex: 2 }}>
              <div className="cinzel" style={{ fontSize: 22, color: C.maroon, fontWeight: 500, lineHeight: 1 }}>3 Generations</div>
              <div style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".18em", color: C.warmGrey, marginTop: 6, textTransform: "uppercase", fontWeight: 500 }}>of weaving mastery</div>
            </div>

            <svg ref={svgRef} style={{ position: "absolute", bottom: -34, right: -26, width: 76, height: 76, overflow: "visible", color: C.gold, zIndex: 2 }} viewBox="0 0 100 100">
              <path className={`thread-path ${sv ? "on" : ""}`} d="M8 88 Q 52 8, 92 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>The Craft</span>

            {/* Cinzel heading — forest green (logo colour) */}
            <h2 className={`cinzel rv d2 ${on ? "on" : ""}`} style={{ fontSize: T.h2, fontWeight: 400, lineHeight: 1.15, color: C.forest, letterSpacing: ".05em" }}>
              Every Thread<br />is a Prayer
            </h2>

            <div className={`gd rv d3 ${on ? "on" : ""}`} style={{ background: C.forest, opacity: .7 }} />

            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: T.body, lineHeight: 1.94, color: C.warmGrey, fontWeight: 300 }}>
              Our looms are not machines — they are extensions of the artisan&apos;s soul. Passed down through generations, the rhythm of the shuttle echoes the heartbeat of rural India.
            </p>
            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: T.body, lineHeight: 1.94, color: C.warmGrey, fontWeight: 300 }}>
              We work directly with weavers in Bengal, Varanasi, and Odisha, preserving techniques that predate written history. When you wear a Neyge saree, you wear a legacy.
            </p>

            {/* Brand book core pillars */}
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
              {[
                ["✦ Zero Power Loom",    "Every yarn woven by hand"],
                ["✦ Direct from Weaver", "No middlemen involved"],
                ["✦ Heritage Certified", "Govt GI tag holders"],
                ["✦ Fair Wage Pledge",   "Artisan-first economics"],
              ].map(([title, sub]) => (
                <div key={title} style={{ padding: "16px 14px", background: "rgba(245,230,211,.65)", border: `1px solid rgba(20,64,42,.18)`, transition: "border-color .3s, background .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(20,64,42,.4)"; e.currentTarget.style.background = "rgba(245,230,211,.95)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(20,64,42,.18)"; e.currentTarget.style.background = "rgba(245,230,211,.65)"; }}>
                  <div style={{ fontFamily: FONT.body, fontSize: 9, color: C.forest, letterSpacing: ".14em", marginBottom: 5, fontWeight: 700 }}>{title}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.warmGrey, fontWeight: 300, lineHeight: 1.55 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/about" className="link-gold">Read the full loom story <span style={{ fontSize: 13 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COLLECTION BLOCK — parallax, maroon + navy gradient overlay
// ─────────────────────────────────────────────────────────────────────────────
function CollectionBlock({ img, title, subtitle, slug }: { img: string; title: string; subtitle: string; slug: string }) {
  const [ref, on] = useInView<HTMLDivElement>(0.08);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => {
      const r = el.getBoundingClientRect();
      const prog = -r.top / window.innerHeight;
      const imgEl = el.querySelector("img") as HTMLImageElement | null;
      if (imgEl) imgEl.style.transform = `translateY(${Math.min(Math.max(prog * 9, -8), 8)}%)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div ref={scrollRef} className="col-block-h" style={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "115%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(90,0,22,.84) 0%, rgba(128,0,32,.22) 42%, rgba(14,26,74,.28) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 18% 78%, rgba(196,152,10,.05) 0%, transparent 38%), radial-gradient(circle at 82% 18%, rgba(196,152,10,.04) 0%, transparent 32%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 90, textAlign: "center", color: "white" }}>
        <div className={`rv d1 ${on ? "on" : ""}`} style={{ width: 32, height: 1, background: "rgba(212,175,55,.65)", marginBottom: 16 }} />
        <span className={`ey rv ${on ? "on" : ""}`} style={{ color: "rgba(212,175,55,.88)", marginBottom: 14, fontSize: 9, letterSpacing: ".34em" }}>Collection</span>

        {/* Cinzel collection title */}
        <h3 className={`cinzel rv d2 ${on ? "on" : ""}`} style={{ fontSize: "clamp(32px,6.5vw,68px)", fontWeight: 400, lineHeight: 1.08, marginBottom: 16, letterSpacing: ".06em" }}>
          {title.toUpperCase()}
        </h3>

        <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,.76)", marginBottom: 40, maxWidth: 420, lineHeight: 1.72, letterSpacing: ".03em" }}>
          {subtitle}
        </p>
        <div className={`rv d4 ${on ? "on" : ""}`}>
          <Link to={`/collections`} className="col-btn">Explore Collection</Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE PILLARS — navy bg, 4 exact pillars from brand book page
// ─────────────────────────────────────────────────────────────────────────────
function CorePillarsStrip() {
  const [ref, on] = useInView(0.1);
  const pillars = [
    { icon: "◈", title: "Artisan Integrity",     body: "We work with authentic weaving traditions and skilled craftsmen, providing certification for every saree." },
    { icon: "◈", title: "Woven in Indian Pride", body: "Rooted in artisan pride, Neyge sarees honour India's cultural legacy through authentic craftsmanship." },
    { icon: "◈", title: "Understated Luxury",    body: "Luxury that whispers, not shouts. Minimal presentation. Premium fabrics. Thoughtful detailing." },
    { icon: "◈", title: "Rooted Modernity",      body: "Designed for the contemporary woman who respects tradition but lives in the present." },
  ];

  return (
    <section ref={ref} className="bg-navy" style={{ padding: "96px 0" }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="ey" style={{ display: "block", marginBottom: 12, color: "rgba(212,175,55,.80)" }}>Brand Purpose</span>
          <h2 className="cinzel" style={{ fontSize: T.h2, fontWeight: 400, color: "white", lineHeight: 1.12, letterSpacing: ".06em" }}>
            OUR CORE PILLARS
          </h2>
          <div style={{ width: 36, height: 1, background: "rgba(212,175,55,.55)", margin: "18px auto 0" }} />
        </div>

        <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: "1px solid rgba(255,255,255,.07)", overflow: "hidden" }}>
          {pillars.map((p, i) => (
            <div key={i} className={`pillar-card rv d${i + 1} ${on ? "on" : ""}`}>
              <div style={{ fontFamily: FONT.serif, fontSize: 26, color: C.goldVibrant, marginBottom: 16, opacity: .75 }}>{p.icon}</div>
              <h3 style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.90)", marginBottom: 14, lineHeight: 1.4 }}>{p.title}</h3>
              <div style={{ width: 22, height: 1, background: "rgba(196,152,10,.5)", marginBottom: 14 }} />
              <p style={{ fontFamily: FONT.body, fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.78, fontWeight: 300 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ARTISAN SPOTLIGHT — cream-2 bg, Cinzel maroon heading
// ─────────────────────────────────────────────────────────────────────────────
function ArtisanSpotlight() {
  const [ref, on] = useInView(0.12);

  return (
    <section ref={ref} id="artisans" className="bg-cream-2" style={{ padding: "130px 0" }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 90, alignItems: "center" }}>

          {/* Image */}
          <div className={`rv-l ${on ? "on" : ""}`} style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -12, right: -12, width: 46, height: 46, borderTop: `1.5px solid rgba(196,152,10,.5)`, borderRight: `1.5px solid rgba(196,152,10,.5)`, pointerEvents: "none", zIndex: 3 }} />
            <div style={{ position: "absolute", bottom: -12, left: -12, width: 46, height: 46, borderBottom: `1.5px solid rgba(196,152,10,.5)`, borderLeft: `1.5px solid rgba(196,152,10,.5)`, pointerEvents: "none", zIndex: 3 }} />

            <div style={{ overflow: "hidden", boxShadow: "0 48px 96px rgba(0,0,0,.17)", aspectRatio: "4/5", position: "relative" }}>
              <img src={IMG.artisan}  alt="Artisan"   style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossA 15s ease-in-out infinite" }} />
              <img src={IMG.artisan2} alt="Artisan 2" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "crossB 15s ease-in-out infinite" }} />
            </div>

            {/* Live badge */}
            <div style={{ position: "absolute", bottom: 26, left: -12, background: "rgba(255,249,240,.97)", backdropFilter: "blur(12px)", border: "1px solid rgba(196,152,10,.28)", padding: "10px 16px", display: "flex", gap: 9, alignItems: "center", boxShadow: "0 8px 28px rgba(0,0,0,.10)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.goldVibrant, flexShrink: 0, animation: "goldBlink 2.5s ease infinite" }} />
              <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: C.maroon, fontWeight: 700 }}>Master Weaver · 200+ Yr Legacy</span>
            </div>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={`gold-badge rv d1 ${on ? "on" : ""}`} style={{ width: "fit-content" }}>
              <span style={{ color: C.gold, fontSize: 11 }}>♥</span>
              <span className="ey">Artisan Spotlight</span>
            </div>

            {/* Cinzel — maroon */}
            <h2 className={`cinzel rv d2 ${on ? "on" : ""}`} style={{ fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12, letterSpacing: ".05em" }}>
              Meet Radha Devi
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />

            {/* Cormorant italic quote */}
            <blockquote className={`rv d3 ${on ? "on" : ""}`} style={{ fontFamily: FONT.serif, fontSize: 18, fontStyle: "italic", fontWeight: 400, color: "#3a1818", lineHeight: 1.85, borderLeft: `2px solid rgba(196,152,10,.48)`, paddingLeft: 20, margin: 0 }}>
              "I learned to weave from my mother when I was seven. The loom is like a third hand to me. Every saree I make carries a piece of my home — the smell of earth, the sound of peacocks, the warmth of the sun on fresh yarn."
            </blockquote>

            <p className={`rv d4 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: T.body, lineHeight: 1.90, color: C.warmGrey, fontWeight: 300 }}>
              Radha is one of 43 master weavers we collaborate with in the villages of Murshidabad. Her family has been weaving silk for over 200 years.
            </p>

            {/* Stats — Cinzel numbers */}
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["43", "Artisans"], ["6", "States"], ["200+", "Yr Heritage"]].map(([n, l]) => (
                <div key={l} className="stat-block">
                  <div className="cinzel" style={{ fontSize: 28, fontWeight: 500, color: C.maroon, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 8, letterSpacing: ".20em", textTransform: "uppercase", color: C.warmGrey, marginTop: 6, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>

            <div className={`rv d6 ${on ? "on" : ""}`}>
              <Link to="/artisans" className="link-gold">Meet all artisans <span style={{ fontSize: 12 }}>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FEATURED SAREES — cream-3 bg, forest green Cinzel heading
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedSarees() {
  const [ref, on] = useInView(0.08);
  const [products, setProducts] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = (await getProducts({ page: 1, page_size: 4, featured: true, sort_by: "created_at", sort_order: "desc" })) as ProductsApiResponse;
        const mapped = (res?.data?.items || []).map(mapProductToSaree);
        if (mapped.length > 0) { setProducts(mapped); return; }
        const fb = (await getProducts({ page: 1, page_size: 4, sort_by: "created_at", sort_order: "desc" })) as ProductsApiResponse;
        setProducts((fb?.data?.items || []).map(mapProductToSaree));
      } catch (e) {
        console.error("Failed to load featured products", e);
        setProducts([]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return (
    <section ref={ref} id="shop" className="bg-cream-3" style={{ padding: "130px 0" }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="ey" style={{ display: "block", marginBottom: 14 }}>Curated Collection</span>
          {/* Forest green heading */}
          <h2 className="cinzel" style={{ fontSize: T.h2, fontWeight: 400, color: C.forest, marginBottom: 18, lineHeight: 1.12, letterSpacing: ".06em" }}>
            Featured Sarees
          </h2>
          <div className="gd gd-c" style={{ marginBottom: 18, background: C.forest, opacity: .65 }} />
          <p style={{ fontFamily: FONT.body, fontSize: T.body, color: C.warmGrey, fontWeight: 300, maxWidth: 360, margin: "0 auto", lineHeight: 1.72, letterSpacing: ".025em" }}>
            Each piece handpicked for its soulful craftsmanship
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", fontFamily: FONT.body, color: C.warmGrey, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", padding: "48px 0" }}>
            Loading featured sarees...
          </div>
        ) : hasProducts ? (
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {products.map((s, i) => (
              <div key={s.id} className={`rv d${i + 1} ${on ? "on" : ""}`}>
                <SareeCard saree={s} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", fontFamily: FONT.body, color: C.warmGrey, fontSize: 13, padding: "48px 0" }}>
            No featured products available right now.
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 64 }}>
          <Link to="/shop" className="btn-maroon">View All Sarees &nbsp;→</Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TEXTURE QUOTE — dark overlay maroon + navy, brand tagline footer
// ─────────────────────────────────────────────────────────────────────────────
function TextureQuote() {
  const [ref, on] = useInView(0.18);

  return (
    <section ref={ref} style={{ position: "relative", padding: "164px 24px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={IMG.texture} alt="Saree texture" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {/* Maroon + navy brand overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(90,0,22,.74) 0%, rgba(26,16,8,.68) 48%, rgba(14,26,74,.62) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(212,175,55,.06) 0%, transparent 66%)" }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><div className="grain-overlay" /></div>
      </div>

      <div className={`rv ${on ? "on" : ""}`} style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 46 }}>
          <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,.52))" }} />
          <span style={{ color: C.goldVibrant, fontSize: 18, opacity: .78 }}>✦</span>
          <div style={{ flex: 1, maxWidth: 72, height: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,.52))" }} />
        </div>

        <blockquote style={{ fontFamily: FONT.serif, fontSize: "clamp(28px,5vw,56px)", fontStyle: "italic", fontWeight: 300, color: "white", lineHeight: 1.4 }}>
          "Handmade is not a trend.<br />It is a truth."
        </blockquote>

        <div style={{ width: 40, height: 1, background: C.goldVibrant, margin: "38px auto 20px", opacity: .58 }} />

        {/* Brand tagline — from brand book */}
        <p style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(255,255,255,.32)" }}>
          NEYGE COUTURE · CRAFTED ELEGANCE · ARTISAN SOUL · ESTD. 2026
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. VIDEO SHOPPING — cream-2 bg, forest green feat tags
// ─────────────────────────────────────────────────────────────────────────────
function VideoShopping() {
  const [ref, on] = useInView(0.12);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => { setPlaying(true); videoRef.current?.play(); };

  return (
    <section ref={ref} className="bg-cream-2" style={{ padding: "130px 0" }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "center" }}>

          <div className={`rv-l ${on ? "on" : ""}`}>
            <div className="video-wrapper">
              <video ref={videoRef} src="" poster={IMG.videoBg} controls={playing} playsInline style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              {!playing && (
                <button className="play-btn" onClick={handlePlay} aria-label="Play video">
                  <div style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: `19px solid ${C.maroon}`, marginLeft: 3 }} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className={`ey rv d1 ${on ? "on" : ""}`}>Premium Service</span>
            <h2 className={`cinzel rv d2 ${on ? "on" : ""}`} style={{ fontSize: T.h2, fontWeight: 400, color: C.maroon, lineHeight: 1.12, letterSpacing: ".05em" }}>
              Shop with<br />a Stylist
            </h2>
            <div className={`gd rv d3 ${on ? "on" : ""}`} />
            <p className={`rv d3 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: T.body, lineHeight: 1.92, color: C.warmGrey, fontWeight: 300 }}>
              Not sure which saree tells your story? Book a one-on-one video session with our in-house styling experts. We guide you through drapes, fabrics, and occasions — from the comfort of your home.
            </p>
            {/* Forest green feature tags */}
            <div className={`rv d4 ${on ? "on" : ""}`} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Draping Guidance", "Fabric Expertise", "Occasion Styling", "Free of Charge"].map(t => (
                <span key={t} className="feat-tag">{t}</span>
              ))}
            </div>
            <div className={`rv d5 ${on ? "on" : ""}`} style={{ marginTop: 4 }}>
              <Link to="/video-shopping" className="btn-gold">▶&nbsp; Book a Free Session</Link>
            </div>
            <p className={`rv d6 ${on ? "on" : ""}`} style={{ fontFamily: FONT.body, fontSize: 11, color: "#9a8070", letterSpacing: ".08em", fontWeight: 300 }}>
              Over 3,200 sessions completed · Rated 4.9 ★
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. INSTAGRAM — cream-3, navy Cinzel heading
// ─────────────────────────────────────────────────────────────────────────────
const IG_IMGS = [IMG.ig1, IMG.ig2, IMG.ig3, IMG.ig4, IMG.ig5, IMG.ig6];

function InstagramGrid() {
  const [ref, on] = useInView(0.08);
  const doubled = [...IG_IMGS, ...IG_IMGS];

  return (
    <section ref={ref} className="bg-cream-3" style={{ padding: "112px 0" }}>
      <div className="wrap">
        <div className={`rv ${on ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="ey" style={{ display: "block", marginBottom: 14 }}>Visual Diary</span>
          {/* Navy heading */}
          <h2 className="cinzel" style={{ fontSize: T.h2, fontWeight: 400, color: C.navy, marginBottom: 10, letterSpacing: ".06em" }}>
            From Our World
          </h2>
          {/* Instagram handle from brand book */}
          <p style={{ fontFamily: FONT.body, fontSize: 11, color: "#9a8070", letterSpacing: ".16em", fontWeight: 500 }}>@neyge_couture</p>
        </div>
      </div>

      <div style={{ overflow: "hidden", width: "100%" }}>
        <div className="ig-track">
          {doubled.map((src, i) => (
            <div key={i} className="ig-item">
              <img src={src} alt={`Gallery ${(i % IG_IMGS.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 38 }}>
        <a href="https://instagram.com/neyge_couture" className="link-gold" target="_blank" rel="noreferrer">
          Follow on Instagram <span style={{ fontSize: 12 }}>→</span>
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. QUOTES + FINAL CTA
// Quotes: cream bg, navy Cinzel heading
// Final CTA: bg-maroon (brand primary dark section)
// Contact info from brand book: admin@neygecouture.com, +91-9113991711
// Palette bar: Navy | Maroon | Blush | Forest (mirrors brand book final page)
// ─────────────────────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "She didn't just wear a saree. She wore six yards of someone's lifetime.", attr: "— A Neyge wearer, Mumbai" },
  { text: "Every knot in this loom is a wish my grandmother wove for her daughters.", attr: "— Radha Devi, Master Weaver" },
  { text: "In a world of fast fashion, we choose to be slow. We choose to be woven.", attr: "— The Neyge Story" },
];

function FinalCTA() {
  const [ref, on]   = useInView(0.15);
  const [qRef, qOn] = useInView(0.1);
 
  return (
    <>
      {/* ── Quotes ── */}
      <section ref={qRef} className="bg-cream" style={{ padding: "110px 0", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: .14, overflow: "visible" }} viewBox="0 0 1320 300" preserveAspectRatio="none">
          <path className="flowing-thread-1" d="M0,150 C200,60 400,240 660,150 C920,60 1100,240 1320,150" stroke={C.gold} strokeWidth="1.5" fill="none" />
          <path className="flowing-thread-2" d="M0,100 C300,180 600,20 900,100 C1100,160 1220,60 1320,100" stroke={C.gold} strokeWidth="1" fill="none" />
        </svg>
 
        <div className="wrap">
          <div className={`rv ${qOn ? "on" : ""}`} style={{ textAlign: "center", marginBottom: 62 }}>
            <span className="ey" style={{ display: "block", marginBottom: 14 }}>Voices &amp; Stories</span>
            <h2 className="cinzel" style={{ fontSize: T.h2, fontWeight: 400, color: C.navy, letterSpacing: ".06em" }}>
              Words Woven in Time
            </h2>
            <div style={{ width: 36, height: 1, background: `rgba(27,42,107,.45)`, margin: "18px auto 0" }} />
          </div>
 
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="grid-2">
            {QUOTES.map((q, i) => (
              <div key={i} className={`quote-card rv d${i + 1} ${qOn ? "on" : ""}`}>
                <div style={{ fontFamily: FONT.serif, fontSize: 52, lineHeight: .72, color: C.gold, opacity: .42, marginBottom: 14, fontWeight: 600 }}>"</div>
                <p style={{ fontFamily: FONT.serif, fontSize: 17, fontStyle: "italic", fontWeight: 400, color: "#3a1818", lineHeight: 1.78, marginBottom: 20 }}>{q.text}</p>
                <div style={{ width: 24, height: 1, background: "rgba(196,152,10,.38)", marginBottom: 12 }} />
                <p style={{ fontFamily: FONT.body, fontSize: 10, color: "#9a8070", letterSpacing: ".12em", fontWeight: 500 }}>{q.attr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <GoldenThread />
 
      {/* ── Final CTA — texture bg + deep maroon/navy overlay ── */}
      <section
        ref={ref}
        style={{
          padding: "152px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Layer 1: Saree texture background image ── */}
        <img
          src={IMG.texture2}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block",
            // Subtle zoom-in feel — same technique as CollectionBlock parallax
            transform: "scale(1.04)",
          }}
        />
 
        {/* ── Layer 2: Deep maroon → navy gradient overlay
            Darker than TextureQuote to distinguish sections visually
            Maroon is dominant (brand primary CTA section) ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(155deg, rgba(90,0,22,.92) 0%, rgba(128,0,32,.88) 35%, rgba(14,26,74,.82) 75%, rgba(10,18,58,.90) 100%)",
        }} />
 
        {/* ── Layer 3: Gold radial bloom at centre — luxury focal glow ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, rgba(212,175,55,.10) 0%, rgba(196,152,10,.04) 38%, transparent 65%)",
          pointerEvents: "none",
        }} />
 
        {/* ── Layer 4: Blush radial — brand colour 3, top-right ── */}
        <div style={{
          position: "absolute", top: "8%", right: "10%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,196,206,.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
 
        {/* ── Layer 5: Forest green radial — brand colour 4, bottom-left ── */}
        <div style={{
          position: "absolute", bottom: "8%", left: "8%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,64,42,.14) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
 
        {/* ── Layer 6: Grain — matches Hero/TextureQuote treatment ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: .22 }}>
          <div className="grain-overlay" />
        </div>
 
        {/* ── Layer 7: Decorative rings — gold, very faint ── */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(196,152,10,.10)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(196,152,10,.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(196,152,10,.06)", pointerEvents: "none" }} />
 
        {/* ── Layer 8: Flowing animated threads — matches rest of page ── */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} viewBox="0 0 1320 500" preserveAspectRatio="none">
          <path className="flowing-thread-1" d="M100,250 Q400,80 660,250 Q920,420 1220,250" stroke={C.goldVibrant} strokeWidth="0.8" fill="none" opacity=".18" />
          <path className="flowing-thread-2" d="M0,350 Q330,150 660,300 Q990,450 1320,200" stroke={C.goldVibrant} strokeWidth="0.6" fill="none" opacity=".12" />
        </svg>
 
        {/* ── Content ── */}
        <div
          className={`rv ${on ? "on" : ""}`}
          style={{
            position: "relative", zIndex: 1,
            maxWidth: 620, margin: "0 auto",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}
        >
          <span className="ey" style={{ marginBottom: 24, color: "rgba(212,175,55,.75)" }}>
            Begin Your Journey
          </span>
 
          {/* Gold shimmer Cinzel headline — pops against dark textured bg */}
          <h2
            className="cinzel shimmer-text"
            style={{
              fontSize: "clamp(56px, 10vw, 108px)",
              fontWeight: 400, lineHeight: .94,
              letterSpacing: ".04em", marginBottom: 22,
            }}
          >
            OWN A STORY.
          </h2>
 
          <p style={{
            fontFamily: FONT.serif, fontSize: 20, fontStyle: "italic",
            fontWeight: 300, color: "rgba(255,255,255,.75)",
            marginBottom: 10, lineHeight: 1.55,
          }}>
            Six yards. One lifetime.
          </p>
 
          <p style={{
            fontFamily: FONT.body, fontSize: 12,
            color: "rgba(255,255,255,.44)", letterSpacing: ".06em",
            fontWeight: 300, maxWidth: 390, textAlign: "center",
            lineHeight: 1.80, marginBottom: 14,
          }}>
            "When you drape a Neyge saree, you carry the dreams of the weaver
            who made it, the love of the artisan who dyed it, and the soul of
            the land it came from."
          </p>
 
          <div style={{ width: 36, height: 1, background: "rgba(212,175,55,.50)", marginBottom: 50 }} />
 
          <Link
            to="/shop"
            className="btn-gold"
            style={{ fontSize: 11, padding: "16px 54px", letterSpacing: ".24em" }}
          >
            Explore Neyge &nbsp;→
          </Link>
 
          {/* Brand contact */}
          <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <p style={{ fontFamily: FONT.body, fontSize: 10, color: "rgba(255,255,255,.26)", letterSpacing: ".12em" }}>
              www.neygecouture.com · admin@neygecouture.com
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: 10, color: "rgba(255,255,255,.20)", letterSpacing: ".10em" }}>
              Free shipping above ₹5,000 · COD available · +91-9113991711
            </p>
          </div>
 
          {/* Brand palette strip — Navy | Maroon | Blush | Forest */}
          <div style={{
            marginTop: 52, display: "flex", gap: 0,
            height: 3, width: 220, overflow: "hidden", opacity: .55,
          }}>
            <div style={{ flex: 1, background: C.navy }} />
            <div style={{ flex: 1, background: C.maroon }} />
            <div style={{ flex: 1, background: C.blush }} />
            <div style={{ flex: 1, background: C.forest }} />
          </div>
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
        <HeritageBand />
        <GoldenThread />
        <LoomStory />

        <div style={{ marginBottom: 0 }}>
          <CollectionBlock
            img={IMG.collection1}
            title="The Terracotta Weave"
            subtitle="Inspired by the red soil of Bengal — raw, earthy, eternal."
            slug="wedding-collection"
          />
        </div>

        <GoldenThread />

        <div style={{ marginBottom: 0 }}>
          <CollectionBlock
            img={IMG.collection2}
            title="Indigo Memories"
            subtitle="Deep blues that tell stories of the night sky over the village."
            slug="wedding-collection"
          />
        </div>

        <GoldenThread />
        <CorePillarsStrip />
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