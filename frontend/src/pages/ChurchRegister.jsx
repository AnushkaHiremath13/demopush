// import { useState } from "react";


// export default function ChurchRegister() {
//   const [formData, setFormData] = useState({
//     code: "",
//     name: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     denomination: "",
//     timezone: "Asia/Kolkata",
//   });

//   const [loading, setLoading] = useState(false);

//   /* ================= HANDLE CHANGE ================= */

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "code" ? value.toUpperCase() : value,
//     }));
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       code,
//       name,
//       email,
//       address,
//       city,
//       state,
//       country,
//       pincode,
//       denomination,
//       timezone,
//     } = formData;

//     if (!code || !name || !email) {
//       alert("Church code, name and email are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ BACKEND-CORRECT PAYLOAD
//       const payload = {
//         chr_app_code: code,
//         chr_app_name: name,
//         chr_app_email: email.toLowerCase(),
//         chr_app_denomination: denomination,
//         chr_app_location: address,
//         chr_app_timezone: timezone,
//         chr_app_city: city,
//         chr_app_state: state,
//         chr_app_country: country,
//         chr_app_pincode: pincode,
//       };

//       await api("/church/apply", {
//         method: "POST",
//         body: payload,
//       });

//       alert("Church application submitted for approval ✅");

//       setFormData({
//         code: "",
//         name: "",
//         email: "",
//         address: "",
//         city: "",
//         state: "",
//         country: "",
//         pincode: "",
//         denomination: "",
//         timezone: "Asia/Kolkata",
//       });
//     } catch (err) {
//       alert(err.message || "Church registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div style={styles.container}>
//       <h2>Church Registration</h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           name="code"
//           placeholder="Church Code"
//           value={formData.code}
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="name"
//           placeholder="Church Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="email"
//           type="email"
//           placeholder="Church Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
//         <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
//         <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
//         <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
//         <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
//         <input name="denomination" placeholder="Denomination" value={formData.denomination} onChange={handleChange} />

//         <select name="timezone" value={formData.timezone} onChange={handleChange}>
//           <option value="Asia/Kolkata">Asia/Kolkata</option>
//           <option value="UTC">UTC</option>
//         </select>

//         <button type="submit" disabled={loading}>
//           {loading ? "Submitting..." : "Register Church"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   container: {
//     maxWidth: "450px",
//     margin: "40px auto",
//     padding: "20px",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
// };
