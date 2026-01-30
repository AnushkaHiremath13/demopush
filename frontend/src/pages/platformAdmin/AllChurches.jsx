import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

export default function AllChurches() {
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH CHURCHES ================= */
  useEffect(() => {
    const loadChurches = async () => {
      try {
        const res = await fetch("/api/platform/church/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setChurches(data.churches || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load churches");
      } finally {
        setLoading(false);
      }
    };

    loadChurches();
  }, [token]);

  /* ================= STATUS ACTION ================= */
  const updateStatus = async (cid, action) => {
    const endpoint =
      action === "SUSPEND"
        ? `/api/platform/church/${cid}/suspend`
        : `/api/platform/church/${cid}/activate`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setChurches((prev) =>
        prev.map((c) =>
          c.cid === cid
            ? {
                ...c,
                cstatus: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE",
              }
            : c
        )
      );
    } else {
      alert("Action failed");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading churches...</p>;
  }

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
              <tr key={church.cid}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.cemail || "-"}</td>
                <td>{church.ccity || "-"}</td>
                <td>{church.cstate || "-"}</td>
                <td>{church.ccountry || "-"}</td>

                <td>
                  <span
                    className={`status-pill ${church.cstatus.toLowerCase()}`}
                  >
                    {church.cstatus}
                  </span>
                </td>

                <td className="action-cell">
                  <button
                    className="icon-btn"
                    title="View Church"
                    onClick={() => navigate(`/admin/church/${church.cid}`)}
                  >
                    👁
                  </button>

                  {church.cstatus === "ACTIVE" ? (
                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(church.cid, "SUSPEND")
                      }
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateStatus(church.cid, "ACTIVATE")
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
