import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { adminAuth } from "../lib/adminAuth";
import adminApi from "../lib/adminApi";

export default function AdminRoute() {
  const [authorization, setAuthorization] = useState<"checking" | "allowed" | "denied">(
    adminAuth.isLoggedIn() ? "checking" : "denied"
  );

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) return;

    let active = true;
    adminApi.get("/auth/me")
      .then((response) => {
        const profile = response.data?.data;
        if (!active) return;
        if (profile?.role === "admin" && profile?.is_active === true) {
          setAuthorization("allowed");
        } else {
          adminAuth.removeToken();
          setAuthorization("denied");
        }
      })
      .catch(() => {
        if (!active) return;
        adminAuth.removeToken();
        setAuthorization("denied");
      });

    return () => {
      active = false;
    };
  }, []);

  if (authorization === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  if (authorization === "checking") {
    return <div className="grid min-h-screen place-items-center bg-[#FFF9F0] text-[#800020]">Verifying administrator access...</div>;
  }

  return <Outlet />;
}
