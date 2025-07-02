import React, { useEffect, useState, useRef } from "react";
import QuestionCard from "../../components/Section/QuestionCard";
import { useParams } from "react-router-dom";
import quizService from "../../../services/quizService";
import PaginationTailwind from "../../components/Pagination/PaginationTailwind";
const QuizReview = () => {
  const { id } = useParams();
  const [questions, setQuestion] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const hasInitialFetched = useRef(false);
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await quizService.getQuestionByQuizID(id, page, limit);
        if (res && res.errCode === 0) {
          const questions = res.data.map((q) => {
            const options = q.answers.map((a) => a.content);
            const correctIndex = q.answers.findIndex((a) => a.isCorrect);
            return {
              ...q,
              options,
              correctAnswer: correctIndex,
            };
          });

          setQuestion(questions);
          setTotalPages(Math.ceil(res?.total / limit));
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

  // if (loading || !questions) return <Loading />;
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Bộ câu hỏi về PHP
      </h2>
      <p className="text-gray-600 mb-6">
        Kiến thức cơ bản về ngôn ngữ lập trình PHP
      </p>

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
