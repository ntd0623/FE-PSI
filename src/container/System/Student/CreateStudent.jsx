import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Mail,
  Lock,
  Users,
  FileDown,
  FileUp,
} from "lucide-react";
import {
  createStudent,
  getClassForStudent,
  importExcel,
} from "../../../services/studentService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { path } from "../../../utils/constant";

export default function StudentForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    class_id: "",
  });
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClassForStudent();
      if (res && res.success === true) {
        const formatted = res.data.map((cls) => ({
          label: `${cls.class_code}-${cls.class_name}`,
          class_code: cls.class_code,
          value: cls.id,
        }));
        setClasses(formatted);
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lớp học: " + error.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const hasXSS = (str) =>
    /<|>|script|onerror|onload|alert\(|javascript:/i.test(str);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập mã số sinh viên hoặc email";
    } else if (form.email.length > 255) {
      newErrors.email = "Email không được vượt quá 255 ký tự";
    } else if (hasXSS(form.email)) {
      newErrors.email = "Email chứa ký tự không hợp lệ";
    }

    if (!form.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (form.password.length > 255) {
      newErrors.password = "Mật khẩu không được vượt quá 255 ký tự";
    }

    if (!form.class_id) {
      newErrors.class_id = "Vui lòng chọn lớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const res = await createStudent(form);
        if (res.success === true) {
          toast.success("Tạo sinh viên thành công");
          handleReset();
          setTimeout(() => {
            navigate(path.STUDENT_MANAGEMENT);
          }, 1500);
        }
      } catch (error) {
        toast.error("Lỗi khi tạo sinh viên: " + error);
      }
    }
  };

  const handleReset = () => {
    setForm({
      email: "",
      password: "",
      class_id: "",
    });
    setErrors({});
  };

  // ⚙️ Export Excel mẫu có dropdown lớp
  const handleExportSample = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Students");

      // Header
      const header = ["Email / Mã SV", "Mật khẩu", "Lớp"];
      sheet.addRow(header);
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // ✅ Dropdown danh sách lớp
      const classList = classes.map((c) => c.class_code);
      if (classList.length > 0) {
        const hiddenSheet = workbook.addWorksheet("ClassList");
        hiddenSheet.state = "veryHidden";

        classList.forEach((cls, i) => {
          hiddenSheet.getCell(`A${i + 1}`).value = cls;
        });

        const range = `ClassList!$A$1:$A$${classList.length}`;

        for (let i = 2; i <= 100; i++) {
          const cell = sheet.getCell(`C${i}`);
          cell.dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [range],
            showErrorMessage: true,
            errorTitle: "Giá trị không hợp lệ",
            error: "Vui lòng chọn lớp trong danh sách dropdown.",
          };
        }
      }

      // Auto width
      sheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const len = cell.value ? cell.value.toString().length : 10;
          if (len > maxLength) maxLength = len;
        });
        col.width = maxLength < 15 ? 15 : maxLength;
      });

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_import_sample.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo file mẫu Excel");
    }
  };

  // Import Excel
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const sheet = workbook.worksheets[0];
      const importedData = [];

      sheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return; // bỏ header
        const email = row.getCell(1).value?.toString().trim();
        const password = row.getCell(2).value?.toString().trim();
        const class_code = row.getCell(3).value?.toString().trim();

        const foundClass = classes.find((c) => c.class_code === class_code);
        if (foundClass) {
          importedData.push({
            email,
            password,
            class_id: +foundClass.value,
          });
        } else {
          console.warn(`⚠️ Lớp ${class_code} không tồn tại trong hệ thống.`);
        }
      });

      if (!importedData.length) {
        toast.error("File Excel rỗng hoặc sai định dạng");
        return;
      }

      const res = await importExcel(importedData);
      if (res.success) {
        toast.success("Import sinh viên thành công");
        setTimeout(() => {
          navigate(path.STUDENT_MANAGEMENT);
        }, 1500);
      }
    } catch (err) {
      toast.error("Lỗi khi đọc file Excel");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(path.STUDENT_MANAGEMENT)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thêm sinh viên mới
          </h1>
          <p className="text-sm text-gray-500">
            Điền thông tin chi tiết hoặc import từ file Excel
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Thông tin sinh viên
        </h2>

        {/* Email / MSSV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã số sinh viên (Email) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="VD: 225480201001@tdc.edu.vn"
              className={`w-full border ${
                errors.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 font-mono`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mặc định"
              className={`w-full border ${
                errors.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Lớp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lớp <span className="text-red-500">*</span>
          </label>
          <select
            name="class_id"
            value={form.class_id}
            onChange={handleChange}
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
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportSample}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FileDown className="w-4 h-4" />
            Tải file mẫu
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition">
            <FileUp className="w-4 h-4" />
            Import Excel
            <input
              type="file"
              accept=".xlsx"
              onChange={handleImportExcel}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Lưu sinh viên
          </button>
        </div>
      </div>
    </div>
  );
}
