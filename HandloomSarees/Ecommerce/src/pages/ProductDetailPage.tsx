// import { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   Heart, ShoppingCart, Star, Truck, Shield,
//   RefreshCw, Award, ChevronLeft, ChevronRight,
//   Check, Sparkles
// } from 'lucide-react';
// import { SAREES } from '@/constants/sarees';
// import { formatCurrency } from '@/lib/utils';
// import { useCart } from '@/hooks/useCarts';
// import { useWishlist } from '@/hooks/useWishlist';
// import { toast } from 'sonner';
// import { SareeCard } from '@/components/features/SareeCard';

// // ─── Brand palette ────────────────────────────────────────────────────────────
// const C = {
//   maroon:   '#800020',
//   maroonDk: '#5a0016',
//   gold:     '#C4980A',
//   goldV:    '#D4AF37',
//   cream:    '#F5E6D3',
//   creamLt:  '#FFF9F0',
//   warmGrey: '#4a3828',
//   indigo:   '#4B0082',
// };

// // ─── CSS ──────────────────────────────────────────────────────────────────────
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// .pd-root {
//   font-family: 'Jost', sans-serif;
//   background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
//   min-height: 100vh;
//   color: #1a1010;
//   line-height: 1;
// }

// /* ── Wrap ── */
// .pd-wrap {
//   max-width: 1280px;
//   margin: 0 auto;
//   padding: 0 56px;
// }
// @media(max-width: 900px) { .pd-wrap { padding: 0 24px; } }
// @media(max-width: 480px) { .pd-wrap { padding: 0 16px; } }

// /* ── Eyebrow ── */
// .pd-ey {
//   font-family: 'Jost'; font-size: 11px;
//   letter-spacing: .25em; text-transform: uppercase;
//   color: #C4980A; font-weight: 600;
// }

// /* ── Gold divider ── */
// .pd-gd { width: 48px; height: 1px; background: #C4980A; display: block; }

// /* ─────────────────────────────
//    ANIMATIONS
// ───────────────────────────── */
// @keyframes pdFadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
// @keyframes pdFadeIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
// @keyframes pdShimmer  { 0%{left:-80%} 100%{left:120%} }
// @keyframes pdPulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.8;transform:scale(1.04)} }
// @keyframes pdDot      { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 18px 3px rgba(212,175,55,.3)} }

// .pd-fadein  { animation: pdFadeIn  .85s cubic-bezier(.4,0,.2,1) both; }
// .pd-fadeup  { animation: pdFadeUp  .85s cubic-bezier(.4,0,.2,1) both; }
// .pd-d1 { animation-delay:.1s  }
// .pd-d2 { animation-delay:.2s  }
// .pd-d3 { animation-delay:.3s  }

// /* ─────────────────────────────
//    PAGE TOP PADDING (clears navbar)
// ───────────────────────────── */
// .pd-page-top { padding-top: 140px; padding-bottom: 80px; }
// @media(max-width: 640px) { .pd-page-top { padding-top: 110px; padding-bottom: 60px; } }

// /* ─────────────────────────────
//    BREADCRUMB
// ───────────────────────────── */
// .pd-breadcrumb {
//   display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
//   margin-bottom: 40px;
//   font-family: 'Jost'; font-size: 12px; letter-spacing: .06em;
//   color: #9a8070;
// }
// .pd-breadcrumb a { color: #9a8070; text-decoration: none; transition: color .2s; }
// .pd-breadcrumb a:hover { color: #800020; }
// .pd-breadcrumb-sep { color: #C4980A; margin: 0 6px; }
// .pd-breadcrumb-current { color: #800020; font-weight: 500; }

// /* ─────────────────────────────
//    MAIN GRID
// ───────────────────────────── */
// .pd-main-grid {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 64px;
//   align-items: start;
//   margin-bottom: 80px;
// }
// @media(max-width: 960px) {
//   .pd-main-grid { grid-template-columns: 1fr; gap: 40px; }
// }

// /* ─────────────────────────────
//    IMAGE SECTION
// ───────────────────────────── */
// .pd-img-main {
//   position: relative;
//   border-radius: 24px; overflow: hidden;
//   background: rgba(255,249,240,.8);
//   border: 1px solid rgba(196,152,10,.25);
//   box-shadow: 0 24px 80px rgba(0,0,0,.12);
//   margin-bottom: 16px;
// }
// .pd-img-main-inner {
//   width: 100%; padding-bottom: 125%; position: relative;
// }
// .pd-img-main img {
//   position: absolute; inset: 0; width: 100%; height: 100%;
//   object-fit: cover; transition: transform .7s cubic-bezier(.4,0,.2,1);
// }
// .pd-img-main:hover img { transform: scale(1.04); }
// .pd-img-overlay {
//   position: absolute; inset: 0;
//   background: linear-gradient(to top, rgba(0,0,0,.18) 0%, transparent 45%);
//   opacity: 0; transition: opacity .4s; pointer-events: none;
// }
// .pd-img-main:hover .pd-img-overlay { opacity: 1; }

// /* Nav arrows */
// .pd-img-arrow {
//   position: absolute; top: 50%; transform: translateY(-50%);
//   width: 40px; height: 40px; border-radius: 50%;
//   background: rgba(255,249,240,.95); backdrop-filter: blur(8px);
//   border: 1px solid rgba(196,152,10,.35);
//   display: flex; align-items: center; justify-content: center;
//   cursor: pointer; opacity: 0; transition: opacity .3s, transform .3s;
//   box-shadow: 0 4px 18px rgba(0,0,0,.12);
//   z-index: 2;
// }
// .pd-img-main:hover .pd-img-arrow { opacity: 1; }
// .pd-img-arrow:hover { transform: translateY(-50%) scale(1.1); }
// .pd-img-arrow.left  { left: 14px; }
// .pd-img-arrow.right { right: 14px; }

// /* Counter */
// .pd-img-counter {
//   position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
//   background: rgba(0,0,0,.55); backdrop-filter: blur(6px);
//   color: rgba(255,255,255,.9); border-radius: 100px;
//   padding: 5px 14px;
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .1em;
//   z-index: 2;
// }

// /* Thumbnails */
// .pd-thumbs {
//   display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
// }
// .pd-thumb {
//   aspect-ratio: 1; border-radius: 14px; overflow: hidden;
//   border: 2px solid transparent; cursor: pointer;
//   transition: border-color .25s, transform .25s, box-shadow .25s;
// }
// .pd-thumb:hover { transform: scale(1.04); }
// .pd-thumb.active {
//   border-color: #C4980A;
//   box-shadow: 0 4px 16px rgba(196,152,10,.3);
// }
// .pd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

// /* ─────────────────────────────
//    DETAILS SECTION
// ───────────────────────────── */
// .pd-details { display: flex; flex-direction: column; gap: 22px; }

// /* Badge row */
// .pd-badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
// .pd-badge {
//   display: inline-flex; align-items: center; gap: 5px;
//   padding: 6px 14px; border-radius: 100px;
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .1em;
//   font-weight: 600; text-transform: uppercase;
// }
// .pd-badge-new  { background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.35); color: #059669; animation: pdPulse 3s ease infinite; }
// .pd-badge-best { background: linear-gradient(135deg, #800020, #4B0082); color: white; box-shadow: 0 4px 14px rgba(128,0,32,.25); }

// /* Title */
// .pd-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(30px, 4.5vw, 48px);
//   font-weight: 400; line-height: 1.08; color: #800020;
// }

// /* Stars */
// .pd-stars { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
// .pd-star-row { display: flex; align-items: center; gap: 3px; }
// .pd-rating-text {
//   font-family: 'Jost'; font-size: 13px; color: #9a8070; font-weight: 400;
// }

// /* Price box */
// .pd-price-box {
//   background: rgba(255,249,240,.9); backdrop-filter: blur(8px);
//   border: 1px solid rgba(196,152,10,.3); border-radius: 18px;
//   padding: 20px 24px;
//   display: flex; align-items: baseline; flex-wrap: wrap; gap: 12px;
// }
// .pd-price-main {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(32px, 5vw, 48px);
//   font-weight: 600; color: #800020; line-height: 1;
// }
// .pd-price-orig {
//   font-family: 'Jost'; font-size: 16px; color: #9a8070;
//   text-decoration: line-through; font-weight: 300;
// }
// .pd-price-off {
//   padding: 5px 12px; border-radius: 100px;
//   background: #800020; color: white;
//   font-family: 'Jost'; font-size: 11px; font-weight: 700; letter-spacing: .08em;
// }

// /* Description */
// .pd-desc {
//   font-family: 'Jost'; font-size: 14px; font-weight: 300;
//   color: #4a3828; line-height: 1.88;
// }

// /* Quick info grid */
// .pd-info-grid {
//   display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
//   background: rgba(255,249,240,.8); backdrop-filter: blur(8px);
//   border: 1px solid rgba(196,152,10,.2);
//   border-radius: 18px; padding: 18px;
// }
// .pd-info-cell { padding: 4px 0; }
// .pd-info-key {
//   font-family: 'Jost'; font-size: 10px; letter-spacing: .15em;
//   text-transform: uppercase; color: #9a8070; font-weight: 500; margin-bottom: 5px;
// }
// .pd-info-val {
//   font-family: 'Jost'; font-size: 13px; font-weight: 600; color: #800020;
// }
// .pd-stock-dot {
//   display: inline-block; width: 7px; height: 7px;
//   border-radius: 50%; margin-right: 6px; vertical-align: middle;
//   animation: pdDot 2.5s ease infinite;
// }

// /* CTA row */
// .pd-cta-row { display: flex; gap: 12px; }
// .pd-btn-cart {
//   flex: 1; padding: 16px 24px;
//   background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
//   color: #800020; border: none; border-radius: 100px;
//   font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
//   font-weight: 600; text-transform: uppercase; cursor: pointer;
//   display: flex; align-items: center; justify-content: center; gap: 8px;
//   transition: transform .35s, box-shadow .35s;
//   box-shadow: 0 6px 24px rgba(212,175,55,.38);
//   position: relative; overflow: hidden;
// }
// .pd-btn-cart::after {
//   content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
//   animation: pdShimmer 3s ease infinite;
// }
// .pd-btn-cart:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }
// .pd-btn-cart:disabled { opacity: .5; cursor: not-allowed; transform: none; }

// .pd-btn-wish {
//   width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
//   border: 1.5px solid rgba(196,152,10,.4); background: white;
//   display: flex; align-items: center; justify-content: center;
//   cursor: pointer; transition: all .3s; box-shadow: 0 4px 16px rgba(0,0,0,.07);
// }
// .pd-btn-wish:hover { transform: scale(1.08); border-color: #800020; }
// .pd-btn-wish.active { background: rgba(128,0,32,.06); border-color: #800020; }

// /* Trust badges */
// .pd-trust {
//   display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
//   padding: 24px 0; border-top: 1px solid rgba(196,152,10,.2);
//   border-bottom: 1px solid rgba(196,152,10,.2);
// }
// @media(max-width: 480px) { .pd-trust { grid-template-columns: repeat(2, 1fr); } }
// .pd-trust-item { text-align: center; }
// .pd-trust-icon {
//   width: 44px; height: 44px; border-radius: 50%;
//   display: flex; align-items: center; justify-content: center;
//   margin: 0 auto 8px;
//   border: 1px solid rgba(196,152,10,.3);
//   transition: transform .3s;
// }
// .pd-trust-icon:hover { transform: scale(1.1); }
// .pd-trust-lbl {
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .06em;
//   color: #4a3828; font-weight: 500;
// }

// /* ─────────────────────────────
//    DETAILS PANEL
// ───────────────────────────── */
// .pd-details-panel {
//   background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
//   border: 1px solid rgba(196,152,10,.22);
//   border-radius: 28px; padding: 48px 52px;
//   box-shadow: 0 16px 60px rgba(0,0,0,.07);
//   margin-bottom: 80px;
// }
// @media(max-width: 700px) { .pd-details-panel { padding: 30px 22px; } }
// @media(max-width: 480px) { .pd-details-panel { padding: 24px 16px; border-radius: 20px; } }

// .pd-panel-head {
//   display: flex; align-items: center; gap: 12px;
//   padding-bottom: 22px; margin-bottom: 36px;
//   border-bottom: 1px solid rgba(196,152,10,.22);
// }
// .pd-panel-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(22px, 3.5vw, 30px); font-weight: 400; color: #800020;
// }

// .pd-inner-grid {
//   display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
// }
// @media(max-width: 700px) { .pd-inner-grid { grid-template-columns: 1fr; gap: 28px; } }

// .pd-sub-title {
//   display: flex; align-items: center; gap: 10px;
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 20px; font-weight: 500; color: #800020;
//   margin-bottom: 18px;
// }
// .pd-sub-title-bar {
//   width: 3px; height: 22px;
//   background: linear-gradient(to bottom, #800020, #C4980A);
//   border-radius: 2px; flex-shrink: 0;
// }

// /* Spec rows */
// .pd-spec-row {
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;
//   background: rgba(255,249,240,.9);
//   border-left: 3px solid rgba(196,152,10,.45);
//   transition: box-shadow .25s;
// }
// .pd-spec-row:hover { box-shadow: 0 4px 18px rgba(0,0,0,.06); }
// .pd-spec-key { font-family: 'Jost'; font-size: 13px; color: #9a8070; font-weight: 400; }
// .pd-spec-val { font-family: 'Jost'; font-size: 13px; color: #800020; font-weight: 600; }

// /* Care row */
// .pd-care-row {
//   display: flex; align-items: flex-start; gap: 10px;
//   padding: 8px 10px; border-radius: 10px; margin-bottom: 6px;
//   transition: background .2s;
// }
// .pd-care-row:hover { background: rgba(196,152,10,.05); }
// .pd-care-check {
//   width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
//   background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.3);
//   display: flex; align-items: center; justify-content: center; margin-top: 1px;
// }
// .pd-care-text { font-family: 'Jost'; font-size: 13px; color: #4a3828; font-weight: 300; line-height: 1.6; }

// /* Artisan story */
// .pd-artisan {
//   grid-column: 1 / -1; margin-top: 8px;
// }
// .pd-artisan-box {
//   background: rgba(196,152,10,.06); border: 1px solid rgba(196,152,10,.25);
//   border-radius: 18px; padding: 26px 28px;
// }
// @media(max-width: 480px) { .pd-artisan-box { padding: 18px 16px; } }
// .pd-artisan-text {
//   font-family: 'Jost'; font-size: 14px; font-weight: 300;
//   color: #4a3828; line-height: 1.88;
// }

// /* ─────────────────────────────
//    RELATED
// ───────────────────────────── */
// .pd-related-head { text-align: center; margin-bottom: 48px; }
// .pd-related-badge {
//   display: inline-flex; align-items: center; gap: 8px;
//   background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
//   padding: 7px 18px; border-radius: 100px; margin-bottom: 16px;
// }
// .pd-related-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: #800020;
// }
// .pd-related-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//   gap: 24px;
// }
// @media(max-width: 560px) { .pd-related-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }

// /* ─────────────────────────────
//    NOT FOUND
// ───────────────────────────── */
// .pd-notfound {
//   min-height: 100vh; display: flex;
//   align-items: center; justify-content: center;
//   background: linear-gradient(170deg, #FFF9F0 0%, #F5E6D3 100%);
//   text-align: center; padding: 24px;
// }
// `;

// // ─── TRUST ITEMS ──────────────────────────────────────────────────────────────
// const TRUST = [
//   { Icon: Truck,     label: 'Free Shipping',    bg: 'rgba(251,146,60,.12)',  border: 'rgba(251,146,60,.3)',  color: '#ea6d10' },
//   { Icon: Shield,    label: '100% Authentic',   bg: 'rgba(59,130,246,.10)',  border: 'rgba(59,130,246,.3)',  color: '#2563eb' },
//   { Icon: RefreshCw, label: '7-Day Returns',    bg: 'rgba(16,185,129,.10)',  border: 'rgba(16,185,129,.3)',  color: '#059669' },
//   { Icon: Award,     label: 'Quality Certified',bg: 'rgba(196,152,10,.12)',  border: 'rgba(196,152,10,.35)', color: '#C4980A' },
// ];

// // ─── COMPONENT ────────────────────────────────────────────────────────────────
// export function ProductDetailPage() {
//   const { id } = useParams();
//   const saree = SAREES.find(s => s.id === id);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const { addToCart }                     = useCart();
//   const { isInWishlist, toggleWishlist }  = useWishlist();

//   if (!saree) {
//     return (
//       <>
//         <style>{CSS}</style>
//         <div className="pd-notfound">
//           <div>
//             <div style={{ color: C.gold, fontSize: 36, marginBottom: 18 }}>✦</div>
//             <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.maroon, marginBottom: 14 }}>
//               Product not found
//             </h2>
//             <Link to="/shop" style={{ fontFamily: "'Jost'", fontSize: 13, color: C.gold, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none' }}>
//               Return to Shop →
//             </Link>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const inWishlist    = isInWishlist(saree.id);
//   const relatedSarees = SAREES.filter(
//     s => s.id !== saree.id && (s.fabric === saree.fabric || s.occasion === saree.occasion)
//   ).slice(0, 4);

//   const handleAddToCart = () => { addToCart(saree); toast.success('Added to cart!'); };
//   const handleToggleWishlist = () => {
//     toggleWishlist(saree);
//     toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
//   };
//   const nextImage = () => setSelectedImage(p => (p + 1) % saree.images.length);
//   const prevImage = () => setSelectedImage(p => (p - 1 + saree.images.length) % saree.images.length);

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="pd-root">
//         <div className="pd-wrap pd-page-top">

//           {/* ── Breadcrumb ── */}
//           <nav className="pd-breadcrumb pd-fadein">
//             <Link to="/">Home</Link>
//             <span className="pd-breadcrumb-sep">/</span>
//             <Link to="/shop">Shop</Link>
//             <span className="pd-breadcrumb-sep">/</span>
//             <span className="pd-breadcrumb-current">{saree.name}</span>
//           </nav>

//           {/* ── Main grid ── */}
//           <div className="pd-main-grid">

//             {/* Images */}
//             <div className="pd-fadein">
//               <div className="pd-img-main">
//                 <div className="pd-img-main-inner">
//                   <img src={saree.images[selectedImage]} alt={saree.name} />
//                 </div>
//                 <div className="pd-img-overlay" />

//                 {saree.images.length > 1 && (
//                   <>
//                     <button className="pd-img-arrow left" onClick={prevImage} aria-label="Previous">
//                       <ChevronLeft size={18} color={C.maroon} />
//                     </button>
//                     <button className="pd-img-arrow right" onClick={nextImage} aria-label="Next">
//                       <ChevronRight size={18} color={C.maroon} />
//                     </button>
//                     <div className="pd-img-counter">
//                       {selectedImage + 1} / {saree.images.length}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {saree.images.length > 1 && (
//                 <div className="pd-thumbs">
//                   {saree.images.map((img, i) => (
//                     <button
//                       key={i}
//                       className={`pd-thumb ${selectedImage === i ? 'active' : ''}`}
//                       onClick={() => setSelectedImage(i)}
//                     >
//                       <img src={img} alt={`${saree.name} ${i + 1}`} />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Details */}
//             <div className="pd-details pd-fadeup pd-d1">

//               {/* Badges */}
//               <div className="pd-badge-row">
//                 {saree.newArrival && (
//                   <span className="pd-badge pd-badge-new">
//                     <Sparkles size={11} /> New Arrival
//                   </span>
//                 )}
//                 {saree.bestSeller && (
//                   <span className="pd-badge pd-badge-best">
//                     <Award size={11} /> Best Seller
//                   </span>
//                 )}
//               </div>

//               {/* Title */}
//               <h1 className="pd-title">{saree.name}</h1>

//               {/* Stars */}
//               <div className="pd-stars">
//                 <div className="pd-star-row">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} size={15}
//                       fill={i < Math.floor(saree.rating) ? C.goldV : 'none'}
//                       color={i < Math.floor(saree.rating) ? C.goldV : '#d1c5b5'}
//                     />
//                   ))}
//                 </div>
//                 <span className="pd-rating-text">
//                   {saree.rating} · {saree.reviews} reviews
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="pd-price-box">
//                 <span className="pd-price-main">{formatCurrency(saree.price)}</span>
//                 {saree.originalPrice && (
//                   <>
//                     <span className="pd-price-orig">{formatCurrency(saree.originalPrice)}</span>
//                     <span className="pd-price-off">
//                       {Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Description */}
//               <p className="pd-desc">{saree.description}</p>

//               {/* Quick info */}
//               <div className="pd-info-grid">
//                 {[
//                   ['Fabric',       saree.fabric],
//                   ['Occasion',     saree.occasion],
//                   ['Colour',       saree.color],
//                   ['Availability', saree.stock > 0 ? `In Stock (${saree.stock})` : 'Out of Stock'],
//                 ].map(([k, v]) => (
//                   <div key={k} className="pd-info-cell">
//                     <div className="pd-info-key">{k}</div>
//                     <div className="pd-info-val" style={{ color: k === 'Availability' ? (saree.stock > 0 ? '#059669' : '#dc2626') : C.maroon }}>
//                       {k === 'Availability' && (
//                         <span className="pd-stock-dot" style={{ background: saree.stock > 0 ? '#10b981' : '#ef4444' }} />
//                       )}
//                       {v}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* CTA */}
//               <div className="pd-cta-row">
//                 <button className="pd-btn-cart" onClick={handleAddToCart} disabled={saree.stock === 0}>
//                   <ShoppingCart size={16} /> Add to Cart
//                 </button>
//                 <button
//                   className={`pd-btn-wish ${inWishlist ? 'active' : ''}`}
//                   onClick={handleToggleWishlist}
//                 >
//                   <Heart
//                     size={20}
//                     color={inWishlist ? C.maroon : C.gold}
//                     fill={inWishlist ? C.maroon : 'none'}
//                   />
//                 </button>
//               </div>

//               {/* Trust badges */}
//               <div className="pd-trust">
//                 {TRUST.map(({ Icon, label, bg, border, color }) => (
//                   <div key={label} className="pd-trust-item">
//                     <div className="pd-trust-icon" style={{ background: bg, borderColor: border }}>
//                       <Icon size={18} color={color} />
//                     </div>
//                     <span className="pd-trust-lbl">{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ── Product Details Panel ── */}
//           <div className="pd-details-panel pd-fadeup pd-d2">
//             <div className="pd-panel-head">
//               <Sparkles size={18} color={C.gold} />
//               <h2 className="pd-panel-title">Product Details</h2>
//             </div>

//             <div className="pd-inner-grid">

//               {/* Specs */}
//               <div>
//                 <div className="pd-sub-title">
//                   <div className="pd-sub-title-bar" />
//                   Specifications
//                 </div>
//                 {[
//                   ['Length',            saree.length],
//                   ['Blouse Piece',      saree.blousePiece ? 'Included' : 'Not Included'],
//                   ['Weaving Technique', saree.weavingTechnique],
//                 ].map(([k, v]) => (
//                   <div key={k} className="pd-spec-row">
//                     <span className="pd-spec-key">{k}</span>
//                     <span className="pd-spec-val">{v}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Care */}
//               <div>
//                 <div className="pd-sub-title">
//                   <div className="pd-sub-title-bar" />
//                   Care Instructions
//                 </div>
//                 {saree.careInstructions.split('.').filter(Boolean).map((item, i) => (
//                   <div key={i} className="pd-care-row">
//                     <div className="pd-care-check">
//                       <Check size={11} color="#059669" />
//                     </div>
//                     <span className="pd-care-text">{item.trim()}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Artisan story — full width */}
//               <div className="pd-artisan">
//                 <div className="pd-sub-title">
//                   <div className="pd-sub-title-bar" />
//                   Artisan Story
//                 </div>
//                 <div className="pd-artisan-box">
//                   <p className="pd-artisan-text">{saree.artisanDetails}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Related ── */}
//           {relatedSarees.length > 0 && (
//             <div className="pd-fadeup pd-d3">
//               <div className="pd-related-head">
//                 <div className="pd-related-badge">
//                   <Sparkles size={13} color={C.gold} />
//                   <span className="pd-ey">Similar Styles</span>
//                 </div>
//                 <h2 className="pd-related-title">You May Also Like</h2>
//               </div>
//               <div className="pd-related-grid">
//                 {relatedSarees.map((s, i) => (
//                   <div key={s.id} style={{ animation: `pdFadeUp .6s ease ${i * 0.08}s both` }}>
//                     <SareeCard saree={s} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }





//below is the code for the product detail page of the saree ecommerce website. It includes the main product image, details, price, description, and related products. The code also handles adding to cart and wishlist functionality, as well as displaying trust badges and care instructions.
// 
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  RotateCcw,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { getProducts, getProductBySlug } from '@/api/products';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/utils';
import type { Saree } from '@/types';

const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  warmGrey: '#4a3828',
};

const TRUST = [
  {
    Icon: ShieldCheck,
    label: 'Authentic Handloom',
    bg: 'rgba(196,152,10,.10)',
    border: 'rgba(196,152,10,.25)',
    color: C.gold,
  },
  {
    Icon: Truck,
    label: 'Pan India Delivery',
    bg: 'rgba(128,0,32,.08)',
    border: 'rgba(128,0,32,.18)',
    color: C.maroon,
  },
  {
    Icon: RotateCcw,
    label: 'Easy Support',
    bg: 'rgba(74,56,40,.06)',
    border: 'rgba(74,56,40,.14)',
    color: C.warmGrey,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MODIFIED CSS: image gallery width reduced, aspect ratio adjusted, layout refined
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&display=swap');
.pd-root{min-height:100vh;background:linear-gradient(180deg,#f7f0e8 0%, #fdf9f4 100%);padding-top:140px}
.pd-wrap{max-width:1320px;margin:0 auto;padding:0 24px 48px}
.pd-page-top{padding-top:18px}
.pd-loading,.pd-notfound{min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Josefin Sans',sans-serif}
.pd-fadein{animation:pdFade .35s ease}
.pd-fadeup{animation:pdFadeUp .4s ease}
.pd-d2{animation-delay:.05s}
@keyframes pdFade{from{opacity:0}to{opacity:1}}
@keyframes pdFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.pd-breadcrumb{display:flex;align-items:center;gap:10px;margin-bottom:24px;font-family:'Josefin Sans',sans-serif;font-size:13px;color:#7a6a5d}
.pd-breadcrumb a{color:#7a6a5d;text-decoration:none}
.pd-breadcrumb-current{color:${C.maroon};font-weight:600}
.pd-breadcrumb-sep{opacity:.55}
.pd-main-grid{display:grid;grid-template-columns:0.7fr 1.3fr;gap:32px}
@media(max-width:980px){.pd-main-grid{grid-template-columns:1fr;gap:24px}.pd-root{padding-top:110px}}
.pd-gallery-card,.pd-summary-card,.pd-details-panel,.pd-related-panel{background:rgba(255,255,255,.58);border:1px solid rgba(128,0,32,.08);border-radius:28px;box-shadow:0 12px 36px rgba(90,0,22,.06);backdrop-filter:blur(8px)}
.pd-gallery-card{padding:20px}
.pd-main-image-wrap{position:relative;border-radius:22px;overflow:hidden;background:#f5eee7;max-width:320px;margin:0 auto;height:auto;max-height:420px}
.pd-main-image{width:100%;height:auto;object-fit:cover;display:block}
.pd-nav-btn{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border:none;border-radius:999px;background:rgba(255,255,255,.88);color:${C.maroon};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.08)}
.pd-nav-btn.left{left:14px}
.pd-nav-btn.right{right:14px}
.pd-thumbs{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:10px;margin-top:16px;max-width:320px;margin-left:auto;margin-right:auto}
.pd-thumb{border:2px solid transparent;border-radius:14px;overflow:hidden;background:#fff;cursor:pointer;padding:0;aspect-ratio:1/1}
.pd-thumb.active{border-color:${C.gold}}
.pd-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.pd-summary-card{padding:28px}
.pd-title{font-family:'Cinzel',serif;color:${C.maroon};font-size:34px;line-height:1.15;margin:0 0 12px}
.pd-stars{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.pd-star-row{display:flex;align-items:center;gap:4px}
.pd-rating-text{font-family:'Josefin Sans',sans-serif;color:#7a6a5d;font-size:14px}
.pd-price-box{display:flex;align-items:flex-start;flex-direction:column;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.pd-price-row-main{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.pd-price-main{font-family:'Cinzel',serif;font-size:30px;color:${C.maroon};font-weight:700;line-height:1}
.pd-price-orig{color:#9a8a7e;text-decoration:line-through;font-family:'Josefin Sans',sans-serif;font-size:18px}
.pd-price-off-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;background:rgba(5,150,105,.12);border:1px solid rgba(5,150,105,.25);font-family:'Josefin Sans',sans-serif;font-size:12px;letter-spacing:.06em;color:#059669;font-weight:700}
.pd-price-save-note{font-family:'Josefin Sans',sans-serif;font-size:13px;color:#059669;font-weight:500;letter-spacing:.02em}
.pd-desc{font-family:'Josefin Sans',sans-serif;font-size:16px;line-height:1.7;color:${C.warmGrey};margin-bottom:22px}
.pd-info-grid{display:grid;grid-template-columns:repeat(2, minmax(0,1fr));gap:12px;margin-bottom:22px}
@media(max-width:560px){.pd-info-grid{grid-template-columns:1fr}}
.pd-info-cell{padding:14px 16px;border-radius:18px;background:rgba(255,249,240,.85);border:1px solid rgba(128,0,32,.06)}
.pd-info-key{font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8a7b6d;margin-bottom:7px}
.pd-info-val{display:flex;align-items:center;gap:8px;font-family:'Josefin Sans',sans-serif;font-size:15px;color:${C.maroon};font-weight:600}
.pd-stock-dot{width:8px;height:8px;border-radius:999px;display:inline-block}
.pd-cta-row{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.pd-btn-cart{flex:1;min-height:52px;border:none;border-radius:16px;background:linear-gradient(135deg, ${C.maroon}, ${C.maroonDk});color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'Josefin Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer}
.pd-btn-cart:disabled{opacity:.55;cursor:not-allowed}
.pd-btn-wish{width:52px;height:52px;border-radius:16px;border:1px solid rgba(196,152,10,.35);background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
.pd-btn-wish.active{background:rgba(128,0,32,.06);border-color:rgba(128,0,32,.22)}

.pd-enquiry-box{margin-bottom:22px;padding:16px;border-radius:18px;background:rgba(196,152,10,.06);border:1px dashed rgba(196,152,10,.3)}
.pd-enquiry-title{font-family:'Josefin Sans',sans-serif;font-size:14px;font-weight:700;color:${C.maroon};margin-bottom:12px;display:flex;align-items:center;gap:8px}
.pd-enquiry-row{display:flex;gap:12px}
.pd-btn-call,.pd-btn-wa{flex:1;min-height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Josefin Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:transform 0.2s}
.pd-btn-call:hover,.pd-btn-wa:hover{transform:scale(1.02)}
.pd-btn-call{background:#fff;border:1px solid ${C.maroon};color:${C.maroon}}
.pd-btn-wa{background:#25D366;border:none;color:#fff}

.pd-trust{display:grid;grid-template-columns:repeat(3, minmax(0,1fr));gap:12px}
@media(max-width:560px){.pd-trust{grid-template-columns:1fr}}
.pd-trust-item{display:flex;align-items:center;gap:10px;padding:12px;border-radius:16px;background:rgba(255,249,240,.9)}
.pd-trust-icon{width:40px;height:40px;border-radius:12px;border:1px solid;display:flex;align-items:center;justify-content:center}
.pd-trust-lbl{font-family:'Josefin Sans',sans-serif;font-size:14px;color:${C.warmGrey};font-weight:600}
.pd-details-panel,.pd-related-panel{margin-top:28px;padding:24px}
.pd-panel-head{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.pd-panel-title{margin:0;font-family:'Cinzel',serif;color:${C.maroon};font-size:24px}
.pd-inner-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
@media(max-width:900px){.pd-inner-grid{grid-template-columns:1fr}}
.pd-sub-title{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-family:'Josefin Sans',sans-serif;font-size:14px;font-weight:700;color:${C.maroon};letter-spacing:.06em;text-transform:uppercase}
.pd-sub-title-bar{width:4px;height:18px;border-radius:999px;background:${C.gold}}
.pd-spec-row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px dashed rgba(128,0,32,.10);font-family:'Josefin Sans',sans-serif}
.pd-spec-key{color:#7a6a5d}
.pd-spec-val{color:${C.maroon};font-weight:600;text-align:right}
.pd-care-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.pd-care-item{display:flex;align-items:flex-start;gap:10px;font-family:'Josefin Sans',sans-serif;color:${C.warmGrey};line-height:1.6}
.pd-care-dot{width:8px;height:8px;margin-top:9px;border-radius:999px;background:${C.gold};flex-shrink:0}
.pd-related-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
@media(max-width:1100px){.pd-related-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){.pd-related-grid{grid-template-columns:1fr}}
.pd-related-card{display:block;text-decoration:none;border-radius:20px;overflow:hidden;background:#fff;border:1px solid rgba(128,0,32,.08)}
.pd-related-card img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.pd-related-body{padding:14px}
.pd-related-name{font-family:'Cinzel',serif;color:${C.maroon};font-size:16px;line-height:1.35;margin-bottom:8px}
.pd-related-price{font-family:'Josefin Sans',sans-serif;color:${C.warmGrey};font-weight:700}
@media (max-width: 640px) {
  .pd-main-image-wrap { max-width: 260px; max-height: 340px; }
  .pd-thumbs { max-width: 260px; }
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
};

type ProductApiResponse = {
  success: boolean;
  message: string;
  data: BackendProduct;
};

type ProductsApiResponse = {
  success: boolean;
  message: string;
  data: {
    items: BackendProduct[];
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// FIXED mapProductToSaree
// ─────────────────────────────────────────────────────────────────────────────
function mapProductToSaree(product: BackendProduct): Saree {
  const imageSet = new Set<string>();

  if (product.thumbnail) imageSet.add(product.thumbnail);
  if (Array.isArray(product.images)) {
    product.images.filter(Boolean).forEach((img) => imageSet.add(img));
  }

  const allImages = Array.from(imageSet);
  const primaryImage = product.thumbnail || allImages[0] || '';

  const mrp = product.price;
  const sellingPrice =
    product.discount_price != null && product.discount_price > 0
      ? Math.max(0, mrp - product.discount_price)
      : mrp;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug || '',
    price: sellingPrice,
    originalPrice: mrp,
    image: primaryImage,
    images: allImages,
    description: product.short_description || '',
    color: product.color || '',
    fabric: product.fabric || '',
    occasion: product.occasion || [],
    weavingTechnique: product.technique || '',
    artisanDetails: product.artisan?.name
      ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ''}${product.artisan.experience ? ` · ${product.artisan.experience}` : ''}`
      : '',
    careInstructions: product.care_instructions || 'Handle with care.',
    stock: Math.max(0, product.stock || 0),
    rating: 4.8,
    reviews: 24,
    featured: product.is_featured || false,
    blousePiece: false,
    length: '5.5 meters',
    newArrival: false,
    bestSeller: false,
  };
}

function buildRelatedProducts(current: Saree, items: BackendProduct[]): Saree[] {
  return items
    .map(mapProductToSaree)
    .filter((item) => item.id !== current.id)
    .filter(
      (item) =>
        item.fabric === current.fabric ||
        item.color === current.color ||
        item.occasion?.[0] === current.occasion?.[0]
    )
    .slice(0, 4);
}

function getProductUrl(product: Pick<Saree, 'id' | 'slug'>) {
  return `/product/${product.slug?.trim() ? product.slug : product.id}`;
}

async function getProductBySlugOrId(identifier: string): Promise<BackendProduct | null> {
  try {
    const response = (await getProductBySlug(identifier)) as ProductApiResponse;
    if (response?.data) return response.data;
 
 
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }
  }

  try {
    const response = (await getProducts({
      page: 1,
      page_size: 100,
    })) as ProductsApiResponse;

    const items = response?.data?.items || [];
    const found = items.find(
      (item) => item.slug === identifier || item.id === identifier
    );

    if (found) return found;
  } catch (error) {
    console.error('Failed during product fallback lookup', error);
  }

  return null;
}

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [saree, setSaree] = useState<Saree | null>(null);
  const [relatedSarees, setRelatedSarees] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // ✅ 1. Scroll to top on page load (dedicated effect)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      // (We already have a dedicated scroll-to-top effect, so we remove the one inside)

      if (!slug) {
        if (active) {
          setSaree(null);
          setRelatedSarees([]);
          setSelectedImage(0);
          setLoading(false);
          setAdding(false);
        }
        return;
      }

      try {
        if (active) {
          setLoading(true);
          setAdding(false);
        }

        const productData = await getProductBySlugOrId(slug);

        if (!productData) {
          if (active) {
            setSaree(null);
            setRelatedSarees([]);
            setSelectedImage(0);
          }
          return;
        }

        const mapped = mapProductToSaree(productData);

        if (!active) return;

        setSaree(mapped);
        setSelectedImage(0);
        setAdding(false);

        try {
          const relatedResponse = (await getProducts({
            page: 1,
            page_size: 12,
            fabric: mapped.fabric || undefined,
          })) as ProductsApiResponse;

          const related = buildRelatedProducts(mapped, relatedResponse?.data?.items || []);
          if (active) setRelatedSarees(related);
        } catch (relatedError) {
          console.error('Failed to load related products', relatedError);
          if (active) setRelatedSarees([]);
        }
      } catch (error) {
        console.error('Failed to load product details', error);
        if (active) {
          setSaree(null);
          setRelatedSarees([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  const inWishlist = useMemo(() => {
    return saree ? isInWishlist(saree.id) : false;
  }, [saree, isInWishlist]);

  const safeImages = useMemo(() => {
    if (!saree) return [];
    return saree.images && saree.images.length > 0
      ? saree.images.filter(Boolean)
      : [saree.image].filter(Boolean);
  }, [saree]);

  const activeImage = safeImages[selectedImage] || safeImages[0] || saree?.image || '';

  const careItems = useMemo(() => {
    if (!saree) return [];
    return (saree.careInstructions || 'Handle with care.')
      .split('.')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [saree]);

  const occasionText = useMemo(() => {
    if (!saree) return '—';
    return Array.isArray(saree.occasion) ? saree.occasion.join(', ') : saree.occasion;
  }, [saree]);

  const hasDiscount =
    saree !== null &&
    saree.originalPrice != null &&
    saree.originalPrice > saree.price;

  const discountPct = hasDiscount && saree
    ? Math.round(((saree.originalPrice! - saree.price) / saree.originalPrice!) * 100)
    : 0;

  const savedAmount = hasDiscount && saree
    ? saree.originalPrice! - saree.price
    : 0;

  const enquiryMessage = saree ? `Hi, I want to enquire about blouse stitching for:
*Product*: ${saree.name}
*ID/SKU*: ${saree.id}
*Colour*: ${saree.color || 'N/A'}
*URL*: ${window.location.origin}/product/${saree.slug || saree.id}` : '';

  const whatsappUrl = `https://wa.me/919113991711?text=${encodeURIComponent(enquiryMessage)}`;

  const handleAddToCart = async () => {
    if (!saree || adding) return;

    try {
 
      setAdding(true);
 
      await addToCart(saree, 1);
 
      toast.success('Added to cart!');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!saree) return;

    try {
      await toggleWishlist(saree);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const nextImage = () => {
    if (safeImages.length <= 1) return;
    setSelectedImage((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    if (safeImages.length <= 1) return;
    setSelectedImage((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pd-loading">Loading product details...</div>
      </>
    );
  }

  if (!saree) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pd-notfound">
          <div>
            <div style={{ color: C.gold, fontSize: 36, marginBottom: 18 }}>✦</div>
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 28,
                color: C.maroon,
                marginBottom: 14,
                letterSpacing: '0.04em',
              }}
            >
              Product not found
            </h2>
            <Link
              to="/shop"
              style={{
                fontFamily: "'Josefin Sans'",
                fontSize: 13,
                color: C.gold,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Return to Shop →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <div className="pd-root">
        <div className="pd-wrap pd-page-top">
          <nav className="pd-breadcrumb pd-fadein">
            <Link to="/">Home</Link>
            <span className="pd-breadcrumb-sep">/</span>
            <Link to="/shop">Shop</Link>
            <span className="pd-breadcrumb-sep">/</span>
            <span className="pd-breadcrumb-current">{saree.name}</span>
          </nav>

          <div className="pd-main-grid">
            <div className="pd-gallery-card pd-fadeup">
              <div className="pd-main-image-wrap">
                <img
                  src={activeImage}
                  alt={saree.name}
                  className="pd-main-image"
                />

                {safeImages.length > 1 && (
                  <>
                    <button
                      className="pd-nav-btn left"
                      onClick={prevImage}
                      type="button"
                      aria-label="Previous image"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      className="pd-nav-btn right"
                      onClick={nextImage}
                      type="button"
                      aria-label="Next image"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {safeImages.length > 1 && (
                <div className="pd-thumbs">
                  {safeImages.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      className={`pd-thumb ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt={`${saree.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-summary-card pd-fadeup pd-d2">
              <h1 className="pd-title">{saree.name}</h1>

              <div className="pd-stars">
                <div className="pd-star-row">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(saree.rating ?? 0) ? C.goldV : 'none'}
                      color={i < Math.floor(saree.rating ?? 0) ? C.goldV : '#d1c5b5'}
                    />
                  ))}
                </div>
                <span className="pd-rating-text">
                  {saree.rating ?? 0} · {saree.reviews ?? 0} reviews
                </span>
              </div>

              <div className="pd-price-box">
                <div className="pd-price-row-main">
                  <span className="pd-price-main">{formatCurrency(saree.price)}</span>

                  {hasDiscount && (
                    <>
                      <span className="pd-price-orig">
                        {formatCurrency(saree.originalPrice!)}
                      </span>
                      <span className="pd-price-off-badge">
                        {discountPct}% OFF
                      </span>
                    </>
                  )}
                </div>

                {hasDiscount && savedAmount > 0 && (
                  <span className="pd-price-save-note">
                    You save {formatCurrency(savedAmount)}
                  </span>
                )}
              </div>

              <p className="pd-desc">
                {saree.description || 'A handcrafted saree with timeless elegance.'}
              </p>

              <div className="pd-info-grid">
                {[
                  ['Fabric', saree.fabric || '—'],
                  ['Occasion', occasionText || '—'],
                  ['Colour', saree.color || '—'],
                  ['Availability', saree.stock > 0 ? `In Stock (${saree.stock})` : 'Out of Stock'],
                ].map(([k, v]) => (
                  <div key={k} className="pd-info-cell">
                    <div className="pd-info-key">{k}</div>
                    <div
                      className="pd-info-val"
                      style={{
                        color:
                          k === 'Availability'
                            ? saree.stock > 0
                              ? '#059669'
                              : '#dc2626'
                            : C.maroon,
                      }}
                    >
                      {k === 'Availability' && (
                        <span
                          className="pd-stock-dot"
                          style={{ background: saree.stock > 0 ? '#10b981' : '#ef4444' }}
                        />
                      )}
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pd-cta-row">
                <button
                  className="pd-btn-cart"
                  onClick={handleAddToCart}
                  disabled={saree.stock === 0 || adding}
                  type="button"
                >
                  <ShoppingCart size={16} />
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  className={`pd-btn-wish ${inWishlist ? 'active' : ''}`}
                  onClick={handleToggleWishlist}
                  type="button"
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={20}
                    color={inWishlist ? C.maroon : C.gold}
                    fill={inWishlist ? C.maroon : 'none'}
                  />
                </button>
              </div>

              <div className="pd-enquiry-box">
                <div className="pd-enquiry-title">
                  <Sparkles size={16} color={C.gold} />
                  Want Blouse Stitching?
                </div>
                <div className="pd-enquiry-row">
                  <a href="tel:+919113991711" className="pd-btn-call">
                    <Phone size={16} /> Call Us
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-btn-wa"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="pd-trust">
                {TRUST.map(({ Icon, label, bg, border, color }) => (
                  <div key={label} className="pd-trust-item">
                    <div className="pd-trust-icon" style={{ background: bg, borderColor: border }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span className="pd-trust-lbl">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pd-details-panel pd-fadeup pd-d2">
            <div className="pd-panel-head">
              <Sparkles size={18} color={C.gold} />
              <h2 className="pd-panel-title">Product Details</h2>
            </div>

            <div className="pd-inner-grid">
              <div>
                <div className="pd-sub-title">
                  <div className="pd-sub-title-bar" />
                  Specifications
                </div>

                {[
                  ['Length', saree.length || '5.5 meters'],
                  ['Blouse Piece', saree.blousePiece ? 'Included' : 'Not Included'],
                  ['Weaving Technique', saree.weavingTechnique || 'Traditional handloom'],
                ].map(([k, v]) => (
                  <div key={k} className="pd-spec-row">
                    <span className="pd-spec-key">{k}</span>
                    <span className="pd-spec-val">{v}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="pd-sub-title">
                  <div className="pd-sub-title-bar" />
                  Care Instructions
                </div>

                <ul className="pd-care-list">
                  {careItems.map((item, index) => (
                    <li key={`${item}-${index}`} className="pd-care-item">
                      <span className="pd-care-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {relatedSarees.length > 0 && (
            <div className="pd-related-panel pd-fadeup">
              <div className="pd-panel-head">
                <Sparkles size={18} color={C.gold} />
                <h2 className="pd-panel-title">You May Also Like</h2>
              </div>

              <div className="pd-related-grid">
                {relatedSarees.map((item) => (
                  <Link key={item.id} to={getProductUrl(item)} className="pd-related-card">
                    <img src={item.image} alt={item.name} />
                    <div className="pd-related-body">
                      <div className="pd-related-name">{item.name}</div>
                      <div className="pd-related-price">{formatCurrency(item.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;