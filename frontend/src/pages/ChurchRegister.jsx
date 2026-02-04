import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function ChurchRegister() {
  const [formData, setFormData] = useState({
    ccode: "",
    cname: "",
    caddress: "",
    cemail: "",
    ccity: "",
    cstate: "",
    ccountry: "",
    cpincode: "",
    cdenomination: "",
    ctimezone: "Asia/Kolkata",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ccode") {
      setFormData({ ...formData, ccode: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/church/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // ✅ SAFE JSON PARSING
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.message || "Church registration failed");
      }

      alert("Church registration submitted for approval ✅");

      setFormData({
        ccode: "",
        cname: "",
        caddress: "",
        cemail: "",
        ccity: "",
        cstate: "",
        ccountry: "",
        cpincode: "",
        cdenomination: "",
        ctimezone: "Asia/Kolkata",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Church Registration</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="ccode"
          placeholder="Church Code"
          value={formData.ccode}
          onChange={handleChange}
          style={{ textTransform: "uppercase" }}
          required
        />

        <input name="cname" placeholder="Church Name" value={formData.cname} onChange={handleChange} required />
        <input name="cemail" type="email" placeholder="Church Email" value={formData.cemail} onChange={handleChange} required />
        <input name="caddress" placeholder="Address" value={formData.caddress} onChange={handleChange} />
        <input name="ccity" placeholder="City" value={formData.ccity} onChange={handleChange} />
        <input name="cstate" placeholder="State" value={formData.cstate} onChange={handleChange} />
        <input name="ccountry" placeholder="Country" value={formData.ccountry} onChange={handleChange} />
        <input name="cpincode" placeholder="Pincode" value={formData.cpincode} onChange={handleChange} />
        <input name="cdenomination" placeholder="Denomination" value={formData.cdenomination} onChange={handleChange} />

        <select name="ctimezone" value={formData.ctimezone} onChange={handleChange}>
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="UTC">UTC</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register Church"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};
