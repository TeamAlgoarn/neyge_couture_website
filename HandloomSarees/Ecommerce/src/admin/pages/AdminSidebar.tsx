import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Products", path: "/admin/products" },
  { label: "Collections", path: "/admin/collections" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Video Bookings", path: "/admin/video-bookings" },
  
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4">
      <h2 className="mb-8 text-3xl font-bold">Admin Panel</h2>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 w-full rounded-xl border border-red-200 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}