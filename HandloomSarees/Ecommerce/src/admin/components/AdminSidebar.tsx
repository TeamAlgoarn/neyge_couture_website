import { NavLink, useNavigate } from "react-router-dom";
import { adminAuth } from "../lib/adminAuth";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.removeToken();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium ${
      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/collections" className={linkClass}>
          Collections
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-lg border border-red-200 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}