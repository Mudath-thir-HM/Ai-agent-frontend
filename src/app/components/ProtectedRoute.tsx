import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
