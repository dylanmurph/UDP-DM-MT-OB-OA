import { Navigate } from "react-router-dom";

export default function PublicRoute({ user, children }) {

  if (user) {
    return <Navigate to={user.role === "host" ? "/host/home" : "/guest/home"} replace />;
  }

  return children;
}