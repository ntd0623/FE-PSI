import React, { useEffect, useRef, useState } from "react";
import { Eye, FileText, CheckCircle, Clock } from "lucide-react";
import { HiOutlineFolder } from "react-icons/hi";
import toast from "react-hot-toast";
import { getAllCode } from "../../../services/studentService";
import examService from "../../../services/examService";
import dayjs from "dayjs";
import PaginationTailwind from "../../components/Pagination/PaginationTailwind";
import { getClassForStudent } from "../../../services/studentService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState({
    listStudent: 0,
    total_result: 0,
    average_score: 0,
    average_finish: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [statusOptions, setStatusOptions] = useState([]);
  const [quizOptions, setQuizOptions] = useState([]);
  const itemPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [classes, setClasses] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    fetchAllCode();
    fetchQuizList();
    fetchClasses();
  }, []);
  const fetchClasses = async () => {
    try {
      const res = await getClassForStudent();
      if (res && res.success === true) {
        const formatted = res.data.map((cls) => ({
          label: `${cls.class_code}`,
          value: +cls.id,
        }));
        setClasses(formatted);
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lớp học: " + error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, selectedStatus, selectedQuiz, selectedClass]);

  const fetchAllCode = async () => {
    try {
      const res = await getAllCode("STATUS_EXAM");
      if (res && res.errCode === 0) {
        setStatusOptions(
          res?.data.map((item) => ({ value: item.key, label: item.value_vi }))
        );
      }
    } catch (error) {
      console.error("Error fetching status codes:", error);
      toast.error("Lỗi khi tải mã trạng thái");
    }
  };

  const fetchQuizList = async () => {
    try {
      const res = await examService.getAllQuiz();
      if (res && res.success === true) {
        setQuizOptions(
          res.data.map((quiz) => ({ value: quiz.id, label: quiz.title }))
        );
      }
    } catch (error) {
      console.error("Error fetching quiz list:", error);
      toast.error("Lỗi khi tải danh sách bài thi");
    }
  };

  const fetchData = async () => {
    try {
      const filters = {};
      if (selectedQuiz !== "all") filters.quiz_id = selectedQuiz;
      if (selectedStatus !== "all") filters.status = selectedStatus;
      if (selectedClass !== "all") filters.class_id = selectedClass;
      const res = await examService.getResultAttempt(
        page,
        itemPerPage,
        filters
      );

      // ✅ Sửa đúng key dữ liệu
      const submissionData = res?.data?.data || [];
      const pagination = res?.data?.pagination || {};
      setSubmissions(submissionData);
      setTotalPages(Math.ceil((pagination.total || 1) / itemPerPage));

      // ✅ Tính thống kê
      const totalStudents = new Set(submissionData.map((item) => item.user_id))
        .size;
      const totalSubmissions = pagination.total || submissionData.length;
      const avgScore =
        submissionData.length > 0
          ? (
              submissionData.reduce(
                (sum, item) => sum + parseFloat(item.total_score || 0),
                0
              ) / submissionData.length
            ).toFixed(2)
          : 0;
      const avgFinish =
        submissionData.length > 0
          ? (
              (submissionData.filter((i) => i.status === "Hoàn thành").length /
                submissionData.length) *
              100
            ).toFixed(1)
          : 0;

      setStatistics({
        listStudent: totalStudents,
        total_result: totalSubmissions,
        average_score: avgScore,
        average_finish: avgFinish,
      });
    } catch (e) {
      console.error("Error fetching data:", e);
      toast.error("Lỗi khi tải dữ liệu");
    }
  };
  const handleExportExcel = async () => {
    try {
      if (selectedClass === "all" || selectedQuiz === "all") {
        toast.error("Vui lòng chọn lớp học và bài thi để xuất Excel!");
        return;
      }

      const res = await examService.exportResult(selectedClass, selectedQuiz);
      if (!res.success) {
        toast.error(res.message || "Không thể xuất dữ liệu");
        return;
      }

      const data = res.data;
      if (!data || data.length === 0) {
        toast.error("Không có dữ liệu để export!");
        return;
      }

      const classLabel =
        classes.find((cls) => cls.value === Number(selectedClass))?.label ||
        selectedClass;
      const quizLabel =
        quizOptions.find((q) => q.value === Number(selectedQuiz))?.label ||
        selectedQuiz;

      // 🔹 Tạo workbook và sheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Kết quả lớp");

      // 🔹 Tạo tiêu đề
      worksheet.mergeCells("A1:K1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = `KẾT QUẢ LỚP ${classLabel} - BÀI THI ${quizLabel}`;
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      titleCell.font = { size: 16, bold: true, color: { argb: "FF1F497D" } };
      worksheet.addRow([]);

      // 🔹 Header
      const headers = [
        "STT",
        "Mã SV",
        "Mã lớp",
        "Tổng điểm",
        "Số câu đúng",
        "Tổng câu",
        "Thời gian nộp",
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // 🔹 Dữ liệu
      data.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.name,
          item.class,
          item.total_score,
          item.total_correct,
          item.total_question,
          dayjs(item.submitted_at).format("DD/MM/YYYY HH:mm"),
        ]);
      });

      // 🔹 Auto width
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, val.length);
        });
        // Giới hạn tối đa 30 ký tự, tối thiểu 12
        const adjustedWidth = Math.min(Math.max(maxLength + 2, 12), 30);
        col.width = adjustedWidth;
      });

      // 🔹 Border + Align cho toàn bộ
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // 🔹 Xuất file
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Ket_qua_Lop${classLabel}_Quiz${quizLabel}.xlsx`;
      saveAs(new Blob([buffer]), fileName);

      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Export Excel error:", error);
      toast.error("Xuất Excel thất bại!");
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setPage(1);
  };
  const handlePageChange = (newPage) => setPage(newPage);
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };
  const handleQuizChange = (e) => {
    setSelectedQuiz(e.target.value);
    setPage(1);
  };

  // ✅ Lọc client-side
  const filteredSubmissions = Array.isArray(submissions)
    ? submissions.filter(
        (s) =>
          s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s?.quiz_title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách bài làm
            </h1>
            <p className="text-sm text-gray-500">
              Tổng hợp kết quả các bài trắc nghiệm đã nộp bởi thực tập sinh
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-violet-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-violet-700">
              {statistics.listStudent}
            </p>
            <p className="text-sm text-violet-800">Sinh viên tham gia</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-blue-700">
              {statistics.total_result}
            </p>
            <p className="text-sm text-blue-800">Tổng lượt nộp bài</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-green-700">
              {statistics.average_score}
            </p>
            <p className="text-sm text-green-800">Điểm trung bình</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-xl shadow flex flex-col items-center">
            <p className="text-xl font-bold text-yellow-700">
              {statistics.average_finish}%
            </p>
            <p className="text-sm text-yellow-800">Tỷ lệ hoàn thành</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 sm:gap-8 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="relative">
                <HiOutlineFolder className="text-3xl text-blue-600" />
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {filteredSubmissions.length}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Danh sách nộp bài
              </span>
            </div>
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
              >
                <FileText size={18} />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="🔍 Tìm sinh viên hoặc bài thi..."
              className="px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={selectedQuiz}
              onChange={handleQuizChange}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Tất cả bài thi</option>
              {quizOptions.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Tất cả lớp học</option>
              {classes.map((cls) => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Submission Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "#",
                  "Sinh viên",
                  "Bài thi",
                  "Lớp",
                  "Điểm",
                  "Kết quả",
                  "Thời gian làm",
                  "Bắt đầu",
                  "Nộp bài",
                  "Trạng thái",
                  "Hành động",
                ].map((h, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-10 text-gray-500 text-sm"
                  >
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    Không có bài làm nào để hiển thị
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      {(page - 1) * itemPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {submission.quiz_title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {submission.class}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold text-center">
                      {submission.total_score}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-blue-600">
                      {submission.total_correct}/{submission.total_question}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-purple-600">
                      {Math.floor(submission.duration_used)}p
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 text-center">
                      {dayjs(submission.start_time).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 text-center">
                      {dayjs(submission.submitted_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {submission.status === "S2" ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          <CheckCircle size={14} className="mr-1" /> Đã nộp
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                          <Clock size={14} className="mr-1" /> Hết giờ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition transform hover:scale-110">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
};

export default StudentSubmissions;
