import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import { api } from "../../api/api";

export default function PlatformUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api("/platform/users");
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error("Platform users fetch error:", err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  /* ================= BLOCK / UNBLOCK ================= */

  const updateStatus = async (usr_id, action) => {
    try {
      const endpoint =
        action === "BLOCK"
          ? `/platform/users/${usr_id}/block`
          : `/platform/users/${usr_id}/unblock`;

      await api(endpoint, { method: "PATCH" });

      setUsers((prev) =>
        prev.map((u) =>
          u.usr_id === usr_id
            ? {
                ...u,
                usr_status: action === "BLOCK" ? "BLOCKED" : "ACTIVE",
              }
            : u
        )
      );
    } catch (err) {
      console.error("Update user status error:", err.message);
      alert("Failed to update user status");
    }
  };

  /* ================= AUTHORITY ================= */

  const getAuthorityLabel = (roles = []) => {
    if (roles.includes("PLATFORM_ADMIN")) return "PLATFORM";
    if (roles.includes("CHURCH_ADMIN")) return "CHURCH ADMIN";
    if (roles.includes("EMPLOYEE")) return "CHURCH STAFF";
    return "FOLLOWER";
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading platform users...</p>;
  }

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
              <tr key={user.usr_id}>
                <td>{user.usr_id}</td>
                <td>{user.usr_name}</td>
                <td>{user.usr_email}</td>

                <td>
                  <strong>{getAuthorityLabel(user.roles)}</strong>
                </td>

                <td>
                  <span
                    className={`status-pill ${user.usr_status.toLowerCase()}`}
                  >
                    {user.usr_status}
                  </span>
                </td>

                <td>
                  {new Date(user.usr_created_at).toLocaleDateString("en-GB")}
                </td>

                <td>
                  {user.usr_status === "BLOCKED" ? (
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateStatus(user.usr_id, "UNBLOCK")
                      }
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(user.usr_id, "BLOCK")
                      }
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
