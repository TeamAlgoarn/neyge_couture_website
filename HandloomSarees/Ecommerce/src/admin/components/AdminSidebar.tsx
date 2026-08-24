import { NavLink, useNavigate } from "react-router-dom";
import { adminAuth } from "../lib/adminAuth";
import { LayoutDashboard, Package, Layers, ShoppingBag, LogOut, Sparkles } from "lucide-react";

const C = {
  maroon: '#800020',
  gold: '#C4980A',
};

const CSS = `
.admin-sidebar {
  width: 280px;
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(196,152,10,.22);
  display: flex;
  flex-direction: column;
  font-family: 'Josefin Sans', sans-serif;
  height: 100%;
}
.admin-sidebar-header {
  padding: 28px 24px;
  border-bottom: 1px solid rgba(196,152,10,.18);
}
.admin-sidebar-logo {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 500;
  color: #800020;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.admin-sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #4a3828;
  text-decoration: none;
  transition: all .25s ease;
}
.admin-nav-link:hover {
  background: rgba(196,152,10,.08);
  color: #800020;
}
.admin-nav-link.active {
  background: linear-gradient(135deg, rgba(128,0,32,.08) 0%, rgba(196,152,10,.12) 100%);
  color: #800020;
  border-left: 3px solid #C4980A;
}
.admin-nav-icon {
  width: 20px;
  height: 20px;
}
.admin-logout-btn {
  margin: 24px 16px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #dc2626;
  background: transparent;
  border: 1.5px solid rgba(220,38,38,.3);
  cursor: pointer;
  transition: all .25s ease;
  width: calc(100% - 32px);
}
.admin-logout-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}
`;

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.removeToken();
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/collections", label: "Collections", icon: Layers },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/chatbot-leads", label: "Chatbot Leads", icon: Sparkles },
  ];

  return (
    <>
      <style>{CSS}</style>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <Sparkles size={20} color={C.gold} />
            Neyge Admin
          </div>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon className="admin-nav-icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}