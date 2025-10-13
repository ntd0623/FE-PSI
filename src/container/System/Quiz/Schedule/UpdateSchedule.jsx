import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Code,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { path } from "../../../../utils/constant";
import quizService from "../../../../services/quizService";
import scheduleService from "../../../../services/scheduleService";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
export default function UpdateQuizSchedule() {
  const [form, setForm] = useState({
    quiz_id: "",
    start_time: "",
    end_time: "",
    attempt_limit: 1,
    shuffle_question: false,
    shuffle_answer: false,
    exam_code: "",
  });
  const [quiz, setQuiz] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  // Mount dữ liệu lần đầu tiên
  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, id);

  // Fetch dữ liệu
  const fetchQuiz = async () => {
    try {
      const res = await quizService.getQuiz();
      if (res && res.errCode === 0) {
        setQuiz(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi fetch dữ liệu: ", +error);
    }
  };
  const fetchSchedule = async () => {
    try {
      const res = await scheduleService.getScheduleById(id);
      if (res && res.success === true) {
        setForm(res?.data);
      }
    } catch (error) {
      toast.error("Lỗi khi fetch dữ liệu: " + error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "quiz") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.quiz_id) newErrors.quiz_id = "Vui lòng nhập tên đề thi";
    if (!form.start_time)
      newErrors.start_time = "Vui lòng chọn thời gian bắt đầu";
    if (!form.end_time) newErrors.end_time = "Vui lòng chọn thời gian kết thúc";
    if (!form.exam_code) newErrors.exam_code = "Vui lòng nhập mã đề thi";

    if (
      form.start_time &&
      form.end_time &&
      new Date(form.start_time) >= new Date(form.end_time)
    ) {
      newErrors.end_time = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const payload = {
      id: +id,
      quiz_id: +form.quiz_id,
      start_time: dayjs(form.start_time).format("YYYY-MM-DD HH:mm:ss"),
      end_time: dayjs(form.end_time).format("YYYY-MM-DD HH:mm:ss"),
      attempt_limit: form.attempt_limit,
      shuffle_answer: form.shuffle_answer ? form.shuffle_answer : false,
      shuffle_question: form.shuffle_question ? form.shuffle_question : false,
      exam_code: form.exam_code,
    };
    if (validateForm()) {
      try {
        const res = await scheduleService.updateSchedule(payload);
        if (res.success === true) {
          toast.success("Cập lịch kiểm tra thành công");
          handleReset();
          setTimeout(() => {
            navigate(path.QUIZ_SCHEDULE);
          }, 1500);
        }
      } catch (error) {
        toast.error("Lỗi khi thêm lịch: " + error);
      }
    }
  };

  const handleReset = () => {
    setForm({
      quiz_id: "",
      start_time: "",
      end_time: "",
      attempt_limit: 1,
      shuffle_question: false,
      shuffle_answer: false,
      exam_code: "",
    });
    setErrors({});
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(path.QUIZ_SCHEDULE)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cập nhập lịch thi mới
          </h1>
          <p className="text-sm text-gray-500">
            Điền thông tin chi tiết để cập nhập lịch thi cho thực tập sinh
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Thông tin cơ bản
          </h2>
          <div className="space-y-5">
            {/* Tên đề thi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đề thi <span className="text-red-500">*</span>
              </label>
              <select
                name="quiz_id"
                value={form.quiz_id}
                onChange={handleChange}
                className={`w-full border ${
                  errors.quiz_id
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
              >
                <option value="">-- Chọn đề thi --</option>
                {quiz &&
                  quiz.length > 0 &&
                  quiz.map((item, index) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
              </select>
              {errors.quiz_id && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.quiz_id}
                </p>
              )}
            </div>

            {/* Mã đề thi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã đề thi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="exam_code"
                  value={form.exam_code}
                  onChange={handleChange}
                  placeholder="VD: PHP2025A"
                  className={`w-full border ${
                    errors.exam_code
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 font-mono`}
                />
              </div>
              {errors.exam_code && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.exam_code}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" /> Thời gian thi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bắt đầu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={dayjs(form.start_time).format("YYYY-MM-DD HH:mm:ss")}
                onChange={handleChange}
                className={`w-full border ${
                  errors.start_time
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
              />
              {errors.start_time && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.start_time}
                </p>
              )}
            </div>

            {/* Kết thúc */}
            <div>
              <label className="block text-sm font-medium  text-gray-700 mb-1">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={dayjs(form.end_time).format("YYYY-MM-DD HH:mm:ss")}
                onChange={handleChange}
                className={`w-full border ${
                  errors.end_time
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2`}
              />
              {errors.end_time && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.end_time}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cấu hình */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" /> Cấu hình bài thi
          </h2>

          {/* Attempt Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lần làm bài tối đa
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  form.attempt_limit > 1 &&
                  setForm({ ...form, attempt_limit: form.attempt_limit - 1 })
                }
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="number"
                name="attempt_limit"
                value={form.attempt_limit}
                onChange={handleChange}
                min={1}
                className="w-20 border border-gray-300 rounded-lg px-4 py-2.5 text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, attempt_limit: form.attempt_limit + 1 })
                }
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold"
              >
                +
              </button>
              <span className="text-sm text-gray-600 ml-2">lần</span>
            </div>
          </div>

          {/* Shuffle Options */}
          <div className="bg-gray-50 rounded-lg border border-gray-300 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">
              Tùy chọn xáo trộn
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="shuffle_question"
                checked={form.shuffle_question}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Xáo trộn thứ tự câu hỏi
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="shuffle_answer"
                checked={form.shuffle_answer}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Xáo trộn thứ tự đáp án
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          Lưu lịch thi
        </button>
      </div>
    </div>
  );
}
