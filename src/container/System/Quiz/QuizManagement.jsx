import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineFolder } from "react-icons/hi";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
import quizService from "../../../services/quizService";
import DeleteConfirmModal from "../../components/Section/DeleteConfirmModal";
import toast from "react-hot-toast";
const QuizManagement = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [search, setSearch] = useState("");
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        {
          opacity: 0,
          y: 50,
          rotateX: 10,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          transformOrigin: "top center",
          onComplete: () => {
            cardRefs.current.forEach((el) => {
              gsap.set(el, { clearProps: "transform" });
            });
          },
        }
      );
    });

    return () => ctx.revert();
  }, [quizSets]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchData = async () => {
      try {
        const res = await quizService.getQuizSets();
        if (res && res.errCode === 0) {
          setQuizSets(res.data);
          setStatistics(res.statistics);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, []);

  const filteredData = quizSets.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDeleteModal = (item) => {
    setSelectedQuiz(item);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await quizService.deleteQuizSet(selectedQuiz.id);
      if (res.errCode === 0) {
        toast.success(`Xóa ${selectedQuiz.title} thành công`);
        setQuizSets((prev) =>
          prev.filter((item) => item.id !== selectedQuiz.id)
        );
      } else {
        toast.error("Xóa thất bại.");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setSelectedQuiz(null);
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-[#FFFF] rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          📝 Trắc nghiệm
        </h1>
        <p className="text-sm text-gray-500 mb-3">
          Các thực tập sinh làm bài test về kiến thức cơ bản của chuyên ngành
        </p>
      </div>

      {/* Mini */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-violet-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-violet-700">{quizSets.length}</p>
          <p className="text-sm text-violet-800">Tổng bộ đề</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-blue-700">
            {statistics?.attempt}
          </p>
          <p className="text-sm text-blue-800">Lượt làm</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-green-700">
            {statistics?.averageTime}
          </p>
          <p className="text-sm text-green-800">Thời gian TB</p>
        </div>
        <div className="bg-red-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-red-700">
            {statistics?.unFinished}%
          </p>
          <p className="text-sm text-red-800">Chưa hoàn thành</p>
        </div>
      </div>

      {/* Tool search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl w-fit shadow-sm">
          <div className="relative">
            <HiOutlineFolder className="text-3xl text-gray-600" />
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {filteredData.length}
            </span>
          </div>
          <span className="text-base font-semibold text-gray-800">
            Danh sách đề
          </span>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm đề thi..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="latest">Mới nhất</option>
            <option value="az">A → Z</option>
          </select>
          <button
            onClick={() => navigate(path.QUIZ_CREATE)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-5 py-2 rounded-xl shadow transition hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg mt-10">
            Không có bộ đề nào để hiển thị.
          </div>
        ) : (
          filteredData.map((set, index) => (
            <div
              key={set.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="bg-white border cursor-pointer
            border-gray-200 rounded-xl shadow-md 
             hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
             hover:ring-2 hover:ring-blue-300 
             hover:scale-105 hover:-translate-y-1 
             transform transition-all duration-300 ease-in-out
             p-5 flex flex-col justify-between"
            >
              <div
                onClick={() =>
                  navigate(path.QUIZ_REVIEW.replace(":id", set.id))
                }
                className="flex items-center gap-4 mb-3"
              >
                <img
                  src={set.image}
                  alt={set.title}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {set.title}
                  </p>
                  <p className="text-sm text-gray-500">{set.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-auto">
                <button
                  className="p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-600 text-lg transition transform hover:scale-110"
                  onClick={() =>
                    navigate(`${path.QUIZ_SETS_CREATE.replace(":id", set.id)}`)
                  }
                  title="Thêm câu hỏi"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    navigate(`${path.QUIZ_UPDATE.replace(":id", set.id)}`)
                  }
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-600 text-lg transition transform hover:scale-110"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleOpenDeleteModal(set)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 text-lg transition transform hover:scale-110"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedQuiz && (
        <DeleteConfirmModal
          item={selectedQuiz}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
};

export default QuizManagement;
