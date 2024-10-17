import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const admin = JSON.parse(sessionStorage.getItem("admin"));

  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
