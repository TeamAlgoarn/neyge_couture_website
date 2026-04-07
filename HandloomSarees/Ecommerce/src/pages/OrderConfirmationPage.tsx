import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const order = location.state?.order;

  if (!order && !orderId) {
    navigate("/", { replace: true });
    return null;
  }

  const displayOrderId = order?.id || orderId || "";

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
          {order?.finalTotal && (
            <p><strong>Total Amount:</strong> ₹{order.finalTotal}</p>
          )}
          {order?.items && (
            <p><strong>Items:</strong> {order.items.length}</p>
          )}
        </div>

        {order?.address && (
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
            <p>{order.address.name}</p>
            <p>{order.address.addressLine1}</p>
            <p>{order.address.city}, {order.address.state}</p>
            <p>{order.address.pincode}</p>
            <p>{order.address.phone}</p>
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