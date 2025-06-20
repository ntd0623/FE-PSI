import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { path } from "../../../utils/constant";
// import "./Register.scss";
import authService from "../../../services/authService";

const Register = () => {
  const formRef = useRef();
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState("");

  const captcha = import.meta.env.VITE_APP_SITE_KEY_CAPTCHA;

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

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
      newErrors.fullName =
        "Họ và tên chỉ được chứa chữ cái, không chứa số hoặc ký tự đặc biệt.";
    }

    if (!email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự trở lên.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      setCaptchaError("Vui lòng xác minh CAPTCHA.");
      return;
    }

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await authService.register({
        name: fullName,
        email: email,
        password: password,
        captcha: captchaToken,
      });

      if (res && res.errCode === 3) {
        setErrors((prev) => ({ ...prev, captchaError: res.message }));
        return;
      }
      if (res && res.errCode === 4) {
        setErrors((prev) => ({ ...prev, email: res.message }));
        return;
      }
      if ((res && res.errCode === 5) || (res.errCode && res.errCode === 1)) {
        setErrors((prev) => ({ ...prev, server: res.message }));
        return;
      }
      if (res && res.errCode === 0) {
        toast.success("Đăng ký thành công. Hãy đăng nhập!");
        navigate(path.LOGIN);
      }
      navigate(path.LOGIN);
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
      <div
        ref={formRef}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Đăng ký tài khoản
        </h2>

        <form className="space-y-4 mb-3">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              className={`w-full border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.fullName ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="••••••••"
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

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={`w-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="w-full flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={captcha}
              onChange={() => setCaptchaError("")}
            />
          </div>
          {captchaError && (
            <p className="text-sm text-red-600 text-center">{captchaError}</p>
          )}

          {/* Nút đăng ký */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Đăng ký
          </button>
          {errors.server && (
            <p className="text-sm text-red-600 mt-2 text-center">
              {errors.server}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Bạn đã có tài khoản?{" "}
          <span
            onClick={() => {
              navigate(path.LOGIN);
            }}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Đăng nhập ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
