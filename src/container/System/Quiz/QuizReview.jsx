import React, { useEffect, useState, useRef } from "react";
import QuestionCard from "../../components/Section/QuestionCard";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "../../../services/quizService";
import PaginationTailwind from "../../components/Pagination/PaginationTailwind";
import { USER_ROLE } from "../../../utils/constant";
import { path } from "../../../utils/constant";
import { ArrowLeft } from "lucide-react";
const QuizReview = () => {
  const { id } = useParams();
  const [questions, setQuestion] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quiz, setQuiz] = useState({});
  const limit = 5;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await quizService.getQuestionByQuizID(
          id,
          page,
          limit,
          USER_ROLE.ADMIN
        );
        if (res && res.errCode === 0) {
          const questions = res.data.map((q) => {
            const options = q.answers.map((a) => a.content);
            const correctAnswer =
              q.type === "QT2"
                ? q.answers.reduce((acc, a, i) => {
                    if (a.is_correct) acc.push(i);
                    return acc;
                  }, [])
                : q.answers.findIndex((a) => a.is_correct);
            return {
              ...q,
              options,
              correctAnswer: correctAnswer,
            };
          });
          setQuestion(questions);
          setTotalPages(Math.ceil(res?.total / limit));
          setQuiz(res?.quiz);
        }
      } catch (e) {
        console.error("Lỗi khi fetch quiz: ", e);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, page]);

  const handlePageChange = (page) => {
    setPage(page);
  };
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen rounded-lg">
      <button
        onClick={() => navigate(path.QUIZ)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại danh sách
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{quiz?.title}</h2>
      <p className="text-gray-600 mb-6">{quiz?.description}</p>

      {questions.length > 0 ? (
        questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={(page - 1) * limit + idx}
          />
        ))
      ) : (
        <p className="text-gray-500 italic">Không có câu hỏi nào.</p>
      )}

      {/* Pagination */}
      <div className="mt-8">
        <PaginationTailwind
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default QuizReview;
