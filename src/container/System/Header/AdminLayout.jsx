import { useState } from "react";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./HeaderAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ menuItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <AdminSideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={menuItems}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />
        <div
          className="p-6 w-full min-h-screen"
          style={{ background: "#EEEEEE" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
