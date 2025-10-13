import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-20 bg-gray-50 min-h-screen text-sm text-gray-800 mt-25">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow col-span-1">
          <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            NM
          </div>
          <div className="text-center mb-4">
            <h2 className="font-semibold text-base">Nguyễn Văn Minh</h2>
            <p className="text-sm text-gray-400">PLT Solutions</p>
          </div>
          <div className="text-center mb-4">
            <p className="text-gray-600 flex items-center justify-center gap-1 text-sm">
              <FiMapPin size={14} /> Hồ Chí Minh, Việt Nam
            </p>
          </div>
          <div className="text-center mb-4">
            <button
              onClick={() => navigate(path.EIDT_PROFILE)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm"
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>

          {/* Contact */}
          <div className="text-sm mt-6">
            <h3 className="font-medium text-gray-700 mb-2">
              Thông tin liên hệ
            </h3>
            <p className="flex items-center gap-2 text-gray-600">
              <FiMail size={14} /> minh.nguyen@email.com
            </p>
            <p className="flex items-center gap-2 mt-1 text-gray-600">
              <FiPhone size={14} /> 0123 456 789
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Kỹ năng</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "ReactJS",
                "Vue.js",
                "JavaScript",
                "TypeScript",
                "Tailwind CSS",
                "Node.js",
              ].map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white p-6 rounded-xl shadow col-span-2">
          <h2 className="text-base font-semibold mb-4">Hồ sơ cá nhân</h2>
          <p className="text-sm text-gray-600 mb-6">
            Đây là hồ sơ cá nhân của bạn trên hệ thống PLT Solutions. Vui lòng
            đảm bảo thông tin luôn chính xác để nhà tuyển dụng có thể liên hệ và
            đánh giá chính xác năng lực của bạn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hồ sơ ứng tuyển */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Hồ sơ ứng tuyển</h3>
              <p className="text-sm text-gray-600 mb-1">Số CV đã gửi</p>
              <p className="text-3xl font-bold text-indigo-600">1</p>
              <p className="text-sm text-gray-500 mt-2">
                Cập nhật cuối: <strong>Hôm nay</strong>
              </p>
            </div>

            {/* Trạng thái hồ sơ */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Trạng thái hồ sơ</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>CV đã gửi thành công</li>
                <li>Đang chờ nhà tuyển dụng xem</li>
                <li>Đã nhận được bài đánh giá</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
