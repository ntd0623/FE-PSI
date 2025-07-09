// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../../utils/constant";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state?.user?.userInfo);
  const location = useLocation(); //

  if (!user) {
    return <Navigate to={path.LOGIN} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.roleID)) {
    return <Navigate to={path.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
