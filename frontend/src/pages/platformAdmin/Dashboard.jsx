import "../../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

/* ================= DATE + AGING ================= */

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
    const data = await api("/platform/dashboard");

    if (data?.success) {
      setStats({
        totalChurches: data.totalChurches || 0,
        activeChurches: data.activeChurches || 0,
        totalUsers: data.totalUsers || 0,
      });
    }
  };

  /* ================= PENDING CHURCH APPLICATIONS ================= */

  const loadPending = async () => {
    const data = await api("/platform/church-applicants");

    if (data?.success) {
      setPendingChurches(data.applications || []);
    } else {
      setPendingChurches([]);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([loadDashboardStats(), loadPending()]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Platform Overview</h1>

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
            <p>{pendingChurches.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-number"><p>{stats.totalUsers}</p></div>
        </div>
      </div>

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
              <tr key={church.chr_app_id}>
                <td>{church.chr_app_code}</td>
                <td>{church.chr_app_name}</td>
                <td>{church.chr_app_city || "-"}</td>
                <td>{church.chr_app_state || "-"}</td>
                <td>{church.chr_app_country || "-"}</td>
                <td>{formatDateWithAging(church.chr_app_applied_on)}</td>
                <td className="actions">
                  <button
                    className="icon-btn"
                    title="View details"
                    onClick={() =>
                      navigate(`/admin/church/application/${church.chr_app_id}`)
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
