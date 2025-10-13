import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users, Calendar, School } from "lucide-react";
import { HiOutlineFolder } from "react-icons/hi";
import PaginationTailwind from "../../components/Pagination/PaginationTailwind";
import toast from "react-hot-toast";
import { path } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import classService from "../../../services/classService";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // ✅ Gọi API
  const fetchClasses = async () => {
    try {
      const res = await classService.getAllClasses(page, itemPerPage);
      if (res && res.success === true && res.data) {
        setClasses(res.data.data || []);
        const total = res.data.pagination?.total || 0;
        setTotalPages(Math.ceil(total / itemPerPage));
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lớp học: " + error.message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page]);

  const filteredClasses = classes.filter(
    (cls) =>
      cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.class_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (cls) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${cls.class_name}?`)) {
      try {
        const res = await classService.deleteClass(cls.id);
        if (res && res.success === true) {
          fetchClasses();
        } else {
          toast.error(res.message || `Xóa lớp ${cls.class_name} thất bại`);
        }
      } catch (error) {}
      toast.success(`Xóa lớp ${cls.class_name} thành công`);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <School className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Lớp học
            </h1>
            <p className="text-sm text-gray-500">
              Danh sách các lớp học đang được quản lý
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-blue-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-blue-700">{classes.length}</p>
            <p className="text-sm text-blue-800">Tổng số lớp học</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-green-700">
              {classes.reduce((a, c) => a + (c.total_student || 0), 0)}
            </p>
            <p className="text-sm text-green-800">Tổng số học viên</p>
          </div>
          <div className="bg-red-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-red-700">
              {classes.filter((c) => (c.total_student || 0) === 0).length}
            </p>
            <p className="text-sm text-red-800">Lớp chưa có học viên</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl w-fit shadow-sm">
            <div className="relative">
              <HiOutlineFolder className="text-3xl text-gray-600" />
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {filteredClasses.length}
              </span>
            </div>
            <span className="text-base font-semibold text-gray-800">
              Danh sách lớp học
            </span>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm lớp..."
              className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => navigate(path.CREATE_CLASS)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-5 py-2 rounded-xl shadow transition hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên lớp
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mã Lớp
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClasses.map((cls) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{cls.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {cls.class_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {cls.class_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />{" "}
                      {cls.total_student || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(path.UPDATE_CLASS.replace(":id", cls.id))
                          }
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
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

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Không có lớp học nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <PaginationTailwind
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
