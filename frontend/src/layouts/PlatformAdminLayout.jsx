import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/platformAdmin.css";
import logo from "../assets/logo.png";   // <-- put your logo in src/assets/logo.png

export default function PlatformAdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // later you will clear tokens here
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        {/* LOGO */}
        <div className="sidebar-logo" onClick={() => navigate("/admin/dashboard")}>
          <img src={logo} alt="POWAHA" />
          <h2>POWAHA</h2>
        </div>

        {/* NAV */}
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/admin/pending-churches" className="nav-link">Pending Churches</NavLink>
          <NavLink to="/admin/all-churches" className="nav-link">All Churches</NavLink>
          <NavLink to="/admin/platform-users" className="nav-link">Platform Users</NavLink>
          <NavLink to="/admin/employee-assignments" className="nav-link">Employee Assignments</NavLink>
          <NavLink to="/admin/security-logs" className="nav-link">Security Logs</NavLink>
          <NavLink to="/admin/profile" className="nav-link">Profile</NavLink>
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
            <img src="/avatar.png" className="top-avatar" />
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
