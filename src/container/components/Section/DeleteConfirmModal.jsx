import React from "react";
import { FaTrash } from "react-icons/fa";
const DeleteConfirmModal = ({ item, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl transform animate-slideUp">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <FaTrash className="text-red-600 text-xl" />
        </div>

        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
          Xác nhận xóa {item.title}
        </h3>

        <p className="text-gray-600 text-center mb-6">
          Bạn có chắc chắn muốn xóa{" "}
          <span className="font-semibold text-gray-800">{item.title}</span>?
          Hành động này không thể hoàn tác.
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
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
);
export default DeleteConfirmModal;
