import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Sparkles, Home } from "lucide-react";

// ─── Brand palette (matches all other pages) ─────────────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.nf-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.nf-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 28px;
  width: 100%;
  max-width: 520px;
  padding: 56px 48px;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0,0,0,.12);
  position: relative;
  overflow: hidden;
}

.nf-card::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px solid rgba(196,152,10,.1);
  pointer-events: none;
}

.nf-icon {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1.5px solid rgba(196,152,10,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.nf-code {
  font-family: 'Cinzel', serif;
  font-size: 80px;
  font-weight: 500;
  color: #800020;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 12px rgba(128,0,32,.15);
}

.nf-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 400;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}

.nf-message {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.7;
  margin-bottom: 32px;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 38px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 100px;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
}

.nf-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: nfShimmer 3s ease infinite;
}

@keyframes nfShimmer { 0%{left:-80%} 100%{left:120%} }

.nf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}

@media(max-width: 500px) {
  .nf-card { padding: 40px 28px; }
  .nf-code { font-size: 60px; }
  .nf-title { font-size: 26px; }
}
`;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style>{CSS}</style>
      <div className="nf-root">
        <div className="nf-card">
          <div className="nf-icon">
            <Sparkles size={36} color={C.goldV} />
          </div>
          <div className="nf-code">404</div>
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-message">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="nf-btn">
            <Home size={16} /> Return Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;