import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminAuthLayout from "../components/AdminAuthLayout";
import adminApi from "../lib/adminApi";
import { ADMIN_PASSWORD_POLICY, getAdminPasswordError } from "../lib/passwordPolicy";

type RecoveryCredentials = {
  accessToken: string;
  refreshToken: string;
  recoveryType: "recovery";
};

function readRecoveryCredentials(): RecoveryCredentials | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  const recoveryType = hash.get("type");

  if (!accessToken || !refreshToken || recoveryType !== "recovery") return null;
  return { accessToken, refreshToken, recoveryType };
}

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [credentials] = useState<RecoveryCredentials | null>(readRecoveryCredentials);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, document.title, window.location.pathname);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || !credentials) return;

    const policyError = getAdminPasswordError(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await adminApi.post("/auth/reset-password", {
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
        recovery_type: credentials.recoveryType,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      window.setTimeout(() => {
        navigate("/admin/login", {
          replace: true,
          state: { message: "Password reset successfully. Sign in with your new password." },
        });
      }, 1200);
    } catch {
      setError("This password recovery link is invalid or has expired. Request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthLayout title="Reset Password" subtitle="Choose a new password for your administrator account">
      {!credentials ? (
        <div className="admin-auth-form">
          <div className="admin-auth-error" role="alert">This recovery link is invalid or has expired.</div>
          <Link className="admin-auth-back-link" to="/admin/forgot-password">Request a new reset link</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="admin-auth-field">
            <label htmlFor="new-password">New Password</label>
            <input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" disabled={loading || success} required />
          </div>
          <div className="admin-auth-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" disabled={loading || success} required />
          </div>
          <p className="admin-auth-policy">{ADMIN_PASSWORD_POLICY}</p>
          {error && <div className="admin-auth-error" role="alert">{error}</div>}
          {success && <div className="admin-auth-success" role="status">Password updated. Redirecting to sign in...</div>}
          <button type="submit" disabled={loading || success} className="admin-auth-button">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </AdminAuthLayout>
  );
}
