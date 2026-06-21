import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route and redirects to /login if:
 *  - user is not authenticated
 *  - user role doesn't match the required role prop
 */
export default function ProtectedRoute({ children, role }) {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && userProfile?.role !== role) return <Navigate to="/login" replace />;

  return children;
}
