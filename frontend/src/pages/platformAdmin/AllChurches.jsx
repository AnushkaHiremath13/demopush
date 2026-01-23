import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

export default function AllChurches() {
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CHURCHES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/platform/church/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((data) => {
        setChurches(data.churches || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load churches");
        setLoading(false);
      });
  }, []);

  /* ================= ACTION ================= */
  const updateStatus = async (cid, action) => {
    const endpoint =
      action === "SUSPEND"
        ? `http://localhost:5000/api/platform/church/${cid}/suspend`
        : `http://localhost:5000/api/platform/church/${cid}/activate`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      setChurches(prev =>
        prev.map(c =>
          c.cid === cid
            ? { ...c, cstatus: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE" }
            : c
        )
      );
    } else {
      alert("Action failed");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading churches...</p>;
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
              <th>City</th>
              <th>State</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {churches.map((church) => (
              <tr key={church.cid}>
                <td>{church.ccode}</td>
                <td>{church.cname}</td>
                <td>{church.ccity}</td>
                <td>{church.cstate}</td>
                <td>
                  <span className={`status-pill ${church.cstatus.toLowerCase()}`}>
                    {church.cstatus}
                  </span>
                </td>
                <td>
                  {church.cstatus === "ACTIVE" ? (
                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(church.cid, "SUSPEND")}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="approve-btn"
                      onClick={() => updateStatus(church.cid, "ACTIVATE")}
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
