import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, children }) {
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}