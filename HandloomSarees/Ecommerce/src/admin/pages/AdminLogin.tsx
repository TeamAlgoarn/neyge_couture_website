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
    user?: { id: string; email: string; role?: string };
  };
  access_token?: string;
  token?: string;
  user?: { id: string; email: string; role?: string };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.login-bg {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #F5E6D3 0%, #FFF9F0 50%, #F8EEE2 100%);
  font-family: 'Josefin Sans', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 249, 240, 0.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196, 152, 10, 0.28);
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 20px 60px rgba(128, 0, 32, 0.10), 0 4px 16px rgba(0,0,0,0.06);
}

@media(min-width: 480px) {
  .login-card {
    border-radius: 28px;
    padding: 48px 40px;
  }
}

.login-ornament {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

@media(min-width: 480px) {
  .login-ornament { margin-bottom: 20px; }
}

.login-ornament-inner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(196, 152, 10, 0.12);
  border: 1px solid rgba(196, 152, 10, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media(min-width: 480px) {
  .login-ornament-inner { width: 64px; height: 64px; }
}

.login-ornament-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C4980A, #800020);
  opacity: 0.85;
}

@media(min-width: 480px) {
  .login-ornament-dot { width: 28px; height: 28px; }
}

.login-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 600;
  color: #800020;
  text-align: center;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

@media(min-width: 480px) {
  .login-title { font-size: 26px; margin-bottom: 8px; }
}

.login-subtitle {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #9a8070;
  text-align: center;
  letter-spacing: 0.06em;
  margin-bottom: 24px;
}

@media(min-width: 480px) {
  .login-subtitle { font-size: 13px; margin-bottom: 36px; }
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

@media(min-width: 480px) {
  .login-divider { margin-bottom: 28px; }
}

.login-divider-line {
  flex: 1;
  height: 1px;
  background: rgba(196, 152, 10, 0.22);
}
.login-divider-diamond {
  width: 6px;
  height: 6px;
  background: #C4980A;
  transform: rotate(45deg);
  opacity: 0.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media(min-width: 480px) {
  .login-form { gap: 20px; }
}

.login-field label {
  display: block;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9a8070;
  margin-bottom: 7px;
}

.login-input {
  width: 100%;
  background: rgba(255, 249, 240, 0.8);
  border: 1px solid rgba(196, 152, 10, 0.28);
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #4a3828;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-sizing: border-box;
}

@media(min-width: 480px) {
  .login-input { border-radius: 14px; padding: 14px 18px; }
}

.login-input::placeholder { color: #c5b8ad; font-weight: 300; }
.login-input:focus {
  border-color: rgba(196, 152, 10, 0.55);
  box-shadow: 0 0 0 3px rgba(196, 152, 10, 0.10);
  background: #FFF9F0;
}

.login-error {
  background: rgba(254, 226, 226, 0.85);
  border: 1px solid rgba(220, 38, 38, 0.25);
  border-radius: 12px;
  padding: 11px 14px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  color: #dc2626;
  letter-spacing: 0.02em;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #800020 0%, #5a0016 100%);
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #F5E6D3;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.2s, box-shadow 0.25s;
  box-shadow: 0 6px 20px rgba(128, 0, 32, 0.28);
  margin-top: 4px;
  -webkit-tap-highlight-color: transparent;
}

@media(min-width: 480px) {
  .login-btn { border-radius: 14px; padding: 15px 24px; font-size: 14px; }
}

.login-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(128, 0, 32, 0.32);
}
.login-btn:active:not(:disabled) { transform: translateY(0); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
`;

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
      const res = await adminApi.post<LoginResponse>("/auth/login", { email, password });
      const token =
        res.data?.data?.access_token ||
        res.data?.data?.token ||
        res.data?.access_token ||
        res.data?.token;
      const user = res.data?.data?.user || res.data?.user;
      if (!token) throw new Error("Token not found in login response");
      if (user?.role && user.role !== "admin") throw new Error("You are not authorized as admin");
      adminAuth.setToken(token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-ornament">
            <div className="login-ornament-inner">
              <div className="login-ornament-dot" />
            </div>
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">Sign in to manage products, orders &amp; collections</p>
          <div className="login-divider">
            <div className="login-divider-line" />
            <div className="login-divider-diamond" />
            <div className="login-divider-line" />
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label>Email Address</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}