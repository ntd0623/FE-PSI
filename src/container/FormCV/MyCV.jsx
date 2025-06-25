import React, { useEffect, useState } from "react";
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
import { getCVByStudentID } from "../../services/studentService";
import CVCard from "../components/Section/CVCard";
import CVDetail from "../../container/System/CVDetail";
import { path, STATUS_CV, STATUS_CV_LABELS } from "../../utils/constant";
import Loading from "../components/Loading/Loading";
import "./MyCV.scss";
const initialCVs = [
  {
    id: 1,
    title: "CV ứng tuyển Frontend Developer",
    submittedAt: "2025-06-23",
    status: "Chờ duyệt",
    description: "Mục tiêu: Làm frontend tại công ty startup sử dụng ReactJS.",
    company: "TechStart JSC",
  },
  {
    id: 2,
    title: "CV Backend Internship",
    submittedAt: "2025-06-15",
    status: "Đã duyệt",
    description: "Ứng tuyển vị trí thực tập Node.js, backend REST API.",
    company: "Innovation Lab",
  },
  {
    id: 3,
    title: "CV Full-stack Developer",
    submittedAt: "2025-06-10",
    status: "Từ chối",
    description:
      "Vị trí phát triển ứng dụng web full-stack với React và Node.js.",
    company: "Digital Solutions",
  },
];

const DeleteConfirmModal = ({ cv, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl transform animate-slideUp">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <FaTrash className="text-red-600 text-xl" />
        </div>

        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
          Xác nhận xóa CV
        </h3>

        <p className="text-gray-600 text-center mb-6">
          Bạn có chắc chắn muốn xóa CV "
          <span className="font-semibold text-gray-800">{cv.title}</span>"? Hành
          động này không thể hoàn tác.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Xóa CV
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MyCV = () => {
  const [cvs, setCVs] = useState(initialCVs);
  const [selectedCV, setSelectedCV] = useState(null);
  const [deleteCV, setDeleteCV] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state?.user?.userInfo);
  const [listCV, setListCV] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const statusCv = filter;
    const id = user.id;
    fetchData(id, statusCv, page);
  }, [filter, page]);

  const getStatusCount = (status) => {
    return listCV.filter((cv) => cv?.statusCv === status).length;
  };

  const filteredCVs =
    filter === "Tất cả"
      ? listCV
      : listCV.filter((cv) => cv?.dataStatus?.value_VI === filter);

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

  const fetchData = async (id, statusCv, page) => {
    setIsLoading(true);
    try {
      let res = await getCVByStudentID({ id, statusCv, page });
      if (res && res.errCode === 0) {
        setListCV(res.data);
        setTotal(res.total);
      }
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCV = (id) => {
    const cvToDelete = cvs.find((cv) => cv.id === id);
    setDeleteCV(cvToDelete);
  };

  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setCVs(cvs.filter((cv) => cv.id !== deleteCV.id));
    setDeleteCV(null);
  };

  const handleCloseModal = () => {
    setSelectedCV(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <Loading />;
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
                      onDelete={handleDeleteCV}
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
            </main>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCV && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] z-9999 flex items-center justify-center px-4 mx-auto">
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

      {deleteCV && (
        <DeleteConfirmModal
          cv={deleteCV}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteCV(null)}
        />
      )}
    </div>
  );
};

export default MyCV;
