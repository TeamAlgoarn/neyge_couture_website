import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminAuthLayout from "../components/AdminAuthLayout";
import { adminAuth } from "../lib/adminAuth";
import adminApi from "../lib/adminApi";

type LoginResponse = {
  data?: {
    access_token?: string;
    user?: { id: string; email: string; role?: string; is_active?: boolean };
  };
};

function getErrorMessage(error: unknown): string {
  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return apiError.response?.data?.message || apiError.message || "Login failed. Please try again.";
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const successMessage = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    adminAuth.removeToken();
    setError("");
    setLoading(true);

    try {
      const response = await adminApi.post<LoginResponse>("/auth/admin/login", {
        email,
        password,
      });
      const token = response.data?.data?.access_token;
      const user = response.data?.data?.user;

      if (!token || user?.role !== "admin" || user.is_active !== true) {
        throw new Error("Admin access required");
      }

      adminAuth.setToken(token);
      navigate("/admin/dashboard", { replace: true });
    } catch (loginError: unknown) {
      adminAuth.removeToken();
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthLayout
      title="Admin Portal"
      subtitle="Sign in to manage products, orders and collections"
    >
      <form onSubmit={handleLogin} className="admin-auth-form">
        {successMessage && <div className="admin-auth-success">{successMessage}</div>}
        <div className="admin-auth-field">
          <label htmlFor="admin-email">Email Address</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="admin-auth-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="admin-auth-link-row">
          <Link to="/admin/forgot-password">Forgot password?</Link>
        </div>
        {error && <div className="admin-auth-error" role="alert">{error}</div>}
        <button type="submit" disabled={loading} className="admin-auth-button">
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AdminAuthLayout>
  );
}
