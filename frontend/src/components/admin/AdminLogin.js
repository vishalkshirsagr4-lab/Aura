import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck as FaUserShield, User as FaUser, Lock as FaLock, Eye as FaEye, EyeOff as FaEyeSlash, Info as FaCircleInfo, LogIn as FaArrowRightToBracket, ArrowLeft as FaArrowLeft } from "lucide-react";
import { api, setToken } from "../../api";

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await api("/api/auth/login", { method: "POST", body: form });
      setToken(data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-badge">
          <FaUserShield />
        </div>
        <h1>Admin portal</h1>
        <p className="login-sub">AI-AURA · Sign in to manage the event</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="username">
              <FaUser /> Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Admin username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <div className="pw-wrap">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Admin password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="message-box warning" role="alert">
              <FaCircleInfo />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-register" disabled={loading}>
            <FaArrowRightToBracket />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to student portal
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;
