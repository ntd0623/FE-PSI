import React, { useEffect, useState, useRef, useCallback } from "react";
import { Clock, ChevronLeft, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import examService from "../../../services/examService";
import quizService from "../../../services/quizService";
import { path } from "../../../utils/constant";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import dayjs from "dayjs";

const STORAGE_KEY = "quiz_state";

const CandidateEvaluationQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState(new Set());
  const [attemptId, setAttemptId] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const { schedule_id, attempt_id, time } = location.state || {};
  const hasFetched = useRef(false);
  const timerRef = useRef(null);
  const heartbeatRef = useRef(null);
  const user = useSelector((state) => state.user?.userInfo);
  const navigate = useNavigate();

  // ========== UTILITY FUNCTIONS ==========
  const clearQuizStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("quiz_attempt_id");
  };

  const saveStateToLocal = useCallback((time, answers, marked) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timeLeft: time,
        selectedAnswers: answers,
        reviewMarked: Array.from(marked),
        savedAt: Date.now(),
      })
    );
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ========== AUTO-SAVE WITH DEBOUNCE ==========
  const saveToServer = useCallback(
    async (answers, time) => {
      console.log("✅ Gọi saveToServer", {
        attemptId,
        isOnline,
        answers,
        time,
      });
      if (!attemptId || !isOnline) {
        console.warn("⛔ Bỏ qua saveToServer vì:", { attemptId, isOnline });

        return;
      }

      setIsSyncing(true);
      try {
        // Format answers theo đúng structure database
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, answerValue]) => {
            const question = questions.find(
              (q) => q.id === parseInt(questionId)
            );
            const isMulti = question?.type === "QT2";

            const answerIds = isMulti
              ? Array.isArray(answerValue)
                ? answerValue
                : []
              : answerValue !== undefined
              ? [answerValue]
              : [];

            return {
              question_id: parseInt(questionId),
              answer_ids: answerIds,
            };
          }
        );

        await examService.autoSave({
          attempt_id: attemptId,
          answers: formattedAnswers,
          time_left: (time / 60).toFixed(2), // gửi lên server theo đơn vị phút
          schedule_id: schedule_id,
        });
      } catch (e) {
        console.error("Auto-save failed:", e);
        // Thêm vào offline queue
        setOfflineQueue((prev) => [...prev, { answers, time }]);
      } finally {
        setIsSyncing(false);
      }
    },
    [attemptId, isOnline, questions]
  );

  const debouncedSave = useCallback(
    debounce((answers, time) => {
      saveToServer(answers, time);
    }, 2000),
    [saveToServer]
  );

  // ========== INITIAL DATA LOAD ==========
  useEffect(() => {
    if (hasFetched.current) return;

    (async () => {
      try {
        if (!schedule_id || !attempt_id) {
          toast.error("Thiếu thông tin phiên làm bài!");
          return;
        }

        const res = await examService.getAttempt(schedule_id, attempt_id);
        if (!res?.success || !Array.isArray(res.data.questions)) {
          toast.error("Không thể tải câu hỏi!" + (res?.message || ""));
          return;
        }

        setQuestions(
          res?.data?.questions.map((qa) => ({
            id: qa.question.id,
            content: qa.question.content,
            type: qa.question.type,
            answers: qa.question.answers || [],
            images_question: qa.question.images_question || [],
          }))
        );

        setAttemptId(attempt_id);
        localStorage.setItem("quiz_attempt_id", attempt_id);

        const duration = Number(time || 0) * 60;
        setQuizDuration(duration);

        // Restore từ localStorage nếu có
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const {
            timeLeft: storedTime,
            selectedAnswers,
            reviewMarked,
            savedAt,
          } = JSON.parse(saved);
          const elapsed = Math.floor((Date.now() - savedAt) / 1000);
          const adjustedTime = Math.max(storedTime - elapsed, 0);

          setTimeLeft(adjustedTime);
          setSelectedAnswers(selectedAnswers || {});
          setReviewMarked(new Set(reviewMarked || []));

          toast.success(
            `Đã khôi phục tiến trình! Thời gian còn: ${formatTime(
              adjustedTime
            )}`
          );
        } else {
          setTimeLeft(duration);
        }
      } catch (e) {
        console.error("Lỗi lấy dữ liệu:", e);
        toast.error("Không thể tải dữ liệu bài thi!" + e.message);
      }
    })();

    hasFetched.current = true;
  }, [schedule_id, attempt_id, time]);

  // ========== TIMER ==========
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = Math.max(prev - 1, 0);
        saveStateToLocal(updated, selectedAnswers, reviewMarked);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, selectedAnswers, reviewMarked, saveStateToLocal]);

  // ========== AUTO SUBMIT WHEN TIME'S UP ==========
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      toast.error("Hết thời gian! Tự động nộp bài...");
      handleSubmit(true);
    }
  }, [timeLeft, questions.length]);

  // ========== HEARTBEAT ==========
  useEffect(() => {
    if (!attemptId) return;

    heartbeatRef.current = setInterval(async () => {
      try {
        await quizService.heartbeat({
          attempt_id: attemptId,
          current_question: currentIndex,
          time_left: timeLeft,
        });
      } catch (e) {
        console.warn("Heartbeat failed:", e);
      }
    }, 15000); // 15s

    return () => clearInterval(heartbeatRef.current);
  }, [attemptId, currentIndex, timeLeft]);

  // ========== ONLINE/OFFLINE HANDLING ==========
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      toast.success("Đã kết nối lại mạng! Đang đồng bộ...");

      // Sync offline queue
      for (const item of offlineQueue) {
        try {
          await saveToServer(item.answers, item.time);
        } catch (e) {
          console.error("Sync failed:", e);
        }
      }
      setOfflineQueue([]);
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Mất kết nối mạng! Dữ liệu sẽ được lưu cục bộ.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineQueue, saveToServer]);

  // ========== PREVENT ACCIDENTAL EXIT ==========
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (questions.length > Object.keys(selectedAnswers).length) {
        e.preventDefault();
        e.returnValue =
          "Bạn có chắc muốn thoát? Tiến trình đã được lưu tự động.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [questions.length, selectedAnswers]);

  // ========== VISIBILITY CHANGE (Tab hidden) ==========
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveStateToLocal(timeLeft, selectedAnswers, reviewMarked);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [timeLeft, selectedAnswers, reviewMarked, saveStateToLocal]);

  // ========== SELECT ANSWER ==========
  const handleSelectAnswer = useCallback(
    async (questionId, answerId, isMulti = false) => {
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

      // Auto-save với debounce
      debouncedSave(updated, timeLeft);
    },
    [selectedAnswers, timeLeft, reviewMarked, saveStateToLocal, debouncedSave]
  );

  // ========== TOGGLE REVIEW ==========
  const toggleReview = useCallback(
    (questionId) => {
      const updated = new Set(reviewMarked);
      updated.has(questionId)
        ? updated.delete(questionId)
        : updated.add(questionId);
      setReviewMarked(updated);
      saveStateToLocal(timeLeft, selectedAnswers, updated);
    },
    [reviewMarked, timeLeft, selectedAnswers, saveStateToLocal]
  );

  // ========== SUBMIT QUIZ ==========
  const handleSubmit = async (timeAuto = false) => {
    if (!timeAuto) {
      const confirm = window.confirm("Bạn chắc chắn muốn nộp bài?");
      if (!confirm) return;
    }

    if (!attemptId) {
      toast.error("Không tìm thấy phiên làm bài!");
      return;
    }

    try {
      // Format answers cho submit
      const formattedAnswers = questions.map((q) => {
        const answer = selectedAnswers[q.id];
        const isMulti = q.type === "QT2";

        const answerIds = isMulti
          ? Array.isArray(answer)
            ? answer
            : []
          : answer !== undefined
          ? [answer]
          : [];

        return {
          question_id: q.id,
          answer_ids: answerIds,
        };
      });

      const payload = {
        attempt_id: attemptId,
        quiz_id: id,
        user_id: user.id,
        answers: formattedAnswers,
        total_question: questions.length,
        duration_used: quizDuration - timeLeft,
        end_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      const res = await examService.submitAttempt(payload);

      if (res && res.success === true) {
        clearInterval(timerRef.current);
        clearInterval(heartbeatRef.current);
        clearQuizStorage();

        toast.success(
          `✅ Nộp bài thành công! Số câu đúng: ${
            res.data?.total_correct || 0
          }/${questions.length}`
        );

        setTimeout(() => {
          navigate(path.HOME);
        }, 1500);
      } else {
        toast.error(
          "❌ Có lỗi khi nộp bài: " + (res?.message || "Vui lòng thử lại!")
        );
      }
    } catch (e) {
      console.error("❌ Submit error:", e);
      toast.error("❌ Lỗi hệ thống khi nộp bài.");
    }
  };

  // ========== PREVENT COPPY PASTE =========
  useEffect(() => {
    const handleCopy = (e) => e.preventDefault();
    const handlePaste = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();
    const handleContextMenu = (e) => e.preventDefault();

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // =========== PREVENT GO BACK ===========
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ========== NAVIGATION ==========
  const goTo = (dir) => {
    setCurrentIndex((prev) =>
      Math.max(0, Math.min(prev + dir, questions.length - 1))
    );
  };

  const currentQuestion = questions[currentIndex];

  if (questions.length === 0) {
    return (
      <div className="mt-32 text-center text-gray-500">
        <div className="animate-pulse">Đang tải câu hỏi...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-32 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 bg-white border border-gray-300 shadow rounded-xl p-4 h-fit">
        {/* Status indicators */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={isOnline ? "text-green-600" : "text-red-600"}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          {isSyncing && (
            <span className="text-xs text-blue-600 animate-pulse">
              Đang lưu...
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Danh sách câu
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ✅ Đã hoàn thành:{" "}
          <span className="font-semibold text-green-600">
            {Object.keys(selectedAnswers).length}/{questions.length}
          </span>
        </p>

        <div className="grid grid-cols-5 gap-2 text-sm mb-4">
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
                    ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                    : isAnswered
                    ? "bg-green-100 text-green-700 border-green-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handleSubmit(false)}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
        >
          Nộp bài
        </button>
      </aside>

      {/* Main */}
      <main className="lg:col-span-3 bg-white border border-gray-300 shadow rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Bài thi đánh giá năng lực
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
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            <ChevronLeft className="inline w-4 h-4 mr-1" />
            Trước
          </button>

          <button
            onClick={() => goTo(1)}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Tiếp <ChevronRight className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CandidateEvaluationQuiz;
