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
  });

  const [loading, setLoading] = useState(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= PLATFORM LOGIN ================= */

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 PLATFORM LOGIN — NO SCOPE, NO FLAGS
      const res = await api("/auth/login", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      // ✅ STORE ONLY TOKEN
      localStorage.setItem("token", res.token);

      // ✅ REDIRECT TO PLATFORM DASHBOARD
      navigate("/platform/dashboard");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper login-layout">
      <div className="auth-form">
        <div className="form-box">
          <h1>Platform Login</h1>

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

          <button
            className="primary-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      <div className="auth-image curved-right">
        <img src={church} alt="church" />
      </div>
    </div>
  );
}
