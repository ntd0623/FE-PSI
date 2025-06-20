import { Menu } from "lucide-react";

const AdminHeader = ({ setIsSidebarOpen }) => {
  return (
    <div className="bg-white shadow-sm px-4 py-4 flex justify-center items-center sticky top-0 z-10">
      <div className="flex items-center">
        <button
          className="block md:hidden mr-3"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Hệ thống quản lý CV thực tập
        </h1>
      </div>
    </div>
  );
};

export default AdminHeader;
