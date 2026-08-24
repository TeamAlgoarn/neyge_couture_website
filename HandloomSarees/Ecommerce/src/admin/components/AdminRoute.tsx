import { Navigate, Outlet } from "react-router-dom";
import { adminAuth } from "../lib/adminAuth";

export default function AdminRoute() {
  if (!adminAuth.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}