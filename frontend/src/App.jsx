import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChurchRegister from "./pages/ChurchRegister";

import PlatformAdminLayout from "./layouts/PlatformAdminLayout";
import Dashboard from "./pages/platformAdmin/Dashboard";
import PendingChurches from "./pages/platformAdmin/PendingChurches";
import AllChurches from "./pages/platformAdmin/AllChurches";
import PlatformUsers from "./pages/platformAdmin/PlatformUsers";
import EmployeeAssignments from "./pages/platformAdmin/EmployeeAssignments";
import SecurityLogs from "./pages/platformAdmin/SecurityLogs";
import AdminProfile from "./pages/platformAdmin/AdminProfile";

import ChurchDetails from "./pages/platformAdmin/ChurchDetails";
import ApprovedChurchDetails from "./pages/platformAdmin/ApprovedChurchDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PUBLIC ================= */}
        <Route path="/church-register" element={<ChurchRegister />} />

        {/* ================= ALIASES (SAFETY NET) ================= */}
        {/* backend or old redirects */}
        <Route
          path="/platform/dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/church/dashboard"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/user"
          element={<Navigate to="/" replace />}
        />

        {/* ================= PLATFORM ADMIN ================= */}
        <Route path="/admin" element={<PlatformAdminLayout />}>
          {/* default admin route */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pending-churches" element={<PendingChurches />} />
          <Route path="all-churches" element={<AllChurches />} />
          <Route path="platform-users" element={<PlatformUsers />} />
          <Route path="employee-assignments" element={<EmployeeAssignments />} />
          <Route path="security-logs" element={<SecurityLogs />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route
            path="church/application/:applicationId"
            element={<ChurchDetails />}
          />

          <Route
            path="church/:churchId"
            element={<ApprovedChurchDetails />}
          />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
