import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, User, School } from "lucide-react";
import { HiOutlineFolder } from "react-icons/hi";
import PaginationTailwind from "../../components/Pagination/PaginationTailwind";
import toast from "react-hot-toast";
import {
  getAllUser,
  getClassForStudent,
  deleteStudent,
} from "../../../services/studentService";
import useDebounce from "../../../hook/useDebounce";
import { path } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedClass, setSelectedClass] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Gọi API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (debouncedSearch) filters.keyword = debouncedSearch;
      if (selectedClass !== "Tất cả") filters.class_id = selectedClass;
      const res = await getAllUser(page, pageSize, filters);
      setStudents(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải dữ liệu sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClassForStudent();
      if (res && res.success === true) {
        const formatted = res.data.map((cls) => ({
          label: `${cls.class_code}`,
          value: cls.id,
        }));
        setClasses([{ label: "Tất cả", value: "Tất cả" }, ...formatted]);
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lớp học: " + error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, selectedClass, debouncedSearch]);

  const handleDelete = async (student) => {
    if (confirm(`Bạn có chắc muốn xóa sinh viên ${student.email}?`)) {
      try {
        const res = await deleteStudent(student.id);
        if (res && res.success === true) {
          toast.success(`Xóa sinh viên ${student.email} thành công`);
          fetchStudents();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa sinh viên: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Sinh viên
            </h1>
            <p className="text-sm text-gray-500">
              Danh sách sinh viên và thông tin lớp học
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl w-fit shadow-sm">
            <HiOutlineFolder className="text-3xl text-gray-600" />
            <span className="text-base font-semibold text-gray-800">
              Danh sách sinh viên ({total})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sinh viên..."
              className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Dropdown Lọc theo lớp */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate(path.CREATE_STUDENT)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-5 py-2 rounded-xl shadow transition hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Không có sinh viên nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                      ID
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                      Mã sinh viên (Email)
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                      Lớp
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{st.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {st.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {st.classes.map((cls) => cls.class_name).join(", ")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                path.UPDATE_STUDENT.replace(":id", st.id)
                              )
                            }
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(st)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <PaginationTailwind
            currentPage={page}
            totalPages={Math.ceil(total / pageSize)}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
