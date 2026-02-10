import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import { api } from "../../api/api";

export default function AllChurches() {
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH CHURCHES ================= */

  useEffect(() => {
    const loadChurches = async () => {
      try {
        const data = await api("/platform/churches");

        if (data?.success) {
          setChurches(data.churches || []);
        } else {
          setChurches([]);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load churches");
      } finally {
        setLoading(false);
      }
    };

    loadChurches();
  }, []);

  /* ================= STATUS ACTION ================= */

  const updateStatus = async (chr_id, action) => {
    try {
      const endpoint =
        action === "SUSPEND"
          ? `/platform/churches/${chr_id}/suspend`
          : `/platform/churches/${chr_id}/activate`;

      const data = await api(endpoint, { method: "PATCH" });

      if (data?.success) {
        setChurches((prev) =>
          prev.map((c) =>
            c.chr_id === chr_id
              ? {
                  ...c,
                  chr_approval_status:
                    action === "SUSPEND" ? "SUSPENDED" : "APPROVED",
                }
              : c
          )
        );
      } else {
        alert("Action failed");
      }
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <p style={{ padding: 20 }}>Loading churches...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">All Churches</h1>

      <div className="dashboard-card large">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Church Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {churches.map((church) => (
              <tr key={church.chr_id}>
                <td>{church.chr_code}</td>
                <td>{church.chr_name}</td>
                <td>{church.chr_email || "-"}</td>
                <td>{church.chr_city || "-"}</td>
                <td>{church.chr_state || "-"}</td>
                <td>{church.chr_country || "-"}</td>

                <td>
                  <span
                    className={`status-pill ${church.chr_approval_status.toLowerCase()}`}
                  >
                    {church.chr_approval_status}
                  </span>
                </td>

                <td className="action-cell">
                  <button
                    className="icon-btn"
                    title="View Church"
                    onClick={() =>
                      navigate(`/admin/church/${church.chr_id}`)
                    }
                  >
                    👁
                  </button>

                  {church.chr_approval_status === "APPROVED" ? (
                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(church.chr_id, "SUSPEND")
                      }
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateStatus(church.chr_id, "ACTIVATE")
                      }
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {churches.length === 0 && (
          <p style={{ textAlign: "center", color: "#777" }}>
            No churches found
          </p>
        )}
      </div>
    </div>
  );
}
