import { ChevronLeft, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { processLogout } from "../../../store/actions/userActions";
import { path } from "../../../utils/constant";
import toast from "react-hot-toast";

const AdminSideBar = ({ isSidebarOpen, setIsSidebarOpen, menuItems = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const handleLogout = () => {
    dispatch(processLogout());
    toast.success("Đăng xuất thành công");
    navigate(path.LOGIN);
  };
  return (
    <div
      className={`fixed inset-y-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menu Chức Năng</h1>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
              item.active
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={item.onClick}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm cursor-pointer" onClick={handleLogout}>
            Đăng xuất
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
