import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, Lock, Mail, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassForStudent,
  getStudentById,
  updateStudent,
} from "../../../services/studentService";
import { path } from "../../../utils/constant";

export default function StudentUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
    class_id: "",
  });
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchClasses();
    fetchStudentDetail();
  }, []);

  // 🔹 Lấy danh sách lớp
  const fetchClasses = async () => {
    try {
      const res = await getClassForStudent();
      if (res?.success) {
        const formatted = res.data.map((cls) => ({
          label: `${cls.class_code}-${cls.class_name}`,
          value: cls.id,
        }));
        setClasses(formatted);
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lớp: " + error.message);
    }
  };

  // 🔹 Lấy thông tin sinh viên cần sửa
  const fetchStudentDetail = async () => {
    try {
      const res = await getStudentById(id);
      if (res?.success && res.data) {
        setForm({
          email: res.data.email || "",
          password: "********", // Ẩn mật khẩu thật
          class_id: res.data.class_id || "",
        });
      } else {
        toast.error("Không tìm thấy sinh viên");
        navigate(path.STUDENT_MANAGEMENT);
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin sinh viên: " + error.message);
    }
  };

  // 🔹 Validate
  const validateForm = () => {
    const newErrors = {};
    if (!form.class_id) newErrors.class_id = "Vui lòng chọn lớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit cập nhật
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = { id, class_id: form.class_id, email: form.email };
      const res = await updateStudent(payload);
      if (res?.success) {
        toast.success("Cập nhật sinh viên thành công");
        setTimeout(() => navigate(path.STUDENT_MANAGEMENT), 1500);
      } else {
        toast.error(res.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật: " + error.message);
    }
  };

  const handleCancel = () => navigate(path.STUDENT_MANAGEMENT);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cập nhật thông tin sinh viên
          </h1>
          <p className="text-sm text-gray-500">
            Bạn chỉ có thể thay đổi lớp học của sinh viên này.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Thông tin sinh viên
        </h2>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email / Mã số sinh viên
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={form.email}
              readOnly
              className="w-full border border-gray-300 bg-gray-100 rounded-lg pl-11 pr-4 py-3 font-mono text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={form.password}
              readOnly
              className="w-full border border-gray-300 bg-gray-100 rounded-lg pl-11 pr-4 py-3 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Lớp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lớp <span className="text-red-500">*</span>
          </label>
          <select
            name="class_id"
            value={form.class_id}
            onChange={(e) => setForm({ ...form, class_id: e.target.value })}
            className={`w-full border ${
              errors.class_id
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
          {errors.class_id && (
            <p className="mt-1 text-xs text-red-600">{errors.class_id}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
