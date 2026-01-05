import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth/authStore.js";

const roleLabels = {
  HR_ADMIN: "HR Admin",
  PM: "Project Manager",
  FOREMAN: "Foreman",
  WORKER: "Worker",
};

function resolveHeading(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return { title: "Workspace", subtitle: "Explore The GAP HR portal." };
  }
  const [, section, resource, detail] = segments;

  if (section === "admin") {
    if (resource === "employees") {
      return {
        title: "Employee Management",
        subtitle: "Track crews, assignments, and onboarding.",
      };
    }
    if (resource === "projects") {
      return {
        title: "Project Management",
        subtitle: "Plan labor, budgets, and geofences.",
      };
    }
    return {
      title: "Admin Dashboard",
      subtitle: "Monitor workforce health across all sites.",
    };
  }

  if (section === "pm") {
    if (resource === "approvals") {
      return {
        title: "Timesheet Approvals",
        subtitle: "Review hours submitted by your crews.",
      };
    }
    if (resource === "dashboard") {
      return {
        title: "Project Dashboard",
        subtitle: "Compare budgets, hours, and site performance.",
      };
    }
  }

  return {
    title: "Workspace",
    subtitle: "Monitor activity and manage updates for The GAP.",
  };
}

function Topbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email || "User";
  const roleLabel = user?.role ? roleLabels[user.role] ?? user.role : "";
  const initials = displayName.slice(0, 2).toUpperCase();
  const badgeLabel = roleLabel || "Signed in";

  const { title, subtitle } = useMemo(
    () => resolveHeading(location.pathname),
    [location.pathname],
  );

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-user">
          <span className="avatar" aria-hidden="true">{initials}</span>
          <div className="user-meta">
            <p className="user-name">{displayName}</p>
            <span className="user-role">{badgeLabel}</span>
          </div>
        </div>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Topbar;
