import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./auth.css";
import church from "../assets/church.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    login_scope: "COMMUNITY", // default
  });

  const [loading, setLoading] = useState(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    const { email, password, login_scope } = formData;

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim().toLowerCase(),
        password,
        login_scope,
      };

      const res = await api("/auth/login", {
        method: "POST",
        body: payload,
      });

      // ✅ store token
      localStorage.setItem("token", res.token);
      localStorage.setItem("scope", res.scope);

      // optional identity storage
      localStorage.setItem("identity", JSON.stringify(res.identity));

      // ✅ role-based redirect
      if (res.scope === "PLATFORM") {
        navigate("/platform/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="auth-wrapper login-layout">
      <div className="auth-form">
        <div className="form-box">
          <h1>Login</h1>

          {/* LOGIN SCOPE */}
          <select
            name="login_scope"
            value={formData.login_scope}
            onChange={handleChange}
          >
            <option value="COMMUNITY">Community User</option>
            <option value="PLATFORM">Platform Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <p className="forgot">Forgot Password?</p>

          <button
            className="primary-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="switch">
            Don’t have an account?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>
        </div>
      </div>

      <div className="auth-image curved-right">
        <img src={church} alt="church" />
      </div>
    </div>
  );
}
