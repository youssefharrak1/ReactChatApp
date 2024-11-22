import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  if (token) return <Outlet />;
  else
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;