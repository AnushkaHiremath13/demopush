import { useNavigate } from "react-router-dom";
import "./auth.css";
import church from "../../assets/church.png";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();              // stop page refresh
    navigate("/admin/dashboard");   // go to dashboard
  };

  return (
    <div className="auth-wrapper login-layout">

      <div className="auth-form">
        <div className="form-box">

          <h1>Login</h1>

          {/* FORM START */}
          <form onSubmit={handleLogin}>

            <input type="text" placeholder="Username" id="uname" required />
            <input type="password" placeholder="Password" id="upassword" required />

            <p className="forgot">Forgot Password!</p>

            <button type="submit" className="primary-btn">
              Login
            </button>

          </form>
          {/* FORM END */}

          <p className="switch">
            Don’t have an account?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>

          <div className="or">Or</div>

          <button className="google-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
            Continue with Google
          </button>

        </div>
      </div>

      <div className="auth-image curved-right">
        <img src={church} alt="church" />
      </div>

    </div>
  );
}
