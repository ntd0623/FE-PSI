import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CandidateEvaluationQuiz = () => {
  const totalQuestions = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 phút

  const question = {
    title:
      "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất cho phát triển web front-end?",
    answers: ["Python", "JavaScript", "Java", "C++"],
  };

  const handleNext = () => {
    if (currentPage < 2) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bài thi Công nghệ thông tin</h2>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-semibold text-lg">{formatTime(timeLeft)}</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question & options */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">
            Câu {currentPage}/{totalQuestions}
          </span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded font-semibold text-gray-700">
            Câu {currentPage}/{totalQuestions}
          </span>
        </div>

        <p className="text-lg font-medium mb-4">{question.title}</p>

        <div className="space-y-3">
          {question.answers.map((ans, idx) => (
            <label
              key={idx}
              className="block border rounded px-4 py-3 cursor-pointer hover:border-blue-400 transition"
            >
              <input
                type="radio"
                name={`question-${currentPage}`}
                className="mr-3 accent-blue-600"
              />
              {ans}
            </label>
          ))}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>

        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
          Next page →
        </button>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>{currentPage}</span>
          <span className="text-gray-400">of</span>
          <span>2</span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === 2}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CandidateEvaluationQuiz;
