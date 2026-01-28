import "../../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

/* ================= DATE + AGING UTILITY ================= */

function formatDateWithAging(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-GB");

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let aging = "Today";
  if (diffDays === 1) aging = "1 day ago";
  else if (diffDays > 1) aging = `${diffDays} days ago`;

  return `${formattedDate} (${aging})`;
}

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [stats, setStats] = useState({
    totalChurches: 0,
    activeChurches: 0,
    totalUsers: 0,
  });

  const [pendingChurches, setPendingChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= DASHBOARD STATS ================= */

  const loadDashboardStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/platform/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setStats({
        totalChurches: data.totalchurches || 0,
        activeChurches: data.activechurches || 0,
        totalUsers: data.totalusers || 0,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  /* ================= PENDING CHURCHES ================= */

  const loadPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/platform/church-applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPendingChurches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Pending churches error:", err);
    }
  };

  /* ================= INITIAL LOAD ================= */



 useEffect(() => {
  const init = async () => {
    try {
      await Promise.all([
        loadDashboardStats(),
        loadPending(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);

  /* ================= LOADING ================= */

  if (loading) {
    return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Platform Overview</h1>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Churches</div>
          <div className="stat-number"><p>{stats.totalChurches}</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Active Churches</div>
          <div className="stat-number"><p>{stats.activeChurches}</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-number warn">
           <p> {pendingChurches.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-number"><p>{stats.totalUsers}</p></div>
        </div>
      </div>

      {/* ===== PENDING TABLE ===== */}
      <div className="dashboard-card large">
        <h3>Pending Church Registrations</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingChurches.map((church) => (
              <tr key={church.application_id}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.ccity || "-"}</td>
                <td>{church.cstate || "-"}</td>
                <td>{church.ccountry || "-"}</td>
                <td>{formatDateWithAging(church.applied_on)}</td>
                <td className="actions">
                  <button
                    className="icon-btn"
                    title="View details"
                    onClick={() =>
                      navigate(`/admin/church/application/${church.application_id}`)
                    }
                  >
                    👁
                  </button>
                </td>
              </tr>
            ))}

            {pendingChurches.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
