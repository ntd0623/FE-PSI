import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen text-center bg-gray-50 px-4">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Không có quyền truy cập
        </h1>
        <p className="mb-6">
          Vui lòng đăng nhập bằng tài khoản có quyền phù hợp.
        </p>
        <button
          onClick={() => navigate(path.LOGIN)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
