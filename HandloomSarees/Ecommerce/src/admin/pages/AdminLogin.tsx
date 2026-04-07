import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth } from "../lib/adminAuth";
import adminApi from "../lib/adminApi";

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    access_token?: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  };
  access_token?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminApi.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const token =
        res.data?.data?.access_token ||
        res.data?.data?.token ||
        res.data?.access_token ||
        res.data?.token;

      const user = res.data?.data?.user || res.data?.user;

      if (!token) {
        throw new Error("Token not found in login response");
      }

      if (user?.role && user.role !== "admin") {
        throw new Error("You are not authorized as admin");
      }

      adminAuth.setToken(token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to manage products, orders, and collections
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}