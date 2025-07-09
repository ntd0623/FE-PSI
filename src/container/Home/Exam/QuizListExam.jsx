import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Clock } from "lucide-react";
import quizService from "../../../services/quizService";
import gsap from "gsap";
import { path } from "../../../utils/constant";
import StartQuizModal from "../../components/Section/QuizModal";

const QuizAssignmentList = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  useEffect(() => {
    if (hasFetched.current) return;

    (async () => {
      try {
        const res = await quizService.getQuizSets();

        if (res.errCode === 3) {
          navigate(path.UNAUTHORIZED);
          return;
        }

        if (res?.errCode === 0) {
          setQuizSets(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        hasFetched.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (quizSets.length === 0) return;

    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        rotateX: 60,
        transformOrigin: "top center",
        y: 50,
      },
      {
        opacity: 1,
        rotateX: 0,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        onComplete: () => {
          cardsRef.current.forEach((el) => {
            gsap.set(el, { clearProps: "transform" });
          });
        },
      }
    );
  }, [quizSets]);

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleConfirmStart = (quizId) => {
    navigate(`${path.QUIZ_EVALUATION.replace(":id", quizId)}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-32">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        🎯 Chọn bài kiểm tra để bắt đầu
      </h1>
      <p className="text-gray-600 text-sm mb-8 max-w-2xl">
        Chào mừng bạn đến với hệ thống kiểm tra đánh giá năng lực. Vui lòng chọn
        một bài kiểm tra phù hợp để bắt đầu. Mỗi bài đều có giới hạn thời gian,
        hãy chuẩn bị kỹ trước khi làm bài.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizSets.map((quiz, index) => (
          <div
            key={quiz.id}
            onClick={() => handleOpenModal(quiz)}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col justify-between transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl will-change-transform cursor-pointer"
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                {quiz.title}
              </h2>
              <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span>📝 {quiz.questionCount || 40} câu hỏi</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {quiz.duration_minutes || quiz.duration} phút
                </span>
              </div>
            </div>
            <button className="mt-auto w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition">
              Bắt đầu làm bài
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedQuiz && showModal && (
        <StartQuizModal
          open={showModal}
          quiz={selectedQuiz}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmStart}
        />
      )}
    </div>
  );
};

export default QuizAssignmentList;
