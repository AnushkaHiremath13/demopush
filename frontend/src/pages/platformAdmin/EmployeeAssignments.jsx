import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

export default function EmployeeAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [email, setEmail] = useState("");
  const [cid, setCid] = useState("");

  /* ================= FETCH ASSIGNMENTS ================= */

  useEffect(() => {
    fetch("/api/platform/employee-assignments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAssignments(data.assignments))
      .catch(() => setAssignments([]));
  }, []);

  /* ================= ADD ASSIGNMENT ================= */

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email || !cid) return;

    const res = await fetch("/api/platform/employee-assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ email, cid }),
    });

    if (res.ok) {
      const data = await res.json();
      setAssignments((prev) => [...prev, data.assignment]);
      setEmail("");
      setCid("");
    } else {
      alert("Failed to assign employee");
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Employee Assignments</h1>
      <p style={{ color: "#777", marginBottom: "14px" }}>
        Assign employee emails to churches before they register.
      </p>

      {/* ADD FORM */}
      <div className="dashboard-card" style={{ marginBottom: "20px" }}>
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
            type="text"
            placeholder="Church ID (cid)"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            required
          />

          <button className="approve-btn">Assign</button>
        </form>
      </div>

      {/* TABLE */}
      <div className="dashboard-card large">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Assignment ID</th>
              <th>Email</th>
              <th>Church ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((a) => (
              <tr key={a.assignment_id}>
                <td>{a.assignment_id}</td>
                <td>{a.email}</td>
                <td>{a.cid}</td>
                <td>
                  <span className={`status-pill ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}

            {assignments.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No employee assignments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
