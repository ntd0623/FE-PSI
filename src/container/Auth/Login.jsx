import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import {
  userLoginSuccess,
  userLoginFail,
} from "../../store/actions/userActions";
import authService from "../../services/authService";
import gsap from "gsap";
import { path, USER_ROLE } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    server: "",
  });

  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);
  const user = useSelector((state) => state.user?.userInfo);
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
      }
    );
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.roleID === USER_ROLE.ADMIN) {
        navigate(path.CV_MANAGEMENT);
      } else {
        navigate(path.FORM_CV);
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", server: "" });

    try {
      const res = await authService.login(email, password);

      if (res && res.errCode === 0) {
        dispatch(userLoginSuccess(res.data));
        toast.success("Đăng nhập thành công!");

        if (res.data.roleID === USER_ROLE.ADMIN) {
          navigate(path.CV_MANAGEMENT);
        } else {
          navigate(path.HOME);
        }
      } else {
        dispatch(userLoginFail());

        if (res.errField === "email") {
          setErrors((prev) => ({ ...prev, email: res.message }));
        } else if (res.errField === "password") {
          setErrors((prev) => ({ ...prev, password: res.message }));
        } else {
          setErrors((prev) => ({ ...prev, server: res.message }));
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      dispatch(userLoginFail());
      setErrors((prev) => ({
        ...prev,
        server: "Có lỗi xảy ra, vui lòng thử lại!",
      }));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    const result = await authService.googleAuth(token);

    if (result && result.data) {
      dispatch(userLoginSuccess(result.data));
      navigate(path.FORM_CV);
      toast.success("Đăng nhập thành công !");
    } else {
      dispatch(userLoginFail());
    }
  };

  const handleGoogleError = () => {
    console.error("Google login thất bại");
  };

  const handleGithubLogin = () => {
    console.log("Login với GitHub");
    // TODO: OAuth GitHub
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
      <div
        ref={formRef}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Đăng nhập hệ thống
        </h2>

        <form className="space-y-4 mb-3">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="you@example.com"
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="••••••••"
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              Ghi nhớ đăng nhập
            </label>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Đăng nhập
          </button>

          {/* Lỗi tổng quát server */}
          {errors.server && (
            <p className="text-sm text-red-600 text-center mt-2">
              {errors.server}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mb-6">
          Bạn chưa có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-4 text-sm text-gray-500">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* OAuth buttons */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
              useOneTap
            />
          </div>
          <button
            onClick={handleGithubLogin}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
          >
            <FaGithub className="text-xl text-gray-800" />
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
