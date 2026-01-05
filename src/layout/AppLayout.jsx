import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getUser } from "../auth/authStore.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

function AppLayout() {
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "user" || event.key === "accessToken") {
        setUser(getUser());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <div className="app-main">
        <Topbar user={user} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
