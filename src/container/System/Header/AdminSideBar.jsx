import { ChevronLeft, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { processLogout } from "../../../store/actions/userActions";
import { path } from "../../../utils/constant";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const AdminSideBar = ({ isSidebarOpen, setIsSidebarOpen, menuItems = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const submenuRefs = useRef({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = () => {
    dispatch(processLogout());
    toast.success("Đăng xuất thành công");
    navigate(path.LOGIN);
  };

  useEffect(() => {
    Object.keys(submenuRefs.current).forEach((label) => {
      const el = submenuRefs.current[label];
      if (!el) return;

      if (openMenus[label]) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          {
            height: 0,
            opacity: 0,
            y: -10,
          },
          {
            height: "auto",
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            if (el) el.style.display = "none";
          },
        });
      }
    });
  }, [openMenus]);

  return (
    <div
      className={`fixed inset-y-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menu Chức Năng</h1>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors justify-between ${
                item.active
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                if (item.children) {
                  toggleMenu(item.label);
                } else {
                  item.onClick();
                }
              }}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium"> {item.label}</span>
              </div>
              {item.children &&
                (openMenus[item.label] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </div>

            {/* Submenu */}
            <div
              className="ml-8 mt-1 space-y-1 overflow-hidden origin-top"
              ref={(el) => (submenuRefs.current[item.label] = el)}
              style={{
                height: 0,
                opacity: 0,
                display: "none",
                transformOrigin: "top",
              }}
            >
              {item.children &&
                item.children.map((child, idx) => (
                  <div
                    key={idx}
                    onClick={child.onClick}
                    className={`flex items-center gap-x-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${
                      child.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {child.icon && <child.icon className="w-4 h-4" />}
                    <span className="text-sm text-black font-medium">
                      {child.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
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
