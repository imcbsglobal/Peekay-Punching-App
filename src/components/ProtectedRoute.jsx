import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api";

const ProtectedRoute = () => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render children routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;