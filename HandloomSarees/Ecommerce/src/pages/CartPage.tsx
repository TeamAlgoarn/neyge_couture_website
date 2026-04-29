import { Link, useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { formatCurrency } from '@/lib/utils';
import { useEffect } from 'react'; // 👈 added import

const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  warmGrey: '#4a3828',
  indigo: '#4B0082',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&display=swap');

.cart-root {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212,175,55,.10), transparent 25%),
    radial-gradient(circle at top right, rgba(128,0,32,.08), transparent 22%),
    linear-gradient(180deg, #FFF9F0 0%, #F5E6D3 100%);
}
.cart-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px 70px;
}
.cart-page-top { padding-top: 146px; }

.cart-fadein { animation: fadeIn .45s ease both; }
.cart-fadeup { animation: fadeUp .6s cubic-bezier(.2,.8,.2,1) both; }
.cart-pop { animation: popIn .48s cubic-bezier(.17,.89,.32,1.2) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(140%); } }

.ey {
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .26em;
  text-transform: uppercase;
  color: #8A6A32;
  font-weight: 600;
}
.gd {
  width: 74px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #C4980A, transparent);
  margin: 0 auto;
}

.cart-header {
  text-align: center;
  padding: 10px 0 34px;
}
.cart-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(196,152,10,.25);
  background: rgba(255,255,255,.54);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  margin-bottom: 18px;
}
.cart-header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(44px, 6vw, 70px);
  line-height: .95;
  color: #800020;
  margin: 0 0 10px;
  letter-spacing: .03em;
}
.cart-header-count {
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #4a3828;
  margin: 0;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 28px;
  align-items: start;
}
@media(max-width: 1100px) {
  .cart-layout { grid-template-columns: 1fr; }
}

.cart-item {
  position: relative;
  background: rgba(255,255,255,.58);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(128,0,32,.08);
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 12px 34px rgba(90,0,22,.06);
  margin-bottom: 18px;
}
.cart-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(140deg, rgba(212,175,55,.30), rgba(128,0,32,.08), rgba(255,255,255,0));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

.cart-item-inner {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 20px;
}
@media(max-width: 680px) {
  .cart-item-inner { grid-template-columns: 1fr; }
}

.cart-item-img-wrap {
  display: block;
  position: relative;
  aspect-ratio: .82 / 1;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff, #f5e6d3);
}
.cart-item-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.cart-item-img-wrap:hover img { transform: scale(1.04); }

.cart-item-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.cart-item-name {
  text-decoration: none;
  font-family: 'Cormorant Garamond', serif;
  color: #800020;
  font-size: 30px;
  line-height: 1;
  letter-spacing: .02em;
  margin-bottom: 10px;
}
.cart-item-name:hover { color: #5a0016; }

.cart-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.cart-item-tag {
  border: 1px solid rgba(196,152,10,.25);
  background: rgba(255,249,240,.82);
  color: #4a3828;
  border-radius: 999px;
  padding: 7px 10px 6px;
  font-family: 'Josefin Sans';
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  flex-wrap: wrap;
}
.cart-qty-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,249,240,.95);
  border: 1px solid rgba(196,152,10,.22);
}
.cart-qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(90,0,22,.08);
  cursor: pointer;
}
.cart-qty-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.cart-qty-val {
  min-width: 20px;
  text-align: center;
  font-family: 'Josefin Sans';
  font-size: 15px;
  color: #4a3828;
  font-weight: 600;
}
.cart-price-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.cart-item-price {
  font-family: 'Cormorant Garamond', serif;
  color: #800020;
  font-size: 28px;
  font-weight: 700;
}
.cart-item-remove {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #8b1e3f;
  cursor: pointer;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  padding: 0;
}

.cart-summary {
  position: sticky;
  top: 120px;
  background: rgba(255,255,255,.7);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(128,0,32,.08);
  border-radius: 26px;
  box-shadow: 0 12px 34px rgba(90,0,22,.06);
  overflow: hidden;
}
.cart-summary-head {
  padding: 22px 24px 18px;
  background: linear-gradient(135deg, rgba(128,0,32,.05), rgba(196,152,10,.05));
  border-bottom: 1px solid rgba(196,152,10,.16);
}
.cart-summary-title {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  color: #800020;
}
.cart-summary-sub {
  margin-top: 5px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
}
.cart-summary-body {
  padding: 22px 24px 24px;
}
.cart-sum-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 0;
}
.cart-sum-label {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
}
.cart-sum-val {
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #4a3828;
  font-weight: 600;
}
.cart-sum-free {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: #0f766e;
  font-weight: 700;
}
.cart-ship-nudge {
  margin-top: 4px;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: rgba(196,152,10,.08);
  border: 1px solid rgba(196,152,10,.18);
  border-radius: 16px;
}
.cart-ship-nudge-text {
  margin: 0;
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: #6f5320;
  line-height: 1.45;
}
.cart-total-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 12px;
  margin-bottom: 20px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(128,0,32,.06), rgba(196,152,10,.10));
}
.cart-total-label {
  font-family: 'Josefin Sans';
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .16em;
  color: #4a3828;
  font-weight: 600;
}
.cart-total-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  line-height: 1;
  color: #800020;
  font-weight: 700;
}
.btn-gold {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #D4AF37 0%, #C4980A 100%);
  color: white;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .24em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(212,175,55,.35);
  transition: transform .3s, box-shadow .3s;
}
.btn-gold::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent, rgba(255,255,255,.3), transparent);
  animation: shimmer 3s ease infinite;
}
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }

.cart-empty-root {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212,175,55,.10), transparent 25%),
    radial-gradient(circle at top right, rgba(128,0,32,.08), transparent 22%),
    linear-gradient(180deg, #FFF9F0 0%, #F5E6D3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 140px 24px 60px;
  text-align: center;
}
.cart-empty-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(196,152,10,.10);
  border: 1px solid rgba(196,152,10,.22);
  margin-bottom: 18px;
}
.cart-empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 6vw, 58px);
  color: #800020;
  line-height: .95;
  margin: 0 0 10px;
}
.cart-empty-sub {
  font-family: 'Josefin Sans';
  font-size: 15px;
  line-height: 1.7;
  color: #4a3828;
  margin: 0 0 28px;
}

@media(max-width: 480px) {
  .cart-header-title { font-size: 34px; }
  .cart-item { padding: 18px 16px; border-radius: 18px; }
  .cart-item-actions { flex-direction: column; align-items: flex-start; }
  .cart-summary-body { padding: 20px 20px 22px; }
}
`;

function getProductUrl(product: { id: string; slug?: string }) {
  return `/product/${product.slug?.trim() ? product.slug : product.id}`;
}

function getOccasionText(occasion: unknown): string {
  if (Array.isArray(occasion)) return occasion.filter(Boolean).join(', ');
  if (typeof occasion === 'string') return occasion;
  return '';
}

function getProductImage(product: {
  image?: string;
  images?: string[];
}) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.find(Boolean) || '';
  }
  return product.image || '';
}

export function CartPage() {
  // ✅ Force scroll to top whenever this page is loaded/opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    cart,
    loading,
    initialized,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!initialized && cart.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cart-empty-root">
          <div className="cart-fadeup">
            <div className="cart-empty-icon">
              <ShoppingBag size={48} color={C.gold} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className="ey">Loading Cart</span>
            </div>
            <h2 className="cart-empty-title">Please wait...</h2>
            <p className="cart-empty-sub">Loading your selected items</p>
          </div>
        </div>
      </>
    );
  }
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
            <Link
              to="/shop"
              className="btn-gold"
              style={{ display: 'inline-flex', width: 'auto', padding: '16px 44px' }}
            >
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
          <div className="cart-header cart-fadein">
            <div className="cart-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="ey">Your Selection</span>
            </div>
            <h1 className="cart-header-title">Shopping Cart</h1>
            <p className="cart-header-count">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
            {loading && (
              <p style={{ marginTop: 8, fontSize: 12, color: '#8A6A32', fontFamily: 'Josefin Sans' }}>
                Updating cart...
              </p>
            )}
            <div className="gd" style={{ marginTop: 16 }} />
          </div>

          <div className="cart-layout">
            <div>
              {cart.map((item, i) => {
                const productUrl = getProductUrl(item.saree);
                const productImage = getProductImage(item.saree);
                const occasionText = getOccasionText(item.saree.occasion);

                return (
                  <div
                    key={item.saree.id}
                    className="cart-item cart-pop"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="cart-item-inner">
                      <Link to={productUrl} className="cart-item-img-wrap">
                        <img src={productImage} alt={item.saree.name} />
                      </Link>

                      <div className="cart-item-body">
                        <Link to={productUrl} className="cart-item-name">
                          {item.saree.name}
                        </Link>

                        <div className="cart-item-tags">
                          {item.saree.fabric ? (
                            <span className="cart-item-tag">{item.saree.fabric}</span>
                          ) : null}
                          {item.saree.color ? (
                            <span className="cart-item-tag">{item.saree.color}</span>
                          ) : null}
                          {occasionText ? (
                            <span className="cart-item-tag">{occasionText}</span>
                          ) : null}
                        </div>

                        <div className="cart-item-actions">
                          <div className="cart-qty-row">
                            <button
                              type="button"
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.saree.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.saree.name}`}
                            >
                              <Minus size={13} color={C.maroon} />
                            </button>

                            <span className="cart-qty-val">{item.quantity}</span>

                            <button
                              type="button"
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.saree.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.saree.name}`}
                              disabled={item.quantity >= item.saree.stock}
                            >
                              <Plus size={13} color={C.maroon} />
                            </button>
                          </div>

                          <div className="cart-price-row">
                            <span className="cart-item-price">
                              {formatCurrency(item.saree.price * item.quantity)}
                            </span>

                            <button
                              type="button"
                              className="cart-item-remove"
                              onClick={() => removeFromCart(item.saree.id)}
                              aria-label={`Remove ${item.saree.name} from cart`}
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="cart-summary cart-fadeup">
              <div className="cart-summary-head">
                <h2 className="cart-summary-title">Order Summary</h2>
                <p className="cart-summary-sub">Review your handcrafted selection</p>
              </div>

              <div className="cart-summary-body">
                <div className="cart-sum-row">
                  <span className="cart-sum-label">Subtotal</span>
                  <span className="cart-sum-val">{formatCurrency(subtotal)}</span>
                </div>

                <div className="cart-sum-row">
                  <span className="cart-sum-label">Shipping</span>
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
                      <strong style={{ color: C.maroon }}>
                        {formatCurrency(2999 - subtotal)}
                      </strong>{' '}
                      more for free shipping
                    </p>
                  </div>
                )}

                <div className="cart-total-strip">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-val">{formatCurrency(total)}</span>
                </div>

                <button type="button" className="btn-gold" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;