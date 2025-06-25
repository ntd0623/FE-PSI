import React from "react";
import moment from "moment";
import { FaFileAlt, FaCalendarAlt, FaEye, FaTrash } from "react-icons/fa";
import { path } from "../../../utils/constant";
import { statusStyle } from "../../../utils/statusHelper";
import { useNavigate } from "react-router-dom";

const CVCard = ({ data, onView, onDelete }) => {
  const navigate = useNavigate();
  const status = statusStyle(data?.statusCv);
  return (
    <div className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
            <FaFileAlt className="text-lg" />
          </div>
          <div className="flex-1">
            <h3
              onClick={onView}
              className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
            >
              {`CV của ${data?.fullName} - ${data?.career_objective}` ||
                "CV chưa có tiêu đề"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <FaCalendarAlt className="text-xs" />
              <span>
                Ngày nộp: {moment(data?.submission_date).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <p className="text-sm text-gray-600">
                🎓 {data?.schoolName} - {data?.major}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
            >
              <span>{status.icon}</span>
              {data?.dataStatus?.value_VI}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
          >
            <FaEye className="text-xl" />
            Xem chi tiết
          </button>

          <button
            onClick={() => navigate(path.VIEW_CV.replace(":id", data.id))}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
          >
            ✏️ Sửa CV
          </button>
        </div>

        <button
          onClick={() => onDelete(data.id)}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm group"
        >
          <FaTrash className="text-xl group-hover:animate-pulse" />
          Xóa CV
        </button>
      </div>
    </div>
  );
};

export default CVCard;
