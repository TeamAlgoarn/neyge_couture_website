// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '@/hooks/useCarts';
// import { authService } from '@/lib/auth';
// import { formatCurrency } from '@/lib/utils';
// import { toast } from 'sonner';
// import { CreditCard, Smartphone, Wallet, Sparkles, MapPin, Shield } from 'lucide-react';

// const C = {
//   maroon: '#800020', maroonDk: '#5a0016',
//   gold: '#C4980A', goldV: '#D4AF37',
//   cream: '#F5E6D3', creamLt: '#FFF9F0',
//   warmGrey: '#4a3828', indigo: '#4B0082',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

// .co-root {
//   font-family: 'Jost', sans-serif;
//   background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
//   min-height: 100vh; color: #1a1010; line-height: 1;
// }
// .co-wrap {
//   max-width: 1200px; margin: 0 auto; padding: 0 56px;
// }
// @media(max-width:900px){.co-wrap{padding:0 24px;}}
// @media(max-width:480px){.co-wrap{padding:0 16px;}}

// .co-ey {
//   font-family:'Jost';font-size:11px;letter-spacing:.25em;
//   text-transform:uppercase;color:#C4980A;font-weight:600;
// }

// /* PAGE TOP */
// .co-page-top { padding-top: 140px; padding-bottom: 80px; }
// @media(max-width:640px){.co-page-top{padding-top:110px;padding-bottom:60px;}}

// /* ANIMATIONS */
// @keyframes coFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
// @keyframes coFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
// @keyframes coShimmer {0%{left:-80%}100%{left:120%}}
// @keyframes coSpin    {to{transform:rotate(360deg)}}

// .co-fadein {animation:coFadeIn  .8s cubic-bezier(.4,0,.2,1) both;}
// .co-fadeup {animation:coFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
// .co-d1{animation-delay:.1s} .co-d2{animation-delay:.2s}

// /* HEADER */
// .co-header { margin-bottom: 44px; }
// .co-header-badge {
//   display:inline-flex;align-items:center;gap:8px;
//   background:rgba(196,152,10,.12);border:1px solid rgba(196,152,10,.35);
//   padding:7px 18px;border-radius:100px;margin-bottom:16px;
// }
// .co-header-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(34px,5.5vw,58px);font-weight:400;color:#800020;line-height:1.06;
// }

// /* LAYOUT */
// .co-layout {
//   display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start;
// }
// @media(max-width:1024px){.co-layout{grid-template-columns:1fr;}}

// /* SECTION CARDS */
// .co-card {
//   background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
//   border:1px solid rgba(196,152,10,.22);border-radius:24px;
//   padding:32px 36px;margin-bottom:20px;
//   box-shadow:0 8px 36px rgba(0,0,0,.06);
// }
// @media(max-width:600px){.co-card{padding:22px 18px;border-radius:18px;}}

// .co-card-head {
//   display:flex;align-items:center;gap:14px;
//   padding-bottom:20px;margin-bottom:24px;
//   border-bottom:1px solid rgba(196,152,10,.18);
// }
// .co-card-icon {
//   width:42px;height:42px;border-radius:50%;flex-shrink:0;
//   background:linear-gradient(135deg,#800020,#4B0082);
//   display:flex;align-items:center;justify-content:center;
//   box-shadow:0 4px 14px rgba(128,0,32,.25);
// }
// .co-card-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(20px,3vw,24px);font-weight:500;color:#800020;
// }

// /* ADDRESS BLOCK */
// .co-address-block {
//   background:rgba(196,152,10,.06);border:1px solid rgba(196,152,10,.28);
//   border-radius:18px;padding:20px 22px;
// }
// .co-address-name {
//   font-family:'Cormorant Garamond',serif;
//   font-size:19px;font-weight:500;color:#800020;margin-bottom:5px;
// }
// .co-address-phone {
//   font-family:'Jost';font-size:13px;color:#4a3828;font-weight:500;margin-bottom:8px;
// }
// .co-address-line {
//   font-family:'Jost';font-size:13px;color:#9a8070;font-weight:300;line-height:1.65;
// }
// .co-address-dot {
//   width:8px;height:8px;border-radius:50%;background:#C4980A;
//   flex-shrink:0;margin-top:5px;
// }

// .co-no-address {
//   text-align:center;padding:36px 20px;
//   border:1.5px dashed rgba(196,152,10,.3);border-radius:16px;
// }
// .co-no-address-text {
//   font-family:'Jost';font-size:13px;color:#9a8070;font-weight:300;margin-top:12px;
// }

// /* PAYMENT OPTIONS */
// .co-pay-option {
//   display:flex;align-items:center;gap:14px;
//   padding:16px 18px;border-radius:18px;
//   border:1.5px solid rgba(196,152,10,.25);
//   cursor:pointer;margin-bottom:12px;
//   background:white;
//   transition:border-color .25s,background .25s,box-shadow .25s,transform .25s;
// }
// .co-pay-option:hover {
//   border-color:rgba(196,152,10,.5);
//   background:rgba(255,249,240,.9);
//   box-shadow:0 6px 24px rgba(128,0,32,.08);
// }
// .co-pay-option.selected {
//   border-color:#C4980A;
//   background:rgba(255,249,240,.95);
//   box-shadow:0 8px 28px rgba(196,152,10,.18);
//   transform:scale(1.01);
// }
// .co-pay-icon {
//   width:40px;height:40px;border-radius:50%;flex-shrink:0;
//   display:flex;align-items:center;justify-content:center;
//   transition:transform .25s;
// }
// .co-pay-option.selected .co-pay-icon { transform:scale(1.1); }
// .co-pay-title {
//   font-family:'Jost';font-size:13px;font-weight:600;color:#800020;margin-bottom:2px;
// }
// .co-pay-sub {
//   font-family:'Jost';font-size:11px;color:#9a8070;font-weight:300;
// }
// .co-pay-radio {
//   width:20px;height:20px;border-radius:50%;flex-shrink:0;
//   border:2px solid rgba(196,152,10,.4);
//   display:flex;align-items:center;justify-content:center;
//   transition:border-color .2s,background .2s;
//   margin-left:auto;
// }
// .co-pay-option.selected .co-pay-radio {
//   border-color:#C4980A;background:#C4980A;
// }

// /* ORDER SUMMARY SIDEBAR */
// .co-summary {
//   background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
//   border:1px solid rgba(196,152,10,.25);border-radius:24px;
//   box-shadow:0 16px 60px rgba(0,0,0,.09);
//   overflow:hidden;position:sticky;top:110px;
// }
// .co-summary-bar {
//   background:linear-gradient(135deg,#800020 0%,#5a0016 55%,#4B0082 100%);
//   padding:22px 28px;position:relative;overflow:hidden;
// }
// .co-summary-bar::after {
//   content:'';position:absolute;top:-50px;right:-50px;
//   width:160px;height:160px;border-radius:50%;
//   border:1px solid rgba(212,175,55,.15);pointer-events:none;
// }
// .co-summary-bar-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:22px;font-weight:400;color:white;position:relative;z-index:1;
// }
// .co-summary-body { padding:24px 26px 28px; }

// /* Cart items list */
// .co-item-list {
//   max-height:220px;overflow-y:auto;margin-bottom:20px;
// }
// .co-item-list::-webkit-scrollbar{width:4px;}
// .co-item-list::-webkit-scrollbar-track{background:#F5E6D3;}
// .co-item-list::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#C4980A,#800020);border-radius:2px;}

// .co-item-row {
//   display:flex;gap:12px;padding:12px 0;
//   border-bottom:1px solid rgba(196,152,10,.14);
// }
// .co-item-row:last-child{border-bottom:none;}
// .co-item-img {
//   width:52px;height:64px;border-radius:10px;object-fit:cover;flex-shrink:0;
//   border:1px solid rgba(196,152,10,.25);
// }
// .co-item-name {
//   font-family:'Jost';font-size:12px;font-weight:500;color:#800020;
//   margin-bottom:3px;
//   display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
// }
// .co-item-qty  {font-family:'Jost';font-size:11px;color:#9a8070;font-weight:300;}
// .co-item-price{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:#800020;margin-top:2px;}

// /* Summary rows */
// .co-sum-row {
//   display:flex;justify-content:space-between;align-items:center;
//   padding:9px 0;border-bottom:1px solid rgba(196,152,10,.12);
// }
// .co-sum-row:last-of-type{border-bottom:none;}
// .co-sum-key {font-family:'Jost';font-size:13px;color:#4a3828;font-weight:400;}
// .co-sum-val {font-family:'Jost';font-size:13px;color:#800020;font-weight:600;}
// .co-sum-free {
//   display:flex;align-items:center;gap:5px;
//   font-family:'Jost';font-size:13px;color:#059669;font-weight:600;
// }

// /* Total strip */
// .co-total-strip {
//   display:flex;justify-content:space-between;align-items:center;
//   background:linear-gradient(135deg,#800020 0%,#4B0082 100%);
//   border-radius:16px;padding:16px 20px;margin:16px 0 20px;
// }
// .co-total-label {
//   font-family:'Jost';font-size:12px;letter-spacing:.1em;
//   text-transform:uppercase;color:rgba(255,255,255,.65);font-weight:500;
// }
// .co-total-val {
//   font-family:'Cormorant Garamond',serif;
//   font-size:28px;font-weight:600;color:#D4AF37;
// }

// /* Place order button */
// .co-place-btn {
//   width:100%;padding:16px;border:none;border-radius:100px;
//   background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
//   color:#800020;
//   font-family:'Jost';font-size:13px;letter-spacing:.12em;
//   font-weight:600;text-transform:uppercase;cursor:pointer;
//   transition:transform .35s,box-shadow .35s;
//   box-shadow:0 6px 24px rgba(212,175,55,.38);
//   position:relative;overflow:hidden;margin-bottom:10px;
// }
// .co-place-btn::after {
//   content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
//   background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
//   animation:coShimmer 3s ease infinite;
// }
// .co-place-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,175,55,.52);}
// .co-place-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}

// .co-place-note {
//   font-family:'Jost';font-size:11px;letter-spacing:.04em;
//   color:#9a8070;text-align:center;font-weight:300;
// }

// /* Spinner */
// .co-spinner {
//   display:inline-block;width:16px;height:16px;border-radius:50%;
//   border:2.5px solid rgba(128,0,32,.25);border-top-color:#800020;
//   animation:coSpin .7s linear infinite;vertical-align:middle;margin-right:8px;
// }

// @media(max-width:480px){
//   .co-header-title{font-size:32px;}
//   .co-summary-body{padding:18px 18px 22px;}
// }
// `;

// export function CheckoutPage() {
//   const navigate = useNavigate();
//   const { cart, getCartTotal, clearCart } = useCart();
//   const user = authService.getCurrentUser();
//   const [paymentMethod, setPaymentMethod] = useState('upi');
//   const [isProcessing, setIsProcessing] = useState(false);

//   const subtotal = getCartTotal();
//   const shipping = subtotal > 2999 ? 0 : 150;
//   const total    = subtotal + shipping;

//   const handlePlaceOrder = async () => {
//     if (!user) { toast.error('Please log in to continue'); navigate('/login'); return; }
//     if (user.addresses.length === 0) { toast.error('Please add a delivery address'); return; }
//     setIsProcessing(true);
//     setTimeout(() => {
//       const orderId = 'ORD' + Date.now();
//       const mockOrder = {
//         id: orderId, userId: user.id, items: cart,
//         total: subtotal, discount: 0, finalTotal: total,
//         status: 'confirmed', shippingAddress: user.addresses[0],
//         paymentMethod, createdAt: new Date().toISOString(),
//         estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//       };
//       const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]');
//       orders.push(mockOrder);
//       localStorage.setItem('handloom_orders', JSON.stringify(orders));
//       clearCart(); setIsProcessing(false);
//       toast.success('Order placed successfully!');
//       navigate(`/order-confirmation/${orderId}`);
//     }, 2000);
//   };

//   if (cart.length === 0) { navigate('/cart'); return null; }
//   if (!user)             { navigate('/login'); return null; }

//   const PAY_OPTIONS = [
//     { value: 'upi',    Icon: Smartphone, title: 'UPI Payment',        sub: 'Pay via UPI apps',              bg: 'rgba(59,130,246,.12)',  border: 'rgba(59,130,246,.35)',  color: '#2563eb' },
//     { value: 'card',   Icon: CreditCard, title: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay',       bg: 'rgba(139,92,246,.12)',  border: 'rgba(139,92,246,.35)', color: '#7c3aed' },
//     { value: 'wallet', Icon: Wallet,     title: 'Wallets',             sub: 'Paytm, PhonePe, Amazon Pay',   bg: 'rgba(16,185,129,.12)',  border: 'rgba(16,185,129,.35)', color: '#059669' },
//   ];

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="co-root">
//         <div className="co-wrap co-page-top">

//           {/* Header */}
//           <div className="co-header co-fadein">
//             <div className="co-header-badge">
//               <Shield size={13} color={C.gold} />
//               <span className="co-ey">Secure Checkout</span>
//             </div>
//             <h1 className="co-header-title">Complete Your Order</h1>
//           </div>

//           <div className="co-layout">

//             {/* Left column */}
//             <div>

//               {/* Delivery Address */}
//               <div className="co-card co-fadeup">
//                 <div className="co-card-head">
//                   <div className="co-card-icon"><MapPin size={18} color="white" /></div>
//                   <h2 className="co-card-title">Delivery Address</h2>
//                 </div>
//                 {user.addresses.length > 0 ? (
//                   <div className="co-address-block">
//                     <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//                       <div className="co-address-dot" />
//                       <div>
//                         <div className="co-address-name">{user.addresses[0].name}</div>
//                         <div className="co-address-phone">{user.addresses[0].phone}</div>
//                         <div className="co-address-line">
//                           {user.addresses[0].addressLine1}
//                           {user.addresses[0].addressLine2 && `, ${user.addresses[0].addressLine2}`}
//                         </div>
//                         <div className="co-address-line">
//                           {user.addresses[0].city}, {user.addresses[0].state} – {user.addresses[0].pincode}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="co-no-address">
//                     <MapPin size={36} color={C.gold} style={{ margin: '0 auto' }} />
//                     <p className="co-no-address-text">No address added. Please add a delivery address.</p>
//                   </div>
//                 )}
//               </div>

//               {/* Payment */}
//               <div className="co-card co-fadeup co-d1">
//                 <div className="co-card-head">
//                   <div className="co-card-icon"><Shield size={18} color="white" /></div>
//                   <h2 className="co-card-title">Payment Method</h2>
//                 </div>
//                 {PAY_OPTIONS.map(({ value, Icon, title, sub, bg, border, color }) => (
//                   <label
//                     key={value}
//                     className={`co-pay-option${paymentMethod === value ? ' selected' : ''}`}
//                     onClick={() => setPaymentMethod(value)}
//                   >
//                     <input type="radio" name="payment" value={value}
//                       checked={paymentMethod === value} onChange={() => setPaymentMethod(value)}
//                       style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
//                     <div className="co-pay-icon" style={{ background: bg, border: `1px solid ${border}` }}>
//                       <Icon size={18} color={color} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div className="co-pay-title">{title}</div>
//                       <div className="co-pay-sub">{sub}</div>
//                     </div>
//                     <div className="co-pay-radio">
//                       {paymentMethod === value && (
//                         <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       )}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="co-summary co-fadein co-d2">
//               <div className="co-summary-bar">
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, position: 'relative', zIndex: 1 }}>
//                   <Sparkles size={13} color="rgba(212,175,55,.75)" />
//                   <span style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>Neyge Couture</span>
//                 </div>
//                 <div className="co-summary-bar-title">Order Summary</div>
//               </div>

//               <div className="co-summary-body">

//                 {/* Items */}
//                 <div className="co-item-list">
//                   {cart.map(item => (
//                     <div key={item.saree.id} className="co-item-row">
//                       <img src={item.saree.images[0]} alt={item.saree.name} className="co-item-img" />
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div className="co-item-name">{item.saree.name}</div>
//                         <div className="co-item-qty">Qty: {item.quantity}</div>
//                         <div className="co-item-price">{formatCurrency(item.saree.price * item.quantity)}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price rows */}
//                 <div className="co-sum-row">
//                   <span className="co-sum-key">Subtotal</span>
//                   <span className="co-sum-val">{formatCurrency(subtotal)}</span>
//                 </div>
//                 <div className="co-sum-row">
//                   <span className="co-sum-key">Shipping</span>
//                   {shipping === 0
//                     ? <span className="co-sum-free"><Sparkles size={12} /> FREE</span>
//                     : <span className="co-sum-val">{formatCurrency(shipping)}</span>
//                   }
//                 </div>

//                 {/* Total */}
//                 <div className="co-total-strip">
//                   <span className="co-total-label">Total Amount</span>
//                   <span className="co-total-val">{formatCurrency(total)}</span>
//                 </div>

//                 <button className="co-place-btn" onClick={handlePlaceOrder} disabled={isProcessing}>
//                   {isProcessing
//                     ? <><span className="co-spinner" />Processing…</>
//                     : 'Place Order ✦'
//                   }
//                 </button>
//                 <p className="co-place-note">By placing this order, you agree to our Terms & Conditions</p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




//below is the mock implementation for wishlist, replace with actual API integration when ready to connect to backend

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCarts';
import { authService } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/api/client';
import { CreditCard, Smartphone, Wallet, Sparkles, MapPin, Shield } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Brand palette (matches HomePage, CartPage, VideoShoppingPage) ────────────
const C = {
  maroon:   '#800020',
  maroonDk: '#5a0016',
  gold:     '#C4980A',
  goldV:    '#D4AF37',
  cream:    '#F5E6D3',
  creamLt:  '#FFF9F0',
  creamMid: '#F8EEE2',
  creamDk:  '#EDD8C4',
  warmGrey: '#4a3828',
  navy:     '#1B2A6B',
  forest:   '#14402A',
  blush:    '#F2C4CE',
};

// ─── CSS – using brand fonts and styles (Cinzel + Josefin Sans) ──────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.co-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.co-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width:900px){.co-wrap{padding:0 24px;}}
@media(max-width:480px){.co-wrap{padding:0 16px;}}

/* ── Eyebrow (brand gold) ── */
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

.co-page-top {
  padding-top: 140px;
  padding-bottom: 80px;
}
@media(max-width:640px){.co-page-top{padding-top:110px;padding-bottom:60px;}}

@keyframes coFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes coFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes coSpin    {to{transform:rotate(360deg)}}

.co-fadein {animation:coFadeIn .8s cubic-bezier(.4,0,.2,1) both;}
.co-fadeup {animation:coFadeUp .8s cubic-bezier(.4,0,.2,1) both;}
.co-d1{animation-delay:.1s}
.co-d2{animation-delay:.2s}

.co-header {
  margin-bottom: 44px;
}
.co-header-badge {
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:rgba(196,152,10,.12);
  border:1px solid rgba(196,152,10,.35);
  padding:7px 18px;
  border-radius:100px;
  margin-bottom:16px;
}
.co-header-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(34px, 5.5vw, 58px);
  font-weight: 400;
  color: #800020;
  line-height: 1.06;
  letter-spacing: 0.04em;
}

.co-layout {
  display:grid;
  grid-template-columns:1fr 360px;
  gap:32px;
  align-items:start;
}
@media(max-width:1024px){.co-layout{grid-template-columns:1fr;}}

.co-card {
  background:rgba(255,249,240,.95);
  backdrop-filter:blur(10px);
  border:1px solid rgba(196,152,10,.22);
  border-radius:24px;
  padding:32px 36px;
  margin-bottom:20px;
  box-shadow:0 8px 36px rgba(0,0,0,.06);
}
@media(max-width:600px){.co-card{padding:22px 18px;border-radius:18px;}}

.co-card-head {
  display:flex;
  align-items:center;
  gap:14px;
  padding-bottom:20px;
  margin-bottom:24px;
  border-bottom:1px solid rgba(196,152,10,.18);
}
.co-card-icon {
  width:42px;
  height:42px;
  border-radius:50%;
  flex-shrink:0;
  background: linear-gradient(135deg, #800020 0%, #1B2A6B 100%);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 4px 14px rgba(128,0,32,.25);
}
.co-card-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(20px, 3vw, 24px);
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.02em;
}

.co-address-block {
  background:rgba(196,152,10,.06);
  border:1px solid rgba(196,152,10,.28);
  border-radius:18px;
  padding:20px 22px;
}
.co-address-name {
  font-family: 'Cinzel', serif;
  font-size: 19px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 5px;
  letter-spacing: 0.02em;
}
.co-address-phone {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
  font-weight: 500;
  margin-bottom: 8px;
}
.co-address-line {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #9a8070;
  font-weight: 300;
  line-height: 1.65;
}
.co-address-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C4980A;
  flex-shrink: 0;
  margin-top: 5px;
}

.co-no-address {
  text-align:center;
  padding:36px 20px;
  border:1.5px dashed rgba(196,152,10,.3);
  border-radius:16px;
}
.co-no-address-text {
  font-family: 'Josefin Sans';
  font-size:13px;
  color:#9a8070;
  font-weight:300;
  margin-top:12px;
}

.co-pay-option {
  display:flex;
  align-items:center;
  gap:14px;
  padding:16px 18px;
  border-radius:18px;
  border:1.5px solid rgba(196,152,10,.25);
  cursor:pointer;
  margin-bottom:12px;
  background:white;
  transition:border-color .25s,background .25s,box-shadow .25s,transform .25s;
}
.co-pay-option:hover {
  border-color:rgba(196,152,10,.5);
  background:rgba(255,249,240,.9);
  box-shadow:0 6px 24px rgba(128,0,32,.08);
}
.co-pay-option.selected {
  border-color:#C4980A;
  background:rgba(255,249,240,.95);
  box-shadow:0 8px 28px rgba(196,152,10,.18);
  transform:scale(1.01);
}
.co-pay-icon {
  width:40px;
  height:40px;
  border-radius:50%;
  flex-shrink:0;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:transform .25s;
}
.co-pay-option.selected .co-pay-icon { transform:scale(1.1); }
.co-pay-title {
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 600;
  color: #800020;
  margin-bottom: 2px;
}
.co-pay-sub {
  font-family: 'Josefin Sans';
  font-size: 11px;
  color: #9a8070;
  font-weight: 300;
}
.co-pay-radio {
  width:20px;
  height:20px;
  border-radius:50%;
  flex-shrink:0;
  border:2px solid rgba(196,152,10,.4);
  display:flex;
  align-items:center;
  justify-content:center;
  transition:border-color .2s,background .2s;
  margin-left:auto;
}
.co-pay-option.selected .co-pay-radio {
  border-color:#C4980A;
  background:#C4980A;
}

.co-summary {
  background:rgba(255,249,240,.97);
  backdrop-filter:blur(12px);
  border:1px solid rgba(196,152,10,.25);
  border-radius:24px;
  box-shadow:0 16px 60px rgba(0,0,0,.09);
  overflow:hidden;
  position:sticky;
  top:110px;
}
.co-summary-bar {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #1B2A6B 100%);
  padding:22px 28px;
  position:relative;
  overflow:hidden;
}
.co-summary-bar::after {
  content:'';
  position:absolute;
  top:-50px;
  right:-50px;
  width:160px;
  height:160px;
  border-radius:50%;
  border:1px solid rgba(212,175,55,.15);
  pointer-events:none;
}
.co-summary-bar-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 400;
  color: white;
  letter-spacing: 0.04em;
  position:relative;
  z-index:1;
}
.co-summary-body {
  padding:24px 26px 28px;
}

.co-item-list {
  max-height:220px;
  overflow-y:auto;
  margin-bottom:20px;
}
.co-item-row {
  display:flex;
  gap:12px;
  padding:12px 0;
  border-bottom:1px solid rgba(196,152,10,.14);
}
.co-item-row:last-child{border-bottom:none;}
.co-item-img {
  width:52px;
  height:64px;
  border-radius:10px;
  object-fit:cover;
  flex-shrink:0;
  border:1px solid rgba(196,152,10,.25);
  background:#f4eadc;
}
.co-item-name {
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 3px;
}
.co-item-qty  {
  font-family: 'Josefin Sans';
  font-size: 11px;
  color: #9a8070;
  font-weight: 300;
}
.co-item-price {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 600;
  color: #800020;
  margin-top: 2px;
}

.co-sum-row {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:9px 0;
  border-bottom:1px solid rgba(196,152,10,.12);
}
.co-sum-key {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
  font-weight: 400;
}
.co-sum-val {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #800020;
  font-weight: 600;
}
.co-sum-free {
  display:flex;
  align-items:center;
  gap:5px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #059669;
  font-weight: 600;
}

.co-total-strip {
  display:flex;
  justify-content:space-between;
  align-items:center;
  background: linear-gradient(135deg, #800020 0%, #1B2A6B 100%);
  border-radius:16px;
  padding:16px 20px;
  margin:16px 0 20px;
}
.co-total-label {
  font-family: 'Josefin Sans';
  font-size: 12px;
  letter-spacing:.1em;
  text-transform:uppercase;
  color:rgba(255,255,255,.65);
  font-weight:500;
}
.co-total-val {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  font-weight: 600;
  color: #D4AF37;
  letter-spacing: 0.02em;
}

/* Button matches btn-gold from other pages */
.co-place-btn {
  width:100%;
  padding:16px;
  border:none;
  border-radius:100px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing:.12em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:0 6px 24px rgba(212,175,55,.38);
  margin-bottom:10px;
  transition: transform .35s, box-shadow .35s;
  position: relative;
  overflow: hidden;
}
.co-place-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: shimmer 3s ease infinite;
}
@keyframes shimmer { 0%{left:-80%} 100%{left:120%} }
.co-place-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}
.co-place-btn:disabled{
  opacity:.55;
  cursor:not-allowed;
  transform: none;
}

.co-place-note {
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing:.04em;
  color:#9a8070;
  text-align:center;
  font-weight:300;
}

.co-spinner {
  display:inline-block;
  width:16px;
  height:16px;
  border-radius:50%;
  border:2.5px solid rgba(128,0,32,.25);
  border-top-color:#800020;
  animation:coSpin .7s linear infinite;
  vertical-align:middle;
  margin-right:8px;
}
`;

type CheckoutCreateResponse = {
  data?: {
    razorpay_order_id: string;
    amount: number;
    currency: string;
    key: string;
  };
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, getCartTotal, clearCart } = useCart();
  const user = authService.getCurrentUser();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && cart.length === 0) {
      navigate('/cart');
    }
  }, [loading, cart.length, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="co-root">
          <div className="co-wrap co-page-top">
            <div style={{ textAlign: 'center', padding: '80px 0', color: C.maroon, fontFamily: "'Josefin Sans'" }}>
              Loading checkout...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0 || !user) {
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const loadRazorpayScript = async () => {
    return new Promise<boolean>((resolve) => {
      const existingScript = document.getElementById('razorpay-sdk');
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    if (!user.addresses || user.addresses.length === 0) {
      toast.error('Please add a delivery address');
      return;
    }

    try {
      setIsProcessing(true);

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
        return;
      }

      const shippingAddress = {
        full_name: user.addresses[0].name,
        phone: user.addresses[0].phone,
        line1: user.addresses[0].addressLine1,
        line2: user.addresses[0].addressLine2 || '',
        city: user.addresses[0].city,
        state: user.addresses[0].state,
        postal_code: user.addresses[0].pincode,
        country: 'India',
      };

      const createRes = await api.post<CheckoutCreateResponse>('/orders/create', {
        shipping_address: shippingAddress,
      });

      const checkoutData = createRes.data?.data;

      if (!checkoutData?.razorpay_order_id || !checkoutData?.key) {
        throw new Error('Invalid checkout response');
      }

      const options = {
        key: checkoutData.key,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: 'Neyge Couture',
        description: 'Order Payment',
        order_id: checkoutData.razorpay_order_id,
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || shippingAddress.phone || '',
        },
        theme: {
          color: C.maroon,
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('VERIFY RESPONSE:', verifyRes.data);

            const createdOrder =
              verifyRes.data?.data ||
              verifyRes.data?.order ||
              verifyRes.data;

            await clearCart();

            toast.success('Order placed successfully!');

            setTimeout(() => {
              if (createdOrder?.id) {
                navigate(`/order-confirmation/${createdOrder.id}`, {
                  state: { order: createdOrder },
                });
              } else {
                navigate('/profile');
              }
            }, 300);
          } catch (error: any) {
            console.error('Payment verification failed', error);
            toast.error(
              error?.response?.data?.detail ||
              error?.response?.data?.message ||
              error?.message ||
              'Payment verification failed'
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Order placement failed', error);
      toast.error(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to place order'
      );
      setIsProcessing(false);
    }
  };

  const PAY_OPTIONS = [
    {
      value: 'upi',
      Icon: Smartphone,
      title: 'UPI Payment',
      sub: 'Pay via UPI apps',
      bg: 'rgba(59,130,246,.12)',
      border: 'rgba(59,130,246,.35)',
      color: '#2563eb',
    },
    {
      value: 'card',
      Icon: CreditCard,
      title: 'Credit / Debit Card',
      sub: 'Visa, Mastercard, Rupay',
      bg: 'rgba(139,92,246,.12)',
      border: 'rgba(139,92,246,.35)',
      color: '#7c3aed',
    },
    {
      value: 'wallet',
      Icon: Wallet,
      title: 'Wallets',
      sub: 'Paytm, PhonePe, Amazon Pay',
      bg: 'rgba(16,185,129,.12)',
      border: 'rgba(16,185,129,.35)',
      color: '#059669',
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="co-root">
        <div className="co-wrap co-page-top">
          <div className="co-header co-fadein">
            <div className="co-header-badge">
              <Shield size={13} color={C.gold} />
              <span className="ey">Secure Checkout</span>
            </div>
            <h1 className="co-header-title">Complete Your Order</h1>
            <div className="gd" style={{ marginTop: 16 }} />
          </div>

          <div className="co-layout">
            <div>
              <div className="co-card co-fadeup">
                <div className="co-card-head">
                  <div className="co-card-icon">
                    <MapPin size={18} color="white" />
                  </div>
                  <h2 className="co-card-title">Delivery Address</h2>
                </div>

                {user.addresses.length > 0 ? (
                  <div className="co-address-block">
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div className="co-address-dot" />
                      <div>
                        <div className="co-address-name">{user.addresses[0].name}</div>
                        <div className="co-address-phone">{user.addresses[0].phone}</div>
                        <div className="co-address-line">
                          {user.addresses[0].addressLine1}
                          {user.addresses[0].addressLine2 && `, ${user.addresses[0].addressLine2}`}
                        </div>
                        <div className="co-address-line">
                          {user.addresses[0].city}, {user.addresses[0].state} – {user.addresses[0].pincode}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="co-no-address">
                    <MapPin size={36} color={C.gold} style={{ margin: '0 auto' }} />
                    <p className="co-no-address-text">No address added. Please add a delivery address.</p>
                  </div>
                )}
              </div>

              <div className="co-card co-fadeup co-d1">
                <div className="co-card-head">
                  <div className="co-card-icon">
                    <Shield size={18} color="white" />
                  </div>
                  <h2 className="co-card-title">Payment Method</h2>
                </div>

                {PAY_OPTIONS.map(({ value, Icon, title, sub, bg, border, color }) => (
                  <label
                    key={value}
                    className={`co-pay-option${paymentMethod === value ? ' selected' : ''}`}
                    onClick={() => setPaymentMethod(value)}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <div className="co-pay-icon" style={{ background: bg, border: `1px solid ${border}` }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="co-pay-title">{title}</div>
                      <div className="co-pay-sub">{sub}</div>
                    </div>
                    <div className="co-pay-radio">
                      {paymentMethod === value && (
                        <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="co-summary co-fadein co-d2">
              <div className="co-summary-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Sparkles size={13} color="rgba(212,175,55,.75)" />
                  <span style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                    Neyge Couture
                  </span>
                </div>
                <div className="co-summary-bar-title">Order Summary</div>
              </div>

              <div className="co-summary-body">
                <div className="co-item-list">
                  {cart.map((item) => (
                    <div key={item.saree.id} className="co-item-row">
                      <img
                        src={item.saree.image || item.saree.images?.[0] || ''}
                        alt={item.saree.name}
                        className="co-item-img"
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="co-item-name">{item.saree.name}</div>
                        <div className="co-item-qty">Qty: {item.quantity}</div>
                        <div className="co-item-price">{formatCurrency(item.saree.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-sum-row">
                  <span className="co-sum-key">Subtotal</span>
                  <span className="co-sum-val">{formatCurrency(subtotal)}</span>
                </div>

                <div className="co-sum-row">
                  <span className="co-sum-key">Shipping</span>
                  {shipping === 0 ? (
                    <span className="co-sum-free">
                      <Sparkles size={12} /> FREE
                    </span>
                  ) : (
                    <span className="co-sum-val">{formatCurrency(shipping)}</span>
                  )}
                </div>

                <div className="co-total-strip">
                  <span className="co-total-label">Total Amount</span>
                  <span className="co-total-val">{formatCurrency(total)}</span>
                </div>

                <button className="co-place-btn" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <span className="co-spinner" />
                      Processing…
                    </>
                  ) : (
                    'Place Order ✦'
                  )}
                </button>

                <p className="co-place-note">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}