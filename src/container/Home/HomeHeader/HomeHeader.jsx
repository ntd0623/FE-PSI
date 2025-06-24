import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { path } from "../../../utils/constant";
import { getAvatarColor } from "../../../utils/statusHelper";
import { processLogout } from "../../../store/actions";
import logo from "../../../assets/img/pltprone.png";
import toast from "react-hot-toast";
import { HiOutlineDocumentAdd } from "react-icons/hi";
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.userInfo);
  const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);

  const handleLogout = () => {
    dispatch(processLogout());
    toast.success("Đăng xuất thành công");
    navigate(path.HOME);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 flex justify-between items-center gap-4 ${
        isScrolled
          ? "bg-white text-black shadow-md"
          : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      }`}
    >
      <Link
        to={path.HOME}
        className="flex items-center ml-4 sm:ml-8 md:ml-16 lg:ml-32"
      >
        <img
          src={logo}
          className="w-24 h-auto object-contain transition-transform hover:scale-105"
          alt="logo"
        />
      </Link>

      <nav className="flex flex-wrap items-center gap-6">
        <Link
          to={path.HOME}
          className="hover:text-blue-200 text-lg font-medium transition"
        >
          Trang chủ
        </Link>
        <Link
          to="https://xaydungphanmem.com/"
          target="_blank"
          className="hover:text-blue-200 text-lg font-medium transition"
        >
          Khóa học
        </Link>
        <Link
          to={path.ABOUT}
          className="hover:text-blue-200 text-lg font-medium transition"
        >
          Giới thiệu
        </Link>
      </nav>

      <div className="relative" ref={menuRef}>
        {!isLoggedIn ? (
          <div className="space-x-2">
            <Link
              to={path.LOGIN}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
            >
              Đăng nhập
            </Link>
            <Link
              to={path.REGISTER}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
            >
              Đăng ký
            </Link>
          </div>
        ) : (
          <div>
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border border-gray-300"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`${getAvatarColor(
                    user.name
                  )} w-full h-full flex items-center justify-center text-white font-semibold`}
                >
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "N/A"}
                </div>
              )}
            </div>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-black font-semibold text-sm">
                  👤 {user.name}
                </div>
                <Link
                  to={path.PROFILE}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  📄 Hồ sơ cá nhân
                </Link>
                <Link
                  to={path.MY_CV}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  📝 CV của tôi
                </Link>
                <Link
                  to={path.FORM_CV}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  ➕ Tạo mới CV
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
