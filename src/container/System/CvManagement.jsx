import React, { useEffect, useState, useRef } from "react";
import { getStatusColor, getAvatarColor } from "../../utils/statusHelper";
import { STATUS_CV } from "../../utils/constant";
import {
  getAllCode,
  getInfoCvStudent,
  updateStatusCV,
} from "../../services/studentService";
import CVDetail from "./CVDetail";
import toast from "react-hot-toast";
import moment from "moment";
import html2pdf from "html2pdf.js";
import PaginationTailwind from "../components/Pagination/PaginationTailwind";
const CVManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCV, setSelectedCV] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listStatusCV, setListStatusCV] = useState("");
  const [listIntership, setListInternship] = useState("");
  const [listStudent, setListStudent] = useState("");
  const hasFetched = useRef(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3; // số lượng bản ghi mỗi trang
  const printRef = useRef();

  const handlePrint = () => {
    if (!selectedCV || !printRef.current) {
      toast.error("Không có dữ liệu CV để in");
      return;
    }

    const element = printRef.current;

    const opt = {
      margin: 0.3,
      filename: `${selectedCV.fullName || "CV"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const fetchData = async () => {
    const listStatusCV = await getAllCode("CV_STATUS");
    const listIntership = await getAllCode("INTERNSHIP_BATCHES");
    const listStudent = await getInfoCvStudent();
    if (
      listStatusCV.errCode === 0 &&
      listIntership.errCode === 0 &&
      listStudent.errCode === 0
    ) {
      setListStatusCV(listStatusCV.data);
      setListInternship(listIntership.data);
      setListStudent(listStudent.data);
    }
  };
  useEffect(() => {
    if (hasFetched.current) return; // if fetched return
    hasFetched.current = true;
    fetchData();
  }, []);

  const fetchFilteredStudents = async (status, batch, page) => {
    const res = await getInfoCvStudent(status, batch, page);
    if (res && res.errCode === 0) {
      setListStudent(res.data);
      setTotalPages(Math.ceil(res?.total / limit));
      console.log("Check total page: ", totalPages);
    }
  };
  useEffect(() => {
    const batch = selectedFilter;
    const status = selectedStatus;
    console.log("Check batch: ", batch);
    console.log("Check status: ", status);
    fetchFilteredStudents(status, batch, page);
  }, [selectedFilter, selectedStatus, page]);

  const counts = {
    SUBMITTED:
      listStudent &&
      listStudent.length > 0 &&
      listStudent.filter((s) => s.statusCv === STATUS_CV.SUBMITTED).length,
    APPROVED:
      listStudent &&
      listStudent.length > 0 &&
      listStudent.filter((s) => s.statusCv === STATUS_CV.APPROVED).length,
    REJECT:
      listStudent &&
      listStudent.length > 0 &&
      listStudent.filter((s) => s.statusCv === STATUS_CV.REJECT).length,
    IN_REVIEW:
      listStudent &&
      listStudent.length > 0 &&
      listStudent.filter((s) => s.statusCv === STATUS_CV.IN_REVIEW).length,
  };

  const statusCards = [
    {
      count: counts.SUBMITTED,
      label:
        listStatusCV &&
        listStatusCV.length > 0 &&
        listStatusCV.find((item) => item.key === STATUS_CV.SUBMITTED).value_VI,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      count: counts.APPROVED,
      label:
        listStatusCV &&
        listStatusCV.length > 0 &&
        listStatusCV.find((item) => item.key === STATUS_CV.APPROVED).value_VI,
      color: "bg-green-100 text-green-800",
    },
    {
      count: counts.REJECT,
      label:
        listStatusCV &&
        listStatusCV.length > 0 &&
        listStatusCV.find((item) => item.key === STATUS_CV.REJECT).value_VI,
      color: "bg-red-100 text-red-800",
    },
    {
      count: counts.IN_REVIEW,
      label:
        listStatusCV &&
        listStatusCV.length > 0 &&
        listStatusCV.find((item) => item.key === STATUS_CV.IN_REVIEW).value_VI,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const handleUpdateStatus = async (student, status) => {
    console.log("Check student: ", student, status);
    const res = await updateStatusCV({ id: student.id, statusCv: status });
    if (res && res.errCode === 0) {
      if (status === "CV2") {
        toast.success(
          `CV của ${student.fullName} đã chuyển sang trạng thái đang xem xét`
        );
      }
      if (status === "CV3") {
        toast.success(
          `CV của ${student.fullName} đã chuyển sang trạng thái đạt yêu cầu`
        );
      }
      if (status === "CV4") {
        toast.success(
          `CV của ${student.fullName} đã chuyển sang trạng thái bị từ chối`
        );
      }
      fetchFilteredStudents(selectedStatus, selectedFilter, page);
    }
  };

  const handleViewCV = (student, status) => {
    setSelectedCV(student);
    if (student.statusCv === STATUS_CV.SUBMITTED) {
      handleUpdateStatus(student, status);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCV(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div
      className="bg-white rounded-lg p-5"
      style={{ boxShadow: "0 0 15px 5px rgba(0,0,0,0.05)" }}
    >
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Danh sách CV ứng tuyển
      </h1>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-6 justify-end">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value={""}>Tất cả các đợt</option>
          {listIntership &&
            listIntership.length > 0 &&
            listIntership.map((item, index) => {
              return (
                <option key={index} value={item.key}>
                  {item.value_VI}
                </option>
              );
            })}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value={""}>Tất cả trạng thái</option>
          {listStatusCV &&
            listStatusCV.length > 0 &&
            listStatusCV.map((item, index) => {
              return (
                <option key={index} value={item.key}>
                  {item.value_VI}
                </option>
              );
            })}
        </select>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} p-4 rounded-lg text-center`}
          >
            <div className="text-2xl font-bold mb-1">{card.count}</div>
            <div className="text-sm font-medium">{card.label}</div>
          </div>
        ))}
      </div>
      {/* Student Cards */}
      <div className="space-y-6">
        {listStudent &&
          listStudent.length > 0 &&
          listStudent.map((student, index) => (
            <div
              key={student.id}
              className="bg-white rounded-lg p-6"
              style={{ boxShadow: "0 0 15px 5px rgba(0,0,0,0.08)" }}
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div className="flex-1 flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full ${getAvatarColor(
                      student.fullName
                    )} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                  >
                    {student?.fullName
                      ? student?.fullName
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                      : "N/A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {student.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {student.email}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500 font-medium block">
                          TRƯỜNG
                        </span>
                        <p className="text-gray-900">{student.schoolName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium block">
                          CHUYÊN NGÀNH
                        </span>
                        <p className="text-gray-900">{student.major}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500 font-medium">GPA</span>
                        <p className="text-gray-900">{student.gpa}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium block">
                          THỜI GIAN NỘP
                        </span>
                        <p className="text-gray-900">
                          {moment(student.submission_date).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-5">
                        <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-3xl text-sm font-medium">
                          {student?.internshipBatch?.dataInternship.value_VI}
                        </span>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-3xl ${getStatusColor(
                            student?.statusCv
                          )}`}
                        >
                          {student?.dataStatus?.value_VI}
                        </span>
                      </div>
                    </div>
                    {(student.statusCv === STATUS_CV.SUBMITTED ||
                      student.statusCv === STATUS_CV.IN_REVIEW) && (
                      <div className="flex flex-wrap gap-6 my-8">
                        <button
                          onClick={() =>
                            handleUpdateStatus(student, STATUS_CV.APPROVED)
                          }
                          className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          Chấp nhận
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(student, STATUS_CV.REJECT)
                          }
                          className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-60 bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 font-medium mb-2">
                    CV PREVIEW
                  </span>
                  <div className="bg-white border border-gray-200 rounded-md h-40 flex items-center justify-center mb-4">
                    <span className="text-sm font-semibold text-gray-700 text-center">
                      CV {student.fullName}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleViewCV(student, STATUS_CV.IN_REVIEW)}
                      className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 text-xs font-medium transition-colors duration-200"
                    >
                      Xem đầy đủ
                    </button>
                  </div>
                </div>
              </div>
              {isModalOpen && selectedCV && (
                <div className="fixed inset-0 bg-transparent z-9999 flex items-center justify-center px-4 mx-auto">
                  <div className="bg-white max-h-[90vh] overflow-y-auto w-full lg:w-3/4 p-6 rounded-xl shadow-lg relative">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-4xl"
                    >
                      &times;
                    </button>
                    {/* CV DETAIL */}
                    <CVDetail cvData={selectedCV} />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
      {/* Pagination - Bổ sung sau */}
      <div className="mt-8">
        <PaginationTailwind
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CVManagement;
