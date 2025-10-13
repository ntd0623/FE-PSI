import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, X, Hash, Type, Users, PawPrint } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { path } from "../../../utils/constant";
import classService from "../../../services/classService";

export default function ClassUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    class_code: "",
    class_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await classService.getClassById(id);
        if (res?.success && res?.data) {
          setForm({
            class_code: res.data.class_code,
            class_name: res.data.class_name,
          });
        } else {
          toast.error("Không tìm thấy thông tin lớp học");
          navigate(path.CLASS_MANAGEMENT);
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin lớp học");
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    // Hàm kiểm tra XSS — chặn ký tự HTML/script nguy hiểm
    const hasXSS = (str) =>
      /<|>|script|onerror|onload|alert\(|javascript:/i.test(str);

    // --- Validate mã lớp ---
    if (!form.class_code.trim()) {
      newErrors.class_code = "Vui lòng nhập mã lớp";
    } else if (form.class_code.length > 255) {
      newErrors.class_code = "Mã lớp không được vượt quá 255 ký tự";
    } else if (hasXSS(form.class_code)) {
      newErrors.class_code = "Mã lớp chứa ký tự không hợp lệ";
    }

    // --- Validate tên lớp ---
    if (!form.class_name.trim()) {
      newErrors.class_name = "Vui lòng nhập tên lớp";
    } else if (form.class_name.length > 255) {
      newErrors.class_name = "Tên lớp không được vượt quá 255 ký tự";
    } else if (hasXSS(form.class_name)) {
      newErrors.class_name = "Tên lớp chứa ký tự không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        const res = await classService.updateClass({
          id: id,
          class_code: form.class_code,
          class_name: form.class_name,
        });
        if (res.success === true) {
          toast.success("Cập nhật lớp học thành công");
          setTimeout(() => {
            navigate(path.CLASS_MANAGEMENT);
          }, 1500);
        } else {
          toast.error(res.message || "Không thể cập nhật lớp học");
        }
      } catch (error) {
        toast.error("Lỗi khi cập nhật lớp học: " + error.message);
      }
    }
  };

  const handleCancel = () => {
    navigate(path.CLASS_MANAGEMENT);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải dữ liệu lớp học...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(path.CLASS_MANAGEMENT)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cập nhật thông tin lớp học
          </h1>
          <p className="text-sm text-gray-500">
            Chỉnh sửa thông tin lớp học hiện tại
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Thông tin lớp học
        </h2>

        {/* Mã lớp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã lớp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="class_code"
              value={form.class_code}
              onChange={handleChange}
              placeholder="VD: CNTT2025A"
              className={`w-full border ${
                errors.class_code
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 font-mono`}
            />
          </div>
          {errors.class_code && (
            <p className="mt-1 text-xs text-red-600">{errors.class_code}</p>
          )}
        </div>

        {/* Tên lớp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên lớp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="class_name"
              value={form.class_name}
              onChange={handleChange}
              placeholder="VD: Lớp Công nghệ thông tin K27"
              className={`w-full border ${
                errors.class_name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.class_name && (
            <p className="mt-1 text-xs text-red-600">{errors.class_name}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
          Hủy
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          Cập nhật
        </button>
      </div>
    </div>
  );
}
