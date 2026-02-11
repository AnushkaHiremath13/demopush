import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/platformAdmin.css";
import logo from "../assets/logo.png";
import { api } from "../api/api";

export default function PlatformAdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.warn("Logout API failed, forcing logout", error);
    } finally {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to LOGIN page ("/")
      navigate("/", { replace: true });

      // Optional safety reload
      window.location.reload();
    }
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        {/* LOGO */}
        <div
          className="sidebar-logo"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img src={logo} alt="POWAHA" />
          <h2>POWAHA</h2>
        </div>

        {/* NAV */}
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/admin/pending-churches" className="nav-link">Pending Churches</NavLink>
          <NavLink to="/admin/all-churches" className="nav-link">All Churches</NavLink>
          {/* <NavLink to="/admin/platform-users" className="nav-link"></NavLink> */}
          <span className="nav-link disabled-link">Platform Users</span>
          {/* <NavLink to="/admin/employee-assignments" className="nav-link">Employee Assignments</NavLink>
          <NavLink to="/admin/security-logs" className="nav-link">Security Logs</NavLink>
          <NavLink to="/admin/profile" className="nav-link">Profile</NavLink> */}
          <span className="nav-link disabled-link">Employee Assignments</span>  
          <span className="nav-link disabled-link">Security Logs</span>
          <span className="nav-link disabled-link">Profile</span>
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-logout">
          <button onClick={handleLogout}>Logout</button>
        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">
          <h3>Platform Admin</h3>

          <div
            className="admin-profile"
            onClick={() => navigate("/admin/profile")}
          >
            <span>Admin</span>
            <img src="/avatar.png" className="top-avatar" alt="Admin" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

