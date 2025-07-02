import React, { useEffect, useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "../../../services/quizService";
import { CRUD_ACTIONS, path } from "../../../utils/constant";
import { FileQuestion } from "lucide-react";
import gsap from "gsap";
import toast from "react-hot-toast";
import { getBase64 } from "../../../utils/CommonUtils";
import Lightbox from "yet-another-react-lightbox";
import Loading from "../../components/Loading/Loading";
const QuizUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [quizSet, setQuizSet] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState([true]);
  const questionRefs = useRef({});
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (hasFetched.current) return;
    const fetchQuizSet = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await quizService.getQuizSetsByID(id);
          if (res && res.errCode === 0) {
            const fetchedQuestions = res.data.questions.map((q) => {
              const options = q.answers.map((a) => a.content);
              const correctIndex = q.answers.findIndex((a) => a.isCorrect);
              return {
                ...q,
                options,
                correctAnswer: correctIndex,
              };
            });

            setQuizSet({ ...res.data, questions: fetchedQuestions });
            setExpandedQuestions(
              new Array(fetchedQuestions.length).fill(false)
            );
          }
        }
      } catch (e) {
        toast.error("Không thể tải dữ liệu bộ câu hỏi.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSet();
    hasFetched.current = true;
  }, [id]);

  useEffect(() => {
    expandedQuestions.forEach((expanded, index) => {
      const el = questionRefs.current[index];
      if (!el) return;

      if (expanded) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          { height: 0, opacity: 0, y: -10 },
          {
            height: "auto",
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            if (el) el.style.display = "none";
          },
        });
      }
    });
  }, [expandedQuestions]);

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setQuizSet((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xoá lỗi tương ứng
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const base64 = await getBase64(file);

      setAvatar(base64);
      setImageFile(objectUrl);
      setQuizSet((prev) => ({
        ...prev,
        image: base64,
      }));
      setImageFile(objectUrl);
    }
  };

  //image
  const openPreview = () => {
    if (imageFile) {
      setIsOpenPreview(true);
    }
  };

  const removeImage = () => {
    setQuizSet((prev) => ({ ...prev, image: null }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizSet.questions];
    updated[index][field] = value;

    setQuizSet((prev) => ({
      ...prev,
      questions: updated,
    }));

    // Xoá lỗi tương ứng nếu có
    setErrors((prev) => {
      const clone = { ...prev };
      if (clone.questions?.[index]) {
        clone.questions = [...clone.questions];
        clone.questions[index] = {
          ...clone.questions[index],
          [field]: undefined,
        };
      }
      return clone;
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quizSet.questions];
    updated[qIndex].options[oIndex] = value;

    setQuizSet((prev) => ({
      ...prev,
      questions: updated,
    }));

    setErrors((prev) => {
      const clone = { ...prev };
      if (clone.questions?.[qIndex]?.optionErrors) {
        clone.questions = [...clone.questions];
        clone.questions[qIndex] = {
          ...clone.questions[qIndex],
          optionErrors: {
            ...clone.questions[qIndex].optionErrors,
            [oIndex]: undefined,
          },
        };
      }
      return clone;
    });
  };

  const setCorrectAnswer = (qIndex, oIndex) => {
    const updated = [...quizSet.questions];
    updated[qIndex].correctAnswer =
      updated[qIndex].correctAnswer === oIndex ? null : oIndex;
    setQuizSet((prev) => ({ ...prev, questions: updated }));
  };

  const addOption = (qIndex) => {
    const updated = [...quizSet.questions];
    updated[qIndex].options.push("");
    setQuizSet((prev) => ({ ...prev, questions: updated }));
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...quizSet.questions];
    updated[qIndex].options.splice(oIndex, 1);
    if (updated[qIndex].correctAnswer === oIndex) {
      updated[qIndex].correctAnswer = null;
    }
    setQuizSet((prev) => ({ ...prev, questions: updated }));
  };

  const removeQuestion = (qIndex) => {
    const updated = [...quizSet.questions];
    updated.splice(qIndex, 1);
    setQuizSet((prev) => ({ ...prev, questions: updated }));
    setExpandedQuestions((prev) => {
      const clone = [...prev];
      clone.splice(qIndex, 1);
      return clone;
    });
  };

  const validateQuizSet = (data) => {
    const newErrors = {};
    const isCreating = !id;
    if (isCreating) {
      if (!data.title.trim()) newErrors.title = "Tên bộ câu hỏi là bắt buộc.";
      if (!data.description.trim())
        newErrors.description = "Mô tả là bắt buộc.";
      if (data.timeLimit <= 0)
        newErrors.timeLimit = "Thời gian làm bài phải lớn hơn 0.";
      if (!data.timeLimit)
        newErrors.timeLimit = "Thời gian làm bài không được bỏ trống.";
      if (!data.timeLimit || isNaN(data.timeLimit) || data.timeLimit <= 0)
        newErrors.timeLimit = "Thời gian làm bài phải lớn hơn 0.";
      if (!Number.isInteger(Number(data.timeLimit)))
        newErrors.timeLimit = "Thời gian làm bài phải là số nguyên.";

      const maxScore = Number(data.maxScore);
      if (!maxScore || maxScore <= 0) {
        newErrors.maxScore = "Điểm tối đa phải lớn hơn 0.";
      } else if (!Number.isInteger(maxScore)) {
        newErrors.maxScore = "Điểm tối đa phải là số nguyên.";
      }
    }
    if (Array.isArray(data.questions)) {
      newErrors.questions = [];

      data.questions.forEach((q, i) => {
        const qErr = {};

        if (!q.content.trim()) qErr.content = "Câu hỏi không được để trống.";

        if (!Array.isArray(q.options) || q.options.length < 2) {
          qErr.options = "Phải có ít nhất 2 lựa chọn.";
        }

        q.options?.forEach((opt, j) => {
          if (!opt.trim()) {
            if (!qErr.optionErrors) qErr.optionErrors = {};
            qErr.optionErrors[j] = "Không được để trống.";
          }
        });

        if (
          q.correctAnswer === null ||
          typeof q.correctAnswer !== "number" ||
          q.correctAnswer < 0 ||
          q.correctAnswer >= q.options.length
        ) {
          qErr.correctAnswer = "Cần chọn đáp án đúng hợp lệ.";
        }

        newErrors.questions[i] = qErr;
      });
    } else {
      newErrors.questions = [];
    }

    setErrors(newErrors);
    const hasError = Object.keys(newErrors).some(
      (key) =>
        key !== "questions" ||
        newErrors.questions.some((q) => Object.keys(q).length > 0)
    );

    return !hasError;
  };

  const handleSubmit = async () => {
    const transformedQuestions = quizSet.questions.map((q, qIndex) => {
      const answers = q.options.map((opt, idx) => ({
        id: q.answers?.[idx]?.id,
        content: opt,
        isCorrect: idx === q.correctAnswer,
      }));
      return {
        id: q.id,
        content: q.content,
        explanation: q.explanation,
        answers,
      };
    });

    const isValid = validateQuizSet(quizSet);
    if (!isValid) return;

    setLoading(true);
    try {
      const res = await quizService.upsertQuizSets({
        id: id,
        title: quizSet.title,
        description: quizSet.description,
        image: quizSet.image,
        duration_minutes: parseInt(quizSet.duration_minutes, 10),
        score: parseInt(quizSet.score, 10),
        questions: transformedQuestions,
        action: CRUD_ACTIONS.EDIT,
      });

      if (res && res.errCode === 0) {
        toast.success("Cập nhật dữ liệu thành công");
        navigate(path.QUIZ);
      }
    } catch (e) {
      toast.error("Lỗi hệ thống: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(path.QUIZ)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
        >
          Lưu câu hỏi
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileQuestion className="w-8 h-8 text-blue-600" />
        {quizSet.title}
      </h2>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
        <h3 className="font-medium text-base mb-4">Thông tin bộ câu hỏi</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tên bộ câu hỏi
          </label>
          <input
            type="text"
            name="title"
            placeholder="Nhập tên bộ câu hỏi..."
            className={`w-full p-2 border ${
              errors.title ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none`}
            value={quizSet.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mô tả
          </label>
          <textarea
            name="description"
            placeholder="Mô tả chi tiết về bộ câu hỏi..."
            className={`w-full p-2 border ${
              errors.description ? "border-red-500" : "border-gray-200"
            } rounded focus:border-gray-400 focus:outline-none transition-all`}
            rows="3"
            value={quizSet.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Thời gian làm bài (phút)
            </label>
            <input
              type="number"
              name="timeLimit"
              className={`w-full p-2 border ${
                errors.timeLimit ? "border-red-500" : "border-gray-200"
              } rounded focus:border-gray-400 focus:outline-none transition-all`}
              value={quizSet.duration_minutes}
              onChange={handleInputChange}
            />
            {errors.timeLimit && (
              <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Điểm tối đa
            </label>
            <input
              type="number"
              name="maxScore"
              className={`w-full p-2 border ${
                errors.maxScore ? "border-red-500" : "border-gray-200"
              } rounded focus:border-gray-400 focus:outline-none transition-all`}
              value={quizSet.score}
              onChange={handleInputChange}
            />
            {errors.maxScore && (
              <p className="text-red-500 text-sm mt-1">{errors.maxScore}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hình ảnh minh hoạ (tuỳ chọn)
          </label>
          <div className="border-2 border-dashed border-blue-300 rounded p-4 text-center">
            {!quizSet.image ? (
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <FiUpload size={24} />
                  <span className="text-sm">Nhấp để tải lên hình ảnh</span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 10MB
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative inline-block">
                <img
                  onClick={openPreview}
                  src={quizSet.image}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded object-cover cursor-pointer"
                />
                <button
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full cursor-pointer"
                  onClick={removeImage}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow max-h-[100vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-medium text-xl">Danh sách câu hỏi</h3>
        </div>

        {quizSet.questions &&
          quizSet.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-200 rounded p-4 mb-6"
            >
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => toggleQuestion(qIndex)}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <X size={20} />
                  </button>
                  <p className="font-semibold ml-1 leading-none">
                    Câu hỏi {qIndex + 1}:
                  </p>
                </div>

                <button className="text-gray-500 hover:text-gray-700 ml-auto cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: `rotate(${
                        expandedQuestions[qIndex] ? "-180deg" : "0deg"
                      })`,
                    }}
                    className={`h-5 w-5 transform transition-transform duration-300`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div ref={(el) => (questionRefs.current[qIndex] = el)}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nội dung câu hỏi
                </label>
                <textarea
                  placeholder="Nội dung câu hỏi"
                  className={`w-full mb-4 p-2 rounded border ${
                    errors.questions?.[qIndex]?.content
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={question.content}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "content", e.target.value)
                  }
                />
                {errors.questions?.[qIndex]?.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.questions[qIndex].content}
                  </p>
                )}

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium mb-3">Các lựa chọn</p>
                    <button
                      onClick={() => addOption(qIndex)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      + Thêm lựa chọn
                    </button>
                  </div>
                  {errors.questions?.[qIndex]?.correctAnswer && (
                    <p className="text-red-500 text-sm mb-2">
                      {errors.questions[qIndex].correctAnswer}
                    </p>
                  )}
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-5 gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => setCorrectAnswer(qIndex, oIndex)}
                        className="accent-blue-600"
                      />
                      <input
                        type="text"
                        className={`flex-1 p-2 rounded border ${
                          errors.questions?.[qIndex]?.optionErrors?.[oIndex]
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder={`Lựa chọn ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                      />
                      {errors.questions?.[qIndex]?.optionErrors?.[oIndex] && (
                        <p className="text-red-500 text-sm text-xs mt-1 ml-6">
                          {errors.questions[qIndex].optionErrors[oIndex]}
                        </p>
                      )}
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Giải thích (tuỳ chọn)
                  </label>
                  <textarea
                    placeholder="Giải thích nếu có"
                    className="w-full p-2 border border-gray-200 rounded"
                    rows={3}
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      <Lightbox
        open={isOpenPreview}
        close={() => setIsOpenPreview(false)}
        slides={[{ src: quizSet.image }]}
      />
    </div>
  );
};

export default QuizUpdate;
