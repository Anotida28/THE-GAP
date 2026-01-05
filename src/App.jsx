import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./auth/LoginPage.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import RequireRole from "./auth/RequireRole.jsx";
import { getUser } from "./auth/authStore.js";
import AdminDashboard from "./app/admin/AdminDashboard.jsx";
import EmployeesPage from "./app/admin/EmployeesPage.jsx";
import ProjectsPage from "./app/admin/ProjectsPage.jsx";
import PMDashboard from "./app/pm/PMDashboard.jsx";
import TimesheetApprovals from "./app/pm/TimesheetApprovals.jsx";

function RoleRedirect() {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "HR_ADMIN") {
    return <Navigate to="/app/admin/dashboard" replace />;
  }
  if (user.role === "PM") {
    return <Navigate to="/app/pm/dashboard/current" replace />;
  }
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={(
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        )}
      >
        <Route index element={<RoleRedirect />} />
        <Route
          path="admin"
          element={(
            <RequireRole allow={["HR_ADMIN"]}>
              <Outlet />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
        <Route
          path="pm"
          element={(
            <RequireRole allow={["PM"]}>
              <Outlet />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="dashboard/current" replace />} />
          <Route path="dashboard/:projectId" element={<PMDashboard />} />
          <Route path="approvals/timesheets" element={<TimesheetApprovals />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
