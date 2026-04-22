import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminCollections from "./AdminCollections";
import AdminOrders from "./AdminOrders";
import AdminOrderDetail from "./AdminOrderDetail";
import AdminVideoBookingsPage from "./AdminVideoBookingsPage";

function RequireAdminAuth({ children }: { children: ReactElement }) {
  const token =
    localStorage.getItem("admin_access_token") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function AdminRoute() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <RequireAdminAuth>
            <AdminDashboard />
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/products"
        element={
          <RequireAdminAuth>
            <AdminProducts />
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/collections"
        element={
          <RequireAdminAuth>
            <AdminCollections />
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <RequireAdminAuth>
            <AdminOrders />
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <RequireAdminAuth>
            <AdminOrderDetail />
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/video-bookings"
        element={
          <RequireAdminAuth>
            <AdminVideoBookingsPage />
          </RequireAdminAuth>
        }
      />
      

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}