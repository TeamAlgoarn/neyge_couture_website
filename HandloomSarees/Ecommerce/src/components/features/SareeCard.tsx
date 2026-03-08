import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Saree } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

// ── CSS injected once via a <style> in the first card render,
//    but since it's component-scoped we rely on class names being unique.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

/* ── CARD SHELL ── */
.sc-card {
  position: relative;
  width: 100%; border-radius: 22px;
  overflow: hidden;
  background: #0d0505;
  transition: transform .6s cubic-bezier(.4,0,.2,1), box-shadow .6s;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
}
.sc-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 24px 64px rgba(0,0,0,.26), 0 0 0 1px rgba(196,152,10,.5);
}

/* ── IMAGE ── */
.sc-img-wrap {
  position: relative;
  aspect-ratio: 3 / 4; overflow: hidden;
}
.sc-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 1s cubic-bezier(.4,0,.2,1);
}
.sc-card:hover .sc-img-wrap img { transform: scale(1.08); }

/* gradient overlay — always present but deepens on hover */
.sc-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    to top,
    rgba(10,2,2,.90) 0%,
    rgba(10,2,2,.35) 42%,
    transparent 72%
  );
  transition: opacity .5s;
}

/* ── TOP BADGES ── */
.sc-badges {
  position: absolute; top: 14px; left: 14px;
  display: flex; flex-direction: column; gap: 6px; z-index: 2;
}
.sc-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 100px;
  font-family: 'Jost'; font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 600;
}
.sc-badge-new {
  background: rgba(16,185,129,.2); border: 1px solid rgba(16,185,129,.4);
  color: #6ee7b7;
}
.sc-badge-best {
  background: rgba(196,152,10,.25); border: 1px solid rgba(196,152,10,.5);
  color: #D4AF37;
}

/* ── ACTION BUTTONS (top-right) ── */
.sc-actions {
  position: absolute; top: 14px; right: 14px;
  display: flex; flex-direction: column; gap: 6px; z-index: 2;
  opacity: 0; transform: translateX(10px);
  transition: opacity .35s, transform .35s;
}
.sc-card:hover .sc-actions {
  opacity: 1; transform: translateX(0);
}
.sc-action-btn {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.12); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .25s, border-color .25s, transform .2s;
}
.sc-action-btn:hover { transform: scale(1.12); }
.sc-action-btn.wish-active {
  background: rgba(200,40,40,.25); border-color: rgba(200,40,40,.5);
}
.sc-action-btn.cart-btn {
  background: rgba(196,152,10,.25); border-color: rgba(196,152,10,.55);
}
.sc-action-btn.cart-btn:hover {
  background: rgba(196,152,10,.55);
}

/* ── BOTTOM INFO PANEL ── */
.sc-info {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 20px 18px 18px;
  z-index: 2;
}

/* fabric tag */
.sc-fabric {
  font-family: 'Jost'; font-size: 10px; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(196,152,10,.8); font-weight: 500;
  margin-bottom: 5px;
}

/* name */
.sc-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px; font-weight: 500; color: white;
  line-height: 1.15; margin-bottom: 10px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* gold line that grows on hover */
.sc-line {
  height: 1px; background: rgba(196,152,10,.35);
  margin-bottom: 10px; position: relative; overflow: hidden;
}
.sc-line::after {
  content: ''; position: absolute; left: 0; top: 0;
  width: 0; height: 100%; background: #C4980A;
  transition: width .45s cubic-bezier(.4,0,.2,1);
}
.sc-card:hover .sc-line::after { width: 100%; }

/* price row */
.sc-price-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 8px;
}
.sc-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 600; color: #D4AF37; line-height: 1;
}
.sc-orig {
  font-family: 'Jost'; font-size: 12px; color: rgba(255,255,255,.35);
  text-decoration: line-through; font-weight: 300;
}
.sc-off {
  padding: 3px 8px; border-radius: 100px;
  background: rgba(128,0,32,.6); border: 1px solid rgba(196,152,10,.4);
  font-family: 'Jost'; font-size: 10px; font-weight: 700;
  letter-spacing: .06em; color: #D4AF37; white-space: nowrap;
}

/* stock dot */
.sc-stock {
  display: flex; align-items: center; gap: 5px;
  font-family: 'Jost'; font-size: 10px; letter-spacing: .08em;
  color: rgba(255,255,255,.4); font-weight: 300;
  margin-top: 6px;
}
.sc-stock-dot {
  width: 6px; height: 6px; border-radius: 50%;
  animation: scDot 2.5s ease infinite;
}
@keyframes scDot {
  0%,100%{ box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  50%{ box-shadow: 0 0 8px 2px rgba(16,185,129,.35); }
}

/* ── GOLD BORDER RING (on hover) ── */
.sc-ring {
  position: absolute; inset: 0; border-radius: 22px;
  border: 1.5px solid transparent;
  transition: border-color .45s;
  pointer-events: none; z-index: 3;
}
.sc-card:hover .sc-ring { border-color: rgba(196,152,10,.55); }

/* ── OUT OF STOCK OVERLAY ── */
.sc-oos {
  position: absolute; inset: 0; z-index: 4;
  background: rgba(0,0,0,.38); backdrop-filter: blur(1px);
  display: flex; align-items: center; justify-content: center;
  border-radius: 22px;
}
.sc-oos-label {
  padding: 8px 20px; border-radius: 100px;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(0,0,0,.5); backdrop-filter: blur(8px);
  font-family: 'Jost'; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(255,255,255,.6); font-weight: 500;
}
`;

// Inject CSS once at module level (idempotent in DOM)
let _cssInjected = false;
function injectCss() {
  if (_cssInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.setAttribute('data-sc', '1');
  el.textContent = CSS;
  document.head.appendChild(el);
  _cssInjected = true;
}

interface Props { saree: Saree; }

export function SareeCard({ saree }: Props) {
  injectCss();

  const { addToCart }                    = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(saree.id);
  const outOfStock = saree.stock === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (outOfStock) return;
    addToCart(saree);
    toast.success(`${saree.name} added to cart`);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(saree);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discount = saree.originalPrice
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${saree.id}`} style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
      <div className="sc-card">

        {/* Image */}
        <div className="sc-img-wrap">
          <img src={saree.images[0]} alt={saree.name} loading="lazy" />
          <div className="sc-img-overlay" />
        </div>

        {/* Top-left badges */}
        <div className="sc-badges">
          {saree.newArrival  && <span className="sc-badge sc-badge-new">✦ New</span>}
          {saree.bestSeller  && <span className="sc-badge sc-badge-best">★ Best Seller</span>}
        </div>

        {/* Top-right action buttons */}
        <div className="sc-actions">
          <button
            className={`sc-action-btn${inWishlist ? ' wish-active' : ''}`}
            onClick={handleWish}
            aria-label="Wishlist"
          >
            <Heart
              size={14}
              color={inWishlist ? '#f87171' : 'white'}
              fill={inWishlist ? '#f87171' : 'none'}
            />
          </button>
          <button
            className="sc-action-btn cart-btn"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} color="#D4AF37" />
          </button>
        </div>

        {/* Bottom info */}
        <div className="sc-info">
          <div className="sc-fabric">{saree.fabric}</div>
          <div className="sc-name">{saree.name}</div>
          <div className="sc-line" />
          <div className="sc-price-row">
            <span className="sc-price">{formatCurrency(saree.price)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {saree.originalPrice && (
                <span className="sc-orig">{formatCurrency(saree.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="sc-off">{discount}% off</span>
              )}
            </div>
          </div>
          <div className="sc-stock">
            <span
              className="sc-stock-dot"
              style={{ background: outOfStock ? '#ef4444' : '#10b981' }}
            />
            {outOfStock ? 'Out of stock' : `${saree.stock} left`}
          </div>
        </div>

        {/* Gold border ring */}
        <div className="sc-ring" />

        {/* Out-of-stock overlay */}
        {outOfStock && (
          <div className="sc-oos">
            <span className="sc-oos-label">Out of Stock</span>
          </div>
        )}
      </div>
    </Link>
  );
}