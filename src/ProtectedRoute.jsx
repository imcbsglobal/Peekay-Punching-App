// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { authAPI } from './api';

const ProtectedRoute = () => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;