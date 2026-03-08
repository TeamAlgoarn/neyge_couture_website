import { Shield, Truck, Award, RefreshCw } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

.tb-root {
  position: relative;
  padding: 80px 0;
  background: linear-gradient(170deg, #F5E6D3 0%, #FFF9F0 50%, #F5E6D3 100%);
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}

/* subtle background lines */
.tb-root::before {
  content: '';
  position: absolute; top: 50%; left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.12), transparent);
  pointer-events: none;
}

.tb-wrap {
  max-width: 1200px; margin: 0 auto;
  padding: 0 56px; position: relative; z-index: 1;
}
@media(max-width:900px){ .tb-wrap { padding: 0 24px; } }
@media(max-width:480px){ .tb-wrap { padding: 0 16px; } }

/* GRID */
.tb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255,249,240,.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 44px rgba(0,0,0,.07);
}
@media(max-width:900px){ .tb-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width:480px){ .tb-grid { grid-template-columns: 1fr; border-radius: 18px; } }

/* CELL */
.tb-cell {
  padding: 36px 28px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  border-right: 1px solid rgba(196,152,10,.2);
  border-bottom: 0;
  position: relative; overflow: hidden;
  transition: background .35s;
  cursor: default;
}
.tb-cell:last-child { border-right: none; }
/* 2-col responsive dividers */
@media(max-width:900px){
  .tb-cell:nth-child(2) { border-right: none; }
  .tb-cell:nth-child(1),
  .tb-cell:nth-child(2) { border-bottom: 1px solid rgba(196,152,10,.2); }
}
@media(max-width:480px){
  .tb-cell { border-right: none !important; border-bottom: 1px solid rgba(196,152,10,.2) !important; }
  .tb-cell:last-child { border-bottom: none !important; }
}
.tb-cell:hover { background: rgba(255,249,240,1); }

/* shimmer sweep on hover */
.tb-cell::after {
  content: '';
  position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.1), transparent);
  transition: left 0s;
}
.tb-cell:hover::after {
  left: 130%;
  transition: left .9s cubic-bezier(.4,0,.2,1);
}

/* ICON */
.tb-icon {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
  transition: transform .35s, box-shadow .35s;
}
.tb-cell:hover .tb-icon { transform: scale(1.12); }

/* gold divider dot row */
.tb-ornament {
  display: flex; align-items: center; gap: 4px; margin-bottom: 10px;
}
.tb-dot {
  width: 4px; height: 4px; border-radius: 50%; background: #C4980A; opacity: .5;
}
.tb-dash { width: 18px; height: 1px; background: #C4980A; opacity: .4; }

/* TEXT */
.tb-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 500; color: #800020;
  margin-bottom: 6px; line-height: 1.1;
}
.tb-desc {
  font-family: 'Jost'; font-size: 12px; font-weight: 300;
  color: #4a3828; line-height: 1.65;
}

@media(max-width:480px){
  .tb-cell { padding: 28px 22px; }
}
`;

const BADGES = [
  {
    Icon: Shield,    title: '100% Authentic',
    desc: 'Certified handloom sarees',
    bg: 'rgba(59,130,246,.1)',   border: 'rgba(59,130,246,.3)',  color: '#2563eb',
  },
  {
    Icon: Truck,     title: 'Free Shipping',
    desc: 'On orders above ₹2,999',
    bg: 'rgba(251,146,60,.1)',   border: 'rgba(251,146,60,.3)',  color: '#ea6d10',
  },
  {
    Icon: Award,     title: 'Quality Assured',
    desc: 'Premium fabric & weaving',
    bg: 'rgba(196,152,10,.12)',  border: 'rgba(196,152,10,.35)', color: '#C4980A',
  },
  {
    Icon: RefreshCw, title: '7-Day Returns',
    desc: 'Easy exchange policy',
    bg: 'rgba(16,185,129,.1)',   border: 'rgba(16,185,129,.3)',  color: '#059669',
  },
];

let _cssInjected = false;
function injectCss() {
  if (_cssInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.setAttribute('data-tb', '1');
  el.textContent = CSS;
  document.head.appendChild(el);
  _cssInjected = true;
}

export function TrustBadges() {
  injectCss();

  return (
    <section className="tb-root">
      <div className="tb-wrap">
        <div className="tb-grid">
          {BADGES.map(({ Icon, title, desc, bg, border, color }) => (
            <div key={title} className="tb-cell">
              <div
                className="tb-icon"
                style={{ background: bg, border: `1px solid ${border}`, boxShadow: `0 4px 18px ${bg}` }}
              >
                <Icon size={22} color={color} />
              </div>
              <div className="tb-ornament">
                <div className="tb-dot" />
                <div className="tb-dash" />
                <div className="tb-dot" />
              </div>
              <h3 className="tb-title">{title}</h3>
              <p className="tb-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}