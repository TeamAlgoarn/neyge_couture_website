import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type Product = {
  id: string;
  name?: string;
  created_at?: string;
};

type Collection = {
  id: string;
  name?: string;
  created_at?: string;
};

type Order = {
  id: string;
  order_number?: string;
  total_amount?: number;
  total?: number;
  status?: string;
  order_status?: string;
  payment_status?: string;
  created_at?: string;
  customer_name?: string;
  user?: {
    name?: string;
    full_name?: string;
  } | null;
};

type VideoBooking = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  occasion?: string;
  preferred_date?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  created_at?: string;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [videoBookings, setVideoBookings] = useState<VideoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extractArray = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.items)) return data.data.items;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.collections)) return data.collections;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.bookings)) return data.bookings;
    return [];
  };

  const getOrderStatus = (order: { order_status?: string; status?: string }) =>
    order.order_status || order.status || "Pending";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsRes, collectionsRes, ordersRes, videoBookingsRes] =
          await Promise.all([
            adminApi.get("/products"),
            adminApi.get("/collections"),
            adminApi.get("/orders/admin/all"),
            adminApi.get("/video-bookings"),
          ]);

        setProducts(extractArray(productsRes.data));
        setCollections(extractArray(collectionsRes.data));
        setOrders(extractArray(ordersRes.data));
        setVideoBookings(extractArray(videoBookingsRes.data));
      } catch (err: any) {
        console.error("Failed to load dashboard data", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + Number(order.total_amount ?? order.total ?? 0);
    }, 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [orders]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [products]);

  const recentVideoBookings = useMemo(() => {
    return [...videoBookings]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [videoBookings]);

  return (
    <AdminLayout title="Dashboard">
      {loading && (
        <div className="rounded-2xl border bg-white p-6">Loading dashboard...</div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border bg-white p-6">
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="mt-2 text-3xl font-bold">{products.length}</h3>
              <Link
                to="/admin/products"
                className="mt-4 inline-block text-sm text-blue-600"
              >
                View products
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <p className="text-sm text-gray-500">Total Collections</p>
              <h3 className="mt-2 text-3xl font-bold">{collections.length}</h3>
              <Link
                to="/admin/collections"
                className="mt-4 inline-block text-sm text-blue-600"
              >
                View collections
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="mt-2 text-3xl font-bold">{orders.length}</h3>
              <Link
                to="/admin/orders"
                className="mt-4 inline-block text-sm text-blue-600"
              >
                View orders
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <p className="text-sm text-gray-500">Video Bookings</p>
              <h3 className="mt-2 text-3xl font-bold">{videoBookings.length}</h3>
              <Link
                to="/admin/video-bookings"
                className="mt-4 inline-block text-sm text-blue-600"
              >
                View bookings
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="mt-2 text-3xl font-bold">₹{totalRevenue}</h3>
              <p className="mt-4 text-sm text-gray-500">
                Based on current order totals
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border bg-white p-6 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <Link to="/admin/orders" className="text-sm text-blue-600">
                  View all
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500">No orders found.</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border p-4">
                      <p className="font-medium">
                        {order.order_number || `Order ${order.id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer:{" "}
                        {order.customer_name ||
                          order.user?.name ||
                          order.user?.full_name ||
                          "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ₹{order.total_amount ?? order.total ?? 0}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {getOrderStatus(order)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Video Bookings</h3>
                <Link to="/admin/video-bookings" className="text-sm text-blue-600">
                  View all
                </Link>
              </div>

              {recentVideoBookings.length === 0 ? (
                <p className="text-sm text-gray-500">No video bookings found.</p>
              ) : (
                <div className="space-y-3">
                  {recentVideoBookings.map((booking) => (
                    <div key={booking.id} className="rounded-xl border p-4">
                      <p className="font-medium">{booking.name || "Unknown User"}</p>
                      <p className="text-sm text-gray-500">
                        {booking.email || "No email"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Occasion: {booking.occasion || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {booking.status || "pending"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Latest Products</h3>
              <Link to="/admin/products" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            {latestProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No products found.</p>
            ) : (
              <div className="space-y-3">
                {latestProducts.map((product) => (
                  <div key={product.id} className="rounded-xl border p-4">
                    <p className="font-medium">
                      {product.name || "Untitled Product"}
                    </p>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}