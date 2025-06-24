import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getAvatarColor } from "../../../utils/statusHelper";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaKey,
  FaIdBadge,
  FaLock,
  FaFileAlt,
  FaBriefcase,
} from "react-icons/fa";
import gsap from "gsap";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const profileRef = useRef(null);

  useEffect(() => {
    if (profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  if (!user)
    return (
      <div className="text-center py-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div
        ref={profileRef}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Thông tin người dùng
        </h2>

        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
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

          <div className="w-full space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-500" />
              <span className="text-gray-600">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-green-500" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaKey className="text-purple-500" />
              <span className="text-gray-600">{user.provider}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            <div className="bg-gray-100 p-4 rounded text-center shadow">
              <FaFileAlt className="text-indigo-500 text-xl mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-700">3 CV đã gửi</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center shadow">
              <FaBriefcase className="text-yellow-500 text-xl mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-700">
                2 vị trí ứng tuyển
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-6">
            Cập nhật thông tin cá nhân
          </button>

          {/* Message */}
          <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded text-sm italic">
            Hãy cập nhật hồ sơ đầy đủ để gia tăng khả năng được tuyển!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
