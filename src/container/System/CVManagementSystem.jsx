import { Outlet } from "react-router-dom";
import AdminLayout from "./Header/AdminLayout";
import { BarChart3, FileText, User, Building2, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { path } from "../../utils/constant";

const CVManagementSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: BarChart3,
      label: "Tổng quan",
      active: location.pathname === path.ADMIN_DASHBOARD,
      onClick: () => navigate(path.ADMIN_DASHBOARD),
    },
    {
      icon: FileText,
      label: "Quản lý CV",
      active:
        location.pathname === path.CV_MANAGEMENT ||
        location.pathname === path.ADMIN,
      onClick: () => navigate(path.CV_MANAGEMENT),
    },
    {
      icon: User,
      label: "Trắc Nghiệm",
      active: location.pathname === path.ADMIN_TEST,
      onClick: () => navigate(path.ADMIN_TEST),
    },
    {
      icon: Building2,
      label: "Quản lý đợt thực tập",
      active: location.pathname === path.ADMIN_BATCH,
      onClick: () => navigate(path.ADMIN_BATCH),
    },
    {
      icon: Building2,
      label: "Quản lý doanh nghiệp",
      active: location.pathname === path.ADMIN_COMPANY,
      onClick: () => navigate(path.ADMIN_COMPANY),
    },
    {
      icon: BarChart3,
      label: "Báo cáo thống kê",
      active: location.pathname === path.ADMIN_REPORT,
      onClick: () => navigate(path.ADMIN_REPORT),
    },
    {
      icon: Settings,
      label: "Cài đặt hệ thống",
      active: location.pathname === path.ADMIN_SETTING,
      onClick: () => navigate(path.ADMIN_SETTING),
    },
  ];

  return (
    <AdminLayout menuItems={menuItems}>
      <Outlet />
    </AdminLayout>
  );
};

export default CVManagementSystem;
