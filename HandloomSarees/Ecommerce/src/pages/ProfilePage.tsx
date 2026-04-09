// // import { useNavigate } from 'react-router-dom';
// // import { authService } from '@/lib/auth';
// // import { User, MapPin, Package, LogOut, Video, Sparkles } from 'lucide-react';
// // import { toast } from 'sonner';
// // import { FASHION_ADVISORS } from '@/constants/advisors';

// // const C = {
// //   maroon: '#800020', maroonDk: '#5a0016',
// //   gold: '#C4980A', goldV: '#D4AF37',
// //   cream: '#F5E6D3', creamLt: '#FFF9F0',
// //   warmGrey: '#4a3828', indigo: '#4B0082',
// // };

// // const CSS = `
// // @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
// // *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

// // .pf-root {
// //   font-family:'Jost',sans-serif;
// //   background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
// //   min-height:100vh;color:#1a1010;line-height:1;
// // }
// // .pf-wrap {
// //   max-width:1100px;margin:0 auto;padding:0 56px;
// // }
// // @media(max-width:900px){.pf-wrap{padding:0 24px;}}
// // @media(max-width:480px){.pf-wrap{padding:0 16px;}}

// // .pf-ey {
// //   font-family:'Jost';font-size:11px;letter-spacing:.25em;
// //   text-transform:uppercase;color:#C4980A;font-weight:600;
// // }

// // /* PAGE TOP */
// // .pf-page-top{padding-top:140px;padding-bottom:80px;}
// // @media(max-width:640px){.pf-page-top{padding-top:110px;padding-bottom:60px;}}

// // /* ANIMATIONS */
// // @keyframes pfFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
// // @keyframes pfFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
// // @keyframes pfShimmer {0%{left:-80%}100%{left:120%}}
// // @keyframes pfBlink   {0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 0 20px 3px rgba(212,175,55,.25)}}

// // .pf-fadein {animation:pfFadeIn  .8s cubic-bezier(.4,0,.2,1) both;}
// // .pf-fadeup {animation:pfFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
// // .pf-d1{animation-delay:.1s} .pf-d2{animation-delay:.2s} .pf-d3{animation-delay:.3s}

// // /* ─── PROFILE HEADER CARD ─── */
// // .pf-hero {
// //   background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
// //   border:1px solid rgba(196,152,10,.25);border-radius:28px;
// //   overflow:hidden;margin-bottom:28px;
// //   box-shadow:0 16px 60px rgba(0,0,0,.08);
// // }
// // .pf-hero-bar {
// //   background:linear-gradient(135deg,#800020 0%,#5a0016 55%,#4B0082 100%);
// //   padding:28px 36px;position:relative;overflow:hidden;
// // }
// // .pf-hero-bar::after {
// //   content:'';position:absolute;top:-60px;right:-60px;
// //   width:200px;height:200px;border-radius:50%;
// //   border:1px solid rgba(212,175,55,.14);pointer-events:none;
// // }
// // .pf-hero-bar::before {
// //   content:'';position:absolute;top:-100px;right:-100px;
// //   width:320px;height:320px;border-radius:50%;
// //   border:1px solid rgba(212,175,55,.07);pointer-events:none;
// // }
// // .pf-hero-bar-eyebrow {
// //   display:flex;align-items:center;gap:8px;margin-bottom:10px;position:relative;z-index:1;
// // }
// // .pf-hero-bar-name {
// //   font-family:'Cormorant Garamond',serif;
// //   font-size:clamp(24px,4vw,36px);font-weight:400;color:white;
// //   position:relative;z-index:1;margin-bottom:5px;
// // }
// // .pf-hero-bar-email {
// //   font-family:'Jost';font-size:13px;color:rgba(255,255,255,.55);
// //   font-weight:300;position:relative;z-index:1;
// // }

// // .pf-hero-body {
// //   padding:22px 36px;
// //   display:flex;align-items:center;justify-content:space-between;
// //   gap:16px;flex-wrap:wrap;
// // }
// // @media(max-width:600px){.pf-hero-body{padding:18px 22px;}}

// // .pf-avatar {
// //   width:56px;height:56px;border-radius:50%;
// //   background:rgba(196,152,10,.12);border:1.5px solid rgba(196,152,10,.3);
// //   display:flex;align-items:center;justify-content:center;
// //   animation:pfBlink 3s ease infinite;
// // }
// // .pf-stats-row { display:flex;gap:0; }
// // .pf-stat-cell {
// //   padding:8px 20px;text-align:center;
// //   border-right:1px solid rgba(196,152,10,.2);
// // }
// // .pf-stat-cell:first-child{border-left:1px solid rgba(196,152,10,.2);}
// // .pf-stat-n {
// //   font-family:'Cormorant Garamond',serif;
// //   font-size:22px;font-weight:500;color:#800020;line-height:1;
// // }
// // .pf-stat-l {
// //   font-family:'Jost';font-size:10px;letter-spacing:.1em;
// //   text-transform:uppercase;color:#9a8070;margin-top:3px;font-weight:500;
// // }

// // /* LOGOUT BUTTON */
// // .pf-logout {
// //   display:flex;align-items:center;gap:8px;
// //   padding:10px 22px;border-radius:100px;
// //   border:1.5px solid rgba(200,50,50,.3);
// //   background:transparent;color:#c0392b;
// //   font-family:'Jost';font-size:12px;letter-spacing:.1em;
// //   text-transform:uppercase;font-weight:500;cursor:pointer;
// //   transition:background .25s,color .25s,transform .2s;
// // }
// // .pf-logout:hover{background:#c0392b;color:white;transform:scale(1.03);}

// // /* ─── SECTION CARDS ─── */
// // .pf-card {
// //   background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
// //   border:1px solid rgba(196,152,10,.22);border-radius:24px;
// //   padding:30px 32px;
// //   box-shadow:0 8px 36px rgba(0,0,0,.06);
// // }
// // @media(max-width:600px){.pf-card{padding:22px 18px;border-radius:18px;}}

// // .pf-card-head {
// //   display:flex;align-items:center;gap:12px;
// //   padding-bottom:18px;margin-bottom:20px;
// //   border-bottom:1px solid rgba(196,152,10,.18);
// // }
// // .pf-card-icon {
// //   width:36px;height:36px;border-radius:50%;flex-shrink:0;
// //   background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
// //   display:flex;align-items:center;justify-content:center;
// // }
// // .pf-card-title {
// //   font-family:'Cormorant Garamond',serif;
// //   font-size:20px;font-weight:500;color:#800020;
// // }

// // /* CONSULTATION / ADDRESS / ORDER ROWS */
// // .pf-row {
// //   background:rgba(255,249,240,.7);
// //   border:1px solid rgba(196,152,10,.2);border-radius:16px;
// //   padding:16px 18px;margin-bottom:10px;
// //   transition:box-shadow .25s,border-color .25s;
// // }
// // .pf-row:last-child{margin-bottom:0;}
// // .pf-row:hover{box-shadow:0 6px 22px rgba(128,0,32,.09);border-color:rgba(196,152,10,.4);}

// // .pf-row-head {
// //   display:flex;align-items:flex-start;justify-content:space-between;
// //   gap:10px;flex-wrap:wrap;
// // }
// // .pf-row-name {
// //   font-family:'Cormorant Garamond',serif;
// //   font-size:17px;font-weight:500;color:#800020;margin-bottom:4px;
// // }
// // .pf-row-sub {
// //   font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.55;
// // }
// // .pf-tag {
// //   display:inline-block;padding:4px 12px;border-radius:100px;
// //   background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
// //   font-family:'Jost';font-size:10px;letter-spacing:.08em;
// //   text-transform:uppercase;color:#800020;font-weight:500;white-space:nowrap;
// // }

// // /* Empty state */
// // .pf-empty {
// //   font-family:'Jost';font-size:13px;color:#9a8070;
// //   font-weight:300;padding:12px 0;
// // }

// // /* ADDRESS DETAILS */
// // .pf-address-phone {
// //   font-family:'Jost';font-size:12px;color:#4a3828;font-weight:500;margin-bottom:4px;
// // }
// // .pf-address-line {
// //   font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.6;
// // }

// // /* GRID */
// // .pf-grid {
// //   display:grid;grid-template-columns:1fr 1fr;gap:24px;
// // }
// // @media(max-width:768px){.pf-grid{grid-template-columns:1fr;gap:18px;}}

// // /* CONSULTATIONS — full width */
// // .pf-consult-section { margin-bottom:24px; }

// // @media(max-width:480px){
// //   .pf-stats-row{flex-wrap:wrap;}
// //   .pf-stat-cell{flex:1;min-width:80px;}
// //   .pf-hero-bar{padding:22px 22px;}
// // }
// // `;

// // export function ProfilePage() {
// //   const navigate = useNavigate();
// //   const user = authService.getCurrentUser();

// //   if (!user) { navigate('/login', { replace: true }); return null; }

// //   const handleLogout = () => {
// //     authService.logout();
// //     toast.success('Logged out successfully');
// //     navigate('/login', { replace: true });
// //   };

// //   const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]')
// //     .filter((o: any) => o.userId === user.id);

// //   const consultations = JSON.parse(localStorage.getItem('handloom_consultations') || '[]')
// //     .filter((c: any) => c.userId === user.id);

// //   const formatDate = (dateStr: string, time: string) => {
// //     const d = new Date(dateStr);
// //     return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at ${time}`;
// //   };

// //   const getAdvisorName = (id: string) =>
// //     FASHION_ADVISORS.find(a => a.id === id)?.name || 'Advisor';

// //   return (
// //     <>
// //       <style>{CSS}</style>
// //       <div className="pf-root">
// //         <div className="pf-wrap pf-page-top">

// //           {/* ── Profile Hero ── */}
// //           <div className="pf-hero pf-fadein">

// //             {/* Maroon top bar */}
// //             <div className="pf-hero-bar">
// //               <div className="pf-hero-bar-eyebrow">
// //                 <Sparkles size={13} color="rgba(212,175,55,.75)" />
// //                 <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(255,255,255,.45)' }}>
// //                   Member Profile
// //                 </span>
// //               </div>
// //               <div className="pf-hero-bar-name">{user.name}</div>
// //               <div className="pf-hero-bar-email">{user.email}</div>
// //               {user.phone && (
// //                 <div className="pf-hero-bar-email" style={{ marginTop: 2 }}>{user.phone}</div>
// //               )}
// //             </div>

// //             {/* Bottom row */}
// //             <div className="pf-hero-body">
// //               <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
// //                 <div className="pf-avatar">
// //                   <User size={24} color={C.gold} />
// //                 </div>
// //                 <div className="pf-stats-row">
// //                   {[
// //                     [String(orders.length),        'Orders'],
// //                     [String(consultations.length), 'Sessions'],
// //                     [String(user.addresses.length),'Addresses'],
// //                   ].map(([n, l]) => (
// //                     <div key={l} className="pf-stat-cell">
// //                       <div className="pf-stat-n">{n}</div>
// //                       <div className="pf-stat-l">{l}</div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //               <button className="pf-logout" onClick={handleLogout}>
// //                 <LogOut size={14} /> Logout
// //               </button>
// //             </div>
// //           </div>

// //           {/* ── Video Consultations ── */}
// //           {consultations.length > 0 && (
// //             <div className="pf-consult-section pf-fadeup pf-d1">
// //               <div className="pf-card">
// //                 <div className="pf-card-head">
// //                   <div className="pf-card-icon"><Video size={16} color={C.gold} /></div>
// //                   <h2 className="pf-card-title">Video Consultations</h2>
// //                 </div>
// //                 {consultations.slice(0, 3).map((c: any) => (
// //                   <div key={c.id} className="pf-row">
// //                     <div className="pf-row-head">
// //                       <div>
// //                         <div className="pf-row-name">{getAdvisorName(c.advisorId)}</div>
// //                         <div className="pf-row-sub">{formatDate(c.date, c.time)}</div>
// //                       </div>
// //                       <span className="pf-tag">{c.status}</span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* ── Grid: Addresses + Orders ── */}
// //           <div className="pf-grid pf-fadeup pf-d2">

// //             {/* Addresses */}
// //             <div className="pf-card">
// //               <div className="pf-card-head">
// //                 <div className="pf-card-icon"><MapPin size={16} color={C.gold} /></div>
// //                 <h2 className="pf-card-title">Saved Addresses</h2>
// //               </div>
// //               {user.addresses.length > 0 ? user.addresses.map(addr => (
// //                 <div key={addr.id} className="pf-row">
// //                   <div className="pf-row-name">{addr.name}</div>
// //                   <div className="pf-address-phone">{addr.phone}</div>
// //                   <div className="pf-address-line">
// //                     {addr.addressLine1}
// //                     {addr.addressLine2 && `, ${addr.addressLine2}`}
// //                   </div>
// //                   <div className="pf-address-line">
// //                     {addr.city}, {addr.state} – {addr.pincode}
// //                   </div>
// //                 </div>
// //               )) : (
// //                 <p className="pf-empty">No saved addresses</p>
// //               )}
// //             </div>

// //             {/* Orders */}
// //             <div className="pf-card">
// //               <div className="pf-card-head">
// //                 <div className="pf-card-icon"><Package size={16} color={C.gold} /></div>
// //                 <h2 className="pf-card-title">Recent Orders</h2>
// //               </div>
// //               {orders.length > 0 ? orders.slice(0, 3).map((o: any) => (
// //                 <div key={o.id} className="pf-row">
// //                   <div className="pf-row-head">
// //                     <div>
// //                       <div className="pf-row-name" style={{ fontSize: 15 }}>Order #{o.id.slice(-8)}</div>
// //                       <div className="pf-row-sub">
// //                         {o.items.length} item{o.items.length !== 1 ? 's' : ''} · ₹{o.finalTotal.toLocaleString('en-IN')}
// //                       </div>
// //                     </div>
// //                     <span className="pf-tag">{o.status}</span>
// //                   </div>
// //                 </div>
// //               )) : (
// //                 <p className="pf-empty">No orders yet</p>
// //               )}
// //             </div>

// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }


// //below code is updaated code
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '@/lib/auth';
// import { User, MapPin, Package, LogOut, Video, Sparkles, Plus, X } from 'lucide-react';
// import { toast } from 'sonner';
// import { FASHION_ADVISORS } from '@/constants/advisors';

// const C = {
//   maroon: '#800020',
//   maroonDk: '#5a0016',
//   gold: '#C4980A',
//   goldV: '#D4AF37',
//   cream: '#F5E6D3',
//   creamLt: '#FFF9F0',
//   warmGrey: '#4a3828',
//   indigo: '#4B0082',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

// .pf-root {
//   font-family:'Jost',sans-serif;
//   background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
//   min-height:100vh;color:#1a1010;line-height:1;
// }
// .pf-wrap {
//   max-width:1100px;margin:0 auto;padding:0 56px;
// }
// @media(max-width:900px){.pf-wrap{padding:0 24px;}}
// @media(max-width:480px){.pf-wrap{padding:0 16px;}}

// .pf-ey {
//   font-family:'Jost';font-size:11px;letter-spacing:.25em;
//   text-transform:uppercase;color:#C4980A;font-weight:600;
// }

// .pf-page-top{padding-top:140px;padding-bottom:80px;}
// @media(max-width:640px){.pf-page-top{padding-top:110px;padding-bottom:60px;}}

// @keyframes pfFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
// @keyframes pfFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
// @keyframes pfBlink   {0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 0 20px 3px rgba(212,175,55,.25)}}

// .pf-fadein {animation:pfFadeIn  .8s cubic-bezier(.4,0,.2,1) both;}
// .pf-fadeup {animation:pfFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
// .pf-d1{animation-delay:.1s} .pf-d2{animation-delay:.2s} .pf-d3{animation-delay:.3s}

// .pf-hero {
//   background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
//   border:1px solid rgba(196,152,10,.25);border-radius:28px;
//   overflow:hidden;margin-bottom:28px;
//   box-shadow:0 16px 60px rgba(0,0,0,.08);
// }
// .pf-hero-bar {
//   background:linear-gradient(135deg,#800020 0%,#5a0016 55%,#4B0082 100%);
//   padding:28px 36px;position:relative;overflow:hidden;
// }
// .pf-hero-bar::after {
//   content:'';position:absolute;top:-60px;right:-60px;
//   width:200px;height:200px;border-radius:50%;
//   border:1px solid rgba(212,175,55,.14);pointer-events:none;
// }
// .pf-hero-bar::before {
//   content:'';position:absolute;top:-100px;right:-100px;
//   width:320px;height:320px;border-radius:50%;
//   border:1px solid rgba(212,175,55,.07);pointer-events:none;
// }
// .pf-hero-bar-eyebrow {
//   display:flex;align-items:center;gap:8px;margin-bottom:10px;position:relative;z-index:1;
// }
// .pf-hero-bar-name {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(24px,4vw,36px);font-weight:400;color:white;
//   position:relative;z-index:1;margin-bottom:5px;
// }
// .pf-hero-bar-email {
//   font-family:'Jost';font-size:13px;color:rgba(255,255,255,.55);
//   font-weight:300;position:relative;z-index:1;
// }

// .pf-hero-body {
//   padding:22px 36px;
//   display:flex;align-items:center;justify-content:space-between;
//   gap:16px;flex-wrap:wrap;
// }
// @media(max-width:600px){.pf-hero-body{padding:18px 22px;}}

// .pf-avatar {
//   width:56px;height:56px;border-radius:50%;
//   background:rgba(196,152,10,.12);border:1.5px solid rgba(196,152,10,.3);
//   display:flex;align-items:center;justify-content:center;
//   animation:pfBlink 3s ease infinite;
// }
// .pf-stats-row { display:flex;gap:0; }
// .pf-stat-cell {
//   padding:8px 20px;text-align:center;
//   border-right:1px solid rgba(196,152,10,.2);
// }
// .pf-stat-cell:first-child{border-left:1px solid rgba(196,152,10,.2);}
// .pf-stat-n {
//   font-family:'Cormorant Garamond',serif;
//   font-size:22px;font-weight:500;color:#800020;line-height:1;
// }
// .pf-stat-l {
//   font-family:'Jost';font-size:10px;letter-spacing:.1em;
//   text-transform:uppercase;color:#9a8070;margin-top:3px;font-weight:500;
// }

// .pf-logout {
//   display:flex;align-items:center;gap:8px;
//   padding:10px 22px;border-radius:100px;
//   border:1.5px solid rgba(200,50,50,.3);
//   background:transparent;color:#c0392b;
//   font-family:'Jost';font-size:12px;letter-spacing:.1em;
//   text-transform:uppercase;font-weight:500;cursor:pointer;
//   transition:background .25s,color .25s,transform .2s;
// }
// .pf-logout:hover{background:#c0392b;color:white;transform:scale(1.03);}

// .pf-card {
//   background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
//   border:1px solid rgba(196,152,10,.22);border-radius:24px;
//   padding:30px 32px;
//   box-shadow:0 8px 36px rgba(0,0,0,.06);
// }
// @media(max-width:600px){.pf-card{padding:22px 18px;border-radius:18px;}}

// .pf-card-head {
//   display:flex;align-items:center;justify-content:space-between;gap:12px;
//   padding-bottom:18px;margin-bottom:20px;
//   border-bottom:1px solid rgba(196,152,10,.18);
// }
// .pf-card-head-left {
//   display:flex;align-items:center;gap:12px;
// }
// .pf-card-icon {
//   width:36px;height:36px;border-radius:50%;flex-shrink:0;
//   background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
//   display:flex;align-items:center;justify-content:center;
// }
// .pf-card-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:20px;font-weight:500;color:#800020;
// }

// .pf-row {
//   background:rgba(255,249,240,.7);
//   border:1px solid rgba(196,152,10,.2);border-radius:16px;
//   padding:16px 18px;margin-bottom:10px;
//   transition:box-shadow .25s,border-color .25s;
// }
// .pf-row:last-child{margin-bottom:0;}
// .pf-row:hover{box-shadow:0 6px 22px rgba(128,0,32,.09);border-color:rgba(196,152,10,.4);}

// .pf-row-head {
//   display:flex;align-items:flex-start;justify-content:space-between;
//   gap:10px;flex-wrap:wrap;
// }
// .pf-row-name {
//   font-family:'Cormorant Garamond',serif;
//   font-size:17px;font-weight:500;color:#800020;margin-bottom:4px;
// }
// .pf-row-sub {
//   font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.55;
// }
// .pf-tag {
//   display:inline-block;padding:4px 12px;border-radius:100px;
//   background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
//   font-family:'Jost';font-size:10px;letter-spacing:.08em;
//   text-transform:uppercase;color:#800020;font-weight:500;white-space:nowrap;
// }

// .pf-empty {
//   font-family:'Jost';font-size:13px;color:#9a8070;
//   font-weight:300;padding:12px 0;
// }

// .pf-address-phone {
//   font-family:'Jost';font-size:12px;color:#4a3828;font-weight:500;margin-bottom:4px;
// }
// .pf-address-line {
//   font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.6;
// }

// .pf-grid {
//   display:grid;grid-template-columns:1fr 1fr;gap:24px;
// }
// @media(max-width:768px){.pf-grid{grid-template-columns:1fr;gap:18px;}}

// .pf-consult-section { margin-bottom:24px; }

// .pf-add-btn {
//   display:inline-flex;align-items:center;gap:8px;
//   padding:10px 18px;border:none;border-radius:100px;
//   background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
//   color:#800020;
//   font-family:'Jost';font-size:11px;letter-spacing:.1em;
//   text-transform:uppercase;font-weight:600;cursor:pointer;
//   box-shadow:0 6px 24px rgba(212,175,55,.28);
// }

// .pf-form {
//   margin-bottom:16px;
//   background:rgba(196,152,10,.06);
//   border:1px solid rgba(196,152,10,.2);
//   border-radius:18px;
//   padding:18px;
// }
// .pf-form-grid {
//   display:grid;
//   grid-template-columns:1fr 1fr;
//   gap:12px;
// }
// @media(max-width:640px){.pf-form-grid{grid-template-columns:1fr;}}

// .pf-field-full { grid-column:1 / -1; }

// .pf-label {
//   display:block;
//   font-family:'Jost';
//   font-size:11px;
//   letter-spacing:.08em;
//   text-transform:uppercase;
//   color:#800020;
//   font-weight:600;
//   margin-bottom:6px;
// }
// .pf-input {
//   width:100%;
//   border:1px solid rgba(196,152,10,.25);
//   background:white;
//   border-radius:12px;
//   padding:12px 14px;
//   font-family:'Jost';
//   font-size:13px;
//   color:#4a3828;
//   outline:none;
// }
// .pf-input:focus {
//   border-color:#C4980A;
//   box-shadow:0 0 0 3px rgba(196,152,10,.12);
// }

// .pf-form-actions {
//   display:flex;
//   gap:10px;
//   margin-top:14px;
//   flex-wrap:wrap;
// }
// .pf-save-btn {
//   display:inline-flex;align-items:center;justify-content:center;
//   padding:12px 22px;border:none;border-radius:100px;
//   background:linear-gradient(135deg,#800020 0%,#4B0082 100%);
//   color:white;font-family:'Jost';font-size:12px;letter-spacing:.08em;
//   text-transform:uppercase;font-weight:600;cursor:pointer;
// }
// .pf-cancel-btn {
//   display:inline-flex;align-items:center;justify-content:center;
//   padding:12px 22px;border:1.5px solid rgba(128,0,32,.25);border-radius:100px;
//   background:transparent;color:#800020;font-family:'Jost';font-size:12px;
//   letter-spacing:.08em;text-transform:uppercase;font-weight:600;cursor:pointer;
// }

// .pf-remove-address-btn {
//   display:inline-flex;align-items:center;gap:6px;
//   margin-top:12px;
//   padding:8px 14px;border-radius:100px;
//   border:1px solid rgba(200,50,50,.25);
//   background:transparent;color:#c0392b;
//   font-family:'Jost';font-size:11px;font-weight:600;cursor:pointer;
// }

// @media(max-width:480px){
//   .pf-stats-row{flex-wrap:wrap;}
//   .pf-stat-cell{flex:1;min-width:80px;}
//   .pf-hero-bar{padding:22px 22px;}
// }
// `;

// type AddressFormState = {
//   name: string;
//   phone: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   pincode: string;
// };

// const initialForm: AddressFormState = {
//   name: '',
//   phone: '',
//   addressLine1: '',
//   addressLine2: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// export function ProfilePage() {
//   const navigate = useNavigate();
//   const currentUser = authService.getCurrentUser();

//   const [user, setUser] = useState(currentUser);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [addressForm, setAddressForm] = useState<AddressFormState>(initialForm);

//   useEffect(() => {
//     const refreshedUser = authService.getCurrentUser();
//     setUser(refreshedUser);
//   }, []);

//   if (!user) {
//     navigate('/login', { replace: true });
//     return null;
//   }

//   const handleLogout = () => {
//     authService.logout();
//     toast.success('Logged out successfully');
//     navigate('/login', { replace: true });
//   };

//   const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]')
//     .filter((o: any) => o.userId === user.id);

//   const consultations = JSON.parse(localStorage.getItem('handloom_consultations') || '[]')
//     .filter((c: any) => c.userId === user.id);

//   const formatDate = (dateStr: string, time: string) => {
//     const d = new Date(dateStr);
//     return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at ${time}`;
//   };

//   const getAdvisorName = (id: string) =>
//     FASHION_ADVISORS.find(a => a.id === id)?.name || 'Advisor';

//   const handleInputChange = (field: keyof AddressFormState, value: string) => {
//     setAddressForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//  const handleSaveAddress = () => {
//   if (
//     !addressForm.name.trim() ||
//     !addressForm.phone.trim() ||
//     !addressForm.addressLine1.trim() ||
//     !addressForm.city.trim() ||
//     !addressForm.state.trim() ||
//     !addressForm.pincode.trim()
//   ) {
//     toast.error('Please fill all required address fields');
//     return;
//   }

//   const updatedUser = {
//     ...user,
//     addresses: [
//       ...(user.addresses || []),
//       {
//         id: `addr_${Date.now()}`,
//         name: addressForm.name.trim(),
//         phone: addressForm.phone.trim(),
//         addressLine1: addressForm.addressLine1.trim(),
//         addressLine2: addressForm.addressLine2.trim(),
//         city: addressForm.city.trim(),
//         state: addressForm.state.trim(),
//         pincode: addressForm.pincode.trim(),
//         isDefault: (user.addresses?.length || 0) === 0,
//       },
//     ],
//   };

//   localStorage.setItem('handloom_user', JSON.stringify(updatedUser));
//   setUser(updatedUser);
//   setAddressForm(initialForm);
//   setShowAddressForm(false);
//   toast.success('Address added successfully');
// };

//   const handleRemoveAddress = (addressId: string) => {
//     const updatedUser = {
//       ...user,
//       addresses: (user.addresses || []).filter((addr: any) => addr.id !== addressId),
//     };

//     localStorage.setItem('handloom_user', JSON.stringify(updatedUser));
//     setUser(updatedUser);
//     toast.success('Address removed successfully');
//   };

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="pf-root">
//         <div className="pf-wrap pf-page-top">
//           <div className="pf-hero pf-fadein">
//             <div className="pf-hero-bar">
//               <div className="pf-hero-bar-eyebrow">
//                 <Sparkles size={13} color="rgba(212,175,55,.75)" />
//                 <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(255,255,255,.45)' }}>
//                   Member Profile
//                 </span>
//               </div>
//               <div className="pf-hero-bar-name">{user.name}</div>
//               <div className="pf-hero-bar-email">{user.email}</div>
//               {user.phone && (
//                 <div className="pf-hero-bar-email" style={{ marginTop: 2 }}>{user.phone}</div>
//               )}
//             </div>

//             <div className="pf-hero-body">
//               <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
//                 <div className="pf-avatar">
//                   <User size={24} color={C.gold} />
//                 </div>
//                 <div className="pf-stats-row">
//                   {[
//                     [String(orders.length), 'Orders'],
//                     [String(consultations.length), 'Sessions'],
//                     [String(user.addresses?.length || 0), 'Addresses'],
//                   ].map(([n, l]) => (
//                     <div key={l} className="pf-stat-cell">
//                       <div className="pf-stat-n">{n}</div>
//                       <div className="pf-stat-l">{l}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <button className="pf-logout" onClick={handleLogout}>
//                 <LogOut size={14} /> Logout
//               </button>
//             </div>
//           </div>

//           {consultations.length > 0 && (
//             <div className="pf-consult-section pf-fadeup pf-d1">
//               <div className="pf-card">
//                 <div className="pf-card-head">
//                   <div className="pf-card-head-left">
//                     <div className="pf-card-icon"><Video size={16} color={C.gold} /></div>
//                     <h2 className="pf-card-title">Video Consultations</h2>
//                   </div>
//                 </div>

//                 {consultations.slice(0, 3).map((c: any) => (
//                   <div key={c.id} className="pf-row">
//                     <div className="pf-row-head">
//                       <div>
//                         <div className="pf-row-name">{getAdvisorName(c.advisorId)}</div>
//                         <div className="pf-row-sub">{formatDate(c.date, c.time)}</div>
//                       </div>
//                       <span className="pf-tag">{c.status}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="pf-grid pf-fadeup pf-d2">
//             <div className="pf-card">
//               <div className="pf-card-head">
//                 <div className="pf-card-head-left">
//                   <div className="pf-card-icon"><MapPin size={16} color={C.gold} /></div>
//                   <h2 className="pf-card-title">Saved Addresses</h2>
//                 </div>

//                 <button
//                   className="pf-add-btn"
//                   onClick={() => setShowAddressForm(true)}
//                   type="button"
//                 >
//                   <Plus size={14} /> Add Address
//                 </button>
//               </div>

//               {showAddressForm && (
//                 <div className="pf-form">
//                   <div className="pf-form-grid">
//                     <div>
//                       <label className="pf-label">Full Name</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.name}
//                         onChange={(e) => handleInputChange('name', e.target.value)}
//                         placeholder="Enter full name"
//                       />
//                     </div>

//                     <div>
//                       <label className="pf-label">Phone</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.phone}
//                         onChange={(e) => handleInputChange('phone', e.target.value)}
//                         placeholder="Enter phone number"
//                       />
//                     </div>

//                     <div className="pf-field-full">
//                       <label className="pf-label">Address Line 1</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.addressLine1}
//                         onChange={(e) => handleInputChange('addressLine1', e.target.value)}
//                         placeholder="House no, street, area"
//                       />
//                     </div>

//                     <div className="pf-field-full">
//                       <label className="pf-label">Address Line 2</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.addressLine2}
//                         onChange={(e) => handleInputChange('addressLine2', e.target.value)}
//                         placeholder="Landmark, optional"
//                       />
//                     </div>

//                     <div>
//                       <label className="pf-label">City</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.city}
//                         onChange={(e) => handleInputChange('city', e.target.value)}
//                         placeholder="Enter city"
//                       />
//                     </div>

//                     <div>
//                       <label className="pf-label">State</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.state}
//                         onChange={(e) => handleInputChange('state', e.target.value)}
//                         placeholder="Enter state"
//                       />
//                     </div>

//                     <div>
//                       <label className="pf-label">Pincode</label>
//                       <input
//                         className="pf-input"
//                         value={addressForm.pincode}
//                         onChange={(e) => handleInputChange('pincode', e.target.value)}
//                         placeholder="Enter pincode"
//                       />
//                     </div>
//                   </div>

//                   <div className="pf-form-actions">
//                     <button type="button" className="pf-save-btn" onClick={handleSaveAddress}>
//                       Save Address
//                     </button>
//                     <button
//                       type="button"
//                       className="pf-cancel-btn"
//                       onClick={() => {
//                         setShowAddressForm(false);
//                         setAddressForm(initialForm);
//                       }}
//                     >
//                       <X size={14} style={{ marginRight: 6 }} />
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {user.addresses && user.addresses.length > 0 ? (
//                 user.addresses.map((addr: any) => (
//                   <div key={addr.id} className="pf-row">
//                     <div className="pf-row-name">{addr.name}</div>
//                     <div className="pf-address-phone">{addr.phone}</div>
//                     <div className="pf-address-line">
//                       {addr.addressLine1}
//                       {addr.addressLine2 && `, ${addr.addressLine2}`}
//                     </div>
//                     <div className="pf-address-line">
//                       {addr.city}, {addr.state} – {addr.pincode}
//                     </div>

//                     <button
//                       type="button"
//                       className="pf-remove-address-btn"
//                       onClick={() => handleRemoveAddress(addr.id)}
//                     >
//                       Remove Address
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="pf-empty">No saved addresses</p>
//               )}
//             </div>

//             <div className="pf-card">
//               <div className="pf-card-head">
//                 <div className="pf-card-head-left">
//                   <div className="pf-card-icon"><Package size={16} color={C.gold} /></div>
//                   <h2 className="pf-card-title">Recent Orders</h2>
//                 </div>
//               </div>

//               {orders.length > 0 ? (
//                 orders.slice(0, 3).map((o: any) => (
//                   <div key={o.id} className="pf-row">
//                     <div className="pf-row-head">
//                       <div>
//                         <div className="pf-row-name" style={{ fontSize: 15 }}>
//                           Order #{o.id.slice(-8)}
//                         </div>
//                         <div className="pf-row-sub">
//                           {o.items.length} item{o.items.length !== 1 ? 's' : ''} · ₹{o.finalTotal.toLocaleString('en-IN')}
//                         </div>
//                       </div>
//                       <span className="pf-tag">{o.status}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="pf-empty">No orders yet</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { authService } from '@/lib/auth';
import { User, MapPin, Package, LogOut, Video, Sparkles, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useVideoBooking } from "@/hooks/useVideoBooking";

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

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.pf-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.pf-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width:900px){ .pf-wrap { padding: 0 24px; } }
@media(max-width:480px){ .pf-wrap { padding: 0 16px; } }

.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}

.gd { width: 44px; height: 1px; background: #C4980A; margin: 0 auto; }

.pf-page-top { padding-top: 140px; padding-bottom: 80px; }
@media(max-width:640px){ .pf-page-top { padding-top: 110px; padding-bottom: 60px; } }

@keyframes pfFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes pfFadeIn  { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes pfBlink   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 20px 3px rgba(212,175,55,.25)} }

.pf-fadein { animation: pfFadeIn  .8s cubic-bezier(.4,0,.2,1) both; }
.pf-fadeup { animation: pfFadeUp  .8s cubic-bezier(.4,0,.2,1) both; }
.pf-d1{animation-delay:.1s} .pf-d2{animation-delay:.2s} .pf-d3{animation-delay:.3s}

.pf-hero {
  background: rgba(255,249,240,.97); backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25); border-radius: 28px;
  overflow: hidden; margin-bottom: 28px;
  box-shadow: 0 16px 60px rgba(0,0,0,.08);
}
.pf-hero-bar {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #1B2A6B 100%);
  padding: 28px 36px; position: relative; overflow: hidden;
}
.pf-hero-bar::after {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 200px; height: 200px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.14); pointer-events: none;
}
.pf-hero-bar-eyebrow {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px; position: relative; z-index: 1;
}
.pf-hero-bar-name {
  font-family: 'Cinzel', serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 400;
  color: white;
  letter-spacing: 0.04em;
  position: relative; z-index: 1; margin-bottom: 5px;
}
.pf-hero-bar-email {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: rgba(255,255,255,.55);
  font-weight: 300;
  position: relative; z-index: 1;
}
.pf-hero-body {
  padding: 22px 36px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
@media(max-width:600px){ .pf-hero-body { padding: 18px 22px; } }

.pf-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(196,152,10,.12); border: 1.5px solid rgba(196,152,10,.3);
  display: flex; align-items: center; justify-content: center;
  animation: pfBlink 3s ease infinite;
}
.pf-stats-row { display: flex; gap: 0; }
.pf-stat-cell {
  padding: 8px 20px; text-align: center;
  border-right: 1px solid rgba(196,152,10,.2);
}
.pf-stat-cell:first-child { border-left: 1px solid rgba(196,152,10,.2); }
.pf-stat-n {
  font-family: 'Cinzel', serif;
  font-size: 22px; font-weight: 500; color: #800020; line-height: 1;
  letter-spacing: 0.02em;
}
.pf-stat-l {
  font-family: 'Josefin Sans';
  font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; color: #9a8070; margin-top: 3px; font-weight: 500;
}
.pf-logout {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: 100px;
  border: 1.5px solid rgba(200,50,50,.3);
  background: transparent; color: #c0392b;
  font-family: 'Josefin Sans';
  font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 500; cursor: pointer;
  transition: background .25s, color .25s, transform .2s;
}
.pf-logout:hover { background: #c0392b; color: white; transform: scale(1.03); }

.pf-card {
  background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22); border-radius: 24px;
  padding: 30px 32px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}
@media(max-width:600px){ .pf-card { padding: 22px 18px; border-radius: 18px; } }

.pf-card-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding-bottom: 18px; margin-bottom: 20px;
  border-bottom: 1px solid rgba(196,152,10,.18);
}
.pf-card-head-left {
  display: flex; align-items: center; gap: 12px;
}
.pf-card-icon {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: rgba(196,152,10,.1); border: 1px solid rgba(196,152,10,.3);
  display: flex; align-items: center; justify-content: center;
}
.pf-card-title {
  font-family: 'Cinzel', serif;
  font-size: 20px; font-weight: 500; color: #800020;
  letter-spacing: 0.02em;
}

.pf-row {
  background: rgba(255,249,240,.7);
  border: 1px solid rgba(196,152,10,.2); border-radius: 16px;
  padding: 16px 18px; margin-bottom: 10px;
  transition: box-shadow .25s, border-color .25s;
}
.pf-row:last-child { margin-bottom: 0; }
.pf-row:hover { box-shadow: 0 6px 22px rgba(128,0,32,.09); border-color: rgba(196,152,10,.4); }
.pf-row-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 10px; flex-wrap: wrap;
}
.pf-row-name {
  font-family: 'Cinzel', serif;
  font-size: 17px; font-weight: 500; color: #800020; margin-bottom: 4px;
  letter-spacing: 0.02em;
}
.pf-row-sub {
  font-family: 'Josefin Sans';
  font-size: 12px; color: #9a8070; font-weight: 300; line-height: 1.55;
}
.pf-tag {
  display: inline-block; padding: 4px 12px; border-radius: 100px;
  background: rgba(196,152,10,.1); border: 1px solid rgba(196,152,10,.3);
  font-family: 'Josefin Sans';
  font-size: 10px; letter-spacing: .08em;
  text-transform: uppercase; color: #800020; font-weight: 500; white-space: nowrap;
}

.pf-empty {
  font-family: 'Josefin Sans';
  font-size: 13px; color: #9a8070;
  font-weight: 300; padding: 12px 0;
}

.pf-address-phone {
  font-family: 'Josefin Sans';
  font-size: 12px; color: #4a3828; font-weight: 500; margin-bottom: 4px;
}
.pf-address-line {
  font-family: 'Josefin Sans';
  font-size: 12px; color: #9a8070; font-weight: 300; line-height: 1.6;
}

.pf-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
}
@media(max-width:768px){ .pf-grid { grid-template-columns: 1fr; gap: 18px; } }

.pf-consult-section { margin-bottom: 24px; }

.pf-add-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border: none; border-radius: 100px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Josefin Sans';
  font-size: 11px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 600; cursor: pointer;
  box-shadow: 0 6px 24px rgba(212,175,55,.28);
  transition: transform .3s, box-shadow .3s;
}
.pf-add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(212,175,55,.4); }

.pf-form {
  margin-bottom: 16px;
  background: rgba(196,152,10,.06);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 18px;
  padding: 18px;
}
.pf-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media(max-width:640px){ .pf-form-grid { grid-template-columns: 1fr; } }
.pf-field-full { grid-column: 1 / -1; }

.pf-label {
  display: block;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #800020;
  font-weight: 600;
  margin-bottom: 6px;
}
.pf-input {
  width: 100%;
  border: 1px solid rgba(196,152,10,.25);
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
  outline: none;
}
.pf-input:focus {
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.12);
}

.pf-form-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.pf-save-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 22px; border: none; border-radius: 100px;
  background: linear-gradient(135deg, #800020 0%, #1B2A6B 100%);
  color: white;
  font-family: 'Josefin Sans';
  font-size: 12px; letter-spacing: .08em;
  text-transform: uppercase; font-weight: 600; cursor: pointer;
  transition: transform .3s, box-shadow .3s;
}
.pf-save-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(128,0,32,.3); }
.pf-cancel-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 22px; border: 1.5px solid rgba(128,0,32,.25); border-radius: 100px;
  background: transparent; color: #800020;
  font-family: 'Josefin Sans';
  font-size: 12px; letter-spacing: .08em;
  text-transform: uppercase; font-weight: 600; cursor: pointer;
  transition: border-color .2s, color .2s;
}
.pf-cancel-btn:hover { border-color: #800020; color: #C4980A; }

.pf-remove-address-btn {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 12px;
  padding: 8px 14px; border-radius: 100px;
  border: 1px solid rgba(200,50,50,.25);
  background: transparent; color: #c0392b;
  font-family: 'Josefin Sans';
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: background .2s, color .2s;
}
.pf-remove-address-btn:hover { background: rgba(192,57,43,.1); border-color: #c0392b; }

@media(max-width:480px){
  .pf-stats-row { flex-wrap: wrap; }
  .pf-stat-cell { flex: 1; min-width: 80px; }
  .pf-hero-bar { padding: 22px 22px; }
}
`;

type AddressFormState = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

type UserOrder = {
  id: string;
  order_number?: string;
  total_amount?: number;
  total?: number;
  finalTotal?: number;
  payment_status?: string;
  order_status?: string;
  status?: string;
  created_at?: string;
  items?: Array<{
    id?: string;
    quantity?: number;
  }>;
};

const initialForm: AddressFormState = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

export function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [user, setUser] = useState(currentUser);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormState>(initialForm);
  const { bookings, loading: bookingsLoading } = useVideoBooking();

  useEffect(() => {
    const refreshedUser = authService.getCurrentUser();
    setUser(refreshedUser);
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError('');

        const res = await api.get('/orders/user');
        console.log('USER ORDERS RESPONSE:', res.data);

        let items: UserOrder[] = [];

        if (Array.isArray(res.data)) {
          items = res.data;
        } else if (Array.isArray(res.data?.data)) {
          items = res.data.data;
        } else if (Array.isArray(res.data?.data?.items)) {
          items = res.data.data.items;
        } else if (Array.isArray(res.data?.orders)) {
          items = res.data.orders;
        } else if (Array.isArray(res.data?.items)) {
          items = res.data.items;
        }

        const realOrders = items.filter((order) => {
          const payment = (order.payment_status || '').toLowerCase();
          const status = (order.order_status || order.status || '').toLowerCase();
          return payment === 'paid' || status === 'confirmed';
        });

        setOrders(realOrders);
      } catch (err: any) {
        console.error('Failed to fetch user orders:', err);
        setOrdersError(err?.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const handleInputChange = (field: keyof AddressFormState, value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.addressLine1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pincode.trim()
    ) {
      toast.error('Please fill all required address fields');
      return;
    }

    const updatedUser = {
      ...user,
      addresses: [
        ...(user.addresses || []),
        {
          id: `addr_${Date.now()}`,
          name: addressForm.name.trim(),
          phone: addressForm.phone.trim(),
          addressLine1: addressForm.addressLine1.trim(),
          addressLine2: addressForm.addressLine2.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          pincode: addressForm.pincode.trim(),
          isDefault: (user.addresses?.length || 0) === 0,
        },
      ],
    };

    localStorage.setItem('handloom_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setAddressForm(initialForm);
    setShowAddressForm(false);
    toast.success('Address added successfully');
  };

  const handleRemoveAddress = (addressId: string) => {
    const updatedUser = {
      ...user,
      addresses: (user.addresses || []).filter((addr: any) => addr.id !== addressId),
    };

    localStorage.setItem('handloom_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success('Address removed successfully');
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-root">
        <div className="pf-wrap pf-page-top">
          <div className="pf-hero pf-fadein">
            <div className="pf-hero-bar">
              <div className="pf-hero-bar-eyebrow">
                <Sparkles size={13} color="rgba(212,175,55,.75)" />
                <span className="ey">Member Profile</span>
              </div>
              <div className="pf-hero-bar-name">{user.name}</div>
              <div className="pf-hero-bar-email">{user.email}</div>
              {user.phone && (
                <div className="pf-hero-bar-email" style={{ marginTop: 2 }}>{user.phone}</div>
              )}
            </div>

            <div className="pf-hero-body">
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div className="pf-avatar">
                  <User size={24} color={C.gold} />
                </div>
                <div className="pf-stats-row">
                  {[
                    [String(orders.length), 'Orders'],
                    [String(bookings.length), 'Sessions'],
                    [String(user.addresses?.length || 0), 'Addresses'],
                  ].map(([n, l]) => (
                    <div key={l} className="pf-stat-cell">
                      <div className="pf-stat-n">{n}</div>
                      <div className="pf-stat-l">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="pf-logout" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          <div className="pf-consult-section pf-fadeup pf-d1">
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><Video size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Video Consultations</h2>
                </div>
              </div>

              {bookingsLoading ? (
                <p className="pf-empty">Loading consultations...</p>
              ) : bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="pf-row">
                    <div className="pf-row-head">
                      <div>
                        <div className="pf-row-name">{booking.occasion || 'General Consultation'}</div>
                        <div className="pf-row-sub">
                          {new Date(booking.preferred_date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                        {booking.notes && (
                          <div className="pf-row-sub" style={{ marginTop: 6 }}>
                            {booking.notes}
                          </div>
                        )}
                      </div>
                      <span className="pf-tag">{booking.status || 'pending'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pf-empty">No consultations yet</p>
              )}
            </div>
          </div>

          <div className="pf-grid pf-fadeup pf-d2">
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><MapPin size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Saved Addresses</h2>
                </div>

                <button
                  className="pf-add-btn"
                  onClick={() => setShowAddressForm(true)}
                  type="button"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {showAddressForm && (
                <div className="pf-form">
                  <div className="pf-form-grid">
                    <div>
                      <label className="pf-label">Full Name</label>
                      <input
                        className="pf-input"
                        value={addressForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="pf-label">Phone</label>
                      <input
                        className="pf-input"
                        value={addressForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="pf-field-full">
                      <label className="pf-label">Address Line 1</label>
                      <input
                        className="pf-input"
                        value={addressForm.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        placeholder="House no, street, area"
                      />
                    </div>

                    <div className="pf-field-full">
                      <label className="pf-label">Address Line 2</label>
                      <input
                        className="pf-input"
                        value={addressForm.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        placeholder="Landmark, optional"
                      />
                    </div>

                    <div>
                      <label className="pf-label">City</label>
                      <input
                        className="pf-input"
                        value={addressForm.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="pf-label">State</label>
                      <input
                        className="pf-input"
                        value={addressForm.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="pf-label">Pincode</label>
                      <input
                        className="pf-input"
                        value={addressForm.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  <div className="pf-form-actions">
                    <button type="button" className="pf-save-btn" onClick={handleSaveAddress}>
                      Save Address
                    </button>
                    <button
                      type="button"
                      className="pf-cancel-btn"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm(initialForm);
                      }}
                    >
                      <X size={14} style={{ marginRight: 6 }} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr: any) => (
                  <div key={addr.id} className="pf-row">
                    <div className="pf-row-name">{addr.name}</div>
                    <div className="pf-address-phone">{addr.phone}</div>
                    <div className="pf-address-line">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </div>
                    <div className="pf-address-line">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </div>

                    <button
                      type="button"
                      className="pf-remove-address-btn"
                      onClick={() => handleRemoveAddress(addr.id)}
                    >
                      Remove Address
                    </button>
                  </div>
                ))
              ) : (
                <p className="pf-empty">No saved addresses</p>
              )}
            </div>

            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><Package size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Recent Orders</h2>
                </div>
              </div>

              {ordersLoading ? (
                <p className="pf-empty">Loading orders...</p>
              ) : ordersError ? (
                <p className="pf-empty" style={{ color: '#c0392b' }}>{ordersError}</p>
              ) : orders.length > 0 ? (
                orders.slice(0, 3).map((o: UserOrder) => {
                  const itemCount =
                    o.items?.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0) ||
                    o.items?.length ||
                    0;

                  const amount = o.total_amount ?? o.total ?? o.finalTotal ?? 0;
                  const status = o.order_status || o.status || 'confirmed';

                  return (
                    <div key={o.id} className="pf-row">
                      <div className="pf-row-head">
                        <div>
                          <div className="pf-row-name" style={{ fontSize: 15 }}>
                            {o.order_number || `Order #${o.id.slice(-8)}`}
                          </div>
                          <div className="pf-row-sub">
                            {itemCount} item{itemCount !== 1 ? 's' : ''} · ₹{Number(amount).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="pf-tag">{status}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="pf-empty">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
