import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5E6D3",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "560px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <CheckCircle size={60} color="#22c55e" />

        <h1
          style={{
            marginTop: "16px",
            fontSize: "28px",
            fontWeight: 600,
            color: "#800020",
          }}
        >
          Order Placed Successfully!
        </h1>

        <p style={{ color: "#666", marginTop: "10px", marginBottom: "24px" }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div
          style={{
            textAlign: "left",
            marginBottom: "20px",
            padding: "16px",
            background: "#f9f9f9",
            borderRadius: "10px",
          }}
        >
          <p><strong>Order ID:</strong> {displayOrderId}</p>
          <p><strong>Total Amount:</strong> ₹{Number(totalAmount).toLocaleString("en-IN")}</p>
          <p><strong>Items:</strong> {itemCount}</p>
        </div>

        {address && (
          <div
            style={{
              textAlign: "left",
              marginBottom: "20px",
              padding: "16px",
              background: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            <p><strong>Delivery Address</strong></p>
            {address.name && <p>{address.name}</p>}
            {address.line1 && <p>{address.line1}</p>}
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city || ""}{address.city && address.state ? ", " : ""}
              {address.state || ""}
            </p>
            {address.pincode && <p>{address.pincode}</p>}
            {address.phone && <p>{address.phone}</p>}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              flex: 1,
              padding: "12px",
              background: "#eee",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            View Orders
          </button>

          <Link
            to="/shop"
            style={{
              flex: 1,
              padding: "12px",
              background: "#800020",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}