import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

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

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= FETCH PENDING ================= */
  useEffect(() => {
    const loadPending = async () => {
      try {
        const res = await fetch("/api/platform/church-applicants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setPendingChurches(data.applications);
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
  }, [token]);

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
              <tr key={church.application_id}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.cemail || "-"}</td>
                <td>{church.ccity || "-"}</td>
                <td>{church.cstate || "-"}</td>
                <td>{church.ccountry || "-"}</td>
                <td>{formatDateWithAging(church.applied_on)}</td>

                <td className="action-cell">
                  <button
                    className="icon-btn"
                    title="View Details"
                    onClick={() =>
                      navigate(
                        `/admin/church/application/${church.application_id}`
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
