// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../api/api";
// //import "./auth.css";
// import church from "../assets/church.png";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     uname: "",
//     uemail: "",
//     uphone: "",
//     ccode: "",
//     upassword: "",
//     uconfirmpassword: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async () => {
//     try {
//       const res = await api("/auth/register", {
//         method: "POST",
//         body: JSON.stringify(formData),
//       });

//       alert(res.message);
//       navigate("/");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleGoogleRegister = () => {
//     alert("Google registration will be enabled soon");
//     // Later: window.location.href = "http://localhost:5000/api/auth/google";
//   };

//   return (
//     <div className="auth-wrapper register-layout">
//       <div className="auth-form">
//         <div className="form-box">
//           <h1>Register</h1>

//           <input
//             type="text"
//             placeholder="Your full name"
//             name="uname"
//             value={formData.uname}
//             onChange={handleChange}
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             name="uemail"
//             value={formData.uemail}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             placeholder="Contact number"
//             name="uphone"
//             value={formData.uphone}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             placeholder="Church Code"
//             name="ccode"
//             value={formData.ccode}
//             onChange={handleChange}
//           />

//           <input
//             type="password"
//             placeholder="Set Password"
//             name="upassword"
//             value={formData.upassword}
//             onChange={handleChange}
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             name="uconfirmpassword"
//             value={formData.uconfirmpassword}
//             onChange={handleChange}
//           />

//           <button className="primary-btn" onClick={handleRegister}>
//             Next
//           </button>

//           <p className="switch small">
//             Already have an Account?
//             <span onClick={() => navigate("/")}> Login</span>
//           </p>

//           <div className="or">Or</div>

//           <button className="google-btn" onClick={handleGoogleRegister}>
//             <img
//               src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//               alt="google"
//             />
//             Continue with Google
//           </button>
//         </div>
//       </div>

//       <div className="auth-image curved-right">
//         <img src={church} alt="church" />
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uname: "",
    uemail: "",
    uphone: "",
    ccode: "",
    upassword: "",
    uconfirmpassword: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    const {
      uname,
      uemail,
      upassword,
      uconfirmpassword,
    } = formData;

    // 🔒 basic validation
    if (!uname || !uemail || !upassword || !uconfirmpassword) {
      alert("Please fill all required fields");
      return;
    }

    if (upassword !== uconfirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      alert(res.message || "Registration successful");
      navigate("/");

    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40, maxWidth: 420 }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Full Name"
        name="uname"
        value={formData.uname}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        name="uemail"
        value={formData.uemail}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Phone Number"
        name="uphone"
        value={formData.uphone}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Church Code (optional)"
        name="ccode"
        value={formData.ccode}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        name="upassword"
        value={formData.upassword}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Confirm Password"
        name="uconfirmpassword"
        value={formData.uconfirmpassword}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p style={{ marginTop: 16 }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
