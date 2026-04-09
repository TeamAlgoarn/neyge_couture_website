import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.oc-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.oc-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 28px;
  width: 100%;
  max-width: 560px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0,0,0,.12);
  position: relative;
  overflow: hidden;
}

.oc-card::before {
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

.oc-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(34,197,94,.12);
  border: 1.5px solid rgba(34,197,94,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ocPulse 2.5s ease infinite;
}

@keyframes ocPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.2); }
  50% { box-shadow: 0 0 0 12px rgba(34,197,94,.08); }
}

.oc-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 400;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}

.oc-sub {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.7;
  margin-bottom: 28px;
}

.oc-detail-box {
  text-align: left;
  background: rgba(196,152,10,.06);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 18px;
  padding: 18px 22px;
  margin-bottom: 20px;
}

.oc-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-family: 'Josefin Sans';
  font-size: 13px;
  border-bottom: 1px solid rgba(196,152,10,.1);
}
.oc-detail-row:last-child { border-bottom: none; }
.oc-detail-label { color: #9a8070; font-weight: 400; }
.oc-detail-value { color: #800020; font-weight: 600; }

.oc-address-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}

.oc-address-line {
  font-family: 'Josefin Sans';
  font-size: 13px;
  color: #4a3828;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 4px;
}

.oc-actions {
  display: flex;
  gap: 14px;
  margin-top: 28px;
}

.oc-btn-outline {
  flex: 1;
  padding: 14px;
  background: transparent;
  border: 1.5px solid rgba(196,152,10,.4);
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  font-weight: 600;
  color: #800020;
  cursor: pointer;
  transition: all .3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.oc-btn-outline:hover {
  border-color: #800020;
  background: rgba(128,0,32,.05);
  transform: translateY(-2px);
}

.oc-btn-primary {
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  border: none;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  font-weight: 600;
  color: #800020;
  cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}
.oc-btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: ocShimmer 3s ease infinite;
}
@keyframes ocShimmer { 0%{left:-80%} 100%{left:120%} }
.oc-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}

@media(max-width: 500px) {
  .oc-card { padding: 32px 24px; }
  .oc-actions { flex-direction: column; }
  .oc-btn-primary, .oc-btn-outline { width: 100%; }
}
`;

type OrderAddress = {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
};

type OrderItem = {
  id?: string;
};

type OrderData = {
  id?: string;
  finalTotal?: number;
  total_amount?: number;
  total?: number;
  items?: OrderItem[];
  address?: OrderAddress;
  shipping_address?: {
    full_name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    phone?: string;
  };
};

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const order = location.state?.order as OrderData | undefined;

  useEffect(() => {
    if (!order && !orderId) {
      navigate("/", { replace: true });
    }
  }, [order, orderId, navigate]);

  if (!order && !orderId) {
    return null;
  }

  const displayOrderId = order?.id || orderId || "";
  const totalAmount = order?.finalTotal ?? order?.total_amount ?? order?.total ?? 0;
  const itemCount = order?.items?.length ?? 0;

  const address = order?.address
    ? {
      name: order.address.name,
      line1: order.address.addressLine1,
      line2: order.address.addressLine2,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
      phone: order.address.phone,
    }
    : order?.shipping_address
      ? {
        name: order.shipping_address.full_name,
        line1: order.shipping_address.line1,
        line2: order.shipping_address.line2,
        city: order.shipping_address.city,
        state: order.shipping_address.state,
        pincode: order.shipping_address.postal_code,
        phone: order.shipping_address.phone,
      }
      : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="oc-root">
        <div className="oc-card">
          <div className="oc-icon">
            <CheckCircle size={40} color="#22c55e" />
          </div>

          <h1 className="oc-title">Order Placed Successfully!</h1>
          <p className="oc-sub">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="oc-detail-box">
            <div className="oc-detail-row">
              <span className="oc-detail-label">Order ID</span>
              <span className="oc-detail-value">{displayOrderId}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Total Amount</span>
              <span className="oc-detail-value">₹{Number(totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="oc-detail-row">
              <span className="oc-detail-label">Items</span>
              <span className="oc-detail-value">{itemCount}</span>
            </div>
          </div>

          {address && (
            <div className="oc-detail-box">
              <div className="oc-address-title">Delivery Address</div>
              {address.name && <div className="oc-address-line">{address.name}</div>}
              {address.line1 && <div className="oc-address-line">{address.line1}</div>}
              {address.line2 && <div className="oc-address-line">{address.line2}</div>}
              {(address.city || address.state) && (
                <div className="oc-address-line">
                  {address.city || ""}{address.city && address.state ? ", " : ""}{address.state || ""}
                </div>
              )}
              {address.pincode && <div className="oc-address-line">{address.pincode}</div>}
              {address.phone && <div className="oc-address-line">{address.phone}</div>}
            </div>
          )}

          <div className="oc-actions">
            <button onClick={() => navigate("/profile")} className="oc-btn-outline">
              View Orders
            </button>
            <Link to="/shop" className="oc-btn-primary">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}