import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
import { FileQuestion, Clock } from "lucide-react";
import toast from "react-hot-toast";
import scheduleService from "../../../services/scheduleService";
import dayjs from "dayjs";
import examService from "../../../services/examService";
import { useSelector } from "react-redux";

const QuizAssignmentList = () => {
  const [examCode, setExamCode] = useState("");
  const [quizInfo, setQuizInfo] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.userInfo);

  const fetchScheduleByExamCode = async (exam_code) => {
    try {
      const res = await scheduleService.getScheduleByExamCode(
        exam_code,
        user.id
      );
      if (res && res.success === true) {
        setQuizInfo(res?.data);
        console.log("Check data: ", res?.data);
      } else {
        setQuizInfo(null);
        toast.error("❌ Mã kiểm tra không hợp lệ!");
      }
    } catch (error) {
      setQuizInfo(null);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Có lỗi xảy ra";

        if (status === 404) {
          toast.error("❌ " + message);
        } else if (status === 403) {
          toast.error("⏰ " + message);
        } else {
          toast.error("⚠️ Lỗi server: " + message);
        }
      } else {
        toast.error("🚫 Lỗi kết nối tới server");
      }
    }
  };

  const handleCheckExamCode = async () => {
    if (!examCode.trim()) {
      toast.error("Vui lòng nhập mã kiểm tra!");
      return;
    }
    await fetchScheduleByExamCode(examCode);
  };

  const handleStartExam = async () => {
    const now = dayjs();
    const start = dayjs(quizInfo.start_time);
    const end = dayjs(quizInfo.end_time);

    if (now.isBefore(start)) {
      toast.error("⏳ Chưa đến giờ làm bài!");
      return;
    }
    if (now.isAfter(end)) {
      toast.error("❌ Đã hết thời gian làm bài!");
      return;
    }

    try {
      // Tạo attempt (quiz_attempt trong database)
      const res = await examService.createExam({
        user_id: user?.id,
        quiz_id: quizInfo?.quiz_id,
        start_time: dayjs(quizInfo?.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_time: dayjs(quizInfo?.end_time).format("YYYY-MM-DD HH:mm:ss"),
        schedule_id: quizInfo?.id,
        duration: quizInfo?.duration_minutes,
      });
      // Navigate sang trang làm bài (dùng quiz_id chứ không phải schedule id)
      navigate(`${path.QUIZ_EVALUATION.replace(":id", quizInfo.quiz_id)}`, {
        state: {
          schedule_id: quizInfo?.id,
          attempt_id: res?.data?.id,
          time: quizInfo?.duration_minutes,
        },
      });
    } catch (error) {
      console.log("Lỗi khi tạo bài thi:", error?.response?.data?.message);
      toast.error(
        "Không thể bắt đầu bài thi: " + error?.response?.data?.message
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-32 px-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🎯 Nhập mã kiểm tra để bắt đầu
      </h1>

      {/* Input exam code */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nhập mã kiểm tra..."
          value={examCode}
          onChange={(e) => setExamCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCheckExamCode();
            }
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCheckExamCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Xác nhận
        </button>
      </div>

      {/* Quiz Info (nếu code đúng) */}
      {quizInfo && (
        <div className="bg-white border rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
            <FileQuestion className="w-5 h-5" />
            {quizInfo.title}
          </h2>
          <p className="text-sm text-gray-600 mb-3">{quizInfo.description}</p>
          <div className="flex gap-4 text-sm text-gray-500 mb-3">
            <span>📝 {quizInfo.number_questions} câu hỏi</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quizInfo.duration_minutes} phút
            </span>
          </div>
          <button
            onClick={handleStartExam}
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
          >
            🚀 Bắt đầu làm bài
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizAssignmentList;
