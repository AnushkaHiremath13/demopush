import { useNavigate } from "react-router-dom";
import "./auth.css";
import church from "../../assets/church.png";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();                // stop refresh
    navigate("/admin/dashboard");     // go to dashboard
  };

  return (
    <div className="auth-wrapper register-layout">

      <div className="auth-form">
        <div className="form-box">

          <h1>Register</h1>

          {/* FORM START */}
          <form onSubmit={handleRegister}>

            <input type="text" placeholder="Your full name" name="uname" required />
            <input type="email" placeholder="Email" name="uemail" required />
            <input type="text" placeholder="Contact number" name="uphone" required />
            <input type="text" placeholder="Church Code" name="ccode" />
            <input type="password" placeholder="Set Password" name="upassword" required />
            <input type="password" placeholder="Confirm Password" name="uconfirmpassword" required />

            <p className="switch small">
              Already have an Account?
              <span onClick={() => navigate("/")}> Login</span>
            </p>

            <button type="submit" className="primary-btn">
              Next
            </button>

          </form>
          {/* FORM END */}

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
