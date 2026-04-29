import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Eye } from "lucide-react";

const CSS = `
.admin-header {
  margin-bottom: 24px;
}
.admin-header-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(24px, 5vw, 28px);
  font-weight: 400;
  color: #800020;
  margin: 0;
}
.admin-stats {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 12px 20px;
  display: inline-block;
  margin-bottom: 24px;
}
.admin-card {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 20px;
}
.admin-order-item {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
}
.admin-order-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.admin-order-id {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 500;
  color: #800020;
}
.admin-order-status {
  background: rgba(196,152,10,.12);
  color: #C4980A;
  border: 1px solid rgba(196,152,10,.3);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}
.admin-order-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.admin-order-detail {
  font-size: 13px;
  color: #4a3828;
  font-weight: 300;
}
.admin-order-detail strong {
  color: #800020;
  font-weight: 600;
}
.admin-order-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(196,152,10,.15);
  padding-top: 12px;
}
.admin-view-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border: 1.5px solid rgba(196,152,10,.4);
  border-radius: 100px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #800020;
  text-decoration: none;
}
@media (max-width: 640px) {
  .admin-order-details {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .admin-order-footer {
    justify-content: stretch;
  }
  .admin-view-btn {
    width: 100%;
    justify-content: center;
  }
}
`;

type Order = {
  id: string; order_number?: string; status?: string; order_status?: string;
  payment_status?: string; total_amount?: number; total?: number; created_at?: string;
  user?: { name?: string; full_name?: string; email?: string } | null;
  customer_name?: string; customer_email?: string;
};

export default function AdminOrders() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/orders/admin/all");
      let items = Array.isArray(res.data) ? res.data : (res.data?.data?.items || res.data?.data || res.data?.orders || []);
      setOrders(items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <AdminLayout title="Orders"><div className="admin-loading">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout title="Orders"><div className="admin-error">{error}</div></AdminLayout>;

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title="Orders">
        <div className="admin-header">
          <h1 className="admin-header-title">Orders</h1>
        </div>
        <div className="admin-stats">Total orders: <strong>{orders.length}</strong></div>
        <div className="admin-card">
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>No orders found.</div>
          ) : (
            orders.map(order => {
              const orderStatus = order.order_status || order.status || "Pending";
              const customerName = order.customer_name || order.user?.name || order.user?.full_name || "Customer";
              const customerEmail = order.customer_email || order.user?.email || "-";
              const total = (order.total_amount ?? order.total ?? 0).toLocaleString("en-IN");
              return (
                <div key={order.id} className="admin-order-item">
                  <div className="admin-order-header">
                    <div className="admin-order-id">{order.order_number || `Order ${order.id.slice(0,8)}`}</div>
                    <div className="admin-order-status">{orderStatus}</div>
                  </div>
                  <div className="admin-order-details">
                    <div className="admin-order-detail"><strong>Customer:</strong> {customerName}</div>
                    <div className="admin-order-detail"><strong>Email:</strong> {customerEmail}</div>
                    <div className="admin-order-detail"><strong>Total:</strong> ₹{total}</div>
                    <div className="admin-order-detail"><strong>Payment:</strong> {order.payment_status || "Pending"}</div>
                    <div className="admin-order-detail"><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</div>
                  </div>
                  <div className="admin-order-footer">
                    <Link to={`/admin/orders/${order.id}`} className="admin-view-btn"><Eye size={14} /> View Details</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AdminLayout>
    </>
  );
}