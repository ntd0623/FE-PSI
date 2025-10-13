import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn Minh",
    position: "Senior Frontend Developer",
    company: "PLT Solutions",
    email: "minh.nguyen@email.com",
    phone: "0123 456 789",
    location: "Hồ Chí Minh, Việt Nam",
    skills: [
      "ReactJS",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
    ],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-20 mt-32">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h2>

      {/* Thông tin cá nhân */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaUser /> Họ tên
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            🧑‍💻 Vị trí
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaBuilding /> Công ty
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaMapMarkerAlt /> Địa chỉ
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Liên hệ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaEnvelope /> Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaPhone /> Số điện thoại
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Kỹ năng */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Kỹ năng</label>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Nút */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          Huỷ
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
