import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaEye,
  FaTimes,
  FaTrash,
  FaPlus,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  getCVByStudentID,
  deleteCVStudent,
} from "../../services/studentService";
import CVCard from "../components/Section/CVCard";
import CVDetail from "../../container/System/CVDetail";
import { path, STATUS_CV, STATUS_CV_LABELS } from "../../utils/constant";
import Loading from "../components/Loading/Loading";
import "./MyCV.scss";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../components/Section/DeleteConfirmModal";
import PaginationTailwind from "../components/Pagination/PaginationTailwind";
const MyCV = () => {
  const modalRef = useRef();
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedDeleteCV, setSelectedDeleteCV] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state?.user?.userInfo);
  const [listCV, setListCV] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 3;
  useEffect(() => {
    const statusCv = filter;
    const id = user.id;
    fetchData(id, statusCv, page, limit);
  }, [filter, page]);

  const getStatusCount = (status) => {
    return listCV.filter((cv) => cv?.statusCv === status).length;
  };

  useEffect(() => {
    localStorage.removeItem("cvData");
  }, []);

  const statusCv = [
    { key: "", label: "Tất cả CV", count: total },
    {
      key: STATUS_CV.IN_REVIEW,
      label: STATUS_CV_LABELS.CV2,
      count: getStatusCount(STATUS_CV.IN_REVIEW),
    },
    {
      key: STATUS_CV.REJECT,
      label: STATUS_CV_LABELS.CV4,
      count: getStatusCount(STATUS_CV.REJECT),
    },
    {
      key: STATUS_CV.APPROVED,
      label: STATUS_CV_LABELS.CV3,
      count: getStatusCount(STATUS_CV.APPROVED),
    },
    {
      key: STATUS_CV.SUBMITTED,
      label: STATUS_CV_LABELS.CV1,
      count: getStatusCount(STATUS_CV.SUBMITTED),
    },
  ];

  useEffect(() => {
    console.log("Check listCV:", listCV);
  }, [listCV]);

  const fetchData = async (id, statusCv, page) => {
    try {
      let res = await getCVByStudentID({ id, statusCv, page, limit });
      if (res && res.errCode === 0) {
        setListCV(res.data);
        setTotal(res.total);
        setTotalPages(Math.ceil(res?.total / limit));
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deleteCVStudent(selectedDeleteCV.id);
    if (res.errCode === 0) {
      toast.success("Xóa CV thành công!");
      setListCV((prev) => prev.filter((cv) => cv.id !== selectedDeleteCV.id));
      fetchData(user.id, filter, page, limit);
    } else {
      toast.error("Xóa CV thất bại.");
    }
    setSelectedDeleteCV(null);
  };

  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (cv) => {
    setSelectedDeleteCV(cv);
  };

  const handleCloseModal = () => {
    setSelectedCV(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaFilter className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Bộ lọc</h3>
                </div>

                <div className="space-y-2">
                  {statusCv &&
                    statusCv.length > 0 &&
                    statusCv.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-200 ${
                          filter === item.key
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{item.label}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            filter === item.key ? "bg-white/20" : "bg-gray-200"
                          }`}
                        >
                          {item.count}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                <h4 className="font-bold text-lg mb-2">Thống kê</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Tổng CV:</span>
                    <span className="font-bold text-xl">{listCV.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">
                      {STATUS_CV_LABELS.CV1}
                    </span>
                    <span className="font-bold text-xl text-green-200">
                      {getStatusCount(STATUS_CV.SUBMITTED)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">
                      {STATUS_CV_LABELS.CV3}
                    </span>
                    <span className="font-bold text-xl text-green-200">
                      {getStatusCount(STATUS_CV.APPROVED)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">
                      {STATUS_CV_LABELS.CV2}
                    </span>
                    <span className="font-bold text-xl text-green-200">
                      {getStatusCount(STATUS_CV.IN_REVIEW)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">
                      {STATUS_CV_LABELS.CV4}
                    </span>
                    <span className="font-bold text-xl text-yellow-200">
                      {getStatusCount(STATUS_CV.REJECT)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Enhanced Main Content */}
            <main className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    CV của bạn
                  </h1>
                  <p className="text-gray-600">
                    Quản lý và theo dõi trạng thái các CV đã nộp
                  </p>
                </div>
                <button
                  onClick={() => navigate(path.FORM_CV)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaPlus className="text-sm" />
                  Nộp CV mới
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h3 className="font-bold text-blue-800 mb-1">Lời khuyên</h3>
                    <p className="text-blue-700">
                      Bạn nên cập nhật CV ít nhất 1 lần trước ngày{" "}
                      <strong>30/06</strong> để tăng cơ hội được duyệt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {listCV && listCV.length > 0 ? (
                  listCV.map((cv) => (
                    <CVCard
                      key={cv.id}
                      data={cv}
                      onView={() => handleViewCV(cv)}
                      onDelete={handleOpenDeleteModal}
                      canEdit={cv.statusCv === STATUS_CV.SUBMITTED}
                      canDelete={cv.statusCv === STATUS_CV.SUBMITTED}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Không có CV nào
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Không có CV nào phù hợp với bộ lọc hiện tại.
                    </p>
                    <button
                      onClick={() => setFilter("")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Xem tất cả CV
                    </button>
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
            </main>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCV && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] z-9999 flex items-center justify-center px-4 mx-auto">
          <div
            ref={modalRef}
            className="bg-white max-h-[90vh] overflow-y-auto w-full lg:w-3/4 p-6 rounded-xl shadow-lg relative"
          >
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

      {selectedDeleteCV && (
        <DeleteConfirmModal
          cv={selectedDeleteCV}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSelectedDeleteCV(null)}
        />
      )}
    </div>
  );
};

export default MyCV;
