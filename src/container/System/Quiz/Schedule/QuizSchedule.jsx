import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Users,
  Shuffle,
  Code,
  School,
} from "lucide-react";
import { HiOutlineFolder } from "react-icons/hi";
import { path } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
import scheduleService from "../../../../services/scheduleService";
import toast from "react-hot-toast";
import PaginationTailwind from "../../../components/Pagination/PaginationTailwind";
import dayjs from "dayjs";
export default function QuizSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState("lastest");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const itemPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSchedule();
  }, [selected]);

  const fetchSchedule = async () => {
    try {
      const res = await scheduleService.getSchedule(
        page,
        itemPerPage,
        selected
      );
      if (res && res.success === true) {
        setSchedules(res?.data?.data);
        setTotalPages(Math.ceil(res?.data?.pagination?.total / itemPerPage));
      }
    } catch (error) {
      toast.error("Lỗi khi fetch dữ liệu: " + error);
    }
  };

  const handleDelete = async (schedule) => {
    if (confirm(`Bạn có chắc chắn muốn xóa lịch thi ${schedule.title}?`)) {
      try {
        const res = await scheduleService.deleteSchedule(schedule.id);
        if (res && res.success === true) {
          toast.success(`Xóa lịch thi ${schedule.title} thành công`);
          fetchSchedule();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa dữ liệu: " + error);
      }
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  // lọc theo tên quiz hoặc mã đề
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule?.exam_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats mock từ dữ liệu
  const totalSchedules = schedules.length;
  const now = dayjs();
  const next7Date = dayjs().add(7, "day");

  const upcoming = schedules.filter((s) => {
    const start_time = dayjs(s.start_time);
    return start_time.isAfter(now) && start_time.isBefore(next7Date);
  }).length;
  const ended = schedules.filter(
    (s) => new Date(s.end_time) < new Date()
  ).length;
  const withShuffle = schedules.filter((s) => s.shuffle_question).length;

  const handlePageChange = (page) => {
    setPage(page);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch Thi</h1>
              <p className="text-sm text-gray-500">
                Quản lý lịch thi và cấu hình bài kiểm tra
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-violet-100 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-xl font-bold text-violet-700">
                {totalSchedules}
              </p>
              <p className="text-sm text-violet-800">Tổng lịch thi</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-xl font-bold text-blue-700">{upcoming}</p>
              <p className="text-sm text-blue-800">Sắp diễn ra (7 ngày tới)</p>
            </div>
            <div className="bg-green-100 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-xl font-bold text-green-700">{ended}</p>
              <p className="text-sm text-green-800">Đã kết thúc</p>
            </div>
            <div className="bg-red-100 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-xl font-bold text-red-700">{withShuffle}</p>
              <p className="text-sm text-red-800">Xáo trộn câu hỏi</p>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl w-fit shadow-sm">
              <div className="relative">
                <HiOutlineFolder className="text-3xl text-gray-600" />
                <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {filteredSchedules.length}
                </span>
              </div>
              <span className="text-base font-semibold text-gray-800">
                Danh sách lịch thi
              </span>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm đề thi..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Sort tạm thời hardcode không làm gì */}
              <select
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="lastest">Mới nhất</option>
                <option value="aZ">A → Z</option>
              </select>
              <button
                onClick={() => navigate(path.CREATE_QUIZ_SCHEDULE)}
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
                      Bài thi
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số lượt làm tối đa
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mã đề
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSchedules.map((schedule) => {
                    const isEnded = dayjs(schedule.end_time).isBefore(dayjs());

                    return (
                      <tr
                        key={schedule.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            #{schedule.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {schedule.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                Bắt đầu:{" "}
                                {dayjs(schedule.start_time).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                Kết thúc:{" "}
                                {dayjs(schedule.end_time).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-xs text-gray-700">
                                Số lần: {schedule.attempt_limit}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {schedule.shuffle_question && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  <Shuffle className="w-3 h-3" />
                                  Câu hỏi
                                </span>
                              )}
                              {schedule.shuffle_answer && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                  <Shuffle className="w-3 h-3" />
                                  Đáp án
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono font-semibold">
                            <Code className="w-3.5 h-3.5" />
                            {schedule.exam_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono font-semibold">
                            <School className="w-3.5 h-3.5" />
                            {schedule.class_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              disabled={isEnded}
                              onClick={() =>
                                !isEnded &&
                                navigate(
                                  path.UPDATE_QUIZ_SCHEDULE.replace(
                                    ":id",
                                    schedule.id
                                  )
                                )
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                isEnded
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-yellow-600 hover:bg-yellow-50"
                              }`}
                              title={
                                isEnded
                                  ? "Đã kết thúc, không thể sửa"
                                  : "Chỉnh sửa"
                              }
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              disabled={isEnded}
                              onClick={() => !isEnded && handleDelete(schedule)}
                              className={`p-2 rounded-lg transition-colors ${
                                isEnded
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                              title={
                                isEnded ? "Đã kết thúc, không thể xóa" : "Xóa"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  Không tìm thấy lịch thi nào
                </p>
              </div>
            )}
          </div>
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
    </>
  );
}
