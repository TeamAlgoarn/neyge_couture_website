import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";

const CSS = `
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
}
.admin-main {
  flex: 1;
  overflow-x: auto;
  padding: 24px 32px;
}
.admin-mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  background: rgba(255,249,240,.95);
  border: 1px solid rgba(196,152,10,.3);
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  backdrop-filter: blur(8px);
}
/* Desktop sidebar visible by default */
.admin-sidebar-desktop {
  display: block;
}
/* Mobile sidebar container hidden by default */
.admin-sidebar-mobile {
  display: none;
}

@media (max-width: 768px) {
  .admin-main {
    padding: 80px 16px 24px;
  }
  .admin-mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Hide desktop sidebar on mobile */
  .admin-sidebar-desktop {
    display: none;
  }
  /* Mobile drawer styles */
  .admin-sidebar-mobile {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: 200;
    transition: transform 0.3s ease;
    background: rgba(255,249,240,.97);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(196,152,10,.22);
  }
  .admin-sidebar-mobile.closed {
    transform: translateX(-100%);
  }
  .admin-sidebar-mobile.open {
    transform: translateX(0);
  }
  .admin-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 199;
  }
}
`;

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-layout">
        {/* Desktop sidebar */}
        <div className="admin-sidebar-desktop">
          <AdminSidebar />
        </div>

        {/* Mobile menu button */}
        <button
          className="admin-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} color="#800020" />
        </button>

        {/* Mobile sidebar drawer - single container with dynamic class */}
        <div className={`admin-sidebar-mobile ${mobileMenuOpen ? "open" : "closed"}`}>
          <div style={{ position: "relative", height: "100%" }}>
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} color="#800020" />
            </button>
            <AdminSidebar />
          </div>
        </div>

        {/* Overlay */}
        {mobileMenuOpen && (
          <div className="admin-overlay" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Main content */}
        <main className="admin-main">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 400, color: "#800020", letterSpacing: "0.04em" }}>
              {title}
            </h1>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}