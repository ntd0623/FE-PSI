import React, { useEffect, useState, useRef } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "../../../services/quizService";
import { path, USER_ROLE } from "../../../utils/constant";
import { useSelector } from "react-redux";
const STORAGE_KEY = "quiz_state";

const CandidateEvaluationQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState(new Set());
  const { id } = useParams();
  const hasFetched = useRef(false);
  const timerRef = useRef(null);
  const user = useSelector((state) => state.user?.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (hasFetched.current) return;
    (async () => {
      try {
        const res = await quizService.getQuestionByQuizID(
          id,
          1,
          "",
          USER_ROLE.STUDENT
        );
        if (res?.errCode === 3) {
          navigate(path.UNAUTHORIZED);
          return;
        }
        if (res?.errCode === 0 && Array.isArray(res.data)) {
          setQuestions(res.data);
          const duration = (res?.duration_minutes || 60) * 60;
          setQuizDuration(duration);
          localStorage.setItem("quiz_duration", duration);
          localStorage.setItem("quiz_total_question", res.data.length);
        }
      } catch (e) {
        console.error("Lỗi lấy dữ liệu câu hỏi:", e);
      }
    })();
    hasFetched.current = true;
  }, [id]);

  // prevent devtool
  useEffect(() => {
    const detectDevTools = setInterval(() => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      const isOpen = widthDiff || heightDiff;

      if (isOpen) {
        document.body.innerHTML =
          "<div style='text-align:center;margin-top:20vh;font-size:2rem;color:red;'>🚫 Không được mở Developer Tools!</div>";
      }
    }, 1000);

    return () => clearInterval(detectDevTools);
  }, []);

  //prevent click right mouse
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const tabSwitchCount = useRef(0);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        tabSwitchCount.current++;
        alert(`🚨 Bạn đã chuyển tab lần ${tabSwitchCount.current}`);

        if (tabSwitchCount.current >= 2) {
          await forceSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const {
        timeLeft: storedTime,
        selectedAnswers,
        reviewMarked,
        savedAt,
      } = JSON.parse(saved);

      const now = Date.now();
      const elapsed = Math.floor((now - savedAt) / 1000);
      const adjustedTimeLeft = Math.max(storedTime - elapsed, 0);

      setTimeLeft(adjustedTimeLeft);
      setSelectedAnswers(selectedAnswers || {});
      setReviewMarked(new Set(reviewMarked || []));
    } else if (quizDuration > 0) {
      setTimeLeft(quizDuration);
    }
  }, [quizDuration]);

  useEffect(() => {
    if (!timeLeft) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = Math.max(prev - 1, 0);
        saveStateToLocal(updated, selectedAnswers, reviewMarked);
        return updated;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [selectedAnswers, reviewMarked, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleSelectAnswer = (questionId, answerId, isMulti = false) => {
    const prevAnswers = selectedAnswers[questionId];
    let updated;

    if (isMulti) {
      let newAnswers = Array.isArray(prevAnswers) ? [...prevAnswers] : [];
      if (newAnswers.includes(answerId)) {
        newAnswers = newAnswers.filter((id) => id !== answerId);
      } else {
        newAnswers.push(answerId);
      }
      updated = { ...selectedAnswers, [questionId]: newAnswers };
    } else {
      updated = { ...selectedAnswers, [questionId]: answerId };
    }

    setSelectedAnswers(updated);
    saveStateToLocal(timeLeft, updated, reviewMarked);
  };

  const toggleReview = (id) => {
    const updated = new Set(reviewMarked);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setReviewMarked(updated);
    saveStateToLocal(timeLeft, selectedAnswers, updated);
  };

  const saveStateToLocal = (time, answers, marked) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timeLeft: time,
        selectedAnswers: answers,
        reviewMarked: Array.from(marked),
        savedAt: Date.now(),
      })
    );
  };

  const handleSubmit = async () => {
    const confirm = window.confirm("Bạn chắc chắn muốn nộp bài?");
    if (!confirm) return;

    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id,
        })
      );

      const payload = {
        quiz_id: id,
        answers: formattedAnswers,
        user_id: user.id,
        total_question: questions.length,
        duration_used: quizDuration - timeLeft,
      };

      const res = await quizService.submittedQuiz(payload);

      if (res && res.errCode === 0) {
        clearInterval(timerRef.current);
        alert("✅ Nộp bài thành công!");
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("quiz_duration");
        setTimeout(() => {
          navigate(path.HOME);
        }, 100);
      } else {
        alert("❌ Có lỗi khi nộp bài: " + res?.message);
      }
    } catch (e) {
      console.log("❌ Submit error:", e);
      alert("❌ Lỗi hệ thống khi nộp bài.");
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  const getDurationUsed = () => {
    const savedDuration = Number(localStorage.getItem("quiz_duration")) || 0;
    const realDuration = quizDuration > 0 ? quizDuration : savedDuration;
    return Math.max(realDuration - timeLeft, 0);
  };
  const forceSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id,
        })
      );

      const totalQuestion =
        questions.length > 0
          ? questions.length
          : Number(localStorage.getItem("quiz_total_question")) || 0;

      const durationUsed =
        quizDuration > 0
          ? quizDuration - timeLeft
          : Number(localStorage.getItem("quiz_duration")) - timeLeft || 0;

      const payload = {
        quiz_id: id,
        answers: formattedAnswers,
        user_id: user.id,
        total_question: totalQuestion,
        duration_used: durationUsed,
      };

      const res = await quizService.submittedQuiz(payload);

      if (res && res.errCode === 0) {
        clearInterval(timerRef.current);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("quiz_duration");
        localStorage.removeItem("quiz_total_question");

        alert(
          "🚨 Bài đã được nộp tự động do vi phạm quy tắc!\n✅ Nộp bài thành công!"
        );
        setTimeout(() => {
          navigate(path.HOME);
        }, 300);
      } else {
        alert("❌ Có lỗi khi nộp bài: " + res?.message);
      }
    } catch (e) {
      console.error("❌ Force submit error:", e);
      alert("❌ Lỗi hệ thống khi ép nộp bài.");
    }
  };

  const goTo = (dir) => {
    setCurrentIndex((prev) =>
      Math.max(0, Math.min(prev + dir, questions.length - 1))
    );
  };

  if (questions.length === 0) {
    return (
      <div className="mt-32 text-center text-gray-500">Đang tải câu hỏi...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-32 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 bg-white border border-gray-300 shadow rounded-xl p-4 h-fit top-24">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Danh sách câu
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ✅ Đã hoàn thành:{" "}
          <span className="font-semibold text-green-600">
            {Object.keys(selectedAnswers).length}/{questions.length}
          </span>
        </p>
        <div className="grid grid-cols-5 gap-2 text-sm">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isMarked = reviewMarked.has(q.id);
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full w-9 h-9 font-semibold border transition hover:scale-105 text-sm ${
                  currentIndex === idx
                    ? "bg-blue-600 text-white ring-2 ring-blue-500"
                    : isMarked
                    ? "bg-yellow-100 text-yellow-700"
                    : isAnswered
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Nộp bài
        </button>
      </aside>

      {/* Main */}
      <main className="lg:col-span-3 bg-white border border-gray-300 shadow rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Bài thi đánh giá năng lực ứng viên
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{formatTime(timeLeft)}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${(timeLeft / quizDuration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(selectedAnswers).length / questions.length) * 100
                }%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {Math.floor(
              (Object.keys(selectedAnswers).length / questions.length) * 100
            )}
            % hoàn thành
          </p>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">
            Câu {currentIndex + 1}/{questions.length}
          </div>
          <p className="text-base font-medium text-gray-800 mb-4">
            {currentQuestion.content}
          </p>
          {Array.isArray(currentQuestion.images_question) &&
            currentQuestion.images_question.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentQuestion.images_question.map((img, idx) => (
                  <div key={idx} className="text-center">
                    <img
                      src={img.image}
                      alt={img.caption || `Hình ${idx + 1}`}
                      className="max-h-64 object-contain border rounded mx-auto"
                    />
                    {img.caption && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          <div className="space-y-3">
            {currentQuestion.answers.map((ans) => {
              const isQT2 = currentQuestion.type === "QT2";
              const selected =
                selectedAnswers[currentQuestion.id] || (isQT2 ? [] : null);
              const isChecked = isQT2
                ? selected.includes(ans.id)
                : selected === ans.id;

              return (
                <label
                  key={ans.id}
                  className={`block border px-4 py-3 rounded cursor-pointer transition ${
                    isChecked
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
                >
                  <input
                    type={isQT2 ? "checkbox" : "radio"}
                    name={`question-${currentQuestion.id}`}
                    className="mr-3 accent-blue-600"
                    checked={isChecked}
                    onChange={() =>
                      handleSelectAnswer(currentQuestion.id, ans.id, isQT2)
                    }
                  />
                  {ans.content}
                </label>
              );
            })}
          </div>

          <button
            onClick={() => toggleReview(currentQuestion.id)}
            className="mt-4 text-sm text-yellow-600 hover:underline"
          >
            {reviewMarked.has(currentQuestion.id)
              ? "❌ Bỏ đánh dấu"
              : "🔖 Đánh dấu câu này"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={() => goTo(-1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="inline w-4 h-4 mr-1" />
            Trước
          </button>

          <button
            onClick={() => goTo(1)}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tiếp <ChevronRight className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CandidateEvaluationQuiz;
