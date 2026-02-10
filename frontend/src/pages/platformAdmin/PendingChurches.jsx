import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
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

export default function PendingChurches() {
  const [pendingChurches, setPendingChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH PENDING ================= */
  useEffect(() => {
    const loadPending = async () => {
      try {
        const data = await api("/platform/church-applicants");

        if (data?.success) {
          setPendingChurches(data.applications || []);
        } else {
          setPendingChurches([]);
        }
      } catch (err) {
        console.error("Pending churches error:", err);
        setPendingChurches([]);
      } finally {
        setLoading(false);
      }
    };

    loadPending();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading pending churches…</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Pending Church Applications</h1>
      <p style={{ color: "#777", marginBottom: 16 }}>
        Review church applications before approval.
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
                <td>{church.chr_app_email || "-"}</td>
                <td>{church.chr_app_city || "-"}</td>
                <td>{church.chr_app_state || "-"}</td>
                <td>{church.chr_app_country || "-"}</td>
                <td>{formatDateWithAging(church.chr_app_applied_on)}</td>

                <td className="action-cell">
                  <button
                    className="icon-btn"
                    title="View Details"
                    onClick={() =>
                      navigate(
                        `/admin/church/application/${church.chr_app_id}`
                      )
                    }
                  >
                    👁
                  </button>
                </td>
              </tr>
            ))}

            {pendingChurches.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  🎉 No pending church applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
