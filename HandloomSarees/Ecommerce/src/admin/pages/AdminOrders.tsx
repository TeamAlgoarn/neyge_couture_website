import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type Order = {
  id: string;
  order_number?: string;
  status?: string;
  order_status?: string;
  payment_status?: string;
  total_amount?: number;
  total?: number;
  created_at?: string;
  user?: {
    name?: string;
    full_name?: string;
    email?: string;
  } | null;
  customer_name?: string;
  customer_email?: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCustomerName = (order: Order) =>
    order.customer_name || order.user?.name || order.user?.full_name || "Customer";

  const getCustomerEmail = (order: Order) =>
    order.customer_email || order.user?.email || "-";

  const getOrderTotal = (order: Order) =>
    order.total_amount ?? order.total ?? 0;

  const getOrderStatus = (order: Order) =>
    order.order_status || order.status || "Pending";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.get("/orders/admin/all");
      console.log("ORDERS API RESPONSE:", res.data);

      let items: Order[] = [];

      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data?.data)) {
        items = res.data.data;
      } else if (Array.isArray(res.data?.data?.items)) {
        items = res.data.data.items;
      } else if (Array.isArray(res.data?.orders)) {
        items = res.data.orders;
      } else if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      }

      setOrders(items);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6">Loading orders...</div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border bg-white p-6">
          <p className="mb-4 text-sm text-gray-500">
            Total orders: {orders.length}
          </p>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {order.order_number || `Order ${order.id.slice(0, 8)}`}
                    </p>

                    <p className="text-sm text-gray-500">
                      Customer: {getCustomerName(order)}
                    </p>

                    <p className="text-sm text-gray-500">
                      Email: {getCustomerEmail(order)}
                    </p>

                    <p className="text-sm text-gray-500">
                      Total: ₹{getOrderTotal(order)}
                    </p>

                    <p className="text-sm text-gray-500">
                      Payment: {order.payment_status || "Pending"}
                    </p>

                    <p className="text-sm">
                      Status:{" "}
                      <span className="font-medium">
                        {getOrderStatus(order)}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <div>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}