import { Sparkles } from 'lucide-react';
import heroImage from '../assets/bg.png'; // 👈 Replace with your actual image filename

const C = {
  maroon:   "#800020",
  gold:     "#C4980A",
  goldV:    "#D4AF37",
  cream:    "#F5E6D3",
  creamLt:  "#FFF9F0",
  warmGrey: "#4a3828",
  indigo:   "#4B0082",
};

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

.ap-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 56px;
}
@media(max-width: 900px) { .ap-wrap { padding: 0 24px; } }
@media(max-width: 480px) { .ap-wrap { padding: 0 16px; } }

.ap-ey {
  font-family: 'Jost'; font-size: 11px;
  letter-spacing: .25em; text-transform: uppercase;
  color: #C4980A; font-weight: 600;
}

.ap-gd   { width: 56px; height: 1px; background: #C4980A; display: block; }
.ap-gd-c { margin: 0 auto; }

/* ── Animations ── */
@keyframes apFadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes apCounter   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes subtleKenBurns {
  0%   { transform: scale(1)    translateX(0)    translateY(0); }
  33%  { transform: scale(1.06) translateX(-1%)  translateY(-0.5%); }
  66%  { transform: scale(1.04) translateX(0.8%) translateY(0.5%); }
  100% { transform: scale(1)    translateX(0)    translateY(0); }
}
@keyframes heroLineGrow  { from{width:0} to{width:80px} }
@keyframes heroChipsFade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes scrollPulse   { 0%,100%{opacity:.5;transform:translateY(0)} 50%{opacity:1;transform:translateY(6px)} }
@keyframes flowThread1 {
  0%   { d: path("M0,30 C220,5 440,55 660,30 C880,5 1100,55 1320,30"); }
  25%  { d: path("M0,20 C200,50 440,8  660,25 C880,45 1100,8  1320,20"); }
  50%  { d: path("M0,38 C200,10 440,58 660,38 C880,10 1100,58 1320,38"); }
  75%  { d: path("M0,18 C220,55 460,5  660,22 C860,55 1080,5  1320,18"); }
  100% { d: path("M0,30 C220,5 440,55 660,30 C880,5 1100,55 1320,30"); }
}
@keyframes flowThread2 {
  0%   { d: path("M0,45 C180,15 400,65 660,42 C920,15 1100,62 1320,45"); }
  33%  { d: path("M0,35 C200,65 420,12 660,35 C900,62 1120,12 1320,35"); }
  66%  { d: path("M0,52 C160,18 420,68 660,50 C900,20 1140,65 1320,52"); }
  100% { d: path("M0,45 C180,15 400,65 660,42 C920,15 1100,62 1320,45"); }
}

.ap-fade { animation: apFadeUp .85s cubic-bezier(.4,0,.2,1) both; }
.ap-d0 { animation-delay:0s   }
.ap-d1 { animation-delay:.14s }
.ap-d2 { animation-delay:.26s }
.ap-d3 { animation-delay:.38s }
.ap-d4 { animation-delay:.50s }

/* ══════════════════════════════════════════════
   HERO  —  full-width background image
══════════════════════════════════════════════ */
.ap-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  overflow: hidden;
}

/* Layer 1 — photograph */
.ap-hero-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center 40%;
  animation: subtleKenBurns 28s ease-in-out infinite;
  will-change: transform;
}

/* Layer 2 — atmospheric colour overlay */
.ap-hero-overlay {
  position: absolute; inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(8,0,2,.76)   0%,
      rgba(70,0,18,.50) 30%,
      rgba(55,0,14,.54) 65%,
      rgba(8,0,2,.84)   100%
    ),
    radial-gradient(ellipse at 52% 56%,
      rgba(75,0,130,.20) 0%,
      rgba(128,0,32,.12) 42%,
      transparent 72%
    );
}

/* Layer 3 — subtle warm grain */
.ap-hero-grain {
  position: absolute; inset: 0; opacity: .04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* Layer 4 — bottom cream bleed into page */
.ap-hero-fade-btm {
  position: absolute; bottom: 0; left: 0; right: 0; height: 160px;
  background: linear-gradient(to top, #FFF9F0 0%, transparent 100%);
  z-index: 3; pointer-events: none;
}

/* Content */
.ap-hero-inner {
  position: relative; z-index: 4;
  max-width: 820px;
  padding: 0 28px;
  margin: 0 auto;
}

.ap-hero-badge {
  display: inline-flex; align-items: center; gap: 9px;
  background: rgba(212,175,55,.13);
  border: 1px solid rgba(212,175,55,.42);
  padding: 8px 22px; border-radius: 100px;
  margin-bottom: 30px;
  animation: apFadeUp 1s cubic-bezier(.4,0,.2,1) .1s both;
}
.ap-hero-badge .ap-ey { color: #D4AF37; letter-spacing: .22em; }

.ap-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 7vw, 82px);
  font-weight: 300; line-height: 1.06; color: #fff;
  text-shadow: 0 8px 48px rgba(0,0,0,.50);
  animation: apFadeUp 1s cubic-bezier(.4,0,.2,1) .22s both;
}
.ap-hero-title em { font-style: italic; font-weight: 400; color: #D4AF37; }

.ap-hero-rule {
  display: block; height: 1px;
  background: rgba(212,175,55,.65);
  margin: 26px auto;
  animation: heroLineGrow 1.5s cubic-bezier(.4,0,.2,1) .45s both;
}

.ap-hero-sub {
  font-family: 'Jost'; font-size: 16px; font-weight: 300;
  color: rgba(255,255,255,.80); line-height: 1.90;
  max-width: 600px; margin: 0 auto 38px;
  text-shadow: 0 2px 16px rgba(0,0,0,.35);
  animation: apFadeUp 1s cubic-bezier(.4,0,.2,1) .34s both;
}

.ap-hero-chips {
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
  animation: heroChipsFade 1s cubic-bezier(.4,0,.2,1) .55s both;
}
.ap-hero-chip {
  font-family: 'Jost'; font-size: 11px; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,.72);
  border: 1px solid rgba(212,175,55,.35);
  padding: 7px 18px; border-radius: 100px;
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(8px);
}

/* Scroll cue */
.ap-hero-scroll {
  position: absolute; bottom: 170px; left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  animation: apFadeUp 1s ease .9s both;
}
.ap-hero-scroll-lbl {
  font-family: 'Jost'; font-size: 9px; letter-spacing: .24em;
  text-transform: uppercase; color: rgba(212,175,55,.55); font-weight: 500;
}
.ap-hero-scroll-line {
  width: 1px; height: 44px;
  background: linear-gradient(to bottom, rgba(212,175,55,.65), transparent);
  animation: scrollPulse 2.2s ease-in-out 1.5s infinite;
}

@media(max-width: 640px) {
  .ap-hero { min-height: 100svh; }
  .ap-hero-title { font-size: clamp(36px, 9vw, 56px); }
  .ap-hero-fade-btm { height: 100px; }
  .ap-hero-scroll { bottom: 110px; }
}

/* ── Section base ── */
.ap-section { margin-bottom: 48px; }

/* ── Cards ── */
.ap-card {
  background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 28px; padding: 52px 56px;
  box-shadow: 0 12px 56px rgba(0,0,0,.07);
  position: relative; overflow: hidden;
}
.ap-card::before {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 180px; height: 180px; border-radius: 50%;
  border: 1px solid rgba(196,152,10,.1); pointer-events: none;
}
@media(max-width: 700px) { .ap-card { padding: 32px 24px; } }
@media(max-width: 480px) { .ap-card { padding: 26px 18px; border-radius: 20px; } }

.ap-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 400; color: #800020; margin-bottom: 10px; line-height: 1.12;
}
.ap-card-title-wrap { margin-bottom: 28px; }

.ap-body {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: #4a3828; line-height: 1.88; margin-bottom: 18px;
}
.ap-body:last-child { margin-bottom: 0; }

.ap-pull {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-style: italic; font-weight: 400;
  color: #5a3020; line-height: 1.7;
  padding: 18px 24px;
  border-left: 2.5px solid rgba(196,152,10,.45);
  background: rgba(196,152,10,.05);
  border-radius: 0 12px 12px 0; margin-top: 8px;
}

.ap-feature-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-top: 28px;
}
@media(max-width: 480px) { .ap-feature-grid { grid-template-columns: 1fr; } }

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
  display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.ap-feature-text { font-family: 'Jost'; font-size: 13px; font-weight: 500; color: #800020; line-height: 1.5; }

.ap-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
@media(max-width: 700px) { .ap-two-col { grid-template-columns: 1fr; } }

.ap-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; margin-top: 40px; }
@media(max-width: 600px) { .ap-stats-grid { grid-template-columns: repeat(2,1fr); } }
.ap-stat {
  text-align: center; padding: 28px 16px;
  border-right: 1px solid rgba(196,152,10,.2);
  border-bottom: 1px solid rgba(196,152,10,.2);
}
.ap-stat:nth-child(4n) { border-right: none; }
.ap-stat:nth-last-child(-n+4) { border-bottom: none; }
@media(max-width:600px){
  .ap-stat:nth-child(2n){border-right:none}
  .ap-stat:nth-child(4n){border-right:none}
  .ap-stat:nth-last-child(-n+2){border-bottom:none}
  .ap-stat:nth-child(3),.ap-stat:nth-child(4){border-bottom:none}
}
.ap-stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px; font-weight: 500; color: #800020; line-height: 1;
  margin-bottom: 8px; animation: apCounter .8s ease both;
}
.ap-stat-lbl { font-family: 'Jost'; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #9a8070; font-weight: 500; line-height: 1.5; }

.ap-region-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 28px; }
@media(max-width:700px){.ap-region-grid{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.ap-region-grid{grid-template-columns:1fr}}

.ap-region-card {
  background: rgba(255,249,240,.9); border: 1px solid rgba(196,152,10,.25);
  border-radius: 18px; padding: 24px 20px;
  transition: transform .35s, box-shadow .35s, border-color .3s;
  position: relative; overflow: hidden;
}
.ap-region-card::after {
  content:''; position:absolute; bottom:-20px; right:-20px;
  width:80px; height:80px; border-radius:50%;
  border:1px solid rgba(196,152,10,.12); pointer-events:none;
}
.ap-region-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(128,0,32,.1); border-color:rgba(196,152,10,.5); }
.ap-region-icon  { font-size:24px; margin-bottom:12px; display:block; }
.ap-region-name  { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:#800020; margin-bottom:6px; line-height:1.2; }
.ap-region-state { font-family:'Jost'; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#C4980A; font-weight:600; margin-bottom:12px; display:block; }
.ap-region-desc  { font-family:'Jost'; font-size:13px; font-weight:300; color:#4a3828; line-height:1.75; }

.ap-process-steps { display:flex; flex-direction:column; gap:0; margin-top:28px; }
.ap-step { display:flex; gap:24px; align-items:flex-start; padding:24px 0; border-bottom:1px solid rgba(196,152,10,.15); }
.ap-step:last-child { border-bottom:none; }
.ap-step-num { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:300; color:rgba(196,152,10,.3); line-height:1; flex-shrink:0; width:52px; text-align:right; }
.ap-step-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; color:#800020; margin-bottom:6px; line-height:1.2; }
.ap-step-desc   { font-family:'Jost'; font-size:14px; font-weight:300; color:#4a3828; line-height:1.8; }

.ap-profiles-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:28px; }
@media(max-width:600px){.ap-profiles-grid{grid-template-columns:1fr}}
.ap-profile-card { background:rgba(255,249,240,.9); border:1px solid rgba(196,152,10,.25); border-radius:18px; padding:28px 24px; transition:transform .35s,box-shadow .35s; }
.ap-profile-card:hover { transform:translateY(-3px); box-shadow:0 14px 44px rgba(128,0,32,.1); }
.ap-profile-header { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
.ap-profile-avatar { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,rgba(196,152,10,.2),rgba(128,0,32,.15)); border:1.5px solid rgba(196,152,10,.35); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.ap-profile-name   { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:#800020; line-height:1.1; }
.ap-profile-role   { font-family:'Jost'; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:#C4980A; font-weight:600; margin-top:3px; }
.ap-profile-quote  { font-family:'Cormorant Garamond',serif; font-size:16px; font-style:italic; font-weight:400; color:#5a3020; line-height:1.72; border-left:2px solid rgba(196,152,10,.4); padding-left:14px; margin-bottom:14px; }
.ap-profile-region { font-family:'Jost'; font-size:12px; font-weight:400; color:#9a8070; letter-spacing:.06em; }

.ap-philosophy {
  background: linear-gradient(135deg, #800020 0%, #5a0016 60%, #4B0082 100%);
  border-radius:28px; padding:56px 52px;
  position:relative; overflow:hidden;
  box-shadow:0 20px 70px rgba(128,0,32,.25);
  margin-bottom:48px;
}
.ap-philosophy::before { content:''; position:absolute; top:-80px; right:-60px; width:260px; height:260px; border-radius:50%; border:1px solid rgba(212,175,55,.12); pointer-events:none; }
.ap-philosophy::after  { content:''; position:absolute; bottom:-70px; left:-50px; width:220px; height:220px; border-radius:50%; border:1px solid rgba(212,175,55,.08); pointer-events:none; }
.ap-philosophy-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:32px; position:relative; z-index:1; }
@media(max-width:700px){.ap-philosophy-grid{grid-template-columns:1fr; gap:24px}}
.ap-phil-num   { font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:300; color:rgba(212,175,55,.25); line-height:1; margin-bottom:10px; }
.ap-phil-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; color:white; margin-bottom:10px; line-height:1.2; }
.ap-phil-desc  { font-family:'Jost'; font-size:13px; font-weight:300; color:rgba(255,255,255,.7); line-height:1.8; }

.ap-thread-divider { width:100%; overflow:hidden; line-height:0; padding:8px 0; pointer-events:none; }

.ap-timeline { position:relative; padding-left:32px; margin-top:28px; }
.ap-timeline::before { content:''; position:absolute; left:0; top:8px; bottom:8px; width:1px; background:linear-gradient(to bottom,rgba(196,152,10,.5),rgba(196,152,10,.1)); }
.ap-tl-item { position:relative; padding:0 0 32px 24px; }
.ap-tl-item:last-child { padding-bottom:0; }
.ap-tl-dot  { position:absolute; left:-4px; top:6px; width:9px; height:9px; border-radius:50%; background:#C4980A; border:2px solid rgba(255,249,240,.9); box-shadow:0 0 0 3px rgba(196,152,10,.2); }
.ap-tl-year  { font-family:'Jost'; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#C4980A; font-weight:600; margin-bottom:6px; }
.ap-tl-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:#800020; margin-bottom:6px; line-height:1.2; }
.ap-tl-desc  { font-family:'Jost'; font-size:14px; font-weight:300; color:#4a3828; line-height:1.78; }

.ap-cta {
  background: linear-gradient(135deg, #800020 0%, #5a0016 50%, #4B0082 100%);
  border-radius:28px; padding:72px 56px; text-align:center;
  position:relative; overflow:hidden;
  box-shadow:0 24px 80px rgba(128,0,32,.3);
}
.ap-cta::before { content:''; position:absolute; top:-80px; right:-80px; width:280px; height:280px; border-radius:50%; border:1px solid rgba(212,175,55,.12); pointer-events:none; }
.ap-cta::after  { content:''; position:absolute; bottom:-100px; left:-80px; width:320px; height:320px; border-radius:50%; border:1px solid rgba(212,175,55,.08); pointer-events:none; }
.ap-cta-eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(212,175,55,.15); border:1px solid rgba(212,175,55,.35); padding:7px 18px; border-radius:100px; margin-bottom:22px; }
.ap-cta-title   { font-family:'Cormorant Garamond',serif; font-size:clamp(30px,5vw,52px); font-weight:400; color:white; margin-bottom:20px; line-height:1.12; }
.ap-cta-body    { font-family:'Jost'; font-size:15px; font-weight:300; color:rgba(255,255,255,.8); line-height:1.88; max-width:600px; margin:0 auto 28px; }
.ap-cta-italic  { font-family:'Cormorant Garamond',serif; font-size:21px; font-style:italic; font-weight:400; color:#D4AF37; line-height:1.6; position:relative; z-index:1; }
@media(max-width:700px){.ap-cta{padding:48px 28px}}
@media(max-width:480px){.ap-cta{padding:40px 20px; border-radius:20px}}

.ap-section-label { display:flex; align-items:center; gap:14px; margin-bottom:24px; }
.ap-section-label-line { flex:1; height:1px; background:rgba(196,152,10,.2); }
`;

function ThreadDivider() {
  return (
    <div className="ap-thread-divider">
      <svg viewBox="0 0 1080 50" preserveAspectRatio="none"
        style={{ width: '100%', height: 50, display: 'block' }}>
        <path d="M0,25 C180,5 360,45 540,25 C720,5 900,45 1080,25"
          stroke="rgba(196,152,10,0.3)" strokeWidth="1.2" fill="none"
          style={{ animation: 'flowThread1 6s ease-in-out infinite' }} />
        <path d="M0,35 C150,15 380,55 540,32 C700,12 900,52 1080,35"
          stroke="rgba(196,152,10,0.15)" strokeWidth="0.8" fill="none"
          style={{ animation: 'flowThread2 9s ease-in-out infinite' }} />
      </svg>
    </div>
  );
}

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

  const REGIONS = [
    { icon:"🏛️", name:"Banarasi",    state:"Varanasi, Uttar Pradesh",  desc:"Home to the finest silk brocades in the world. Banarasi weaves are known for their intricate gold and silver zari work, inspired by Mughal motifs and temple architecture." },
    { icon:"🌺", name:"Kanchipuram", state:"Tamil Nadu",               desc:"Woven from pure mulberry silk with contrasting borders, Kanchipuram sarees are considered the gold standard of South Indian bridal wear. Each takes up to two weeks to complete." },
    { icon:"🎋", name:"Jamdani",     state:"Murshidabad, West Bengal", desc:"A UNESCO Intangible Cultural Heritage. Jamdani features geometric and floral patterns woven directly onto fine muslin — a technique so delicate it is called 'weaving air'." },
    { icon:"🦚", name:"Sambalpuri",  state:"Odisha",                   desc:"Celebrated for its 'Bandha' tie-and-dye technique. Sambalpuri artisans dye each thread before weaving, creating vibrant ikat patterns of peacocks, lotuses, and temple wheels." },
    { icon:"🌊", name:"Pochampally", state:"Telangana",                desc:"Famous for its geometric ikat patterns. Known as the 'Silk City of India', Pochampally weaving communities have turned this art into a GI-tagged national treasure." },
    { icon:"🌾", name:"Chanderi",    state:"Madhya Pradesh",           desc:"Translucent, lightweight, and exquisitely delicate — Chanderi sarees combine silk and cotton to create fabrics that drape like a whisper. Motifs draw from nature and royalty." },
  ];

  const PROCESS_STEPS = [
    { num:"01", title:"Thread Selection & Natural Dyeing", desc:"The journey begins with raw silk or cotton yarn, hand-selected for quality. Natural dyes — indigo, turmeric, pomegranate rind, madder root — are prepared in clay vessels over open fires, a process unchanged for centuries." },
    { num:"02", title:"Warping the Loom",                  desc:"Hundreds of individual threads are stretched and aligned on the wooden loom with mathematical precision. This preparation alone can take a master weaver two full days before a single shuttle passes through." },
    { num:"03", title:"The Weaving",                       desc:"With hands and feet moving in perfect rhythm, the weaver interlaces weft threads through the warp. Intricate motifs — flowers, birds, temple borders — emerge row by row, each an act of memory and devotion." },
    { num:"04", title:"Zari & Embellishment",              desc:"Gold and silver zari threads, hand-drawn from pure metal wire, are woven into borders and pallus. A single Banarasi saree may contain over 5,600 individual zari insertions by hand." },
    { num:"05", title:"Quality & Finishing",               desc:"Each saree is hand-inspected thread by thread, washed in soft water, sun-dried on bamboo frames, and lightly starched. Only pieces that meet our artisan council's standards carry the Neyge seal." },
  ];

  const ARTISAN_PROFILES = [
    { emoji:"👩", name:"Radha Devi",       role:"Master Weaver · Murshidabad", region:"Jamdani Specialist · 38 years of craft",   quote:"I learned to weave when I was seven. My mother said: 'The loom will never leave you hungry, and it will never leave you silent.' She was right on both counts." },
    { emoji:"👨", name:"Rameshwar Prasad", role:"Zari Master · Varanasi",      region:"Banarasi Brocade · 3rd Generation",         quote:"My grandfather said gold thread is not for showing off. It is for saying — this family worked hard, this moment matters, this woman deserves to feel like a queen." },
    { emoji:"👩", name:"Lakshmi Bai",      role:"Ikat Dyer · Pochampally",     region:"Pochampally Ikat · 22 years of practice",  quote:"The dye does not know the design yet. The thread does not know its colour. But between my hands and the water and the sun — the saree knows exactly who it is becoming." },
    { emoji:"👨", name:"Mohan Das",        role:"Sambalpuri Weaver · Odisha",  region:"Bandha Tie-Dye · GI Certified",             quote:"People ask me how long one saree takes. I say: twenty years to learn how, and five days to weave. The twenty years is the part they wear." },
  ];

  const PHILOSOPHY = [
    { num:"I",   title:"Soul Before Scale",     desc:"We will never sacrifice the intimacy of handwork for the speed of machines. Every saree that leaves our hands is made entirely by human hands — no exceptions." },
    { num:"II",  title:"Story Before Sale",     desc:"We believe a saree's value is not its price tag but the life lived in its making. We document every artisan's story so the wearer knows exactly whose hands made their garment." },
    { num:"III", title:"Heritage Before Trend", desc:"Fashion changes with seasons. Handloom endures across centuries. We make sarees that are relevant today not because they are trendy, but because they are true." },
  ];

  const TIMELINE = [
    { year:"2019", title:"The First Loom Visit",       desc:"Our founders visited a struggling Jamdani weaver collective in Murshidabad. Seventeen artisans, four working looms. The seeds of Neyge were planted that afternoon." },
    { year:"2020", title:"First Artisan Partnership",  desc:"We partnered with 12 weavers across Bengal and Varanasi, committing to fixed fair wages regardless of market fluctuation — a first for the region." },
    { year:"2021", title:"GI Certification Network",   desc:"Neyge helped 31 artisans complete their Geographical Indication (GI) certification, giving their craft official government recognition and legal protection." },
    { year:"2022", title:"Six Regions, One Mission",   desc:"We expanded to six weaving regions — Varanasi, Murshidabad, Odisha, Telangana, Tamil Nadu, and Madhya Pradesh — while maintaining direct relationships with every weaver." },
    { year:"2024", title:"500 Artisans Empowered",     desc:"Over 500 artisan families now earn consistent, dignified income through Neyge. Average artisan income has increased by 3.2x since their first season with us." },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ap-root">

        {/* ══════════════════════════════════════════════════════
            HERO — full-width background image
        ══════════════════════════════════════════════════════ */}
        <header className="ap-hero">
          <div className="ap-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="ap-hero-overlay" />
          <div className="ap-hero-grain" />
          <div className="ap-hero-fade-btm" />

          <div className="ap-hero-inner">
            <div className="ap-hero-badge">
              <Sparkles size={13} color={C.goldV} />
              <span className="ap-ey">Our Legacy</span>
            </div>

            <h1 className="ap-hero-title">
              Weaving Stories,<br />
              <em>Not Just Sarees</em>
            </h1>

            <span className="ap-hero-rule" style={{ width: 80 }} />

            <p className="ap-hero-sub">
              Every thread carries a legacy. Every weave preserves a tradition.
              Behind every saree lies the skilled hands of master artisans who
              have inherited their craft across generations.
            </p>

            <div className="ap-hero-chips">
              {["500+ Artisans", "100% Handloom", "GI Certified", "Natural Dyes", "Zero Machines"].map(c => (
                <span key={c} className="ap-hero-chip">{c}</span>
              ))}
            </div>
          </div>

          <div className="ap-hero-scroll">
            <span className="ap-hero-scroll-lbl">Scroll</span>
            <div className="ap-hero-scroll-line" />
          </div>
        </header>

        {/* ── Body ── */}
        <div className="ap-wrap" style={{ paddingBottom: 80 }}>

          {/* S1 — Heritage Meets Craftsmanship */}
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
                  <p className="ap-body">For centuries, India's weaving communities have preserved techniques passed down through generations. From intricate zari borders to hand-dyed natural fabrics, each saree reflects patience, precision, and pride.</p>
                  <p className="ap-body">Our artisans do not just create garments — they create heirlooms. Every piece is woven on traditional looms, often taking days or even weeks to complete.</p>
                </div>
                <div>
                  <blockquote className="ap-pull">"The rhythm of the loom is not just work — it is tradition in motion."</blockquote>
                  <div style={{ marginTop:20, padding:'18px 20px', background:'rgba(196,152,10,.07)', borderRadius:16, border:'1px solid rgba(196,152,10,.2)' }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:500, color:C.maroon, lineHeight:1 }}>3 Generations</div>
                    <div style={{ fontFamily:"'Jost'", fontSize:11, letterSpacing:'.1em', color:'#9a8070', marginTop:5, textTransform:'uppercase', fontWeight:500 }}>of weaving mastery</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ThreadDivider />

          {/* S2 — Hands Behind the Heritage */}
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
              <p className="ap-body">Our artisans come from renowned weaving regions across India — where craftsmanship is not a profession, but a way of life.</p>
              <p className="ap-body">Many began learning the art as children, sitting beside their elders, understanding the dance between thread and tension.</p>
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

          {/* S3 — Crafting Change */}
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
              <p className="ap-body">When you choose handloom, you support rural artisan families, fair wages, ethical sourcing, and the preservation of disappearing crafts.</p>
              <div style={{ border:'1px solid rgba(196,152,10,.2)', borderRadius:20, overflow:'hidden', marginTop:32 }}>
                <div className="ap-stats-grid">
                  {STATS.map((s, i) => (
                    <div key={s.lbl} className="ap-stat" style={{ animationDelay:`${i * 0.1}s` }}>
                      <div className="ap-stat-num">{s.num}</div>
                      <div className="ap-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <ThreadDivider />

          {/* S4 — Artisan Voices */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">Their Words</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">In Their Own Words</h2>
                <span className="ap-gd" />
              </div>
              <p className="ap-body">We believe the most powerful story a saree can carry is the voice of the person who made it. Here are the words of four of our master weavers — spoken in their villages, translated with love.</p>
              <div className="ap-profiles-grid">
                {ARTISAN_PROFILES.map(p => (
                  <div key={p.name} className="ap-profile-card">
                    <div className="ap-profile-header">
                      <div className="ap-profile-avatar">{p.emoji}</div>
                      <div>
                        <div className="ap-profile-name">{p.name}</div>
                        <div className="ap-profile-role">{p.role}</div>
                      </div>
                    </div>
                    <p className="ap-profile-quote">"{p.quote}"</p>
                    <span className="ap-profile-region">{p.region}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* S5 — Weaving Regions */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">The Regions</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">Six Regions,<br />One Unbroken Thread</h2>
                <span className="ap-gd" />
              </div>
              <p className="ap-body">India's handloom geography is a living atlas of culture. Each region has developed its own signature language of weave, dye, and motif — shaped by its soil, its rivers, its gods, and its history.</p>
              <div className="ap-region-grid">
                {REGIONS.map(r => (
                  <div key={r.name} className="ap-region-card">
                    <span className="ap-region-icon">{r.icon}</span>
                    <div className="ap-region-name">{r.name}</div>
                    <span className="ap-region-state">{r.state}</span>
                    <p className="ap-region-desc">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ThreadDivider />

          {/* S6 — The Making */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">The Process</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">From Thread to Treasure</h2>
                <span className="ap-gd" />
              </div>
              <p className="ap-body">A handloom saree is not manufactured. It is grown — slowly, deliberately, step by step — the way a story is told. Here is what happens between the raw thread and the moment it reaches you.</p>
              <div className="ap-process-steps">
                {PROCESS_STEPS.map(s => (
                  <div key={s.num} className="ap-step">
                    <div className="ap-step-num">{s.num}</div>
                    <div>
                      <div className="ap-step-title">{s.title}</div>
                      <p className="ap-step-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* S7 — Philosophy */}
          <section className="ap-fade ap-d3">
            <div className="ap-philosophy">
              <div style={{ textAlign:'center', marginBottom:44, position:'relative', zIndex:1 }}>
                <div className="ap-cta-eyebrow" style={{ justifyContent:'center', display:'inline-flex' }}>
                  <Sparkles size={13} color={C.goldV} />
                  <span style={{ fontFamily:"'Jost'", fontSize:11, letterSpacing:'.2em', textTransform:'uppercase', color:C.goldV, fontWeight:600 }}>Our Philosophy</span>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,4.5vw,44px)', fontWeight:400, color:'white', marginTop:14, lineHeight:1.1 }}>Three Truths We Weave By</h2>
                <div style={{ width:56, height:1, background:'rgba(212,175,55,.45)', margin:'18px auto 0' }} />
              </div>
              <div className="ap-philosophy-grid">
                {PHILOSOPHY.map(p => (
                  <div key={p.num}>
                    <div className="ap-phil-num">{p.num}</div>
                    <div className="ap-phil-title">{p.title}</div>
                    <p className="ap-phil-desc">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ThreadDivider />

          {/* S8 — Timeline */}
          <section className="ap-section ap-fade ap-d2">
            <div className="ap-card">
              <div className="ap-card-title-wrap">
                <div className="ap-section-label">
                  <span className="ap-ey">Our Journey</span>
                  <div className="ap-section-label-line" />
                </div>
                <h2 className="ap-card-title">The Neyge Story,<br />Year by Year</h2>
                <span className="ap-gd" />
              </div>
              <p className="ap-body">
                Neyge did not begin with a business plan. It began with a conversation in a weaver's courtyard in Murshidabad — and a question that has guided us ever since:{' '}
                <em style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:'#5a3020' }}>"What if the woman who buys the saree could hear the loom that made it?"</em>
              </p>
              <div className="ap-timeline">
                {TIMELINE.map(t => (
                  <div key={t.year} className="ap-tl-item">
                    <div className="ap-tl-dot" />
                    <div className="ap-tl-year">{t.year}</div>
                    <div className="ap-tl-title">{t.title}</div>
                    <p className="ap-tl-desc">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* S9 — Final CTA */}
          <section className="ap-fade ap-d3">
            <div className="ap-cta">
              <div className="ap-cta-eyebrow">
                <Sparkles size={13} color={C.goldV} />
                <span style={{ fontFamily:"'Jost'", fontSize:11, letterSpacing:'.2em', textTransform:'uppercase', color:C.goldV, fontWeight:600 }}>Our Commitment</span>
              </div>
              <h2 className="ap-cta-title">A Commitment<br /><em style={{ fontStyle:'italic', fontWeight:300 }}>to Authenticity</em></h2>
              <div style={{ width:56, height:1, background:'rgba(212,175,55,.5)', margin:'0 auto 24px' }} />
              <p className="ap-cta-body">Every saree you wear carries a human story — a legacy woven with dedication, resilience, and artistry.</p>
              <p className="ap-cta-italic">"When you drape our sarees, you don't just wear elegance —<br />you wear tradition."</p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}