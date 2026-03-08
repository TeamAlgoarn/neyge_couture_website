import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { User, MapPin, Package, LogOut, Video, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { FASHION_ADVISORS } from '@/constants/advisors';

const C = {
  maroon: '#800020', maroonDk: '#5a0016',
  gold: '#C4980A', goldV: '#D4AF37',
  cream: '#F5E6D3', creamLt: '#FFF9F0',
  warmGrey: '#4a3828', indigo: '#4B0082',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.pf-root {
  font-family:'Jost',sans-serif;
  background:linear-gradient(170deg,#FFF9F0 0%,#F8EEE2 50%,#F5E6D3 100%);
  min-height:100vh;color:#1a1010;line-height:1;
}
.pf-wrap {
  max-width:1100px;margin:0 auto;padding:0 56px;
}
@media(max-width:900px){.pf-wrap{padding:0 24px;}}
@media(max-width:480px){.pf-wrap{padding:0 16px;}}

.pf-ey {
  font-family:'Jost';font-size:11px;letter-spacing:.25em;
  text-transform:uppercase;color:#C4980A;font-weight:600;
}

/* PAGE TOP */
.pf-page-top{padding-top:140px;padding-bottom:80px;}
@media(max-width:640px){.pf-page-top{padding-top:110px;padding-bottom:60px;}}

/* ANIMATIONS */
@keyframes pfFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes pfFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes pfShimmer {0%{left:-80%}100%{left:120%}}
@keyframes pfBlink   {0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 0 20px 3px rgba(212,175,55,.25)}}

.pf-fadein {animation:pfFadeIn  .8s cubic-bezier(.4,0,.2,1) both;}
.pf-fadeup {animation:pfFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
.pf-d1{animation-delay:.1s} .pf-d2{animation-delay:.2s} .pf-d3{animation-delay:.3s}

/* ─── PROFILE HEADER CARD ─── */
.pf-hero {
  background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
  border:1px solid rgba(196,152,10,.25);border-radius:28px;
  overflow:hidden;margin-bottom:28px;
  box-shadow:0 16px 60px rgba(0,0,0,.08);
}
.pf-hero-bar {
  background:linear-gradient(135deg,#800020 0%,#5a0016 55%,#4B0082 100%);
  padding:28px 36px;position:relative;overflow:hidden;
}
.pf-hero-bar::after {
  content:'';position:absolute;top:-60px;right:-60px;
  width:200px;height:200px;border-radius:50%;
  border:1px solid rgba(212,175,55,.14);pointer-events:none;
}
.pf-hero-bar::before {
  content:'';position:absolute;top:-100px;right:-100px;
  width:320px;height:320px;border-radius:50%;
  border:1px solid rgba(212,175,55,.07);pointer-events:none;
}
.pf-hero-bar-eyebrow {
  display:flex;align-items:center;gap:8px;margin-bottom:10px;position:relative;z-index:1;
}
.pf-hero-bar-name {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(24px,4vw,36px);font-weight:400;color:white;
  position:relative;z-index:1;margin-bottom:5px;
}
.pf-hero-bar-email {
  font-family:'Jost';font-size:13px;color:rgba(255,255,255,.55);
  font-weight:300;position:relative;z-index:1;
}

.pf-hero-body {
  padding:22px 36px;
  display:flex;align-items:center;justify-content:space-between;
  gap:16px;flex-wrap:wrap;
}
@media(max-width:600px){.pf-hero-body{padding:18px 22px;}}

.pf-avatar {
  width:56px;height:56px;border-radius:50%;
  background:rgba(196,152,10,.12);border:1.5px solid rgba(196,152,10,.3);
  display:flex;align-items:center;justify-content:center;
  animation:pfBlink 3s ease infinite;
}
.pf-stats-row { display:flex;gap:0; }
.pf-stat-cell {
  padding:8px 20px;text-align:center;
  border-right:1px solid rgba(196,152,10,.2);
}
.pf-stat-cell:first-child{border-left:1px solid rgba(196,152,10,.2);}
.pf-stat-n {
  font-family:'Cormorant Garamond',serif;
  font-size:22px;font-weight:500;color:#800020;line-height:1;
}
.pf-stat-l {
  font-family:'Jost';font-size:10px;letter-spacing:.1em;
  text-transform:uppercase;color:#9a8070;margin-top:3px;font-weight:500;
}

/* LOGOUT BUTTON */
.pf-logout {
  display:flex;align-items:center;gap:8px;
  padding:10px 22px;border-radius:100px;
  border:1.5px solid rgba(200,50,50,.3);
  background:transparent;color:#c0392b;
  font-family:'Jost';font-size:12px;letter-spacing:.1em;
  text-transform:uppercase;font-weight:500;cursor:pointer;
  transition:background .25s,color .25s,transform .2s;
}
.pf-logout:hover{background:#c0392b;color:white;transform:scale(1.03);}

/* ─── SECTION CARDS ─── */
.pf-card {
  background:rgba(255,249,240,.95);backdrop-filter:blur(10px);
  border:1px solid rgba(196,152,10,.22);border-radius:24px;
  padding:30px 32px;
  box-shadow:0 8px 36px rgba(0,0,0,.06);
}
@media(max-width:600px){.pf-card{padding:22px 18px;border-radius:18px;}}

.pf-card-head {
  display:flex;align-items:center;gap:12px;
  padding-bottom:18px;margin-bottom:20px;
  border-bottom:1px solid rgba(196,152,10,.18);
}
.pf-card-icon {
  width:36px;height:36px;border-radius:50%;flex-shrink:0;
  background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
  display:flex;align-items:center;justify-content:center;
}
.pf-card-title {
  font-family:'Cormorant Garamond',serif;
  font-size:20px;font-weight:500;color:#800020;
}

/* CONSULTATION / ADDRESS / ORDER ROWS */
.pf-row {
  background:rgba(255,249,240,.7);
  border:1px solid rgba(196,152,10,.2);border-radius:16px;
  padding:16px 18px;margin-bottom:10px;
  transition:box-shadow .25s,border-color .25s;
}
.pf-row:last-child{margin-bottom:0;}
.pf-row:hover{box-shadow:0 6px 22px rgba(128,0,32,.09);border-color:rgba(196,152,10,.4);}

.pf-row-head {
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:10px;flex-wrap:wrap;
}
.pf-row-name {
  font-family:'Cormorant Garamond',serif;
  font-size:17px;font-weight:500;color:#800020;margin-bottom:4px;
}
.pf-row-sub {
  font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.55;
}
.pf-tag {
  display:inline-block;padding:4px 12px;border-radius:100px;
  background:rgba(196,152,10,.1);border:1px solid rgba(196,152,10,.3);
  font-family:'Jost';font-size:10px;letter-spacing:.08em;
  text-transform:uppercase;color:#800020;font-weight:500;white-space:nowrap;
}

/* Empty state */
.pf-empty {
  font-family:'Jost';font-size:13px;color:#9a8070;
  font-weight:300;padding:12px 0;
}

/* ADDRESS DETAILS */
.pf-address-phone {
  font-family:'Jost';font-size:12px;color:#4a3828;font-weight:500;margin-bottom:4px;
}
.pf-address-line {
  font-family:'Jost';font-size:12px;color:#9a8070;font-weight:300;line-height:1.6;
}

/* GRID */
.pf-grid {
  display:grid;grid-template-columns:1fr 1fr;gap:24px;
}
@media(max-width:768px){.pf-grid{grid-template-columns:1fr;gap:18px;}}

/* CONSULTATIONS — full width */
.pf-consult-section { margin-bottom:24px; }

@media(max-width:480px){
  .pf-stats-row{flex-wrap:wrap;}
  .pf-stat-cell{flex:1;min-width:80px;}
  .pf-hero-bar{padding:22px 22px;}
}
`;

export function ProfilePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) { navigate('/login', { replace: true }); return null; }

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]')
    .filter((o: any) => o.userId === user.id);

  const consultations = JSON.parse(localStorage.getItem('handloom_consultations') || '[]')
    .filter((c: any) => c.userId === user.id);

  const formatDate = (dateStr: string, time: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at ${time}`;
  };

  const getAdvisorName = (id: string) =>
    FASHION_ADVISORS.find(a => a.id === id)?.name || 'Advisor';

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-root">
        <div className="pf-wrap pf-page-top">

          {/* ── Profile Hero ── */}
          <div className="pf-hero pf-fadein">

            {/* Maroon top bar */}
            <div className="pf-hero-bar">
              <div className="pf-hero-bar-eyebrow">
                <Sparkles size={13} color="rgba(212,175,55,.75)" />
                <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(255,255,255,.45)' }}>
                  Member Profile
                </span>
              </div>
              <div className="pf-hero-bar-name">{user.name}</div>
              <div className="pf-hero-bar-email">{user.email}</div>
              {user.phone && (
                <div className="pf-hero-bar-email" style={{ marginTop: 2 }}>{user.phone}</div>
              )}
            </div>

            {/* Bottom row */}
            <div className="pf-hero-body">
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div className="pf-avatar">
                  <User size={24} color={C.gold} />
                </div>
                <div className="pf-stats-row">
                  {[
                    [String(orders.length),        'Orders'],
                    [String(consultations.length), 'Sessions'],
                    [String(user.addresses.length),'Addresses'],
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

          {/* ── Video Consultations ── */}
          {consultations.length > 0 && (
            <div className="pf-consult-section pf-fadeup pf-d1">
              <div className="pf-card">
                <div className="pf-card-head">
                  <div className="pf-card-icon"><Video size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Video Consultations</h2>
                </div>
                {consultations.slice(0, 3).map((c: any) => (
                  <div key={c.id} className="pf-row">
                    <div className="pf-row-head">
                      <div>
                        <div className="pf-row-name">{getAdvisorName(c.advisorId)}</div>
                        <div className="pf-row-sub">{formatDate(c.date, c.time)}</div>
                      </div>
                      <span className="pf-tag">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Grid: Addresses + Orders ── */}
          <div className="pf-grid pf-fadeup pf-d2">

            {/* Addresses */}
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-icon"><MapPin size={16} color={C.gold} /></div>
                <h2 className="pf-card-title">Saved Addresses</h2>
              </div>
              {user.addresses.length > 0 ? user.addresses.map(addr => (
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
                </div>
              )) : (
                <p className="pf-empty">No saved addresses</p>
              )}
            </div>

            {/* Orders */}
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-icon"><Package size={16} color={C.gold} /></div>
                <h2 className="pf-card-title">Recent Orders</h2>
              </div>
              {orders.length > 0 ? orders.slice(0, 3).map((o: any) => (
                <div key={o.id} className="pf-row">
                  <div className="pf-row-head">
                    <div>
                      <div className="pf-row-name" style={{ fontSize: 15 }}>Order #{o.id.slice(-8)}</div>
                      <div className="pf-row-sub">
                        {o.items.length} item{o.items.length !== 1 ? 's' : ''} · ₹{o.finalTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <span className="pf-tag">{o.status}</span>
                  </div>
                </div>
              )) : (
                <p className="pf-empty">No orders yet</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}