import React, { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import gsap from "gsap";
import { HiOutlineFolder } from "react-icons/hi";
import toast from "react-hot-toast";
import quizService from "../../../services/quizService";
import moment from "moment";
const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setstatistics] = useState([]);
  const [search, setSearch] = useState("");
  const cardsRef = useRef([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchData = async () => {
      try {
        const res = await quizService.getQuizResult();
        if (res && res.errCode === 0) {
          setSubmissions(res.data);
          setstatistics(res.statistics);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, []);
  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50, rotateX: 10, scale: 0.95 },
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
          cardsRef.current.forEach((el) => {
            gsap.set(el, { clearProps: "transform" });
          });
        },
      }
    );
  }, [submissions]);

  const filteredSubmissions = submissions.filter((s) =>
    s?.userData?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full min-h-screen bg-[#FFFF] rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          📋 Danh sách sinh viên đã làm bài
        </h1>
        <p className="text-sm text-gray-500 mb-3">
          Tổng hợp kết quả các bài trắc nghiệm đã nộp bởi thực tập sinh
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-violet-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-violet-700">
            {statistics.listStudent}
          </p>
          <p className="text-sm text-violet-800">Sinh viên tham gia</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-blue-700">
            {statistics.total_result}
          </p>
          <p className="text-sm text-blue-800">Tổng lượt nộp bài</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-green-700">
            {statistics.average_score}
          </p>
          <p className="text-sm text-green-800">Điểm trung bình</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-xl font-bold text-yellow-700">
            {statistics.average_finish}%
          </p>
          <p className="text-sm text-yellow-800">Tỷ lệ hoàn thành</p>
        </div>
      </div>

      {/* Search Tool */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl w-fit shadow-sm">
          <div className="relative">
            <HiOutlineFolder className="text-3xl text-gray-600" />
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {filteredSubmissions.length}
            </span>
          </div>
          <span className="text-base font-semibold text-gray-800">
            Danh sách nộp bài
          </span>
        </div>

        <input
          type="text"
          placeholder="🔍 Tìm sinh viên..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Submission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg mt-10">
            Không có bài làm nào để hiển thị.
          </div>
        ) : (
          filteredSubmissions.map((submission, idx) => (
            <div
              key={submission.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-blue-200 hover:ring-2 hover:ring-blue-300 hover:scale-105 transition-all duration-300"
            >
              <div>
                <p className="text-lg font-semibold text-blue-700 mb-1">
                  {submission?.userData?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {submission?.quizzes?.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ⏱{" "}
                  {moment(submission.submitted_at).format(
                    "DD/MM/YYYY HH:SS:MM"
                  )}
                </p>
                <p className="text-sm text-green-600 font-semibold mt-2">
                  🎯 Điểm: {submission?.total_score}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition transform hover:scale-110">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSubmissions;
