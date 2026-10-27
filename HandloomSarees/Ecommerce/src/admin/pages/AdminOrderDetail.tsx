import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type OrderItem = {
  id?: string; quantity?: number; unit_price?: number; price?: number;
  line_total?: number; total?: number;
  product?: { id?: string; name?: string; thumbnail?: string | null; image?: string | null; slug?: string } | null;
  product_name?: string; thumbnail?: string | null;
  selected_addons?: Array<{ id: string; name: string; price: number }>;
  addons_total?: number;
};

type OrderDetail = {
  id: string; order_number?: string; status?: string; order_status?: string;
  payment_status?: string; subtotal?: number; total_amount?: number; total?: number;
  shipping_amount?: number; shipping_fee?: number; created_at?: string;
  user?: { name?: string; full_name?: string; email?: string; phone?: string } | null;
  customer_name?: string; customer_email?: string; customer_phone?: string;
  shipping_address?: {
    full_name?: string; line1?: string; line2?: string;
    city?: string; state?: string; postal_code?: string; country?: string; phone?: string;
  } | string | null;
  items?: OrderItem[];
  courier_name?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  status_history?: Record<string, unknown>[];
};








type OrderResponse = { data?: OrderDetail; order?: OrderDetail };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.od-wrap { font-family: 'Josefin Sans', sans-serif; }

.od-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,249,240,0.97);
  border: 1px solid rgba(196,152,10,0.28);
  border-radius: 12px;
  padding: 9px 16px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #800020;
  cursor: pointer;
  transition: box-shadow 0.25s, border-color 0.25s, transform 0.2s;
  margin-bottom: 20px;
  -webkit-tap-highlight-color: transparent;
}

@media(min-width: 640px) {
  .od-back-btn { padding: 10px 20px; margin-bottom: 24px; }
}

.od-back-btn:hover {
  border-color: rgba(196,152,10,0.5);
  box-shadow: 0 4px 16px rgba(128,0,32,0.10);
  transform: translateX(-2px);
}

.od-loading, .od-error {
  background: rgba(255,249,240,0.97);
  border: 1px solid rgba(196,152,10,0.22);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  color: #9a8070;
}
.od-error { color: #dc2626; border-color: rgba(220,38,38,0.3); background: rgba(254,226,226,0.8); }

.od-grid { display: grid; gap: 16px; }

@media(min-width: 640px) {
  .od-grid { gap: 24px; }
}

.od-two-col {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media(min-width: 640px) {
  .od-two-col { grid-template-columns: 1fr 1fr; gap: 24px; }
}

.od-card {
  background: rgba(255,249,240,0.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,0.22);
  border-radius: 20px;
  padding: 20px 16px;
  box-shadow: 0 8px 36px rgba(0,0,0,0.06);
}

@media(min-width: 640px) {
  .od-card { border-radius: 24px; padding: 28px; }
}

.od-card-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.03em;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(196,152,10,0.18);
}

@media(min-width: 640px) {
  .od-card-title { font-size: 18px; margin-bottom: 20px; }
}

.od-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.od-field:last-child { margin-bottom: 0; }

.od-field-label {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9a8070;
}

.od-field-value {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #4a3828;
  line-height: 1.5;
}

.od-badge {
  display: inline-block;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(196,152,10,0.12);
  border: 1px solid rgba(196,152,10,0.3);
  color: #7a6000;
}

.od-address-block {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 2;
}

.od-item {
  background: rgba(255,249,240,0.9);
  border: 1px solid rgba(196,152,10,0.2);
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: box-shadow 0.25s, border-color 0.25s;
}

@media(min-width: 640px) {
  .od-item { border-radius: 18px; padding: 16px; margin-bottom: 12px; gap: 16px; }
}

.od-item:last-child { margin-bottom: 0; }
.od-item:hover { box-shadow: 0 6px 22px rgba(128,0,32,0.09); border-color: rgba(196,152,10,0.4); }

.od-item-left { display: flex; align-items: center; gap: 10px; min-width: 0; }

@media(min-width: 640px) {
  .od-item-left { gap: 16px; }
}

.od-item-img {
  width: 52px; height: 52px;
  border-radius: 10px;
  border: 1px solid rgba(196,152,10,0.22);
  object-fit: cover;
  flex-shrink: 0;
}

@media(min-width: 640px) {
  .od-item-img { width: 64px; height: 64px; border-radius: 12px; }
}

.od-item-img-placeholder {
  width: 52px; height: 52px;
  border-radius: 10px;
  border: 1px solid rgba(196,152,10,0.22);
  background: rgba(196,152,10,0.08);
  flex-shrink: 0;
}

@media(min-width: 640px) {
  .od-item-img-placeholder { width: 64px; height: 64px; border-radius: 12px; }
}

.od-item-name {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.02em;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media(min-width: 640px) {
  .od-item-name { font-size: 14px; margin-bottom: 4px; white-space: normal; }
}

.od-item-meta {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #9a8070;
  line-height: 1.8;
}

@media(min-width: 640px) {
  .od-item-meta { font-size: 12px; }
}

.od-item-total {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.02em;
  white-space: nowrap;
  flex-shrink: 0;
}

@media(min-width: 640px) {
  .od-item-total { font-size: 16px; }
}

.od-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #9a8070;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(196,152,10,0.1);
}
.od-summary-row:last-child {
  border-bottom: none;
  padding-top: 16px;
  margin-top: 4px;
  border-top: 1px solid rgba(196,152,10,0.22);
}
.od-summary-total-label {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.04em;
}

@media(min-width: 640px) {
  .od-summary-total-label { font-size: 16px; }
}

.od-summary-total-value {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 600;
  color: #800020;
  letter-spacing: 0.02em;
}

@media(min-width: 640px) {
  .od-summary-total-value { font-size: 20px; }
}

.od-form-group {
  margin-bottom: 16px;
}
.od-form-label {
  display: block;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9a8070;
  margin-bottom: 6px;
}
.od-form-select, .od-form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(196,152,10,0.3);
  border-radius: 8px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  color: #4a3828;
  background: rgba(255,255,255,0.7);
  transition: all 0.2s;
}
.od-form-select:focus, .od-form-input:focus {
  outline: none;
  border-color: rgba(196,152,10,0.6);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(196,152,10,0.1);
}
.od-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background: #800020;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.od-btn-primary:hover {
  background: #5a0016;
}
.od-btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
`;

export default function AdminOrderDetail() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({
    order_status: "",
    courier_name: "",
    tracking_number: "",
    tracking_url: ""
  });

  const getOrderStatus = (order: { order_status?: string; status?: string }) =>
    order.order_status || order.status || "Pending";

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {

      try {
        setLoading(true);

        setError("");
        const res = await adminApi.get<OrderResponse>(`/orders/admin/${id}`);

        const rawData = res.data?.data || res.data?.order || res.data;
        const data = rawData ? (rawData as OrderDetail) : null;
        setOrder(data);
        if (data) {
          setStatusForm({
            order_status: data.order_status || data.status || "",
            courier_name: data.courier_name || "",
            tracking_number: data.tracking_number || "",
            tracking_url: data.tracking_url || ""
          });
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Failed to fetch order detail");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatusUpdating(true);
      await adminApi.patch(`/orders/admin/${id}/status`, {
        order_status: statusForm.order_status,
        courier_name: statusForm.courier_name || null,
        tracking_number: statusForm.tracking_number || null,
        tracking_url: statusForm.tracking_url || null,
      });

      const res = await adminApi.get<OrderResponse>(`/orders/admin/${id}`);
      const rawData = res.data?.data || res.data?.order || res.data;
      const data = rawData ? (rawData as OrderDetail) : null;
      setOrder(data);
      alert("Order status updated successfully!");
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message || (err as Error)?.message || "Failed to update status";
      alert(errorMsg);
    } finally {
      setStatusUpdating(false);
    }
  };

  const customerName = order?.customer_name || order?.user?.name || order?.user?.full_name || "Customer";
  const customerEmail = order?.customer_email || order?.user?.email || "-";
  const customerPhone =
    order?.customer_phone ||
    order?.user?.phone ||
    (typeof order?.shipping_address === "object" && order?.shipping_address?.phone) || "-";

  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.shipping_amount ?? order?.shipping_fee ?? 0;
  const total = order?.total_amount ?? order?.total ?? 0;

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title="Order Details">
        <div className="od-wrap">
          <button onClick={() => navigate("/admin/orders")} className="od-back-btn">
            ← Back to Orders
          </button>

          {loading && <div className="od-loading">Loading order...</div>}
          {error && <div className="od-error">{error}</div>}

          {!loading && !error && order && (
            <div className="od-grid">
              <div className="od-two-col">
                <div className="od-card">
                  <div className="od-card-title">Order Info</div>
                  <div className="od-field">
                    <span className="od-field-label">Order Number</span>
                    <span className="od-field-value">{order.order_number || order.id}</span>
                  </div>
                  <div className="od-field">
                    <span className="od-field-label">Status</span>
                    <span className="od-badge">{getOrderStatus(order)}</span>
                  </div>
                  <div className="od-field">
                    <span className="od-field-label">Payment</span>
                    <span className="od-badge">{order.payment_status || "Pending"}</span>
                  </div>
                  <div className="od-field">
                    <span className="od-field-label">Created</span>
                    <span className="od-field-value">
                      {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                    </span>
                  </div>
                </div>

                <div className="od-card">
                  <div className="od-card-title">Customer Info</div>
                  <div className="od-field">
                    <span className="od-field-label">Name</span>
                    <span className="od-field-value">{customerName}</span>
                  </div>
                  <div className="od-field">
                    <span className="od-field-label">Email</span>
                    <span className="od-field-value">{customerEmail}</span>
                  </div>
                  <div className="od-field">
                    <span className="od-field-label">Phone</span>
                    <span className="od-field-value">{customerPhone}</span>
                  </div>
                </div>

                <div className="od-card">
                  <div className="od-card-title">Update Status & Tracking</div>
                  <form onSubmit={handleUpdateStatus}>
                    <div className="od-form-group">
                      <label className="od-form-label" htmlFor="order_status">Order Status</label>
                      <select
                        id="order_status"
                        className="od-form-select"
                        value={statusForm.order_status}
                        onChange={(e) => setStatusForm({...statusForm, order_status: e.target.value})}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {(statusForm.order_status === "shipped" || statusForm.order_status === "out_for_delivery" || statusForm.order_status === "delivered") && (
                      <>
                        <div className="od-form-group">
                          <label className="od-form-label" htmlFor="courier_name">Courier Name</label>
                          <input
                            id="courier_name"
                            className="od-form-input"
                            type="text"
                            placeholder="e.g. FedEx, DTDC"
                            maxLength={100}
                            value={statusForm.courier_name}
                            onChange={(e) => setStatusForm({...statusForm, courier_name: e.target.value})}
                          />
                        </div>
                        <div className="od-form-group">
                          <label className="od-form-label" htmlFor="tracking_number">Tracking Number</label>
                          <input
                            id="tracking_number"
                            className="od-form-input"
                            type="text"
                            placeholder="Tracking ID"
                            maxLength={100}
                            value={statusForm.tracking_number}
                            onChange={(e) => setStatusForm({...statusForm, tracking_number: e.target.value})}
                          />
                        </div>
                        <div className="od-form-group">
                          <label className="od-form-label" htmlFor="tracking_url">Tracking URL</label>
                          <input
                            id="tracking_url"
                            className="od-form-input"
                            type="text"
                            placeholder="https://..."
                            value={statusForm.tracking_url}
                            onChange={(e) => setStatusForm({...statusForm, tracking_url: e.target.value})}
                          />
                        </div>
                      </>
                    )}

                    <button type="submit" className="od-btn-primary" disabled={statusUpdating}>
                      {statusUpdating ? "Updating..." : "Update Order"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="od-card">
                <div className="od-card-title">Shipping Address</div>
                {typeof order.shipping_address === "string" ? (
                  <p className="od-address-block">{order.shipping_address}</p>
                ) : order.shipping_address ? (
                  <div className="od-address-block">
                    {order.shipping_address.full_name && <div>{order.shipping_address.full_name}</div>}
                    {order.shipping_address.line1 && <div>{order.shipping_address.line1}</div>}
                    {order.shipping_address.line2 && <div>{order.shipping_address.line2}</div>}
                    <div>{order.shipping_address.city || ""} {order.shipping_address.state || ""}</div>
                    <div>{order.shipping_address.postal_code || ""} {order.shipping_address.country || ""}</div>
                    {order.shipping_address.phone && <div>{order.shipping_address.phone}</div>}
                  </div>
                ) : (
                  <p className="od-field-value" style={{ color: "#9a8070" }}>No shipping address found.</p>
                )}

                {(order.courier_name || order.tracking_number) && (
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(196,152,10,0.18)" }}>
                    <div className="od-card-title" style={{ fontSize: 14, marginBottom: 12, border: "none", padding: 0 }}>Tracking Details</div>
                    {order.courier_name && (
                      <div className="od-field">
                        <span className="od-field-label">Courier</span>
                        <span className="od-field-value">{order.courier_name}</span>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div className="od-field">
                        <span className="od-field-label">Tracking Number</span>
                        <span className="od-field-value">{order.tracking_number}</span>
                      </div>
                    )}
                    {order.tracking_url && (
                      <div className="od-field">
                        <span className="od-field-label">Tracking Link</span>
                        <a href={order.tracking_url} target="_blank" rel="noreferrer" className="od-field-value" style={{ color: "#800020", textDecoration: "underline" }}>
                          Track Package
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="od-card">
                <div className="od-card-title">Ordered Items</div>
                {!order.items || order.items.length === 0 ? (
                  <p className="od-field-value" style={{ color: "#9a8070" }}>No order items found.</p>
                ) : order.items.map((item, index) => {
                  const itemName = item.product?.name || item.product_name || "Product";
                  const itemImage = item.product?.thumbnail || item.product?.image || item.thumbnail || "";
                  const itemQty = item.quantity ?? 0;
                  const itemPrice = item.unit_price ?? item.price ?? 0;
                  const itemTotal = item.line_total ?? item.total ?? itemQty * itemPrice;
                  return (
                    <div key={item.id || `${itemName}-${index}`} className="od-item">
                      <div className="od-item-left">
                        {itemImage
                          ? <img src={itemImage} alt={itemName} className="od-item-img" />
                          : <div className="od-item-img-placeholder" />
                        }
                        <div style={{ minWidth: 0 }}>
                          <div className="od-item-name">{itemName}</div>
                          <div className="od-item-meta">Qty: {itemQty}</div>
                          <div className="od-item-meta">Unit: ₹{itemPrice.toLocaleString("en-IN")}</div>
                          {item.selected_addons && item.selected_addons.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                              {item.selected_addons.map((addon) => (
                                <span key={addon.id} className="od-badge" style={{ fontSize: 10, padding: '2px 8px' }}>
                                  {addon.name} (+₹{addon.price})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="od-item-total">₹{itemTotal.toLocaleString("en-IN")}</div>
                    </div>
                  );
                })}
              </div>

              <div className="od-card">
                <div className="od-card-title">Payment Summary</div>
                <div className="od-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="od-summary-row">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString("en-IN")}</span>
                </div>
                <div className="od-summary-row">
                  <span className="od-summary-total-label">Total</span>
                  <span className="od-summary-total-value">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}