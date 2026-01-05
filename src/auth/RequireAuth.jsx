import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, getUser } from "./authStore.js";

function RequireAuth({ children }) {
  const location = useLocation();
  const token = getAccessToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
