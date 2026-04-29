// // import { useState, useMemo } from 'react';
// // import { useSearchParams } from 'react-router-dom';
// // import { SareeCard } from '@/components/features/SareeCard';
// // import { SAREES } from '@/constants/sarees';
// // import { ChevronDown, X, Sparkles, SlidersHorizontal, ChevronRight, Tag } from 'lucide-react';

// // // ─── Import hero image (same as HomePage g3.png) ─────────────────────────────
// // import shopHeroImg from '@/assets/g17.png';

// // const FABRICS   = ['Silk', 'Cotton', 'Linen', 'Khadi'];
// // const OCCASIONS = ['Wedding', 'Casual', 'Festive', 'Party'];
// // const COLORS    = ['Red', 'Blue', 'Green', 'Gold', 'Pink', 'Purple', 'White', 'Multicolor'];

// // const SORT_OPTIONS = [
// //   { value: 'popular',    label: 'Most Popular'       },
// //   { value: 'price-asc',  label: 'Price: Low to High' },
// //   { value: 'price-desc', label: 'Price: High to Low' },
// //   { value: 'newest',     label: 'Newest First'        },
// // ];

// // // ─── Brand palette ────────────────────────────────────────────────────────────
// // const C = {
// //   maroon:     "#800020",
// //   maroonDark: "#5a0016",
// //   gold:       "#C4980A",
// //   goldV:      "#D4AF37",
// //   cream:      "#F5E6D3",
// //   creamLight: "#FFF9F0",
// //   warmGrey:   "#4a3828",
// // };

// // // ─── CSS ──────────────────────────────────────────────────────────────────────
// // const CSS = `
// // @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

// // *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
// // html { scroll-behavior: smooth; }

// // .sp-root {
// //   font-family: 'Jost', sans-serif;
// //   background: #FFF9F0;
// //   color: #1a1010;
// //   min-height: 100vh;
// //   overflow-x: hidden;
// //   line-height: 1;
// // }

// // /* ── Wrap ── */
// // .sp-wrap { max-width: 1320px; margin: 0 auto; padding: 0 56px; }
// // @media(max-width: 900px)  { .sp-wrap { padding: 0 20px; } }
// // @media(max-width: 480px)  { .sp-wrap { padding: 0 16px; } }

// // /* ── Eyebrow ── */
// // .sp-ey {
// //   font-family: 'Jost', sans-serif; font-size: 11px;
// //   letter-spacing: 0.25em; text-transform: uppercase;
// //   color: #C4980A; font-weight: 600;
// // }

// // /* ─────────────────────────────────────
// //    ANIMATIONS
// // ───────────────────────────────────── */
// // @keyframes spFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
// // @keyframes spFadeIn   { from{opacity:0} to{opacity:1} }
// // @keyframes spSlideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
// // @keyframes spSlideIn  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
// // @keyframes spOrb      { 0%,100%{transform:scale(1);opacity:.14} 50%{transform:scale(1.28);opacity:.26} }
// // @keyframes silkMove   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
// // @keyframes shimmerBtn { 0%{left:-80%} 100%{left:120%} }
// // @keyframes spCardIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

// // .sp-fadein  { animation: spFadeIn  0.35s ease both; }
// // .sp-card    { animation: spCardIn  0.6s ease  both; }
// // .sp-fade    { animation: spFadeUp  0.9s  cubic-bezier(.4,0,.2,1) both; }
// // .sp-d0 { animation-delay:0s    }
// // .sp-d1 { animation-delay:.12s  }
// // .sp-d2 { animation-delay:.24s  }
// // .sp-d3 { animation-delay:.36s  }
// // .sp-d4 { animation-delay:.50s  }
// // .sp-d5 { animation-delay:.65s  }

// // /* ─────────────────────────────────────
// //    HERO
// // ───────────────────────────────────── */
// // .sp-hero {
// //   position: relative;
// //   height: 100vh; min-height: 600px;
// //   display: flex; align-items: center; justify-content: center;
// //   overflow: hidden;
// // }
// // .sp-hero-img {
// //   position: absolute; inset: 0; width: 100%; height: 100%;
// //   object-fit: cover; object-position: center top;
// // }
// // .sp-hero-overlay {
// //   position: absolute; inset: 0;
// //   background: linear-gradient(180deg,
// //     rgba(0,0,0,.38) 0%,
// //     rgba(60,0,15,.52) 50%,
// //     rgba(0,0,0,.72) 100%);
// // }
// // .sp-hero-silk {
// //   position: absolute; inset: 0; overflow: hidden; pointer-events: none;
// // }
// // .sp-hero-silk-bar {
// //   position: absolute; top: 0; bottom: 0; width: 30%;
// //   background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
// //   animation: silkMove 16s linear infinite;
// // }
// // .sp-hero-content {
// //   position: relative; z-index: 2;
// //   text-align: center; color: white;
// //   padding: 80px 24px 0;   /* ← was: 0 24px — add 80px top */
// //   max-width: 760px; width: 100%;
// // }
// // .sp-hero-badge {
// //   display: inline-flex; align-items: center; gap: 8px;
// //   background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
// //   border: 1px solid rgba(212,175,55,.5);
// //   padding: 8px 10px; border-radius: 100px; margin-bottom: 22px;
// // }
// // .sp-hero-title {
// //   font-family: 'Cormorant Garamond', serif;
// //   font-size: clamp(38px, 7vw, 74px);
// //   font-weight: 300; line-height: 1.06; margin-bottom: 16px;
// // }
// // .sp-hero-sub {
// //   font-family: 'Cormorant Garamond', serif;
// //   font-size: clamp(16px, 2.5vw, 21px);
// //   font-style: italic; font-weight: 300;
// //   color: rgba(255,255,255,.82); margin-bottom: 14px;
// // }
// // .sp-hero-divider {
// //   width: 56px; height: 1px; background: #D4AF37;
// //   margin: 0 auto 20px; opacity: .8;
// // }
// // .sp-hero-desc {
// //   font-family: 'Jost'; font-size: 15px; font-weight: 300;
// //   color: rgba(255,255,255,.78); line-height: 1.85;
// //   max-width: 520px; margin: 0 auto 28px;
// // }
// // .sp-hero-pills {
// //   display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 20px;
// // }
// // .sp-hero-pill {
// //   padding: 7px 16px;
// //   background: rgba(255,255,255,.12); backdrop-filter: blur(6px);
// //   border: 1px solid rgba(212,175,55,.45); border-radius: 100px;
// //   font-family: 'Jost'; font-size: 11px; letter-spacing: .12em;
// //   color: rgba(255,255,255,.9); text-transform: uppercase; font-weight: 500;
// // }
// // .sp-hero-count {
// //   font-family: 'Jost'; font-size: 11px; letter-spacing: .18em;
// //   text-transform: uppercase; color: rgba(255,255,255,.42);
// // }
// // .sp-scroll-ind {
// //   position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
// //   display: flex; flex-direction: column; align-items: center; gap: 6px;
// //   animation: spFadeUp 1s ease 1.4s both;
// // }

// // /* ─────────────────────────────────────
// //    TOOLBAR
// // ───────────────────────────────────── */
// // .sp-toolbar {
// //   display: flex; align-items: center; justify-content: space-between;
// //   padding: 20px 0;
// //   border-bottom: 1px solid rgba(196,152,10,.18);
// //   margin-bottom: 24px;
// //   flex-wrap: wrap; gap: 12px;
// // }
// // .sp-toolbar-left {
// //   font-family: 'Jost'; font-size: 14px; color: #4a3828; font-weight: 400;
// // }
// // .sp-toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

// // /* ── Filter trigger ── */
// // .sp-filter-trigger {
// //   display: flex; align-items: center; gap: 8px;
// //   padding: 10px 22px;
// //   background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
// //   border: 1.5px solid rgba(196,152,10,.35); border-radius: 100px;
// //   font-family: 'Jost'; font-size: 13px; font-weight: 600;
// //   color: #800020; cursor: pointer;
// //   transition: transform .3s, box-shadow .3s;
// //   box-shadow: 0 3px 16px rgba(0,0,0,.07);
// // }
// // .sp-filter-trigger:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1); }
// // .sp-filter-badge {
// //   width: 18px; height: 18px; border-radius: 50%;
// //   background: #800020; color: white;
// //   font-size: 10px; font-weight: 700;
// //   display: flex; align-items: center; justify-content: center;
// // }

// // /* ── Sort ── */
// // .sp-sort-wrap { position: relative; }
// // .sp-sort {
// //   appearance: none; -webkit-appearance: none;
// //   background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
// //   border: 1.5px solid rgba(196,152,10,.35);
// //   padding: 10px 40px 10px 18px; border-radius: 100px;
// //   font-family: 'Jost'; font-size: 13px; font-weight: 500;
// //   color: #800020; cursor: pointer;
// //   transition: box-shadow .3s; box-shadow: 0 3px 16px rgba(0,0,0,.07);
// // }
// // .sp-sort:focus { outline: none; border-color: #C4980A; }
// // .sp-sort:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }

// // /* ─────────────────────────────────────
// //    ACTIVE CHIPS
// // ───────────────────────────────────── */
// // .sp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
// // .sp-chip-active {
// //   display: inline-flex; align-items: center; gap: 6px;
// //   padding: 6px 14px;
// //   background: rgba(128,0,32,.08); border: 1px solid rgba(128,0,32,.25);
// //   border-radius: 100px;
// //   font-family: 'Jost'; font-size: 12px; color: #800020; font-weight: 500;
// //   cursor: pointer; transition: background .2s;
// // }
// // .sp-chip-active:hover { background: rgba(128,0,32,.15); }

// // /* ─────────────────────────────────────
// //    GRID
// // ───────────────────────────────────── */
// // .sp-grid {
// //   display: grid;
// //   grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
// //   gap: 28px;
// // }
// // @media(max-width: 640px) {
// //   .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
// // }
// // @media(max-width: 360px) {
// //   .sp-grid { grid-template-columns: 1fr; }
// // }
// // @media(max-width: 640px) {
// //   .sp-hero-content {
// //     padding-top: 130px;   /* ← add this line */
// //   }
// // }
// // /* ─────────────────────────────────────
// //    FILTER PANEL
// // ───────────────────────────────────── */
// // .sp-overlay {
// //   position: fixed; inset: 0; z-index: 60;
// //   background: rgba(8,2,2,.5); backdrop-filter: blur(3px);
// //   animation: spFadeIn .3s ease both;
// // }

// // /* Desktop: slides in from LEFT; Mobile: slides up from BOTTOM */
// // .sp-panel {
// //   position: fixed; top: 0; left: 0; bottom: 0;
// //   width: 360px; max-width: 88vw; z-index: 61;
// //   display: flex; flex-direction: column;
// //   box-shadow: 20px 0 80px rgba(0,0,0,.24);
// //   animation: spSlideIn .42s cubic-bezier(.16,1,.3,1) both;
// // }

// // /* ── Panel header ── */
// // .sp-panel-head {
// //   background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
// //   padding: 36px 28px 28px; position: relative; overflow: hidden; flex-shrink: 0;
// // }
// // .sp-panel-head::after {
// //   content: ''; position: absolute; top: -60px; right: -60px;
// //   width: 200px; height: 200px; border-radius: 50%;
// //   border: 1px solid rgba(212,175,55,.15); pointer-events: none;
// // }
// // .sp-panel-head::before {
// //   content: ''; position: absolute; top: -100px; right: -100px;
// //   width: 320px; height: 320px; border-radius: 50%;
// //   border: 1px solid rgba(212,175,55,.08); pointer-events: none;
// // }
// // .sp-panel-shine {
// //   position: absolute; inset: 0; overflow: hidden; pointer-events: none;
// // }
// // .sp-panel-shine::after {
// //   content: ''; position: absolute;
// //   top: -50%; left: -80%; width: 60%; height: 200%;
// //   background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
// //   animation: shimmerBtn 4s ease infinite;
// // }
// // .sp-panel-close {
// //   position: absolute; top: 18px; right: 18px;
// //   width: 32px; height: 32px; border-radius: 50%;
// //   background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
// //   display: flex; align-items: center; justify-content: center;
// //   cursor: pointer; transition: background .2s; z-index: 2;
// // }
// // .sp-panel-close:hover { background: rgba(255,255,255,.22); }
// // .sp-panel-eyebrow {
// //   display: flex; align-items: center; gap: 8px; margin-bottom: 10px; position: relative; z-index: 1;
// // }
// // .sp-panel-title {
// //   font-family: 'Cormorant Garamond', serif;
// //   font-size: 28px; font-weight: 400; color: white; position: relative; z-index: 1;
// //   margin-bottom: 6px;
// // }
// // .sp-panel-subtitle {
// //   font-family: 'Jost'; font-size: 11px; letter-spacing: .18em;
// //   text-transform: uppercase; color: rgba(255,255,255,.45); position: relative; z-index: 1;
// // }

// // /* ── Stats bar ── */
// // .sp-panel-stats {
// //   display: flex; background: rgba(255,249,240,.98);
// //   border-bottom: 1px solid rgba(196,152,10,.18); flex-shrink: 0;
// // }
// // .sp-panel-stat {
// //   flex: 1; padding: 13px 10px; text-align: center;
// //   border-right: 1px solid rgba(196,152,10,.14);
// // }
// // .sp-panel-stat:last-child { border-right: none; }
// // .sp-panel-stat-n {
// //   font-family: 'Cormorant Garamond', serif;
// //   font-size: 21px; font-weight: 500; color: #800020; line-height: 1;
// // }
// // .sp-panel-stat-l {
// //   font-family: 'Jost'; font-size: 10px; letter-spacing: .1em;
// //   text-transform: uppercase; color: #9a8070; margin-top: 3px; font-weight: 500;
// // }

// // /* ── Body ── */
// // .sp-panel-body {
// //   flex: 1; overflow-y: auto;
// //   background: linear-gradient(180deg, #FFF9F0 0%, #F8EEE2 100%);
// //   padding: 0 24px;
// // }
// // .sp-panel-body::-webkit-scrollbar { width: 4px; }
// // .sp-panel-body::-webkit-scrollbar-track { background: #F5E6D3; }
// // .sp-panel-body::-webkit-scrollbar-thumb { background: #C4980A; border-radius: 2px; }

// // /* ── Accordion ── */
// // .sp-acc {
// //   border-bottom: 1px solid rgba(196,152,10,.2);
// // }
// // .sp-acc-head {
// //   display: flex; align-items: center; justify-content: space-between;
// //   padding: 16px 0; cursor: pointer; user-select: none;
// // }
// // .sp-acc-head:hover .sp-acc-label { color: #800020; }
// // .sp-acc-label {
// //   font-family: 'Cormorant Garamond', serif;
// //   font-size: 17px; font-weight: 500; color: #3a1818; transition: color .2s;
// //   display: flex; align-items: center; gap: 8px;
// // }
// // .sp-acc-cnt {
// //   display: inline-flex; align-items: center; justify-content: center;
// //   width: 19px; height: 19px; border-radius: 50%;
// //   background: #800020; color: white;
// //   font-family: 'Jost'; font-size: 10px; font-weight: 700;
// // }
// // .sp-acc-chev {
// //   color: #C4980A; transition: transform .3s cubic-bezier(.4,0,.2,1);
// // }
// // .sp-acc-chev.open { transform: rotate(90deg); }
// // .sp-acc-body {
// //   overflow: hidden;
// //   max-height: 0; opacity: 0;
// //   transition: max-height .38s cubic-bezier(.4,0,.2,1), opacity .3s ease;
// // }
// // .sp-acc-body.open { max-height: 400px; opacity: 1; }

// // /* ── Chips inside accordion ── */
// // .sp-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 18px; }
// // .sp-chip {
// //   padding: 7px 16px; border-radius: 100px;
// //   border: 1.5px solid rgba(196,152,10,.35);
// //   font-family: 'Jost'; font-size: 12px; letter-spacing: .05em;
// //   color: #4a3828; background: white; cursor: pointer;
// //   transition: all .25s cubic-bezier(.4,0,.2,1); font-weight: 400;
// // }
// // .sp-chip:hover {
// //   border-color: #800020; color: #800020;
// //   background: rgba(128,0,32,.05); transform: translateY(-1px);
// // }
// // .sp-chip.on {
// //   background: linear-gradient(135deg, #800020 0%, #5a0016 100%);
// //   border-color: #800020; color: white;
// //   box-shadow: 0 4px 14px rgba(128,0,32,.3); font-weight: 500;
// // }

// // /* ── Price ── */
// // .sp-price-wrap { padding: 14px 0 22px; }
// // .sp-price-track-outer {
// //   position: relative; height: 4px;
// //   background: rgba(196,152,10,.22); border-radius: 100px; margin: 14px 0 4px;
// // }
// // .sp-price-fill {
// //   position: absolute; left: 0; top: 0; height: 100%;
// //   background: linear-gradient(90deg, #C4980A, #D4AF37);
// //   border-radius: 100px; pointer-events: none; transition: width .1s;
// // }
// // .sp-slider {
// //   width: 100%; appearance: none; -webkit-appearance: none;
// //   height: 4px; background: transparent;
// //   border-radius: 100px; cursor: pointer; display: block;
// // }
// // .sp-slider::-webkit-slider-thumb {
// //   appearance: none; -webkit-appearance: none;
// //   width: 20px; height: 20px; border-radius: 50%;
// //   background: #800020; border: 2.5px solid white;
// //   box-shadow: 0 2px 10px rgba(128,0,32,.4); cursor: pointer;
// //   transition: transform .2s;
// // }
// // .sp-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
// // .sp-price-row {
// //   display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
// // }
// // .sp-price-lbl { font-family: 'Jost'; font-size: 12px; color: #9a8070; }
// // .sp-price-val { font-family: 'Cormorant Garamond',serif; font-size: 19px; font-weight: 600; color: #800020; }

// // /* ── Footer ── */
// // .sp-panel-footer {
// //   padding: 18px 24px 28px;
// //   background: rgba(255,249,240,.98);
// //   border-top: 1px solid rgba(196,152,10,.18);
// //   flex-shrink: 0;
// // }
// // .sp-btn-apply {
// //   width: 100%; padding: 15px; border: none; border-radius: 100px;
// //   background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
// //   color: #800020;
// //   font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
// //   font-weight: 600; text-transform: uppercase; cursor: pointer;
// //   transition: transform .3s, box-shadow .3s;
// //   box-shadow: 0 6px 24px rgba(212,175,55,.38);
// //   position: relative; overflow: hidden;
// // }
// // .sp-btn-apply::after {
// //   content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
// //   background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
// //   animation: shimmerBtn 3s ease infinite;
// // }
// // .sp-btn-apply:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }
// // .sp-btn-clear {
// //   width: 100%; padding: 11px; margin-top: 10px;
// //   background: transparent; border: 1.5px solid rgba(196,152,10,.35);
// //   color: #4a3828; border-radius: 100px;
// //   font-family: 'Jost'; font-size: 12px; letter-spacing: .1em;
// //   text-transform: uppercase; cursor: pointer; font-weight: 500;
// //   transition: border-color .25s, color .25s;
// // }
// // .sp-btn-clear:hover { border-color: #800020; color: #800020; }

// // /* ─────────────────────────────────────
// //    EMPTY STATE
// // ───────────────────────────────────── */
// // .sp-empty { text-align: center; padding: 90px 0; }

// // /* ─────────────────────────────────────
// //    MOBILE OVERRIDES
// // ───────────────────────────────────── */
// // @media(max-width: 640px) {
// //   .sp-panel {
// //     top: auto; left: 0; right: 0; bottom: 0;
// //     width: 100%; max-width: 100%;
// //     border-radius: 24px 24px 0 0;
// //     max-height: 92vh;
// //     animation: spSlideUp .42s cubic-bezier(.16,1,.3,1) both;
// //     box-shadow: 0 -20px 80px rgba(0,0,0,.24);
// //   }
// //   .sp-panel-head { border-radius: 24px 24px 0 0; padding: 28px 22px 24px; }
// //   .sp-panel-title { font-size: 24px; }
// //   .sp-hero { height: 100vh; min-height: 480px; }
// //   .sp-hero-desc { font-size: 14px; }
// //   .sp-toolbar { gap: 10px; }
// //   .sp-toolbar-left { font-size: 13px; }
// // }

// // @media(max-width: 400px) {
// //   .sp-hero-pills { gap: 6px; }
// //   .sp-hero-pill  { font-size: 10px; padding: 6px 12px; }
// //   .sp-hero-title { font-size: 34px; }
// // }
// // `;

// // /* ═══════════════════════════════════════════════════════════════════════════
// //    COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════ */
// // export function ShopPage() {
// //   const [searchParams] = useSearchParams();
// //   const [showFilters, setShowFilters] = useState(false);

// //   const [selectedFabrics,   setSelectedFabrics]   = useState<string[]>(() => { const f = searchParams.get('fabric');   return f ? [f] : []; });
// //   const [selectedOccasions, setSelectedOccasions] = useState<string[]>(() => { const o = searchParams.get('occasion'); return o ? [o] : []; });
// //   const [selectedColors,    setSelectedColors]    = useState<string[]>([]);
// //   const [priceRange,        setPriceRange]        = useState<[number,number]>([0, 50000]);
// //   const [sortBy,            setSortBy]            = useState('popular');

// //   const toggle = (v: string, set: React.Dispatch<React.SetStateAction<string[]>>) =>
// //     set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

// //   const clearAll = () => {
// //     setSelectedFabrics([]); setSelectedOccasions([]);
// //     setSelectedColors([]); setPriceRange([0, 50000]);
// //   };

// //   const activeCount =
// //     selectedFabrics.length + selectedOccasions.length + selectedColors.length +
// //     (priceRange[1] < 50000 ? 1 : 0);

// //   const filteredSarees = useMemo(() => {
// //     let f = [...SAREES];
// //     if (selectedFabrics.length)   f = f.filter(s => selectedFabrics.includes(s.fabric));
// //     if (selectedOccasions.length) f = f.filter(s => selectedOccasions.includes(s.occasion));
// //     if (selectedColors.length)    f = f.filter(s => selectedColors.includes(s.color));
// //     f = f.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);
// //     if      (sortBy === 'price-asc')  f.sort((a,b) => a.price - b.price);
// //     else if (sortBy === 'price-desc') f.sort((a,b) => b.price - a.price);
// //     else if (sortBy === 'newest')     f.sort((a,b) => (b.newArrival?1:0)-(a.newArrival?1:0));
// //     else                              f.sort((a,b) => b.rating - a.rating);
// //     return f;
// //   }, [selectedFabrics, selectedOccasions, selectedColors, priceRange, sortBy]);

// //   const activeChips: { label: string; onRemove: () => void }[] = [
// //     ...selectedFabrics.map(v   => ({ label: v, onRemove: () => setSelectedFabrics(p  => p.filter(x=>x!==v)) })),
// //     ...selectedOccasions.map(v => ({ label: v, onRemove: () => setSelectedOccasions(p=> p.filter(x=>x!==v)) })),
// //     ...selectedColors.map(v    => ({ label: v, onRemove: () => setSelectedColors(p   => p.filter(x=>x!==v)) })),
// //     ...(priceRange[1] < 50000  ? [{ label: `≤ ₹${priceRange[1].toLocaleString('en-IN')}`, onRemove: () => setPriceRange([0,50000]) }] : []),
// //   ];

// //   return (
// //     <>
// //       <style>{CSS}</style>
// //       <div className="sp-root">

// //         {/* ══ HERO ══ */}
// //         <section className="sp-hero">
// //           <img src={shopHeroImg} alt="Shop" className="sp-hero-img" />
// //           <div className="sp-hero-overlay" />
// //           <div className="sp-hero-silk"><div className="sp-hero-silk-bar" /></div>

// //           {/* Gold orb */}
// //           <div style={{
// //             position:"absolute", bottom:"12%", left:"50%", transform:"translateX(-50%)",
// //             width:260, height:260, borderRadius:"50%",
// //             background:"radial-gradient(circle, rgba(212,175,55,.14) 0%, transparent 70%)",
// //             animation:"spOrb 8s ease-in-out infinite", pointerEvents:"none"
// //           }} />

// //           <div className="sp-hero-content">
// //             <div className="sp-fade sp-d0">
// //               <div className="sp-hero-badge">
// //                 <Sparkles size={13} color="#D4AF37" />
// //                 <span className="sp-ey" style={{ color:"rgba(212,175,55,.95)" }}>Handcrafted Excellence</span>
// //               </div>
// //             </div>

// //             <h1 className="sp-hero-title sp-fade sp-d1">
// //               Discover Timeless<br />
// //               <em style={{ fontStyle:"italic", fontWeight:300 }}>Elegance</em>
// //             </h1>

// //             <p className="sp-hero-sub sp-fade sp-d2">
// //               A Curated Collection of Handloom Masterpieces
// //             </p>

// //             <div className="sp-fade sp-d2">
// //               <div className="sp-hero-divider" />
// //             </div>

// //             <p className="sp-hero-desc sp-fade sp-d3">
// //               Each saree tells a unique story of heritage, artistry, and skilled craftsmanship.
// //               Explore pieces that celebrate India's rich weaving traditions while embracing
// //               contemporary sophistication.
// //             </p>

// //             <div className="sp-hero-pills sp-fade sp-d4">
// //               {["✦  Authentic Handloom","✦  Premium Fabrics","✦  Exclusive Designs","✦  Artisan Crafted"].map(l => (
// //                 <span key={l} className="sp-hero-pill">{l}</span>
// //               ))}
// //             </div>

// //             <p className="sp-hero-count sp-fade sp-d5">
// //               Browse {SAREES.length} exquisite pieces — each a testament to timeless beauty
// //             </p>
// //           </div>

// //           {/* Scroll indicator */}
// //           <div className="sp-scroll-ind">
// //             <span style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:".22em", color:"rgba(255,255,255,.35)", textTransform:"uppercase", writingMode:"vertical-rl" }}>Scroll</span>
// //             <div style={{ width:1, height:40, background:"linear-gradient(to bottom, rgba(212,175,55,.6), transparent)" }} />
// //           </div>
// //         </section>

// //         {/* ══ CONTENT ══ */}
// //         <div className="sp-wrap" style={{ paddingTop:40, paddingBottom:100 }}>

// //           {/* Toolbar */}
// //           <div className="sp-toolbar">
// //             <div className="sp-toolbar-left">
// //               Showing{" "}
// //               <strong style={{ color:C.maroon }}>{filteredSarees.length}</strong>
// //               {" "}of{" "}
// //               <strong>{SAREES.length}</strong> exquisite pieces
// //             </div>
// //             <div className="sp-toolbar-right">
// //               <button className="sp-filter-trigger" onClick={() => setShowFilters(true)}>
// //                 <SlidersHorizontal size={14} />
// //                 Filters
// //                 {activeCount > 0 && <span className="sp-filter-badge">{activeCount}</span>}
// //               </button>
// //               <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
// //             </div>
// //           </div>

// //           {/* Active filter chips */}
// //           {activeChips.length > 0 && (
// //             <div className="sp-chips">
// //               {activeChips.map((c, i) => (
// //                 <button key={i} className="sp-chip-active" onClick={c.onRemove}>
// //                   {c.label} <X size={12} />
// //                 </button>
// //               ))}
// //               <button className="sp-chip-active" onClick={clearAll}
// //                 style={{ borderColor:"rgba(196,152,10,.4)", color:C.warmGrey }}>
// //                 Clear all ×
// //               </button>
// //             </div>
// //           )}

// //           {/* Grid */}
// //           <div className="sp-grid">
// //             {filteredSarees.map((saree, i) => (
// //               <div key={saree.id} className="sp-card"
// //                 style={{ animationDelay:`${Math.min(i * 0.04, 0.6)}s` }}>
// //                 <SareeCard saree={saree} />
// //               </div>
// //             ))}
// //           </div>

// //           {filteredSarees.length === 0 && (
// //             <div className="sp-empty">
// //               <div style={{ color:C.gold, fontSize:32, marginBottom:16 }}>✦</div>
// //               <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.maroon, marginBottom:10 }}>
// //                 No sarees match your filters
// //               </p>
// //               <p style={{ fontFamily:"'Jost'", fontSize:14, color:C.warmGrey, fontWeight:300, marginBottom:28 }}>
// //                 Try adjusting your selection to discover more
// //               </p>
// //               <button className="sp-btn-clear" style={{ width:"auto", padding:"12px 32px" }} onClick={clearAll}>
// //                 Clear all filters
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* ══ PREMIUM FILTER PANEL ══ */}
// //         {showFilters && (
// //           <>
// //             <div className="sp-overlay" onClick={() => setShowFilters(false)} />
// //             <div className="sp-panel" onClick={e => e.stopPropagation()}>

// //               {/* Maroon Header */}
// //               <div className="sp-panel-head">
// //                 <div className="sp-panel-shine" />
// //                 <button className="sp-panel-close" onClick={() => setShowFilters(false)}>
// //                   <X size={15} color="white" />
// //                 </button>
// //                 <div className="sp-panel-eyebrow">
// //                   <Tag size={13} color="rgba(212,175,55,.75)" />
// //                   <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.48)" }}>
// //                     Neyge Couture
// //                   </span>
// //                 </div>
// //                 <div className="sp-panel-title">Refine Your Search</div>
// //                 <div className="sp-panel-subtitle">Discover your perfect saree</div>
// //               </div>

// //               {/* Stats bar */}
// //               <div className="sp-panel-stats">
// //                 {[[String(filteredSarees.length),"Results"],[String(activeCount||"—"),"Active"],[String(SAREES.length),"Total"]].map(([n,l])=>(
// //                   <div key={l} className="sp-panel-stat">
// //                     <div className="sp-panel-stat-n">{n}</div>
// //                     <div className="sp-panel-stat-l">{l}</div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Scrollable body */}
// //               <div className="sp-panel-body">

// //                 <AccordionSection title="Fabric"   items={FABRICS}   selected={selectedFabrics}   toggle={v=>toggle(v,setSelectedFabrics)}   defaultOpen />
// //                 <AccordionSection title="Occasion" items={OCCASIONS} selected={selectedOccasions} toggle={v=>toggle(v,setSelectedOccasions)} defaultOpen />
// //                 <AccordionSection title="Colour"   items={COLORS}    selected={selectedColors}    toggle={v=>toggle(v,setSelectedColors)} />

// //                 {/* Price Range */}
// //                 <div className="sp-acc">
// //                   <div className="sp-acc-head" style={{ cursor:"default" }}>
// //                     <span className="sp-acc-label">Price Range</span>
// //                   </div>
// //                   <div className="sp-price-wrap">
// //                     <div className="sp-price-track-outer">
// //                       <div className="sp-price-fill" style={{ width:`${(priceRange[1]/50000)*100}%` }} />
// //                     </div>
// //                     <input
// //                       type="range" min="0" max="50000" step="1000"
// //                       value={priceRange[1]}
// //                       onChange={e => setPriceRange([0, parseInt(e.target.value)])}
// //                       className="sp-slider"
// //                     />
// //                     <div className="sp-price-row">
// //                       <span className="sp-price-lbl">₹0</span>
// //                       <span className="sp-price-val">₹{priceRange[1].toLocaleString('en-IN')}</span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* bottom padding */}
// //                 <div style={{ height: 16 }} />
// //               </div>

// //               {/* Footer */}
// //               <div className="sp-panel-footer">
// //                 <button className="sp-btn-apply" onClick={() => setShowFilters(false)}>
// //                   Show {filteredSarees.length} Results
// //                 </button>
// //                 {activeCount > 0 && (
// //                   <button className="sp-btn-clear" onClick={clearAll}>Clear All Filters</button>
// //                 )}
// //               </div>
// //             </div>
// //           </>
// //         )}

// //       </div>
// //     </>
// //   );
// // }

// // /* ─── Sort Select ─────────────────────────────────────────────────────────── */
// // function SortSelect({ sortBy, setSortBy }: { sortBy: string; setSortBy: (v:string)=>void }) {
// //   return (
// //     <div className="sp-sort-wrap">
// //       <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sp-sort">
// //         {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
// //       </select>
// //       <ChevronDown size={14} color={C.maroon}
// //         style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
// //     </div>
// //   );
// // }

// // /* ─── Accordion Section ───────────────────────────────────────────────────── */
// // function AccordionSection({
// //   title, items, selected, toggle, defaultOpen = false,
// // }: {
// //   title: string; items: string[];
// //   selected: string[]; toggle: (v: string) => void;
// //   defaultOpen?: boolean;
// // }) {
// //   const [open, setOpen] = useState(defaultOpen);
// //   return (
// //     <div className="sp-acc">
// //       <div className="sp-acc-head" onClick={() => setOpen(p => !p)}>
// //         <span className="sp-acc-label">
// //           {title}
// //           {selected.length > 0 && <span className="sp-acc-cnt">{selected.length}</span>}
// //         </span>
// //         <ChevronRight size={15} className={`sp-acc-chev${open ? " open" : ""}`} />
// //       </div>
// //       <div className={`sp-acc-body${open ? " open" : ""}`}>
// //         <div className="sp-chip-grid">
// //           {items.map(item => (
// //             <button
// //               key={item}
// //               className={`sp-chip${selected.includes(item) ? " on" : ""}`}
// //               onClick={() => toggle(item)}
// //             >
// //               {item}
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// //below code is for the saree card component used in the grid, it is a simple card that displays the saree image, name, price and rating. It also has a "New Arrival" badge for new sarees.

// import { useEffect, useMemo, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { SareeCard } from '@/components/features/SareeCard';
// import { getProducts } from '@/api/products';
// import type { Saree } from '@/types';
// import {
//   ChevronDown,
//   X,
//   Sparkles,
//   SlidersHorizontal,
//   ChevronRight,
//   Tag,
// } from 'lucide-react';

// import shopHeroImg from '@/assets/g17.png';

// const FABRICS = ['Silk', 'Cotton', 'Linen', 'Khadi'];
// const OCCASIONS = ['Wedding', 'Casual', 'Festive', 'Party'];
// const COLORS = ['Red', 'Blue', 'Green', 'Gold', 'Pink', 'Purple', 'White', 'Multicolor'];

// const SORT_OPTIONS = [
//   { value: 'newest', label: 'Newest First' },
//   { value: 'price-asc', label: 'Price: Low to High' },
//   { value: 'price-desc', label: 'Price: High to Low' },
// ];

// const C = {
//   maroon: '#800020',
//   maroonDark: '#5a0016',
//   gold: '#C4980A',
//   goldV: '#D4AF37',
//   cream: '#F5E6D3',
//   creamLight: '#FFF9F0',
//   warmGrey: '#4a3828',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
// html { scroll-behavior: smooth; }

// .sp-root {
//   font-family: 'Jost', sans-serif;
//   background: #FFF9F0;
//   color: #1a1010;
//   min-height: 100vh;
//   overflow-x: hidden;
//   line-height: 1;
// }

// .sp-wrap { max-width: 1320px; margin: 0 auto; padding: 0 56px; }
// @media(max-width: 900px)  { .sp-wrap { padding: 0 20px; } }
// @media(max-width: 480px)  { .sp-wrap { padding: 0 16px; } }

// .sp-ey {
//   font-family: 'Jost', sans-serif; font-size: 11px;
//   letter-spacing: 0.25em; text-transform: uppercase;
//   color: #C4980A; font-weight: 600;
// }

// @keyframes spFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
// @keyframes spFadeIn   { from{opacity:0} to{opacity:1} }
// @keyframes spSlideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
// @keyframes spSlideIn  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
// @keyframes spOrb      { 0%,100%{transform:scale(1);opacity:.14} 50%{transform:scale(1.28);opacity:.26} }
// @keyframes silkMove   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
// @keyframes shimmerBtn { 0%{left:-80%} 100%{left:120%} }
// @keyframes spCardIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

// .sp-fadein  { animation: spFadeIn  0.35s ease both; }
// .sp-card    { animation: spCardIn  0.6s ease  both; }
// .sp-fade    { animation: spFadeUp  0.9s  cubic-bezier(.4,0,.2,1) both; }
// .sp-d0 { animation-delay:0s    }
// .sp-d1 { animation-delay:.12s  }
// .sp-d2 { animation-delay:.24s  }
// .sp-d3 { animation-delay:.36s  }
// .sp-d4 { animation-delay:.50s  }
// .sp-d5 { animation-delay:.65s  }

// .sp-hero {
//   position: relative;
//   height: 100vh; min-height: 600px;
//   display: flex; align-items: center; justify-content: center;
//   overflow: hidden;
// }
// .sp-hero-img {
//   position: absolute; inset: 0; width: 100%; height: 100%;
//   object-fit: cover; object-position: center top;
// }
// .sp-hero-overlay {
//   position: absolute; inset: 0;
//   background: linear-gradient(180deg,
//     rgba(0,0,0,.38) 0%,
//     rgba(60,0,15,.52) 50%,
//     rgba(0,0,0,.72) 100%);
// }
// .sp-hero-silk {
//   position: absolute; inset: 0; overflow: hidden; pointer-events: none;
// }
// .sp-hero-silk-bar {
//   position: absolute; top: 0; bottom: 0; width: 30%;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
//   animation: silkMove 16s linear infinite;
// }
// .sp-hero-content {
//   position: relative; z-index: 2;
//   text-align: center; color: white;
//   padding: 80px 24px 0;
//   max-width: 760px; width: 100%;
// }
// .sp-hero-badge {
//   display: inline-flex; align-items: center; gap: 8px;
//   background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
//   border: 1px solid rgba(212,175,55,.5);
//   padding: 8px 10px; border-radius: 100px; margin-bottom: 22px;
// }
// .sp-hero-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(38px, 7vw, 74px);
//   font-weight: 300; line-height: 1.06; margin-bottom: 16px;
// }
// .sp-hero-sub {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(16px, 2.5vw, 21px);
//   font-style: italic; font-weight: 300;
//   color: rgba(255,255,255,.82); margin-bottom: 14px;
// }
// .sp-hero-divider {
//   width: 56px; height: 1px; background: #D4AF37;
//   margin: 0 auto 20px; opacity: .8;
// }
// .sp-hero-desc {
//   font-family: 'Jost'; font-size: 15px; font-weight: 300;
//   color: rgba(255,255,255,.78); line-height: 1.85;
//   max-width: 520px; margin: 0 auto 28px;
// }
// .sp-hero-pills {
//   display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 20px;
// }
// .sp-hero-pill {
//   padding: 7px 16px;
//   background: rgba(255,255,255,.12); backdrop-filter: blur(6px);
//   border: 1px solid rgba(212,175,55,.45); border-radius: 100px;
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .12em;
//   color: rgba(255,255,255,.9); text-transform: uppercase; font-weight: 500;
// }
// .sp-hero-count {
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .18em;
//   text-transform: uppercase; color: rgba(255,255,255,.42);
// }
// .sp-scroll-ind {
//   position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
//   display: flex; flex-direction: column; align-items: center; gap: 6px;
//   animation: spFadeUp 1s ease 1.4s both;
// }

// .sp-toolbar {
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 20px 0;
//   border-bottom: 1px solid rgba(196,152,10,.18);
//   margin-bottom: 24px;
//   flex-wrap: wrap; gap: 12px;
// }
// .sp-toolbar-left {
//   font-family: 'Jost'; font-size: 14px; color: #4a3828; font-weight: 400;
// }
// .sp-toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

// .sp-filter-trigger {
//   display: flex; align-items: center; gap: 8px;
//   padding: 10px 22px;
//   background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
//   border: 1.5px solid rgba(196,152,10,.35); border-radius: 100px;
//   font-family: 'Jost'; font-size: 13px; font-weight: 600;
//   color: #800020; cursor: pointer;
//   transition: transform .3s, box-shadow .3s;
//   box-shadow: 0 3px 16px rgba(0,0,0,.07);
// }
// .sp-filter-trigger:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1); }
// .sp-filter-badge {
//   width: 18px; height: 18px; border-radius: 50%;
//   background: #800020; color: white;
//   font-size: 10px; font-weight: 700;
//   display: flex; align-items: center; justify-content: center;
// }

// .sp-sort-wrap { position: relative; }
// .sp-sort {
//   appearance: none; -webkit-appearance: none;
//   background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
//   border: 1.5px solid rgba(196,152,10,.35);
//   padding: 10px 40px 10px 18px; border-radius: 100px;
//   font-family: 'Jost'; font-size: 13px; font-weight: 500;
//   color: #800020; cursor: pointer;
//   transition: box-shadow .3s; box-shadow: 0 3px 16px rgba(0,0,0,.07);
// }
// .sp-sort:focus { outline: none; border-color: #C4980A; }
// .sp-sort:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }

// .sp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
// .sp-chip-active {
//   display: inline-flex; align-items: center; gap: 6px;
//   padding: 6px 14px;
//   background: rgba(128,0,32,.08); border: 1px solid rgba(128,0,32,.25);
//   border-radius: 100px;
//   font-family: 'Jost'; font-size: 12px; color: #800020; font-weight: 500;
//   cursor: pointer; transition: background .2s;
// }
// .sp-chip-active:hover { background: rgba(128,0,32,.15); }

// .sp-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
//   gap: 28px;
// }
// @media(max-width: 640px) {
//   .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
// }
// @media(max-width: 360px) {
//   .sp-grid { grid-template-columns: 1fr; }
// }
// @media(max-width: 640px) {
//   .sp-hero-content { padding-top: 130px; }
// }

// .sp-overlay {
//   position: fixed; inset: 0; z-index: 60;
//   background: rgba(8,2,2,.5); backdrop-filter: blur(3px);
//   animation: spFadeIn .3s ease both;
// }

// .sp-panel {
//   position: fixed; top: 0; left: 0; bottom: 0;
//   width: 360px; max-width: 88vw; z-index: 61;
//   display: flex; flex-direction: column;
//   box-shadow: 20px 0 80px rgba(0,0,0,.24);
//   animation: spSlideIn .42s cubic-bezier(.16,1,.3,1) both;
// }

// .sp-panel-head {
//   background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
//   padding: 36px 28px 28px; position: relative; overflow: hidden; flex-shrink: 0;
// }
// .sp-panel-head::after {
//   content: ''; position: absolute; top: -60px; right: -60px;
//   width: 200px; height: 200px; border-radius: 50%;
//   border: 1px solid rgba(212,175,55,.15); pointer-events: none;
// }
// .sp-panel-head::before {
//   content: ''; position: absolute; top: -100px; right: -100px;
//   width: 320px; height: 320px; border-radius: 50%;
//   border: 1px solid rgba(212,175,55,.08); pointer-events: none;
// }
// .sp-panel-shine {
//   position: absolute; inset: 0; overflow: hidden; pointer-events: none;
// }
// .sp-panel-shine::after {
//   content: ''; position: absolute;
//   top: -50%; left: -80%; width: 60%; height: 200%;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
//   animation: shimmerBtn 4s ease infinite;
// }
// .sp-panel-close {
//   position: absolute; top: 18px; right: 18px;
//   width: 32px; height: 32px; border-radius: 50%;
//   background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
//   display: flex; align-items: center; justify-content: center;
//   cursor: pointer; transition: background .2s; z-index: 2;
// }
// .sp-panel-close:hover { background: rgba(255,255,255,.22); }
// .sp-panel-eyebrow {
//   display: flex; align-items: center; gap: 8px; margin-bottom: 10px; position: relative; z-index: 1;
// }
// .sp-panel-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 28px; font-weight: 400; color: white; position: relative; z-index: 1;
//   margin-bottom: 6px;
// }
// .sp-panel-subtitle {
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .18em;
//   text-transform: uppercase; color: rgba(255,255,255,.45); position: relative; z-index: 1;
// }

// .sp-panel-stats {
//   display: flex; background: rgba(255,249,240,.98);
//   border-bottom: 1px solid rgba(196,152,10,.18); flex-shrink: 0;
// }
// .sp-panel-stat {
//   flex: 1; padding: 13px 10px; text-align: center;
//   border-right: 1px solid rgba(196,152,10,.14);
// }
// .sp-panel-stat:last-child { border-right: none; }
// .sp-panel-stat-n {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 21px; font-weight: 500; color: #800020; line-height: 1;
// }
// .sp-panel-stat-l {
//   font-family: 'Jost'; font-size: 10px; letter-spacing: .1em;
//   text-transform: uppercase; color: #9a8070; margin-top: 3px; font-weight: 500;
// }

// .sp-panel-body {
//   flex: 1; overflow-y: auto;
//   background: linear-gradient(180deg, #FFF9F0 0%, #F8EEE2 100%);
//   padding: 0 24px;
// }
// .sp-panel-body::-webkit-scrollbar { width: 4px; }
// .sp-panel-body::-webkit-scrollbar-track { background: #F5E6D3; }
// .sp-panel-body::-webkit-scrollbar-thumb { background: #C4980A; border-radius: 2px; }

// .sp-acc { border-bottom: 1px solid rgba(196,152,10,.2); }
// .sp-acc-head {
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 16px 0; cursor: pointer; user-select: none;
// }
// .sp-acc-head:hover .sp-acc-label { color: #800020; }
// .sp-acc-label {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 17px; font-weight: 500; color: #3a1818; transition: color .2s;
//   display: flex; align-items: center; gap: 8px;
// }
// .sp-acc-cnt {
//   display: inline-flex; align-items: center; justify-content: center;
//   width: 19px; height: 19px; border-radius: 50%;
//   background: #800020; color: white;
//   font-family: 'Jost'; font-size: 10px; font-weight: 700;
// }
// .sp-acc-chev {
//   color: #C4980A; transition: transform .3s cubic-bezier(.4,0,.2,1);
// }
// .sp-acc-chev.open { transform: rotate(90deg); }
// .sp-acc-body {
//   overflow: hidden;
//   max-height: 0; opacity: 0;
//   transition: max-height .38s cubic-bezier(.4,0,.2,1), opacity .3s ease;
// }
// .sp-acc-body.open { max-height: 400px; opacity: 1; }

// .sp-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 18px; }
// .sp-chip {
//   padding: 7px 16px; border-radius: 100px;
//   border: 1.5px solid rgba(196,152,10,.35);
//   font-family: 'Jost'; font-size: 12px; letter-spacing: .05em;
//   color: #4a3828; background: white; cursor: pointer;
//   transition: all .25s cubic-bezier(.4,0,.2,1); font-weight: 400;
// }
// .sp-chip:hover {
//   border-color: #800020; color: #800020;
//   background: rgba(128,0,32,.05); transform: translateY(-1px);
// }
// .sp-chip.on {
//   background: linear-gradient(135deg, #800020 0%, #5a0016 100%);
//   border-color: #800020; color: white;
//   box-shadow: 0 4px 14px rgba(128,0,32,.3); font-weight: 500;
// }

// .sp-price-wrap { padding: 14px 0 22px; }
// .sp-price-track-outer {
//   position: relative; height: 4px;
//   background: rgba(196,152,10,.22); border-radius: 100px; margin: 14px 0 4px;
// }
// .sp-price-fill {
//   position: absolute; left: 0; top: 0; height: 100%;
//   background: linear-gradient(90deg, #C4980A, #D4AF37);
//   border-radius: 100px; pointer-events: none; transition: width .1s;
// }
// .sp-slider {
//   width: 100%; appearance: none; -webkit-appearance: none;
//   height: 4px; background: transparent;
//   border-radius: 100px; cursor: pointer; display: block;
// }
// .sp-slider::-webkit-slider-thumb {
//   appearance: none; -webkit-appearance: none;
//   width: 20px; height: 20px; border-radius: 50%;
//   background: #800020; border: 2.5px solid white;
//   box-shadow: 0 2px 10px rgba(128,0,32,.4); cursor: pointer;
//   transition: transform .2s;
// }
// .sp-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
// .sp-price-row {
//   display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
// }
// .sp-price-lbl { font-family: 'Jost'; font-size: 12px; color: #9a8070; }
// .sp-price-val { font-family: 'Cormorant Garamond',serif; font-size: 19px; font-weight: 600; color: #800020; }

// .sp-panel-footer {
//   padding: 18px 24px 28px;
//   background: rgba(255,249,240,.98);
//   border-top: 1px solid rgba(196,152,10,.18);
//   flex-shrink: 0;
// }
// .sp-btn-apply {
//   width: 100%; padding: 15px; border: none; border-radius: 100px;
//   background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
//   color: #800020;
//   font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
//   font-weight: 600; text-transform: uppercase; cursor: pointer;
//   transition: transform .3s, box-shadow .3s;
//   box-shadow: 0 6px 24px rgba(212,175,55,.38);
//   position: relative; overflow: hidden;
// }
// .sp-btn-apply::after {
//   content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
//   animation: shimmerBtn 3s ease infinite;
// }
// .sp-btn-apply:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }
// .sp-btn-clear {
//   width: 100%; padding: 11px; margin-top: 10px;
//   background: transparent; border: 1.5px solid rgba(196,152,10,.35);
//   color: #4a3828; border-radius: 100px;
//   font-family: 'Jost'; font-size: 12px; letter-spacing: .1em;
//   text-transform: uppercase; cursor: pointer; font-weight: 500;
//   transition: border-color .25s, color .25s;
// }
// .sp-btn-clear:hover { border-color: #800020; color: #800020; }

// .sp-empty { text-align: center; padding: 90px 0; }
// .sp-loading, .sp-error {
//   text-align: center;
//   padding: 70px 0;
//   font-family: 'Jost';
//   color: #4a3828;
//   font-size: 15px;
// }
// .sp-error button {
//   margin-top: 16px;
//   padding: 12px 24px;
//   border-radius: 100px;
//   border: none;
//   background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
//   color: #800020;
//   cursor: pointer;
//   font-weight: 600;
// }

// @media(max-width: 640px) {
//   .sp-panel {
//     top: auto; left: 0; right: 0; bottom: 0;
//     width: 100%; max-width: 100%;
//     border-radius: 24px 24px 0 0;
//     max-height: 92vh;
//     animation: spSlideUp .42s cubic-bezier(.16,1,.3,1) both;
//     box-shadow: 0 -20px 80px rgba(0,0,0,.24);
//   }
//   .sp-panel-head { border-radius: 24px 24px 0 0; padding: 28px 22px 24px; }
//   .sp-panel-title { font-size: 24px; }
//   .sp-hero { height: 100vh; min-height: 480px; }
//   .sp-hero-desc { font-size: 14px; }
//   .sp-toolbar { gap: 10px; }
//   .sp-toolbar-left { font-size: 13px; }
// }

// @media(max-width: 400px) {
//   .sp-hero-pills { gap: 6px; }
//   .sp-hero-pill  { font-size: 10px; padding: 6px 12px; }
//   .sp-hero-title { font-size: 34px; }
// }
// `;

// type BackendProduct = {
//   id: string;
//   name: string;
//   slug?: string;
//   price: number;
//   discount_price?: number | null;
//   thumbnail?: string | null;
//   images?: string[];
//   short_description?: string | null;
//   color?: string | null;
//   fabric?: string | null;
//   stock?: number | null;
//   technique?: string | null;
//   artisan?: {
//     name?: string;
//     region?: string;
//     experience?: string;
//   } | null;
//   occasion?: string[];
//   care_instructions?: string | null;
//   is_featured?: boolean;
//   created_at?: string;
// };

// type ProductsApiResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     items: BackendProduct[];
//     pagination?: {
//       total?: number;
//       page?: number;
//       page_size?: number;
//       total_pages?: number;
//       has_next?: boolean;
//       has_prev?: boolean;
//     };
//     filters?: Record<string, unknown>;
//   };
// };

// function mapProductToSaree(product: BackendProduct): Saree {
//   return {
//     id: product.id,
//     name: product.name,
//     slug: product.slug || '',
//     price: product.discount_price ?? product.price,
//     originalPrice: product.price,
//     image: product.thumbnail || product.images?.[0] || shopHeroImg,
//     images: product.images && product.images.length > 0 ? product.images : [shopHeroImg],
//     description: product.short_description || '',
//     color: product.color || '',
//     fabric: product.fabric || '',
//     occasion: product.occasion || [],
//     weavingTechnique: product.technique || '',
//     artisanDetails: product.artisan?.name
//       ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ''}`
//       : '',
//     careInstructions: product.care_instructions || '',
//     stock: product.stock || 0,
//     rating: 0,
//     reviews: 0,
//     featured: product.is_featured || false,
//     blousePiece: false,
//     length: '',
//   };
// }

// function getSortParams(sortBy: string): {
//   sort_by: 'created_at' | 'price' | 'name';
//   sort_order: 'asc' | 'desc';
// } {
//   if (sortBy === 'price-asc') {
//     return { sort_by: 'price', sort_order: 'asc' };
//   }
//   if (sortBy === 'price-desc') {
//     return { sort_by: 'price', sort_order: 'desc' };
//   }
//   return { sort_by: 'created_at', sort_order: 'desc' };
// }

// export function ShopPage() {
//   const [searchParams] = useSearchParams();
//   const [showFilters, setShowFilters] = useState(false);

//   const [selectedFabrics, setSelectedFabrics] = useState<string[]>(() => {
//     const f = searchParams.get('fabric');
//     return f ? [f] : [];
//   });
//   const [selectedOccasions, setSelectedOccasions] = useState<string[]>(() => {
//     const o = searchParams.get('occasion');
//     return o ? [o] : [];
//   });
//   const [selectedColors, setSelectedColors] = useState<string[]>(() => {
//     const c = searchParams.get('color');
//     return c ? [c] : [];
//   });
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
//   const [sortBy, setSortBy] = useState('newest');

//   const [products, setProducts] = useState<Saree[]>([]);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const toggleSingle = (
//     value: string,
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     setter((prev) => (prev.includes(value) ? [] : [value]));
//   };

//   const clearAll = () => {
//     setSelectedFabrics([]);
//     setSelectedOccasions([]);
//     setSelectedColors([]);
//     setPriceRange([0, 50000]);
//     setSortBy('newest');
//   };

//   const activeCount =
//     selectedFabrics.length +
//     selectedOccasions.length +
//     selectedColors.length +
//     (priceRange[1] < 50000 ? 1 : 0);

//   const activeChips: { label: string; onRemove: () => void }[] = [
//     ...selectedFabrics.map((v) => ({
//       label: v,
//       onRemove: () => setSelectedFabrics([]),
//     })),
//     ...selectedOccasions.map((v) => ({
//       label: v,
//       onRemove: () => setSelectedOccasions([]),
//     })),
//     ...selectedColors.map((v) => ({
//       label: v,
//       onRemove: () => setSelectedColors([]),
//     })),
//     ...(priceRange[1] < 50000
//       ? [
//           {
//             label: `≤ ₹${priceRange[1].toLocaleString('en-IN')}`,
//             onRemove: () => setPriceRange([0, 50000]),
//           },
//         ]
//       : []),
//   ];

//   const queryPayload = useMemo(() => {
//     const sortParams = getSortParams(sortBy);

//     return {
//       page: 1,
//       page_size: 50,
//       fabric: selectedFabrics[0] || undefined,
//       occasion: selectedOccasions[0] || undefined,
//       color: selectedColors[0] || undefined,
//       min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
//       max_price: priceRange[1] < 50000 ? priceRange[1] : undefined,
//       sort_by: sortParams.sort_by,
//       sort_order: sortParams.sort_order,
//     };
//   }, [selectedFabrics, selectedOccasions, selectedColors, priceRange, sortBy]);

//   const loadProducts = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const response = (await getProducts(queryPayload)) as ProductsApiResponse;
//       const items = response?.data?.items || [];
//       const mapped = items.map(mapProductToSaree);

//       setProducts(mapped);
//       setTotalProducts(response?.data?.pagination?.total || mapped.length);
//     } catch (err) {
//       setError('Failed to load products');
//       setProducts([]);
//       setTotalProducts(0);
//       console.error('Failed to fetch products', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, [queryPayload]);

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="sp-root">
//         <section className="sp-hero">
//           <img src={shopHeroImg} alt="Shop" className="sp-hero-img" />
//           <div className="sp-hero-overlay" />
//           <div className="sp-hero-silk">
//             <div className="sp-hero-silk-bar" />
//           </div>

//           <div
//             style={{
//               position: 'absolute',
//               bottom: '12%',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               width: 260,
//               height: 260,
//               borderRadius: '50%',
//               background: 'radial-gradient(circle, rgba(212,175,55,.14) 0%, transparent 70%)',
//               animation: 'spOrb 8s ease-in-out infinite',
//               pointerEvents: 'none',
//             }}
//           />

//           <div className="sp-hero-content">
//             <div className="sp-fade sp-d0">
//               <div className="sp-hero-badge">
//                 <Sparkles size={13} color="#D4AF37" />
//                 <span className="sp-ey" style={{ color: 'rgba(212,175,55,.95)' }}>
//                   Handcrafted Excellence
//                 </span>
//               </div>
//             </div>

//             <h1 className="sp-hero-title sp-fade sp-d1">
//               Discover Timeless
//               <br />
//               <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Elegance</em>
//             </h1>

//             <p className="sp-hero-sub sp-fade sp-d2">
//               A Curated Collection of Handloom Masterpieces
//             </p>

//             <div className="sp-fade sp-d2">
//               <div className="sp-hero-divider" />
//             </div>

//             <p className="sp-hero-desc sp-fade sp-d3">
//               Each saree tells a unique story of heritage, artistry, and skilled craftsmanship.
//               Explore pieces that celebrate India's rich weaving traditions while embracing
//               contemporary sophistication.
//             </p>

//             <div className="sp-hero-pills sp-fade sp-d4">
//               {['✦  Authentic Handloom', '✦  Premium Fabrics', '✦  Exclusive Designs', '✦  Artisan Crafted'].map(
//                 (label) => (
//                   <span key={label} className="sp-hero-pill">
//                     {label}
//                   </span>
//                 )
//               )}
//             </div>

//             <p className="sp-hero-count sp-fade sp-d5">
//               Browse {totalProducts} exquisite pieces — each a testament to timeless beauty
//             </p>
//           </div>

//           <div className="sp-scroll-ind">
//             <span
//               style={{
//                 fontFamily: "'Jost'",
//                 fontSize: 9,
//                 letterSpacing: '.22em',
//                 color: 'rgba(255,255,255,.35)',
//                 textTransform: 'uppercase',
//                 writingMode: 'vertical-rl',
//               }}
//             >
//               Scroll
//             </span>
//             <div
//               style={{
//                 width: 1,
//                 height: 40,
//                 background: 'linear-gradient(to bottom, rgba(212,175,55,.6), transparent)',
//               }}
//             />
//           </div>
//         </section>

//         <div className="sp-wrap" style={{ paddingTop: 40, paddingBottom: 100 }}>
//           <div className="sp-toolbar">
//             <div className="sp-toolbar-left">
//               Showing <strong style={{ color: C.maroon }}>{products.length}</strong> of{' '}
//               <strong>{totalProducts}</strong> exquisite pieces
//             </div>

//             <div className="sp-toolbar-right">
//               <button className="sp-filter-trigger" onClick={() => setShowFilters(true)}>
//                 <SlidersHorizontal size={14} />
//                 Filters
//                 {activeCount > 0 && <span className="sp-filter-badge">{activeCount}</span>}
//               </button>
//               <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
//             </div>
//           </div>

//           {activeChips.length > 0 && (
//             <div className="sp-chips">
//               {activeChips.map((chip, index) => (
//                 <button key={index} className="sp-chip-active" onClick={chip.onRemove}>
//                   {chip.label} <X size={12} />
//                 </button>
//               ))}
//               <button
//                 className="sp-chip-active"
//                 onClick={clearAll}
//                 style={{ borderColor: 'rgba(196,152,10,.4)', color: C.warmGrey }}
//               >
//                 Clear all ×
//               </button>
//             </div>
//           )}

//           {loading ? (
//             <div className="sp-loading">Loading products...</div>
//           ) : error ? (
//             <div className="sp-error">
//               <div>{error}</div>
//               <button onClick={loadProducts}>Retry</button>
//             </div>
//           ) : products.length > 0 ? (
//             <div className="sp-grid">
//               {products.map((saree, index) => (
//                 <div
//                   key={saree.id}
//                   className="sp-card"
//                   style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
//                 >
//                   <SareeCard saree={saree} />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="sp-empty">
//               <div style={{ color: C.gold, fontSize: 32, marginBottom: 16 }}>✦</div>
//               <p
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 26,
//                   color: C.maroon,
//                   marginBottom: 10,
//                 }}
//               >
//                 No sarees match your filters
//               </p>
//               <p
//                 style={{
//                   fontFamily: "'Jost'",
//                   fontSize: 14,
//                   color: C.warmGrey,
//                   fontWeight: 300,
//                   marginBottom: 28,
//                 }}
//               >
//                 Try adjusting your selection to discover more
//               </p>
//               <button
//                 className="sp-btn-clear"
//                 style={{ width: 'auto', padding: '12px 32px' }}
//                 onClick={clearAll}
//               >
//                 Clear all filters
//               </button>
//             </div>
//           )}
//         </div>

//         {showFilters && (
//           <>
//             <div className="sp-overlay" onClick={() => setShowFilters(false)} />
//             <div className="sp-panel" onClick={(e) => e.stopPropagation()}>
//               <div className="sp-panel-head">
//                 <div className="sp-panel-shine" />
//                 <button className="sp-panel-close" onClick={() => setShowFilters(false)}>
//                   <X size={15} color="white" />
//                 </button>

//                 <div className="sp-panel-eyebrow">
//                   <Tag size={13} color="rgba(212,175,55,.75)" />
//                   <span
//                     style={{
//                       fontFamily: "'Jost'",
//                       fontSize: 10,
//                       letterSpacing: '.2em',
//                       textTransform: 'uppercase',
//                       color: 'rgba(255,255,255,.48)',
//                     }}
//                   >
//                     Neyge Couture
//                   </span>
//                 </div>

//                 <div className="sp-panel-title">Refine Your Search</div>
//                 <div className="sp-panel-subtitle">Discover your perfect saree</div>
//               </div>

//               <div className="sp-panel-stats">
//                 {[
//                   [String(products.length), 'Results'],
//                   [String(activeCount || '—'), 'Active'],
//                   [String(totalProducts), 'Total'],
//                 ].map(([n, l]) => (
//                   <div key={l} className="sp-panel-stat">
//                     <div className="sp-panel-stat-n">{n}</div>
//                     <div className="sp-panel-stat-l">{l}</div>
//                   </div>
//                 ))}
//               </div>

//               <div className="sp-panel-body">
//                 <AccordionSection
//                   title="Fabric"
//                   items={FABRICS}
//                   selected={selectedFabrics}
//                   toggle={(v) => toggleSingle(v, setSelectedFabrics)}
//                   defaultOpen
//                 />
//                 <AccordionSection
//                   title="Occasion"
//                   items={OCCASIONS}
//                   selected={selectedOccasions}
//                   toggle={(v) => toggleSingle(v, setSelectedOccasions)}
//                   defaultOpen
//                 />
//                 <AccordionSection
//                   title="Colour"
//                   items={COLORS}
//                   selected={selectedColors}
//                   toggle={(v) => toggleSingle(v, setSelectedColors)}
//                 />

//                 <div className="sp-acc">
//                   <div className="sp-acc-head" style={{ cursor: 'default' }}>
//                     <span className="sp-acc-label">Price Range</span>
//                   </div>

//                   <div className="sp-price-wrap">
//                     <div className="sp-price-track-outer">
//                       <div
//                         className="sp-price-fill"
//                         style={{ width: `${(priceRange[1] / 50000) * 100}%` }}
//                       />
//                     </div>

//                     <input
//                       type="range"
//                       min="0"
//                       max="50000"
//                       step="1000"
//                       value={priceRange[1]}
//                       onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
//                       className="sp-slider"
//                     />

//                     <div className="sp-price-row">
//                       <span className="sp-price-lbl">₹0</span>
//                       <span className="sp-price-val">
//                         ₹{priceRange[1].toLocaleString('en-IN')}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ height: 16 }} />
//               </div>

//               <div className="sp-panel-footer">
//                 <button className="sp-btn-apply" onClick={() => setShowFilters(false)}>
//                   Show {products.length} Results
//                 </button>
//                 {activeCount > 0 && (
//                   <button className="sp-btn-clear" onClick={clearAll}>
//                     Clear All Filters
//                   </button>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// function SortSelect({
//   sortBy,
//   setSortBy,
// }: {
//   sortBy: string;
//   setSortBy: (value: string) => void;
// }) {
//   return (
//     <div className="sp-sort-wrap">
//       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sp-sort">
//         {SORT_OPTIONS.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       <ChevronDown
//         size={14}
//         color={C.maroon}
//         style={{
//           position: 'absolute',
//           right: 14,
//           top: '50%',
//           transform: 'translateY(-50%)',
//           pointerEvents: 'none',
//         }}
//       />
//     </div>
//   );
// }

// function AccordionSection({
//   title,
//   items,
//   selected,
//   toggle,
//   defaultOpen = false,
// }: {
//   title: string;
//   items: string[];
//   selected: string[];
//   toggle: (value: string) => void;
//   defaultOpen?: boolean;
// }) {
//   const [open, setOpen] = useState(defaultOpen);

//   return (
//     <div className="sp-acc">
//       <div className="sp-acc-head" onClick={() => setOpen((prev) => !prev)}>
//         <span className="sp-acc-label">
//           {title}
//           {selected.length > 0 && <span className="sp-acc-cnt">{selected.length}</span>}
//         </span>
//         <ChevronRight size={15} className={`sp-acc-chev${open ? ' open' : ''}`} />
//       </div>

//       <div className={`sp-acc-body${open ? ' open' : ''}`}>
//         <div className="sp-chip-grid">
//           {items.map((item) => (
//             <button
//               key={item}
//               className={`sp-chip${selected.includes(item) ? ' on' : ''}`}
//               onClick={() => toggle(item)}
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SareeCard } from '@/components/features/SareeCard';
import { getProducts } from '@/api/products';
import type { Saree } from '@/types';
import {
  ChevronDown,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Tag,
} from 'lucide-react';

import shopHeroImg from '@/assets/g17.png';

const FABRICS = ['Silk', 'Cotton', 'Linen', 'Khadi'];
const OCCASIONS = ['Wedding', 'Casual', 'Festive', 'Party'];
const COLORS = ['Red', 'Blue', 'Green', 'Gold', 'Pink', 'Purple', 'White', 'Multicolor'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

// ─── Brand palette (matches HomePage, CartPage, etc.) ────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  creamDk: '#EDD8C4',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
  forest: '#14402A',
  blush: '#F2C4CE',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

.sp-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  color: #1a1010;
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1;
}

.sp-wrap { max-width: 1320px; margin: 0 auto; padding: 0 64px; }
@media(max-width: 900px)  { .sp-wrap { padding: 0 24px; } }
@media(max-width: 480px)  { .sp-wrap { padding: 0 12px; } }

/* ── Eyebrow label ── */
.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}

/* ── Gold divider ── */
.gd { width: 44px; height: 1px; background: #C4980A; margin: 0 auto; }

@keyframes spFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes spFadeIn   { from{opacity:0} to{opacity:1} }
@keyframes spSlideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes spSlideIn  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
@keyframes spOrb      { 0%,100%{transform:scale(1);opacity:.14} 50%{transform:scale(1.28);opacity:.26} }
@keyframes silkMove   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
@keyframes shimmerBtn { 0%{left:-80%} 100%{left:120%} }
@keyframes spCardIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

.sp-fadein  { animation: spFadeIn  0.35s ease both; }
.sp-card    { animation: spCardIn  0.6s ease  both; }
.sp-fade    { animation: spFadeUp  0.9s  cubic-bezier(.4,0,.2,1) both; }
.sp-d0 { animation-delay:0s    }
.sp-d1 { animation-delay:.12s  }
.sp-d2 { animation-delay:.24s  }
.sp-d3 { animation-delay:.36s  }
.sp-d4 { animation-delay:.50s  }
.sp-d5 { animation-delay:.65s  }

/* Hero section */
.sp-hero {
  position: relative;
  height: 100vh; min-height: 600px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.sp-hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
}
.sp-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg,
    rgba(0,0,0,.38) 0%,
    rgba(128,0,32,.52) 50%,
    rgba(27,42,107,.72) 100%);
}
.sp-hero-silk {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
}
.sp-hero-silk-bar {
  position: absolute; top: 0; bottom: 0; width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
  animation: silkMove 16s linear infinite;
}
.sp-hero-content {
  position: relative; z-index: 2;
  text-align: center; color: white;
  padding: 80px 24px 0;
  max-width: 760px; width: 100%;
}
.sp-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
  border: 1px solid rgba(212,175,55,.5);
  padding: 8px 10px; border-radius: 100px; margin-bottom: 22px;
}
.sp-hero-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(38px, 7vw, 74px);
  font-weight: 400; line-height: 1.06; margin-bottom: 16px;
  letter-spacing: 0.04em;
}
.sp-hero-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(16px, 2.5vw, 21px);
  font-style: italic; font-weight: 300;
  color: rgba(255,255,255,.82); margin-bottom: 14px;
}
.sp-hero-divider {
  width: 56px; height: 1px; background: #D4AF37;
  margin: 0 auto 20px; opacity: .8;
}
.sp-hero-desc {
  font-family: 'Josefin Sans'; font-size: 15px; font-weight: 300;
  color: rgba(255,255,255,.78); line-height: 1.85;
  max-width: 520px; margin: 0 auto 28px;
}
.sp-hero-pills {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 20px;
}
.sp-hero-pill {
  padding: 7px 16px;
  background: rgba(255,255,255,.12); backdrop-filter: blur(6px);
  border: 1px solid rgba(212,175,55,.45); border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 11px; letter-spacing: .12em;
  color: rgba(255,255,255,.9); text-transform: uppercase; font-weight: 500;
}
.sp-hero-count {
  font-family: 'Josefin Sans'; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(255,255,255,.42);
}
.sp-scroll-ind {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  animation: spFadeUp 1s ease 1.4s both;
}

/* Toolbar */
.sp-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(196,152,10,.18);
  margin-bottom: 16px;
  flex-wrap: wrap; gap: 10px;
}
.sp-toolbar-left {
  font-family: 'Josefin Sans'; font-size: 13px; color: #4a3828; font-weight: 400;
}
.sp-toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.sp-filter-trigger {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
  border: 1.5px solid rgba(196,152,10,.35); border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 600;
  color: #800020; cursor: pointer;
  transition: transform .3s, box-shadow .3s;
  box-shadow: 0 3px 16px rgba(0,0,0,.07);
  white-space: nowrap;
}
.sp-filter-trigger:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1); }
.sp-filter-badge {
  width: 18px; height: 18px; border-radius: 50%;
  background: #800020; color: white;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.sp-sort-wrap { position: relative; }
.sp-sort {
  appearance: none; -webkit-appearance: none;
  background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
  border: 1.5px solid rgba(196,152,10,.35);
  padding: 9px 36px 9px 14px; border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 500;
  color: #800020; cursor: pointer;
  transition: box-shadow .3s; box-shadow: 0 3px 16px rgba(0,0,0,.07);
  max-width: 160px;
}
.sp-sort:focus { outline: none; border-color: #C4980A; }
.sp-sort:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }

/* Active chips */
.sp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.sp-chip-active {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: rgba(128,0,32,.08); border: 1px solid rgba(128,0,32,.25);
  border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 11px; color: #800020; font-weight: 500;
  cursor: pointer; transition: background .2s;
}
.sp-chip-active:hover { background: rgba(128,0,32,.15); }

/* ── Product grid ── */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
@media(max-width: 1100px) { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
@media(max-width: 820px)  { .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
@media(max-width: 480px)  {
  .sp-grid {
    /* Single column on small phones — matches Amazon-style reference */
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* Filter panel overlay */
.sp-overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(8,2,2,.5); backdrop-filter: blur(3px);
  animation: spFadeIn .3s ease both;
}
.sp-panel {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 360px; max-width: 88vw; z-index: 61;
  display: flex; flex-direction: column;
  box-shadow: 20px 0 80px rgba(0,0,0,.24);
  animation: spSlideIn .42s cubic-bezier(.16,1,.3,1) both;
}
.sp-panel-head {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #1B2A6B 100%);
  padding: 36px 28px 28px; position: relative; overflow: hidden; flex-shrink: 0;
}
.sp-panel-head::after {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 200px; height: 200px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.15); pointer-events: none;
}
.sp-panel-shine {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
}
.sp-panel-shine::after {
  content: ''; position: absolute;
  top: -50%; left: -80%; width: 60%; height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
  animation: shimmerBtn 4s ease infinite;
}
.sp-panel-close {
  position: absolute; top: 18px; right: 18px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .2s; z-index: 2;
}
.sp-panel-close:hover { background: rgba(255,255,255,.22); }
.sp-panel-eyebrow {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px; position: relative; z-index: 1;
}
.sp-panel-title {
  font-family: 'Cinzel', serif;
  font-size: 28px; font-weight: 400; color: white; position: relative; z-index: 1;
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}
.sp-panel-subtitle {
  font-family: 'Josefin Sans'; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(255,255,255,.45); position: relative; z-index: 1;
}
.sp-panel-stats {
  display: flex; background: rgba(255,249,240,.98);
  border-bottom: 1px solid rgba(196,152,10,.18); flex-shrink: 0;
}
.sp-panel-stat {
  flex: 1; padding: 13px 10px; text-align: center;
  border-right: 1px solid rgba(196,152,10,.14);
}
.sp-panel-stat:last-child { border-right: none; }
.sp-panel-stat-n {
  font-family: 'Cinzel', serif;
  font-size: 21px; font-weight: 500; color: #800020; line-height: 1;
  letter-spacing: 0.02em;
}
.sp-panel-stat-l {
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; color: #9a8070; margin-top: 3px; font-weight: 500;
}
.sp-panel-body {
  flex: 1; overflow-y: auto;
  background: linear-gradient(180deg, #FFF9F0 0%, #F8EEE2 100%);
  padding: 0 24px;
}
.sp-panel-body::-webkit-scrollbar { width: 4px; }
.sp-panel-body::-webkit-scrollbar-track { background: #F5E6D3; }
.sp-panel-body::-webkit-scrollbar-thumb { background: #C4980A; border-radius: 2px; }

.sp-acc { border-bottom: 1px solid rgba(196,152,10,.2); }
.sp-acc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0; cursor: pointer; user-select: none;
}
.sp-acc-head:hover .sp-acc-label { color: #800020; }
.sp-acc-label {
  font-family: 'Cinzel', serif;
  font-size: 17px; font-weight: 500; color: #3a1818; transition: color .2s;
  display: flex; align-items: center; gap: 8px;
  letter-spacing: 0.02em;
}
.sp-acc-cnt {
  display: inline-flex; align-items: center; justify-content: center;
  width: 19px; height: 19px; border-radius: 50%;
  background: #800020; color: white;
  font-family: 'Josefin Sans'; font-size: 10px; font-weight: 700;
}
.sp-acc-chev {
  color: #C4980A; transition: transform .3s cubic-bezier(.4,0,.2,1);
}
.sp-acc-chev.open { transform: rotate(90deg); }
.sp-acc-body {
  overflow: hidden;
  max-height: 0; opacity: 0;
  transition: max-height .38s cubic-bezier(.4,0,.2,1), opacity .3s ease;
}
.sp-acc-body.open { max-height: 400px; opacity: 1; }

.sp-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 18px; }
.sp-chip {
  padding: 7px 16px; border-radius: 100px;
  border: 1.5px solid rgba(196,152,10,.35);
  font-family: 'Josefin Sans'; font-size: 12px; letter-spacing: .05em;
  color: #4a3828; background: white; cursor: pointer;
  transition: all .25s cubic-bezier(.4,0,.2,1); font-weight: 400;
}
.sp-chip:hover {
  border-color: #800020; color: #800020;
  background: rgba(128,0,32,.05); transform: translateY(-1px);
}
.sp-chip.on {
  background: linear-gradient(135deg, #800020 0%, #5a0016 100%);
  border-color: #800020; color: white;
  box-shadow: 0 4px 14px rgba(128,0,32,.3); font-weight: 500;
}

.sp-price-wrap { padding: 14px 0 22px; }
.sp-price-track-outer {
  position: relative; height: 4px;
  background: rgba(196,152,10,.22); border-radius: 100px; margin: 14px 0 4px;
}
.sp-price-fill {
  position: absolute; left: 0; top: 0; height: 100%;
  background: linear-gradient(90deg, #C4980A, #D4AF37);
  border-radius: 100px; pointer-events: none; transition: width .1s;
}
.sp-slider {
  width: 100%; appearance: none; -webkit-appearance: none;
  height: 4px; background: transparent;
  border-radius: 100px; cursor: pointer; display: block;
}
.sp-slider::-webkit-slider-thumb {
  appearance: none; -webkit-appearance: none;
  width: 20px; height: 20px; border-radius: 50%;
  background: #800020; border: 2.5px solid white;
  box-shadow: 0 2px 10px rgba(128,0,32,.4); cursor: pointer;
  transition: transform .2s;
}
.sp-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
.sp-price-row {
  display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
}
.sp-price-lbl { font-family: 'Josefin Sans'; font-size: 12px; color: #9a8070; }
.sp-price-val { font-family: 'Cinzel', serif; font-size: 19px; font-weight: 600; color: #800020; }

.sp-panel-footer {
  padding: 18px 24px 28px;
  background: rgba(255,249,240,.98);
  border-top: 1px solid rgba(196,152,10,.18);
  flex-shrink: 0;
}
.sp-btn-apply {
  width: 100%; padding: 15px; border: none; border-radius: 100px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Josefin Sans'; font-size: 13px; letter-spacing: .12em;
  font-weight: 600; text-transform: uppercase; cursor: pointer;
  transition: transform .3s, box-shadow .3s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  position: relative; overflow: hidden;
}
.sp-btn-apply::after {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: shimmerBtn 3s ease infinite;
}
.sp-btn-apply:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }
.sp-btn-clear {
  width: 100%; padding: 11px; margin-top: 10px;
  background: transparent; border: 1.5px solid rgba(196,152,10,.35);
  color: #4a3828; border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; cursor: pointer; font-weight: 500;
  transition: border-color .25s, color .25s;
}
.sp-btn-clear:hover { border-color: #800020; color: #800020; }

.sp-empty { text-align: center; padding: 90px 0; }
.sp-loading, .sp-error {
  text-align: center;
  padding: 70px 0;
  font-family: 'Josefin Sans';
  color: #4a3828;
  font-size: 15px;
}
.sp-error button {
  margin-top: 16px;
  padding: 12px 24px;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  cursor: pointer;
  font-weight: 600;
}

/* ── Mobile overrides ── */
@media(max-width: 640px) {
  .sp-panel {
    top: auto; left: 0; right: 0; bottom: 0;
    width: 100%; max-width: 100%;
    border-radius: 24px 24px 0 0;
    max-height: 92vh;
    animation: spSlideUp .42s cubic-bezier(.16,1,.3,1) both;
    box-shadow: 0 -20px 80px rgba(0,0,0,.24);
  }
  .sp-panel-head { border-radius: 24px 24px 0 0; padding: 28px 22px 24px; }
  .sp-panel-title { font-size: 24px; }
  .sp-hero { height: 100vh; min-height: 480px; }
  .sp-hero-desc { font-size: 14px; }

  /* Toolbar: stack label above controls on very small screens */
  .sp-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 0;
  }
  .sp-toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
  .sp-filter-trigger { flex: 1; justify-content: center; }
  .sp-sort-wrap { flex: 1; }
  .sp-sort { max-width: 100%; width: 100%; }
}

@media(max-width: 400px) {
  .sp-hero-pills { gap: 6px; }
  .sp-hero-pill  { font-size: 10px; padding: 6px 12px; }
  .sp-hero-title { font-size: 34px; }
}
`;

type BackendProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  discount_price?: number | null;
  thumbnail?: string | null;
  images?: string[];
  short_description?: string | null;
  color?: string | null;
  fabric?: string | null;
  stock?: number | null;
  technique?: string | null;
  artisan?: {
    name?: string;
    region?: string;
    experience?: string;
  } | null;
  occasion?: string[];
  care_instructions?: string | null;
  is_featured?: boolean;
  created_at?: string;
};

type ProductsApiResponse = {
  success: boolean;
  message: string;
  data: {
    items: BackendProduct[];
    pagination?: {
      total?: number;
      page?: number;
      page_size?: number;
      total_pages?: number;
      has_next?: boolean;
      has_prev?: boolean;
    };
    filters?: Record<string, unknown>;
  };
};

function mapProductToSaree(product: BackendProduct): Saree {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug || '',
    price: product.discount_price != null && product.discount_price > 0
      ? Math.max(0, product.price - product.discount_price)
      : product.price,
    originalPrice: product.price,
    image: product.thumbnail || product.images?.[0] || shopHeroImg,
    images: product.images && product.images.length > 0 ? product.images : [shopHeroImg],
    description: product.short_description || '',
    color: product.color || '',
    fabric: product.fabric || '',
    occasion: product.occasion || [],
    weavingTechnique: product.technique || '',
    artisanDetails: product.artisan?.name
      ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ''}`
      : '',
    careInstructions: product.care_instructions || '',
    stock: product.stock || 0,
    rating: 0,
    reviews: 0,
    featured: product.is_featured || false,
    blousePiece: false,
    length: '',
  };
}

function sortProducts(items: Saree[], sortBy: string): Saree[] {
  const sorted = [...items];
  if (sortBy === 'price-asc') { sorted.sort((a, b) => a.price - b.price); return sorted; }
  if (sortBy === 'price-desc') { sorted.sort((a, b) => b.price - a.price); return sorted; }
  return sorted;
}

function toggleMulti(
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>
) {
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
}

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // ── Scroll to top on mount ──────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Multi-select state ──────────────────────────────────────────────────────
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(() => {
    const f = searchParams.get('fabric');
    return f ? [f] : [];
  });
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(() => {
    const o = searchParams.get('occasion');
    return o ? [o] : [];
  });
  const [selectedColors, setSelectedColors] = useState<string[]>(() => {
    const c = searchParams.get('color');
    return c ? [c] : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('newest');

  const [allProducts, setAllProducts] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const clearAll = () => {
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedColors([]);
    setPriceRange([0, 50000]);
    setSortBy('newest');
  };

  const activeCount =
    selectedFabrics.length +
    selectedOccasions.length +
    selectedColors.length +
    (priceRange[1] < 50000 ? 1 : 0);

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...selectedFabrics.map((v) => ({
      label: v,
      onRemove: () => setSelectedFabrics((prev) => prev.filter((f) => f !== v)),
    })),
    ...selectedOccasions.map((v) => ({
      label: v,
      onRemove: () => setSelectedOccasions((prev) => prev.filter((o) => o !== v)),
    })),
    ...selectedColors.map((v) => ({
      label: v,
      onRemove: () => setSelectedColors((prev) => prev.filter((c) => c !== v)),
    })),
    ...(priceRange[1] < 50000
      ? [{ label: `≤ ₹${priceRange[1].toLocaleString('en-IN')}`, onRemove: () => setPriceRange([0, 50000]) }]
      : []),
  ];

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = (await getProducts({
        page: 1,
        page_size: 50,
        sort_by: 'created_at',
        sort_order: 'desc',
      })) as ProductsApiResponse;

      const items = response?.data?.items || [];
      setAllProducts(items.map(mapProductToSaree));
    } catch (err) {
      setError('Failed to load products');
      setAllProducts([]);
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedFabrics.length > 0) {
      result = result.filter((item) =>
        selectedFabrics.some((fabric) => item.fabric?.toLowerCase() === fabric.toLowerCase())
      );
    }
    if (selectedOccasions.length > 0) {
      result = result.filter((item) =>
        item.occasion?.some((occasion) =>
          selectedOccasions.some((selected) => selected.toLowerCase() === occasion.toLowerCase())
        )
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter((item) =>
        selectedColors.some((color) => item.color?.toLowerCase() === color.toLowerCase())
      );
    }
    result = result.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);

    return sortProducts(result, sortBy);
  }, [allProducts, selectedFabrics, selectedOccasions, selectedColors, priceRange, sortBy]);

  const totalProducts = allProducts.length;

  return (
    <>
      <style>{CSS}</style>
      <div className="sp-root">
        {/* ── Hero ── */}
        <section className="sp-hero">
          <img src={shopHeroImg} alt="Shop" className="sp-hero-img" />
          <div className="sp-hero-overlay" />
          <div className="sp-hero-silk">
            <div className="sp-hero-silk-bar" />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,.14) 0%, transparent 70%)',
              animation: 'spOrb 8s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />

          <div className="sp-hero-content">
            <div className="sp-fade sp-d0">
              <div className="sp-hero-badge">
                <Sparkles size={13} color="#D4AF37" />
                <span className="ey" style={{ color: 'rgba(212,175,55,.95)' }}>
                  Handcrafted Excellence
                </span>
              </div>
            </div>

            <h1 className="sp-hero-title sp-fade sp-d1">
              Discover Timeless
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Elegance</em>
            </h1>

            <p className="sp-hero-sub sp-fade sp-d2">
              A Curated Collection of Handloom Masterpieces
            </p>

            <div className="sp-fade sp-d2">
              <div className="sp-hero-divider" />
            </div>

            <p className="sp-hero-desc sp-fade sp-d3">
              Each saree tells a unique story of heritage, artistry, and skilled craftsmanship.
              Explore pieces that celebrate India's rich weaving traditions while embracing
              contemporary sophistication.
            </p>

            <div className="sp-hero-pills sp-fade sp-d4">
              {['✦  Authentic Handloom', '✦  Premium Fabrics', '✦  Exclusive Designs', '✦  Artisan Crafted'].map(
                (label) => (
                  <span key={label} className="sp-hero-pill">{label}</span>
                )
              )}
            </div>

            <p className="sp-hero-count sp-fade sp-d5">
              Browse {totalProducts} exquisite pieces — each a testament to timeless beauty
            </p>
          </div>

          <div className="sp-scroll-ind">
            <span
              style={{
                fontFamily: "'Josefin Sans'",
                fontSize: 9,
                letterSpacing: '.22em',
                color: 'rgba(255,255,255,.35)',
                textTransform: 'uppercase',
                writingMode: 'vertical-rl',
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: 1,
                height: 40,
                background: 'linear-gradient(to bottom, rgba(212,175,55,.6), transparent)',
              }}
            />
          </div>
        </section>

        {/* ── Product listing ── */}
        <div className="sp-wrap" style={{ paddingTop: 40, paddingBottom: 100 }}>
          <div className="sp-toolbar">
            <div className="sp-toolbar-left">
              Showing <strong style={{ color: C.maroon }}>{filteredProducts.length}</strong> of{' '}
              <strong>{totalProducts}</strong> exquisite pieces
            </div>

            <div className="sp-toolbar-right">
              <button className="sp-filter-trigger" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={14} />
                Filters
                {activeCount > 0 && <span className="sp-filter-badge">{activeCount}</span>}
              </button>
              <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="sp-chips">
              {activeChips.map((chip, index) => (
                <button key={index} className="sp-chip-active" onClick={chip.onRemove}>
                  {chip.label} <X size={12} />
                </button>
              ))}
              <button
                className="sp-chip-active"
                onClick={clearAll}
                style={{ borderColor: 'rgba(196,152,10,.4)', color: C.warmGrey }}
              >
                Clear all ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="sp-loading">Loading products...</div>
          ) : error ? (
            <div className="sp-error">
              <div>{error}</div>
              <button onClick={loadProducts}>Retry</button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="sp-grid">
              {filteredProducts.map((saree, index) => (
                <div
                  key={saree.id}
                  className="sp-card"
                  style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
                >
                  <SareeCard saree={saree} />
                </div>
              ))}
            </div>
          ) : (
            <div className="sp-empty">
              <div style={{ color: C.gold, fontSize: 32, marginBottom: 16 }}>✦</div>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 26,
                  color: C.maroon,
                  marginBottom: 10,
                  letterSpacing: '0.04em',
                }}
              >
                No sarees match your filters
              </p>
              <p
                style={{
                  fontFamily: "'Josefin Sans'",
                  fontSize: 14,
                  color: C.warmGrey,
                  fontWeight: 300,
                  marginBottom: 28,
                }}
              >
                Try adjusting your selection to discover more
              </p>
              <button
                className="sp-btn-clear"
                style={{ width: 'auto', padding: '12px 32px' }}
                onClick={clearAll}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <>
            <div className="sp-overlay" onClick={() => setShowFilters(false)} />
            <div className="sp-panel" onClick={(e) => e.stopPropagation()}>
              <div className="sp-panel-head">
                <div className="sp-panel-shine" />
                <button className="sp-panel-close" onClick={() => setShowFilters(false)}>
                  <X size={15} color="white" />
                </button>

                <div className="sp-panel-eyebrow">
                  <Tag size={13} color="rgba(212,175,55,.75)" />
                  <span
                    style={{
                      fontFamily: "'Josefin Sans'",
                      fontSize: 10,
                      letterSpacing: '.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,.48)',
                    }}
                  >
                    Neyge Couture
                  </span>
                </div>

                <div className="sp-panel-title">Refine Your Search</div>
                <div className="sp-panel-subtitle">Discover your perfect saree</div>
              </div>

              <div className="sp-panel-stats">
                {[
                  [String(filteredProducts.length), 'Results'],
                  [String(activeCount || '—'), 'Active'],
                  [String(totalProducts), 'Total'],
                ].map(([n, l]) => (
                  <div key={l} className="sp-panel-stat">
                    <div className="sp-panel-stat-n">{n}</div>
                    <div className="sp-panel-stat-l">{l}</div>
                  </div>
                ))}
              </div>

              <div className="sp-panel-body">
                <AccordionSection
                  title="Fabric"
                  items={FABRICS}
                  selected={selectedFabrics}
                  toggle={(v) => toggleMulti(v, setSelectedFabrics)}
                  defaultOpen
                />
                <AccordionSection
                  title="Occasion"
                  items={OCCASIONS}
                  selected={selectedOccasions}
                  toggle={(v) => toggleMulti(v, setSelectedOccasions)}
                  defaultOpen
                />
                <AccordionSection
                  title="Colour"
                  items={COLORS}
                  selected={selectedColors}
                  toggle={(v) => toggleMulti(v, setSelectedColors)}
                />

                <div className="sp-acc">
                  <div className="sp-acc-head" style={{ cursor: 'default' }}>
                    <span className="sp-acc-label">Price Range</span>
                  </div>
                  <div className="sp-price-wrap">
                    <div className="sp-price-track-outer">
                      <div
                        className="sp-price-fill"
                        style={{ width: `${(priceRange[1] / 50000) * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
                      className="sp-slider"
                    />
                    <div className="sp-price-row">
                      <span className="sp-price-lbl">₹0</span>
                      <span className="sp-price-val">
                        ₹{priceRange[1].toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ height: 16 }} />
              </div>

              <div className="sp-panel-footer">
                <button className="sp-btn-apply" onClick={() => setShowFilters(false)}>
                  Show {filteredProducts.length} Results
                </button>
                {activeCount > 0 && (
                  <button className="sp-btn-clear" onClick={clearAll}>
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SortSelect({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: (value: string) => void;
}) {
  return (
    <div className="sp-sort-wrap">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sp-sort">
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        color={C.maroon}
        style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function AccordionSection({
  title,
  items,
  selected,
  toggle,
  defaultOpen = false,
}: {
  title: string;
  items: string[];
  selected: string[];
  toggle: (value: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="sp-acc">
      <div className="sp-acc-head" onClick={() => setOpen((prev) => !prev)}>
        <span className="sp-acc-label">
          {title}
          {selected.length > 0 && <span className="sp-acc-cnt">{selected.length}</span>}
        </span>
        <ChevronRight size={15} className={`sp-acc-chev${open ? ' open' : ''}`} />
      </div>

      <div className={`sp-acc-body${open ? ' open' : ''}`}>
        <div className="sp-chip-grid">
          {items.map((item) => (
            <button
              key={item}
              className={`sp-chip${selected.includes(item) ? ' on' : ''}`}
              onClick={() => toggle(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}