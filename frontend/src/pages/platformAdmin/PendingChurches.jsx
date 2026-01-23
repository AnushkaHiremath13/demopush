import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function PendingChurches() {
  const [pendingChurches, setPendingChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PENDING CHURCHES ================= */

  const loadPendingChurches = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/platform/church/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pending churches");
      }

      const data = await res.json();
      setPendingChurches(data.churches || []);
    } catch (err) {
      console.error("Pending churches fetch error:", err);
      setPendingChurches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingChurches();
  }, []);

  /* ================= ACTION HANDLERS ================= */

  const handleApprove = async (cid) => {
    try {
      const res = await fetch(
        `${API_BASE}/platform/church/${cid}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Approve failed");
      }

      setPendingChurches((prev) =>
        prev.filter((church) => church.cid !== cid)
      );
    } catch (err) {
      console.error("Approve church error:", err);
      alert("Failed to approve church");
    }
  };

  const handleReject = async (cid) => {
    try {
      const res = await fetch(
        `${API_BASE}/platform/church/${cid}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Reject failed");
      }

      setPendingChurches((prev) =>
        prev.filter((church) => church.cid !== cid)
      );
    } catch (err) {
  console.error("Reject church error:", err);
  alert("Failed to reject church");
}

  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading pending churches...</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Pending Church Approvals</h1>
      <p style={{ color: "#777", marginBottom: "14px" }}>
        Review and approve churches before they can operate on the platform.
      </p>

      <div className="dashboard-card large">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Church Code</th>
              <th>Church Name</th>
              <th>Email</th>
              <th>City</th>
              <th>State</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingChurches.map((church) => (
              <tr key={church.cid}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.adminemail || "-"}</td>
                <td>{church.ccity}</td>
                <td>{church.cstate}</td>
                <td>
                  {church.createdat
                    ? new Date(church.createdat).toLocaleString()
                    : "-"}
                </td>
                <td className="action-cell">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(church.cid)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(church.cid)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {pendingChurches.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "22px", color: "#777" }}
                >
                  🎉 No pending church requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
