// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../../utils/constant";
import Header from "../../Home/HomeHeader/HomeHeader";
const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state?.user?.userInfo);
  if (!user) {
    return <Navigate to={path.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.roleID)) {
    return <Navigate to={path.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
