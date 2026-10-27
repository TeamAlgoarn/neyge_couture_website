import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { adminAuth } from "../lib/adminAuth";
import adminApi from "../lib/adminApi";
import { ADMIN_PASSWORD_POLICY, getAdminPasswordError } from "../lib/passwordPolicy";

export default function AdminSecurity() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const policyError = getAdminPasswordError(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await adminApi.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      adminAuth.removeToken();
      window.setTimeout(() => {
        navigate("/admin/login", {
          replace: true,
          state: { message: "Password changed successfully. Please sign in again." },
        });
      }, 1200);
    } catch (changeError: unknown) {
      const apiError = changeError as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || "Unable to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Account Security">
      <section className="max-w-xl rounded-3xl border border-[#C4980A]/25 bg-[#FFF9F0] p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl text-[#800020]">Change Password</h2>
        <p className="mt-2 text-sm leading-6 text-[#806c5f]">
          Confirm your current password. After the change, all refresh sessions are revoked and you must sign in again.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-[#4a3828]">
            Current Password
            <input className="mt-2 w-full rounded-xl border border-[#C4980A]/30 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#C4980A]/20" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" disabled={loading || success} required />
          </label>
          <label className="block text-sm font-medium text-[#4a3828]">
            New Password
            <input className="mt-2 w-full rounded-xl border border-[#C4980A]/30 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#C4980A]/20" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" disabled={loading || success} required />
          </label>
          <label className="block text-sm font-medium text-[#4a3828]">
            Confirm New Password
            <input className="mt-2 w-full rounded-xl border border-[#C4980A]/30 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#C4980A]/20" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" disabled={loading || success} required />
          </label>
          <p className="text-xs leading-5 text-[#806c5f]">{ADMIN_PASSWORD_POLICY}</p>
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
          {success && <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700" role="status">Password changed. Redirecting to sign in...</div>}
          <button className="rounded-xl bg-[#800020] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading || success}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
