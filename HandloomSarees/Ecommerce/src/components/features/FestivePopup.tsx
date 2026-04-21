import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { getActiveFestivePopup } from '@/api/festiveCollections';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.festive-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  padding: 20px;
  animation: fadeIn 0.3s ease both;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.festive-popup-card {
  position: relative;
  width: 100%;
  max-width: 560px;
  background: rgba(255,249,240,.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.3);
  border-radius: 32px;
  box-shadow: 0 24px 80px rgba(0,0,0,.25);
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) both;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.popup-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s;
  z-index: 10;
}
.popup-close:hover {
  background: rgba(128,0,32,.2);
  border-color: #800020;
  transform: scale(1.05);
}
.popup-close:hover svg {
  color: #800020;
}
.popup-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-bottom: 1px solid rgba(196,152,10,.2);
}
.popup-content {
  padding: 32px 32px 40px;
  text-align: center;
}
.popup-ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(196,152,10,.1);
  border: 1px solid rgba(196,152,10,.3);
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}
.popup-title {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  font-weight: 500;
  color: #800020;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}
.popup-message {
  font-family: 'Josefin Sans';
  font-size: 15px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.8;
  margin-bottom: 28px;
}
.popup-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
}
.popup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}
@media (max-width: 560px) {
  .popup-content { padding: 24px 20px 32px; }
  .popup-title { font-size: 28px; }
  .popup-img { height: 200px; }
}
`;

export function FestivePopup() {
  const [data, setData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadPopup = async () => {
      const festive = await getActiveFestivePopup();
      if (!festive) return;

      const seenKey = `festive_popup_seen_${festive.slug}`;
      const seen = localStorage.getItem(seenKey);

      if (!seen) {
        setData(festive);
        setOpen(true);
      }
    };

    loadPopup();
  }, []);

  const handleClose = () => {
    if (data?.slug) {
      localStorage.setItem(`festive_popup_seen_${data.slug}`, 'true');
    }
    setOpen(false);
  };

  if (!open || !data) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="festive-popup-overlay" onClick={handleClose}>
        <div className="festive-popup-card" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={handleClose}>
            <X size={16} color="#9a8070" />
          </button>

          {data.banner_image && (
            <img
              src={data.banner_image}
              alt={data.name}
              className="popup-img"
            />
          )}

          <div className="popup-content">
            <div className="popup-ey">
              <Sparkles size={12} /> Festive Edit
            </div>
            <h2 className="popup-title">{data.name}</h2>
            <p className="popup-message">
              {data.popup_message || data.description || "Discover handcrafted festive sarees curated for your celebrations."}
            </p>
            <Link
              to={`/festive/${data.slug}`}
              onClick={handleClose}
              className="popup-btn"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}