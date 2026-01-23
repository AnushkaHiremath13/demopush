import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

export default function PlatformUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    if (!token) {
      console.error("No auth token found");
      setLoading(false);
      return;
    }

    async function loadUsers() {
      try {
        const res = await fetch("/api/platform/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Server did not return JSON");
        }

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch platform users");
        }

        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error("Platform users fetch error:", err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [token]);

  /* ================= BLOCK / UNBLOCK ================= */

  const updateStatus = async (uid, action) => {
    if (!token) return;

    try {
      const endpoint =
        action === "BLOCK"
          ? `/api/platform/user/${uid}/block`
          : `/api/platform/user/${uid}/unblock`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return JSON");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Status update failed");
      }

      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === uid
            ? { ...u, ustatus: action === "BLOCK" ? "BLOCKED" : "ACTIVE" }
            : u
        )
      );
    } catch (err) {
      console.error("Update user status error:", err.message);
      alert("Failed to update user status");
    }
  };

  /* ================= AUTHORITY LABEL ================= */

  const getAuthorityLabel = (user) => {
    if (user.uisplatform) return "PLATFORM";
    if (user.uisemployee) return "CHURCH STAFF";
    return "FOLLOWER";
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading platform users...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Platform Users</h1>
      <p style={{ color: "#777", marginBottom: "14px" }}>
        View and manage all users across the platform.
      </p>

      <div className="dashboard-card large">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Authority</th>
              <th>Status</th>
              <th>Joined On</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.uname}</td>
                <td>{user.uemail}</td>

                <td>
                  <strong>{getAuthorityLabel(user)}</strong>
                </td>

                <td>
                  <span
                    className={`status-pill ${
                      user.ustatus
                        ? user.ustatus.toLowerCase()
                        : "unknown"
                    }`}
                  >
                    {user.ustatus || "UNKNOWN"}
                  </span>
                </td>

                <td>{user.createdat || "-"}</td>

                <td>
                  {user.ustatus === "BLOCKED" ? (
                    <button
                      className="approve-btn"
                      onClick={() => updateStatus(user.uid, "UNBLOCK")}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(user.uid, "BLOCK")}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
