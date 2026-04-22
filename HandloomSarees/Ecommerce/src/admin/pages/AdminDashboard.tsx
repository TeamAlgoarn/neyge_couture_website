import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Video,
  Sparkles,
} from "lucide-react";

// ─── Brand palette (matches all other pages) ─────────────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.admin-dashboard {
  font-family: 'Josefin Sans', sans-serif;
  word-break: break-word;
}

/* Stats Cards */
.admin-stat-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 24px;
  transition: transform .3s, box-shadow .3s;
}
.admin-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(128,0,32,.1);
  border-color: rgba(196,152,10,.4);
}
.admin-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.admin-stat-label {
  font-family: 'Josefin Sans';
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #9a8070;
  font-weight: 500;
  margin-bottom: 8px;
}
.admin-stat-value {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  font-weight: 500;
  color: #800020;
  line-height: 1;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.admin-stat-link {
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 600;
  color: #C4980A;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap .25s;
  padding: 4px 0;
}
.admin-stat-link:hover { gap: 10px; color: #800020; }

/* Section Cards */
.admin-section-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}
.admin-section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(196,152,10,.18);
}
.admin-section-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.02em;
}
.admin-section-link {
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 600;
  color: #C4980A;
  text-decoration: none;
  transition: color .2s;
  padding: 4px 0;
}
.admin-section-link:hover { color: #800020; }

/* List Items */
.admin-list-item {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
  transition: box-shadow .25s, border-color .25s;
}
.admin-list-item:hover {
  box-shadow: 0 6px 22px rgba(128,0,32,.09);
  border-color: rgba(196,152,10,.4);
}
.admin-list-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
.admin-list-meta {
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: #9a8070;
  font-weight: 300;
  line-height: 1.6;
}

/* Loading & Error */
.admin-loading,
.admin-error {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  font-family: 'Josefin Sans';
  font-size: 14px;
}
.admin-error { color: #dc2626; border-color: rgba(220,38,38,.3); background: rgba(254,226,226,.8); }

/* Grid */
.admin-grid {
  display: grid;
  gap: 24px;
}
.admin-stats-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.admin-three-col {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr 1fr;
}
.admin-two-col {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
}
/* Responsive overrides */
@media(max-width: 1024px) {
  .admin-three-col { grid-template-columns: 1fr 1fr; }
}
@media(max-width: 768px) {
  .admin-stats-grid { gap: 16px; }
  .admin-stat-card { padding: 20px; }
  .admin-stat-value { font-size: 28px; }
  .admin-three-col { grid-template-columns: 1fr; }
  .admin-two-col { grid-template-columns: 1fr; }
  .admin-section-card { padding: 20px; }
  .admin-list-item { padding: 14px; }
}
@media(max-width: 480px) {
  .admin-stat-card { padding: 16px; }
  .admin-stat-value { font-size: 24px; }
  .admin-section-title { font-size: 18px; }
  .admin-list-title { font-size: 15px; }
}
`;

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

type FestiveCollection = {
  id: string;
  name?: string;
  slug?: string;
  created_at?: string;
  is_active?: boolean;
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
  const [festiveCollections, setFestiveCollections] = useState<FestiveCollection[]>([]);
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

        const [
          productsRes,
          collectionsRes,
          festiveCollectionsRes,
          ordersRes,
          videoBookingsRes,
        ] = await Promise.all([
          adminApi.get("/products"),
          adminApi.get("/collections"),
          adminApi.get("/admin/festive-collections"),
          adminApi.get("/orders/admin/all"),
          adminApi.get("/video-bookings"),
        ]);

        setProducts(extractArray(productsRes.data));
        setCollections(extractArray(collectionsRes.data));
        setFestiveCollections(extractArray(festiveCollectionsRes.data));
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

  const STATS = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      link: "/admin/products",
      color: C.goldV,
    },
    {
      label: "Total Collections",
      value: collections.length,
      icon: Layers,
      link: "/admin/collections",
      color: C.goldV,
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      link: "/admin/orders",
      color: C.goldV,
    },
    {
      label: "Festive Collections",
      value: festiveCollections.length,
      icon: Sparkles,
      link: "/admin/festive-collections",
      color: C.goldV,
    },
    {
      label: "Video Bookings",
      value: videoBookings.length,
      icon: Video,
      link: "/admin/video-bookings",
      color: C.goldV,
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      link: "/admin/orders",
      color: C.goldV,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title="Dashboard">
        <div className="admin-dashboard">
          {loading && (
            <div className="admin-loading">Loading dashboard...</div>
          )}

          {error && (
            <div className="admin-error">{error}</div>
          )}

          {!loading && !error && (
            <div className="admin-grid">
              <div className="admin-stats-grid">
                {STATS.map((stat) => (
                  <div key={stat.label} className="admin-stat-card">
                    <div className="admin-stat-icon">
                      <stat.icon size={22} color={stat.color} />
                    </div>
                    <div className="admin-stat-label">{stat.label}</div>
                    <div className="admin-stat-value">{stat.value}</div>
                    <Link to={stat.link} className="admin-stat-link">
                      View details <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="admin-three-col">
                <div className="admin-section-card" style={{ gridColumn: "span 2" }}>
                  <div className="admin-section-header">
                    <h3 className="admin-section-title">Recent Orders</h3>
                    <Link to="/admin/orders" className="admin-section-link">
                      View all
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <p className="admin-list-meta">No orders found.</p>
                  ) : (
                    <div>
                      {recentOrders.map((order) => (
                        <div key={order.id} className="admin-list-item">
                          <div className="admin-list-title">
                            {order.order_number || `Order ${order.id.slice(0, 8)}`}
                          </div>
                          <div className="admin-list-meta">
                            Customer:{" "}
                            {order.customer_name ||
                              order.user?.name ||
                              order.user?.full_name ||
                              "Customer"}
                          </div>
                          <div className="admin-list-meta">
                            Total: ₹{(order.total_amount ?? order.total ?? 0).toLocaleString("en-IN")}
                          </div>
                          <div className="admin-list-meta">
                            Status: {getOrderStatus(order)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-section-card">
                  <div className="admin-section-header">
                    <h3 className="admin-section-title">Recent Video Bookings</h3>
                    <Link to="/admin/video-bookings" className="admin-section-link">
                      View all
                    </Link>
                  </div>

                  {recentVideoBookings.length === 0 ? (
                    <p className="admin-list-meta">No video bookings found.</p>
                  ) : (
                    <div>
                      {recentVideoBookings.map((booking) => (
                        <div key={booking.id} className="admin-list-item">
                          <div className="admin-list-title">
                            {booking.name || "Unknown User"}
                          </div>
                          <div className="admin-list-meta">
                            {booking.email || "No email"}
                          </div>
                          <div className="admin-list-meta">
                            Occasion: {booking.occasion || "-"}
                          </div>
                          <div className="admin-list-meta">
                            Status: {booking.status || "pending"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-section-card">
                <div className="admin-section-header">
                  <h3 className="admin-section-title">Latest Products</h3>
                  <Link to="/admin/products" className="admin-section-link">
                    View all
                  </Link>
                </div>

                {latestProducts.length === 0 ? (
                  <p className="admin-list-meta">No products found.</p>
                ) : (
                  <div className="admin-two-col">
                    {latestProducts.map((product) => (
                      <div key={product.id} className="admin-list-item">
                        <div className="admin-list-title">
                          {product.name || "Untitled Product"}
                        </div>
                        <div className="admin-list-meta">ID: {product.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}