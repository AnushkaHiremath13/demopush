// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import PlatformAdminLayout from "./layouts/PlatformAdminLayout";
// import Dashboard from "./pages/platformAdmin/Dashboard";
// import PendingChurches from "./pages/platformAdmin/PendingChurches";
// import AllChurches from "./pages/platformAdmin/AllChurches";
// import PlatformUsers from "./pages/platformAdmin/PlatformUsers";
// import EmployeeAssignments from "./pages/platformAdmin/EmployeeAssignments";
// import SecurityLogs from "./pages/platformAdmin/SecurityLogs";
// import AdminProfile from "./pages/platformAdmin/AdminProfile";

// import ChurchDetails from "./pages/platformAdmin/ChurchDetails";
// import ApprovedChurchDetails from "./pages/platformAdmin/ApprovedChurchDetails";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* AUTH */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* PLATFORM ADMIN */}
//         <Route path="/admin" element={<PlatformAdminLayout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="pending-churches" element={<PendingChurches />} />
//           <Route path="all-churches" element={<AllChurches />} />
//           <Route path="platform-users" element={<PlatformUsers />} />
//           <Route path="employee-assignments" element={<EmployeeAssignments />} />
//           <Route path="security-logs" element={<SecurityLogs />} />
//           <Route path="profile" element={<AdminProfile />} />

//           {/* 🔥 PENDING CHURCH APPLICATION DETAILS */}
//           <Route
//             path="church/application/:applicationId"
//             element={<ChurchDetails />}
//           />

//           {/* 🔥 APPROVED CHURCH DETAILS */}
//           <Route
//             path="church/:churchId"
//             element={<ApprovedChurchDetails />}
//           />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />   {/* ✅ alias */}
        <Route path="/register" element={<Register />} />

        {/* PLATFORM ADMIN */}
        <Route path="/admin" element={<PlatformAdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pending-churches" element={<PendingChurches />} />
          <Route path="all-churches" element={<AllChurches />} />
          <Route path="platform-users" element={<PlatformUsers />} />
          <Route path="employee-assignments" element={<EmployeeAssignments />} />
          <Route path="security-logs" element={<SecurityLogs />} />
          <Route path="profile" element={<AdminProfile />} />

          {/* PENDING CHURCH APPLICATION DETAILS */}
          <Route
            path="church/application/:applicationId"
            element={<ChurchDetails />}
          />

          {/* APPROVED CHURCH DETAILS */}
          <Route
            path="church/:churchId"
            element={<ApprovedChurchDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
