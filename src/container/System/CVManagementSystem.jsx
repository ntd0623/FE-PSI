import { Outlet } from "react-router-dom";
import AdminLayout from "./Header/AdminLayout";
import {
  BarChart3,
  FileText,
  ClipboardList,
  GraduationCap,
  Briefcase,
  LineChart,
  Settings,
  ListChecks,
  NotebookText,
  FilePlus,
  UserCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { path } from "../../utils/constant";

const CVManagementSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: () => <BarChart3 className="text-blue-500" />,
      label: "Tổng quan",
      active: location.pathname === path.ADMIN_DASHBOARD,
      onClick: () => navigate(path.ADMIN_DASHBOARD),
    },
    {
      icon: () => <FileText className="text-violet-600" />,
      label: "Quản lý CV",
      active:
        location.pathname === path.CV_MANAGEMENT ||
        location.pathname === path.ADMIN,
      onClick: () => navigate(path.CV_MANAGEMENT),
    },
    {
      icon: () => <ClipboardList className="text-emerald-600" />,
      label: "Trắc Nghiệm",
      active: location.pathname.startsWith(path.QUIZ),
      children: [
        {
          icon: () => <NotebookText className="text-green-600" />,
          label: "Quản lý bộ câu hỏi",
          active: location.pathname === path.QUIZ,
          onClick: () => navigate(path.QUIZ),
        },
        {
          icon: () => <UserCheck className="text-amber-600" />,
          label: "Sinh viên đã làm bài",
          active: location.pathname === path.QUIZ_CREATE,
          onClick: () => navigate(path.STUDENT_SUBMISSTION),
        },
      ],
    },
    {
      icon: () => <GraduationCap className="text-orange-500" />,
      label: "Quản lý đợt thực tập",
      active: location.pathname === path.ADMIN_BATCH,
      onClick: () => navigate(path.ADMIN_BATCH),
    },
    {
      icon: () => <Briefcase className="text-cyan-600" />,
      label: "Quản lý doanh nghiệp",
      active: location.pathname === path.ADMIN_COMPANY,
      onClick: () => navigate(path.ADMIN_COMPANY),
    },
    {
      icon: () => <LineChart className="text-pink-500" />,
      label: "Báo cáo thống kê",
      active: location.pathname === path.ADMIN_REPORT,
      onClick: () => navigate(path.ADMIN_REPORT),
    },
    {
      icon: () => <Settings className="text-gray-600" />,
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
