import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type OrderItem = {
  id?: string;
  quantity?: number;
  unit_price?: number;
  price?: number;
  line_total?: number;
  total?: number;
  product?: {
    id?: string;
    name?: string;
    thumbnail?: string | null;
    image?: string | null;
    slug?: string;
  } | null;
  product_name?: string;
  thumbnail?: string | null;
};

type OrderDetail = {
  id: string;
  order_number?: string;
  status?: string;
  order_status?: string;
  payment_status?: string;
  subtotal?: number;
  total_amount?: number;
  total?: number;
  shipping_amount?: number;
  shipping_fee?: number;
  created_at?: string;
  user?: {
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
  } | null;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: {
    full_name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
  } | string | null;
  items?: OrderItem[];
};

type OrderResponse = {
  data?: OrderDetail | any;
  order?: OrderDetail | any;
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrderStatus = (order: { order_status?: string; status?: string }) =>
    order.order_status || order.status || "Pending";

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await adminApi.get<OrderResponse>(`/orders/admin/${id}`);
        console.log("ORDER DETAIL RESPONSE:", res.data);

        const data = res.data?.data || res.data?.order || res.data;
        setOrder(data || null);
      } catch (err: any) {
        console.error("Failed to fetch order detail:", err);
        setError(err?.message || "Failed to fetch order detail");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const customerName =
    order?.customer_name ||
    order?.user?.name ||
    order?.user?.full_name ||
    "Customer";

  const customerEmail =
    order?.customer_email ||
    order?.user?.email ||
    "-";

  const customerPhone =
    order?.customer_phone ||
    order?.user?.phone ||
    (typeof order?.shipping_address === "object" && order?.shipping_address?.phone) ||
    "-";

  const subtotal = order?.subtotal ?? 0;
  const shipping = order?.shipping_amount ?? order?.shipping_fee ?? 0;
  const total = order?.total_amount ?? order?.total ?? 0;

  return (
    <AdminLayout title="Order Details">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          ← Back to Orders
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6">Loading order...</div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && order && (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 space-y-3">
              <h3 className="text-lg font-semibold">Order Info</h3>
              <p>
                <span className="font-medium">Order:</span>{" "}
                {order.order_number || order.id}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {getOrderStatus(order)}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.payment_status || "Pending"}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 space-y-3">
              <h3 className="text-lg font-semibold">Customer Info</h3>
              <p>
                <span className="font-medium">Name:</span> {customerName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customerEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {customerPhone}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-lg font-semibold">Shipping Address</h3>

            {typeof order.shipping_address === "string" ? (
              <p>{order.shipping_address}</p>
            ) : order.shipping_address ? (
              <div className="space-y-1 text-sm text-gray-700">
                <p>{order.shipping_address.full_name || ""}</p>
                <p>{order.shipping_address.line1 || ""}</p>
                {order.shipping_address.line2 ? (
                  <p>{order.shipping_address.line2}</p>
                ) : null}
                <p>
                  {order.shipping_address.city || ""}{" "}
                  {order.shipping_address.state || ""}
                </p>
                <p>
                  {order.shipping_address.postal_code || ""}{" "}
                  {order.shipping_address.country || ""}
                </p>
                {order.shipping_address.phone ? (
                  <p>{order.shipping_address.phone}</p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address found.</p>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Ordered Items</h3>

            {!order.items || order.items.length === 0 ? (
              <p className="text-sm text-gray-500">No order items found.</p>
            ) : (
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const itemName =
                    item.product?.name || item.product_name || "Product";
                  const itemImage =
                    item.product?.thumbnail ||
                    item.product?.image ||
                    item.thumbnail ||
                    "";
                  const itemQty = item.quantity ?? 0;
                  const itemPrice = item.unit_price ?? item.price ?? 0;
                  const itemTotal =
                    item.line_total ?? item.total ?? itemQty * itemPrice;

                  return (
                    <div
                      key={item.id || `${itemName}-${index}`}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="h-16 w-16 rounded-lg border object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg border bg-gray-100" />
                        )}

                        <div>
                          <p className="font-medium">{itemName}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {itemQty}
                          </p>
                          <p className="text-sm text-gray-500">
                            Unit Price: ₹{itemPrice}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">₹{itemTotal}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Payment Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-base font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}