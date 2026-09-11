import { useState } from "react";
import { Link } from "react-router-dom";
import AdminAuthLayout from "../components/AdminAuthLayout";
import adminApi from "../lib/adminApi";

const GENERIC_SUCCESS = "If an account exists for this email, a password reset link has been sent.";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");
    try {
      await adminApi.post("/auth/forgot-password", { email });
      setMessage(GENERIC_SUCCESS);
    } catch (requestError: unknown) {
      const apiError = requestError as { response?: { status?: number } };
      setError(
        apiError.response?.status === 429
          ? "Too many reset requests. Please wait a minute and try again."
          : "Password recovery is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthLayout title="Recover Access" subtitle="Request a secure administrator password reset link">
      <form onSubmit={handleSubmit} className="admin-auth-form">
        <div className="admin-auth-field">
          <label htmlFor="recovery-email">Email Address</label>
          <input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>
        {message && <div className="admin-auth-success" role="status">{message}</div>}
        {error && <div className="admin-auth-error" role="alert">{error}</div>}
        <button type="submit" disabled={loading} className="admin-auth-button">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <Link className="admin-auth-back-link" to="/admin/login">Back to admin login</Link>
      </form>
    </AdminAuthLayout>
  );
}
