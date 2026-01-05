import { NavLink } from "react-router-dom";

const adminNav = [
  { path: "/app/admin/dashboard", label: "Dashboard" },
  { path: "/app/admin/employees", label: "Employees" },
  { path: "/app/admin/projects", label: "Projects" },
];

const pmNav = [
  { path: "/app/pm/dashboard/current", label: "Dashboard" },
  { path: "/app/pm/approvals/timesheets", label: "Approvals" },
];

function Sidebar({ user }) {
  const role = user?.role;
  const navItems = role === "HR_ADMIN" ? adminNav : role === "PM" ? pmNav : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <img className="brand-logo" src="/logo.png" alt="The GAP Company logo" />
        </span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            {item.label}
          </NavLink>
        ))}
        {navItems.length === 0 ? (
          <NavLink to="/app" className={({ isActive }) => (isActive ? "active" : "")}>
            Overview
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}

export default Sidebar;
