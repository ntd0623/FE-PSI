import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const StartQuizModal = ({ quiz, onClose, onConfirm }) => {
  const modalRef = useRef();

  // Hiệu ứng mở modal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // ✅ Xử lý đóng có hiệu ứng
  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: -40,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Xác nhận làm bài
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Bạn sắp bắt đầu bài kiểm tra:{" "}
          <span className="font-semibold text-blue-600">{quiz.title}</span>.
          <br />
          Hệ thống sẽ bắt đầu tính thời gian ngay khi bạn xác nhận.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(quiz.id);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Bắt đầu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StartQuizModal;
