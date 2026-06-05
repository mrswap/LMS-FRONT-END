import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // agar already login hai → dashboard bhej de
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
