import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "./authStore.js";

function RequireRole({ allow, children }) {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

export default RequireRole;
