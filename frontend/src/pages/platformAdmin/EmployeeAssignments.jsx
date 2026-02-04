import {  useState } from "react";
import "../../styles/dashboard.css";

export default function EmployeeAssignments() {
  const [assignments, setAssignments] = useState([]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cid, setCid] = useState("");

  const [csvFile, setCsvFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  /* ================= FETCH ASSIGNMENTS ================= */

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/platform/employee-assignments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error("Fetch assignments failed", err);
      setAssignments([]);
    }
  };

  
  /* ================= ADD SINGLE ASSIGNMENT ================= */

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email || !phone || !cid) return;

    try {
      const res = await fetch("/api/platform/employee-assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, phone, cid }),
      });

      if (!res.ok) {
        alert("Failed to assign employee");
        return;
      }

      await fetchAssignments();

      setEmail("");
      setPhone("");
      setCid("");
    } catch (err) {
      console.error("Assign employee error", err);
      alert("Something went wrong");
    }
  };

  /* ================= CSV BULK UPLOAD ================= */

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await fetch(
        "/api/platform/employee-assignments/bulk",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        alert("CSV upload failed");
        return;
      }

      const data = await res.json();
      setUploadResult(data);

      await fetchAssignments();
      setCsvFile(null);
    } catch (err) {
      console.error("CSV upload error", err);
      alert("CSV upload error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Employee Assignments</h1>

      <div className="dashboard-card">
        <h3>Assign New Employee</h3>

        <form onSubmit={handleAdd} className="assign-form">
          <input
            type="email"
            placeholder="Employee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Employee phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Church Code"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            required
          />

          <button className="approve-btn">Assign</button>
        </form>

        <hr />

        <h3>Bulk Assign via CSV</h3>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />

        <button
          className="approve-btn"
          onClick={handleCsvUpload}
          disabled={!csvFile}
        >
          Upload CSV
        </button>

        {uploadResult && (
          <div>
            <p>Inserted: {uploadResult.inserted}</p>
            <p>Duplicates: {uploadResult.duplicates}</p>
          </div>
        )}
      </div>

      <div className="dashboard-card large">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Church</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  {assignments.map((a) => (
    <tr key={a.eid}>
      <td>{a.eid}</td>
      <td>{a.email}</td>
      <td>{a.phone}</td>
      <td>{a.ccode}</td>
      <td>{a.status}</td>
    </tr>
  ))}

  {assignments.length === 0 && (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No assignments found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
