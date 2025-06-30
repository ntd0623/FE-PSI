import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { processLogout } from "../../../store/actions/userActions";
import { FaBars } from "react-icons/fa";
import logo from "../../../assets/img/pltLogo.png";
import logo2 from "../../../assets/img/pltprone.png";
import { path } from "../../../utils/constant";
import { getAvatarColor } from "../../../utils/statusHelper";
import toast from "react-hot-toast";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get user from redux
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.userInfo);
  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    dispatch(processLogout());
    toast.success("Đăng xuất thành công");
    navigate(path.LOGIN);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 flex justify-between items-center gap-4 ${
        isScrolled
          ? "bg-white text-black shadow-md"
          : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      }`}
    >
      {/* Logo */}
      <Link
        to={path.HOME}
        className={`flex items-center sm:ml-8 md:ml-16 lg:ml-32 ${
          isScrolled ? "ml-10" : ""
        }`}
      >
        <img
          src={isScrolled ? logo2 : logo}
          className={`h-18 object-contain transition-transform hover:scale-105 ${
            isScrolled ? "w-20" : "w-64"
          }`}
          alt="logo"
        />
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden sm:flex flex-wrap items-center gap-6">
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

      {/* Avatar or Login */}
      <div className="hidden sm:block relative" ref={menuRef}>
        {!isLoggedIn ? (
          <div className="flex flex-wrap gap-2">
            <Link
              to={path.REGISTER}
              className="flex-1 min-w-[120px] text-center bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
            >
              Đăng ký
            </Link>

            <Link
              to={path.LOGIN}
              className="flex-1 min-w-[120px] text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
            >
              Đăng nhập
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

      {/* Mobile hamburger */}
      <div className="sm:hidden">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-white text-black px-4 py-3 flex flex-col gap-2 sm:hidden shadow-md z-40">
          <Link to={path.HOME} className="py-2 hover:bg-gray-100">
            Trang chủ
          </Link>
          <Link
            to="https://xaydungphanmem.com/"
            target="_blank"
            className="py-2 hover:bg-gray-100"
          >
            Khóa học
          </Link>
          <Link to={path.ABOUT} className="py-2 hover:bg-gray-100">
            Giới thiệu
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to={path.LOGIN}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2 text-center"
              >
                Đăng nhập
              </Link>
              <Link
                to={path.REGISTER}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded mt-2 text-center"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <Link to={path.PROFILE} className="py-2 hover:bg-gray-100 w-full">
                Hồ sơ cá nhân
              </Link>
              <Link to={path.MY_CV} className="py-2 hover:bg-gray-100 w-full">
                CV của tôi
              </Link>
              <Link to={path.FORM_CV} className="py-2 hover:bg-gray-100 w-full">
                Tạo mới CV
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 py-2 w-full text-left hover:bg-red-50 hover:text-red-700"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
