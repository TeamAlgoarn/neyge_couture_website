import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { formatCurrency } from '@/lib/utils';

// ─── Brand palette (matches VideoShoppingPage & HomePage) ────────────────────
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
};

// ─── CSS – using same brand classes as home page and video shopping ──────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cart-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}

/* ── Wrap (same as home page .wrap) ── */
.cart-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width: 900px) { .cart-wrap { padding: 0 24px; } }
@media(max-width: 480px) { .cart-wrap { padding: 0 16px; } }

/* ── Eyebrow label (brand gold) ── */
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

/* ─────────────────────────────
   ANIMATIONS (matching home page)
───────────────────────────── */
@keyframes cartFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes cartFadeIn  { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes shimmer     { 0%{left:-80%} 100%{left:120%} }
@keyframes cartPop     { from{opacity:0;transform:translateY(28px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }

.cart-fadein { animation: cartFadeIn  .8s cubic-bezier(.4,0,.2,1) both; }
.cart-fadeup { animation: cartFadeUp  .8s cubic-bezier(.4,0,.2,1) both; }
.cart-pop    { animation: cartPop     .6s cubic-bezier(.34,1.56,.64,1) both; }
.cart-d1 { animation-delay:.1s }
.cart-d2 { animation-delay:.2s }

/* ─────────────────────────────
   PAGE TOP (clears navbar)
───────────────────────────── */
.cart-page-top { padding-top: 140px; padding-bottom: 80px; }
@media(max-width: 640px) { .cart-page-top { padding-top: 110px; padding-bottom: 60px; } }

/* ─────────────────────────────
   EMPTY STATE
───────────────────────────── */
.cart-empty-root {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(170deg, #FFF9F0 0%, #F5E6D3 100%);
  padding: 24px; text-align: center;
}
.cart-empty-icon {
  width: 110px; height: 110px; border-radius: 50%; margin: 0 auto 28px;
  background: rgba(196,152,10,.1); border: 1.5px solid rgba(196,152,10,.3);
  display: flex; align-items: center; justify-content: center;
}
.cart-empty-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 400;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}
.cart-empty-sub {
  font-family: 'Josefin Sans'; font-size: 14px; font-weight: 300;
  color: #4a3828; line-height: 1.75; margin-bottom: 32px;
}

/* ─────────────────────────────
   PAGE HEADER
───────────────────────────── */
.cart-header { margin-bottom: 44px; }
.cart-header-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
  padding: 7px 18px; border-radius: 100px; margin-bottom: 16px;
}
.cart-header-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 400; color: #800020; line-height: 1.06; margin-bottom: 6px;
  letter-spacing: 0.04em;
}
.cart-header-count {
  font-family: 'Josefin Sans'; font-size: 13px; color: #9a8070; font-weight: 300;
}

/* ─────────────────────────────
   LAYOUT
───────────────────────────── */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}
@media(max-width: 1024px) { .cart-layout { grid-template-columns: 1fr; } }

/* ─────────────────────────────
   CART ITEM CARD (matches brand card style)
───────────────────────────── */
.cart-item {
  background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 22px 24px;
  margin-bottom: 16px;
  transition: box-shadow .35s, border-color .3s;
  box-shadow: 0 6px 28px rgba(0,0,0,.06);
}
.cart-item:hover {
  box-shadow: 0 14px 48px rgba(128,0,32,.1);
  border-color: rgba(196,152,10,.42);
}

.cart-item-inner {
  display: flex; gap: 20px; align-items: flex-start;
}
@media(max-width: 560px) {
  .cart-item-inner { flex-direction: column; }
}

/* Image */
.cart-item-img-wrap {
  width: 100px; flex-shrink: 0;
  border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(196,152,10,.25);
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}
@media(max-width: 560px) { .cart-item-img-wrap { width: 100%; height: 200px; } }
.cart-item-img-wrap img {
  width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block;
  transition: transform .6s cubic-bezier(.4,0,.2,1);
}
@media(max-width: 560px) { .cart-item-img-wrap img { aspect-ratio: unset; height: 200px; } }
.cart-item-img-wrap:hover img { transform: scale(1.05); }

/* Body */
.cart-item-body { flex: 1; min-width: 0; }

.cart-item-name {
  font-family: 'Cinzel', serif;
  font-size: 20px; font-weight: 500; color: #800020;
  text-decoration: none; display: block; margin-bottom: 8px;
  transition: color .2s; line-height: 1.2;
  letter-spacing: 0.02em;
}
.cart-item-name:hover { color: #C4980A; }

.cart-item-tags {
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
}
.cart-item-tag {
  padding: 4px 12px; border-radius: 100px;
  background: rgba(196,152,10,.08); border: 1px solid rgba(196,152,10,.25);
  font-family: 'Josefin Sans'; font-size: 11px; color: #4a3828; font-weight: 400;
}

/* Qty + remove row */
.cart-item-actions {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}

.cart-qty-row {
  display: flex; align-items: center; gap: 0;
  background: rgba(196,152,10,.08); border: 1px solid rgba(196,152,10,.25);
  border-radius: 100px; padding: 4px;
}
.cart-qty-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: white; border: 1px solid rgba(196,152,10,.3);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .25s, transform .2s;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.cart-qty-btn:hover { background: #D4AF37; transform: scale(1.1); }
.cart-qty-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
.cart-qty-btn:hover svg { color: white !important; }
.cart-qty-val {
  min-width: 32px; text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 18px; font-weight: 500; color: #800020;
}

.cart-remove-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 100px;
  border: 1.5px solid rgba(200,50,50,.3);
  background: transparent; color: #c0392b;
  font-family: 'Josefin Sans'; font-size: 12px; font-weight: 500;
  cursor: pointer; transition: background .25s, color .25s, transform .2s;
}
.cart-remove-btn:hover {
  background: #c0392b; color: white; transform: scale(1.04);
}

/* Price */
.cart-item-price {
  text-align: right; flex-shrink: 0;
}
@media(max-width: 560px) { .cart-item-price { text-align: left; } }
.cart-item-price-main {
  font-family: 'Cinzel', serif;
  font-size: 24px; font-weight: 600; color: #800020; display: block;
  letter-spacing: 0.02em;
}
.cart-item-price-orig {
  font-family: 'Josefin Sans'; font-size: 12px; color: #9a8070;
  text-decoration: line-through; font-weight: 300; margin-top: 3px;
}

/* ─────────────────────────────
   ORDER SUMMARY (matches brand panel style)
───────────────────────────── */
.cart-summary {
  background: rgba(255,249,240,.97); backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 24px;
  box-shadow: 0 16px 60px rgba(0,0,0,.09);
  overflow: hidden;
  position: sticky; top: 110px;
}

/* Summary maroon top bar (same as VideoShopping panel bar) */
.cart-summary-bar {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #1B2A6B 100%);
  padding: 22px 28px;
  position: relative; overflow: hidden;
}
.cart-summary-bar::after {
  content: ''; position: absolute; top: -50px; right: -50px;
  width: 160px; height: 160px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.15); pointer-events: none;
}
.cart-summary-bar-title {
  font-family: 'Cinzel', serif;
  font-size: 22px; font-weight: 400; color: white;
  letter-spacing: 0.04em;
  position: relative; z-index: 1;
}

/* Summary body */
.cart-summary-body { padding: 26px 28px 28px; }

/* Row */
.cart-sum-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(196,152,10,.14);
}
.cart-sum-row:last-of-type { border-bottom: none; }
.cart-sum-key {
  font-family: 'Josefin Sans'; font-size: 13px; color: #4a3828; font-weight: 400;
}
.cart-sum-val {
  font-family: 'Josefin Sans'; font-size: 13px; color: #800020; font-weight: 600;
}
.cart-sum-free {
  display: flex; align-items: center; gap: 5px;
  font-family: 'Josefin Sans'; font-size: 13px; color: #059669; font-weight: 600;
}

/* Free shipping nudge */
.cart-ship-nudge {
  background: rgba(196,152,10,.07); border: 1px solid rgba(196,152,10,.22);
  border-radius: 12px; padding: 11px 14px; margin: 8px 0;
}
.cart-ship-nudge-text {
  font-family: 'Josefin Sans'; font-size: 12px; color: #4a3828; font-weight: 300; line-height: 1.5;
}

/* Total strip (maroon + gold) */
.cart-total-strip {
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #800020 0%, #1B2A6B 100%);
  border-radius: 16px; padding: 16px 20px; margin: 18px 0;
}
.cart-total-label {
  font-family: 'Josefin Sans'; font-size: 13px; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(255,255,255,.7); font-weight: 500;
}
.cart-total-val {
  font-family: 'Cinzel', serif;
  font-size: 28px; font-weight: 600; color: #D4AF37;
  letter-spacing: 0.02em;
}

/* ─────────────────────────────
   BUTTONS (matching VideoShopping & HomePage)
───────────────────────────── */
.btn-gold {
  display: block; width: 100%; padding: 16px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020;
  border: none; border-radius: 100px;
  font-family: 'Josefin Sans'; font-size: 13px; letter-spacing: .12em;
  font-weight: 600; text-transform: uppercase;
  text-decoration: none; text-align: center;
  cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  position: relative; overflow: hidden;
  margin-bottom: 12px;
}
.btn-gold::after {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: shimmer 3s ease infinite;
}
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 24px;
  border: 1.5px solid rgba(196,152,10,.5);
  background: transparent;
  color: #4a3828;
  font-family: 'Josefin Sans'; font-size: 10px; letter-spacing: .22em;
  font-weight: 500; text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: transform .35s, background .3s, border-color .3s;
}
.btn-outline:hover { transform: translateY(-2px); background: rgba(196,152,10,.08); border-color: #C4980A; }

.cart-continue-link {
  display: block; text-align: center;
  font-family: 'Josefin Sans'; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; color: #4a3828; font-weight: 500;
  text-decoration: none; transition: color .2s; padding: 6px 0;
}
.cart-continue-link:hover { color: #800020; }

/* Trust signals */
.cart-trust { margin-top: 22px; padding-top: 20px; border-top: 1px solid rgba(196,152,10,.18); }
.cart-trust-item {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 0;
}
.cart-trust-dot {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.cart-trust-text {
  font-family: 'Josefin Sans'; font-size: 12px; color: #4a3828; font-weight: 400;
}

/* ─────────────────────────────
   RESPONSIVE
───────────────────────────── */
@media(max-width: 480px) {
  .cart-header-title { font-size: 34px; }
  .cart-item { padding: 18px 16px; border-radius: 18px; }
  .cart-item-actions { flex-direction: column; align-items: flex-start; }
  .cart-summary-body { padding: 20px 20px 22px; }
}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    console.log('Current cart:', cart);
    navigate('/checkout');
  };

  // ── Empty state ──
  if (cart.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cart-empty-root">
          <div className="cart-fadeup">
            <div className="cart-empty-icon">
              <ShoppingBag size={48} color={C.gold} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="ey">Your Selection</span>
            </div>
            <h2 className="cart-empty-title">Your Cart is Empty</h2>
            <p className="cart-empty-sub">
              Discover our beautiful collection<br />of handcrafted sarees
            </p>
            <Link to="/shop" className="btn-gold" style={{ display: 'inline-flex', width: 'auto', padding: '16px 44px' }}>
              Continue Shopping <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="cart-root">
        <div className="cart-wrap cart-page-top">

          {/* ── Header ── */}
          <div className="cart-header cart-fadein">
            <div className="cart-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="ey">Your Selection</span>
            </div>
            <h1 className="cart-header-title">Shopping Cart</h1>
            <p className="cart-header-count">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
            <div className="gd" style={{ marginTop: 16 }} />
          </div>

          {/* ── Layout ── */}
          <div className="cart-layout">

            {/* ── Items ── */}
            <div>
              {cart.map((item, i) => (
                <div
                  key={item.saree.id}
                  className="cart-item cart-pop"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="cart-item-inner">

                    {/* Image */}
                    <Link to={`/product/${item.saree.id}`} className="cart-item-img-wrap">
                      <img src={item.saree.images[0]} alt={item.saree.name} />
                    </Link>

                    {/* Body */}
                    <div className="cart-item-body">
                      <Link to={`/product/${item.saree.id}`} className="cart-item-name">
                        {item.saree.name}
                      </Link>
                      <div className="cart-item-tags">
                        <span className="cart-item-tag">{item.saree.fabric}</span>
                        <span className="cart-item-tag">{item.saree.color}</span>
                        <span className="cart-item-tag">{item.saree.occasion}</span>
                      </div>
                      <div className="cart-item-actions">
                        {/* Qty */}
                        <div className="cart-qty-row">
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.saree.id, item.quantity - 1)}
                          >
                            <Minus size={13} color={C.maroon} />
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.saree.id, item.quantity + 1)}
                            disabled={item.quantity >= item.saree.stock}
                          >
                            <Plus size={13} color={C.maroon} />
                          </button>
                        </div>
                        {/* Remove */}
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.saree.id)}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price">
                      <span className="cart-item-price-main">
                        {formatCurrency(item.saree.price * item.quantity)}
                      </span>
                      {item.saree.originalPrice && (
                        <p className="cart-item-price-orig">
                          {formatCurrency(item.saree.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="cart-summary cart-fadein cart-d1">

              {/* Maroon bar */}
              <div className="cart-summary-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, position: 'relative', zIndex: 1 }}>
                  <Sparkles size={14} color="rgba(212,175,55,.8)" />
                  <span style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
                    Neyge Couture
                  </span>
                </div>
                <div className="cart-summary-bar-title">Order Summary</div>
              </div>

              <div className="cart-summary-body">

                {/* Rows */}
                <div className="cart-sum-row">
                  <span className="cart-sum-key">Subtotal</span>
                  <span className="cart-sum-val">{formatCurrency(subtotal)}</span>
                </div>
                <div className="cart-sum-row">
                  <span className="cart-sum-key">Shipping</span>
                  {shipping === 0 ? (
                    <span className="cart-sum-free">
                      <Sparkles size={12} /> FREE
                    </span>
                  ) : (
                    <span className="cart-sum-val">{formatCurrency(shipping)}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="cart-ship-nudge">
                    <p className="cart-ship-nudge-text">
                      Add{' '}
                      <strong style={{ color: C.maroon }}>{formatCurrency(2999 - subtotal)}</strong>
                      {' '}more for free shipping
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="cart-total-strip">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-val">{formatCurrency(total)}</span>
                </div>

                {/* Checkout */}
                <button type="button" className="btn-gold" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>

                <Link to="/shop" className="cart-continue-link">
                  ← Continue Shopping
                </Link>

                {/* Trust */}
                <div className="cart-trust">
                  {[
                    { text: 'Secure Checkout',        bg: 'rgba(16,185,129,.12)',  border: 'rgba(16,185,129,.3)',  color: '#059669' },
                    { text: '7-Day Easy Returns',      bg: 'rgba(59,130,246,.10)',  border: 'rgba(59,130,246,.3)',  color: '#2563eb' },
                    { text: '100% Authentic Products', bg: 'rgba(196,152,10,.12)', border: 'rgba(196,152,10,.35)', color: '#C4980A' },
                  ].map(({ text, bg, border, color }) => (
                    <div key={text} className="cart-trust-item">
                      <div className="cart-trust-dot" style={{ background: bg, border: `1px solid ${border}` }}>
                        <svg width="11" height="11" viewBox="0 0 20 20" fill={color}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="cart-trust-text">{text}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}