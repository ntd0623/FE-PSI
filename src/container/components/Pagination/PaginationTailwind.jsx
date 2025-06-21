import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const PaginationTailwind = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between flex-wrap mt-6 px-4 gap-y-4">
      {/* Trái - để trống hoặc dùng sau */}
      <div className="w-[100px] hidden sm:block" />

      {/* Giữa - nút Next page */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="bg-green-600 text-white font-semibold px-5 py-2 rounded shadow 
             transition hover:bg-green-700 flex items-center gap-2 
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next page →
        </button>
      </div>

      {/* Phải - pagination */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 
             hover:bg-gray-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        <input
          type="text"
          readOnly
          value={currentPage}
          className="w-10 text-center border border-gray-300 rounded-md py-1"
        />
        <span className="text-sm text-gray-600">of {totalPages}</span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 
             hover:bg-gray-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PaginationTailwind;
