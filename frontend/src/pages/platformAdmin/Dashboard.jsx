import "../../styles/dashboard.css";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [pendingChurches, setPendingChurches] = useState([]);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  /* ================= FETCH STATS ================= */

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/platform/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats error:", err.message);
      }
    }

    loadStats();
  }, [token]);

  /* ================= FETCH PENDING CHURCHES ================= */

  useEffect(() => {
    async function loadPending() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/platform/church/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data = await res.json();
        setPendingChurches(data.churches || []);
      } catch (err) {
        console.error("Pending churches error:", err.message);
      }
    }

    loadPending();
  }, [token]);

  /* ================= ACTION HANDLERS ================= */

  const handleApprove = async (cid) => {
    const res = await fetch(
      `http://localhost:5000/api/platform/church/${cid}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setPendingChurches((prev) =>
        prev.filter((church) => church.cid !== cid)
      );
    }
  };

  const handleReject = async (cid) => {
    const res = await fetch(
      `http://localhost:5000/api/platform/church/${cid}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setPendingChurches((prev) =>
        prev.filter((church) => church.cid !== cid)
      );
    }
  };

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Platform Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">Total Churches</p>
          <h2 className="stat-number">{stats.totalchurches}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Active Churches</p>
          <h2 className="stat-number">{stats.activechurches}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Pending Requests</p>
          <h2 className="stat-number warn">{stats.pendingchurches}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Total Users</p>
          <h2 className="stat-number">{stats.totalusers}</h2>
        </div>
      </div>

      <div className="dashboard-card large">
        <h3>Pending Church Registrations</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Church Code</th>
              <th>Church Name</th>
              <th>City</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingChurches.map((church) => (
              <tr key={church.cid}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.ccity || "-"}</td>
                <td>{church.cstate || "-"}</td>
                <td>
                  <button onClick={() => handleApprove(church.cid)}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(church.cid)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {pendingChurches.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No pending church requests 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
