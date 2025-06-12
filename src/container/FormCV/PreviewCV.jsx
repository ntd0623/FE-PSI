import React, { useRef, useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { createCV } from "../../services/studentService";
import { path } from "../../utils/constant";
import toast from "react-hot-toast";
import "./PreviewCV.scss";
export default function CVPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvData, setCvData] = useState(null);
  useEffect(() => {
    let data = null;

    if (location.state) {
      data = location.state;
    } else {
      const stored = localStorage.getItem("cvData");
      if (stored) {
        data = JSON.parse(stored);
      }
    }

    setCvData(data);
    console.log("Dữ liệu CV:", data); // ✅ đúng, vì log đúng lúc gán
  }, []);

  const handleSubmit = async () => {
    const cv = await createCV({
      userID: 1,
      fullName: cvData.formData.fullName,
      email: cvData.formData.email,
      phoneNumber: cvData.formData.phone,
      birthDay: cvData.birthDay,
      genderID: cvData.formData.gender,
      degreeID: cvData.formData.degree,
      address: cvData.formData.address,
      school_name: cvData.formData.university,
      major: cvData.formData.major,
      gpa: cvData.formData.gpa,
      graduationYear: cvData.formData.graduationYear,
      career_objective: cvData.formData.careerGoal,
      archivements: cvData.formData.achievements,
      references: cvData.formData.references,
      skills: cvData.formData.skills,
      experience: cvData.formData.experience,
      projects: cvData.formData.projects,
      image: cvData.avatar,
    });
    if (cv && cv.errCode === 0) {
      toast.success("Tạo CV thành công !");
      localStorage.removeItem("cvData");
      // Điều hướng về trang tạo CV (form CV)
      navigate(path.FORM_CV);
    }
  };
  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6 print:hidden">
        {/* Button Return */}
        <div className="flex justify-start">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="text-gray-700" />
            <span className="text-sm font-medium">Quay lại</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold">Xem trước CV</h1>
        </div>

        {/* Button Print CV */}
        <div className="flex justify-end">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition text-sm font-medium"
          >
            In CV
          </button>
        </div>
      </div>

      {/* CV Content & Sidebar */}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main CV Area */}
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-3/4 print:w-full print-center">
          {/* Header Info */}
          <div className="flex flex-col lg:flex-row print:flex-row items-center lg:items-center print:items-center gap-6 mb-6 text-center lg:text-left print:text-left">
            <div className="flex-shrink-0">
              {cvData?.avatar ? (
                <img
                  src={cvData.avatar}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-purple-700 text-white flex items-center justify-center text-3xl font-bold">
                  {cvData?.formData?.fullName
                    ? cvData.formData.fullName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "NVA"}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-semibold">
                {cvData?.formData?.fullName || "Họ tên"}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-500" />
                  <span>{cvData?.formData?.email || "Email"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-500" />
                  <span>{cvData?.formData?.phone || "Số điện thoại"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  <span>{cvData?.formData?.address || "Địa chỉ"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  <span>{cvData?.birthDay || "Ngày sinh"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <Section title="MỤC TIÊU NGHỀ NGHIỆP">
            {cvData?.formData?.careerGoal || "Chưa nhập mục tiêu"}
          </Section>

          <Section title="HỌC VẤN">
            <SubSection
              title={`${cvData?.formData?.university}` || "Tên trường"}
              subtitle={`Tốt nghiệp: ${
                cvData?.formData?.graduationYear || "Năm"
              }`}
            >
              Chuyên ngành: {cvData?.formData?.major || "Chuyên ngành"}
              <br />
              Bằng cấp: {cvData?.degreeValue?.value_VI || "Bằng cấp"}
              <br />
              GPA: {cvData?.formData?.gpa || "GPA"}
            </SubSection>
          </Section>

          <Section title="KINH NGHIỆM LÀM VIỆC">
            {cvData?.formData?.experience?.map((item, index) => {
              const timeRange =
                item.startDate && item.endDate
                  ? `${item.startDate} - ${item.endDate}`
                  : "Thời gian";

              return (
                <SubSection
                  key={index}
                  title={item.position || "Vị trí"}
                  subtitle={timeRange}
                >
                  Tên Công ty: {item.nameCompany || "Tên công ty"}
                  <br />
                  Mô tả công việc: {item.description || "Mô tả công việc"}
                </SubSection>
              );
            })}
          </Section>

          <Section title="KỸ NĂNG">
            <div className="flex flex-wrap gap-3">
              <SkillColumn
                title="Kỹ năng kỹ thuật"
                skills={cvData?.formData?.skills?.programming || []}
                color="bg-purple-700"
              />
              <SkillColumn
                title="Kỹ năng mềm"
                skills={cvData?.formData?.skills?.softSkills || []}
                color="bg-green-600"
              />
              <SkillColumn
                title="Ngôn ngữ"
                skills={cvData?.formData?.skills?.languages || []}
                color="bg-yellow-500"
              />
            </div>
          </Section>

          <Section title="DỰ ÁN">
            {cvData?.formData?.projects?.map((project, index) => (
              <Project
                key={index}
                title={project.name || "Tên dự án"}
                techs={project.technologies || ""}
                link={project.link || "#"}
                description={project.description || ""}
              />
            ))}
          </Section>

          <Section title="THÀNH TÍCH & GIẢI THƯỞNG">
            <div>{cvData?.formData?.achievements || "Chưa nhập"}</div>
          </Section>

          <Section title="NGƯỜI THAM KHẢO">
            {cvData?.formData?.references || "Chưa có"}
          </Section>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:fixed lg:bottom-4 lg:right-4 w-full lg:w-1/4 z-50 mt-6 lg:mt-0 print:hidden">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Thao tác</h3>
          <p className="text-sm text-gray-500 mb-3">
            Kiểm tra thông tin và gửi CV cho admin
          </p>
          <div className="bg-gray-100 p-3 rounded mb-3">
            <p className="text-sm text-gray-700">
              {cvData?.formData?.fullName}
            </p>
            <p className="text-sm text-gray-700">{cvData?.formData?.email}</p>
            <p className="text-sm text-gray-700">
              {cvData?.formData?.university}
            </p>
            <p className="text-sm text-gray-700">{cvData?.formData?.major}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded">
            Lưu ý quan trọng: Vui lòng kiểm tra kỹ thông tin trước khi gửi. CV
            sẽ được gửi trực tiếp đến admin xét duyệt.
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Gửi CV cho Admin
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-2 w-full border border-purple-600 text-purple-600 hover:bg-purple-100 font-medium py-2 px-4 rounded transition"
          >
            Quay lại chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-md font-bold uppercase border-b-2 border-purple-700 mb-2">
        {title}
      </h3>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function SubSection({ title, subtitle, children }) {
  return (
    <div className="mb-2">
      <p className="font-semibold text-gray-800">
        {title}{" "}
        <span className="float-right text-sm text-gray-600">{subtitle}</span>
      </p>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  );
}

function SkillColumn({ title, skills, color }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <p className="font-semibold mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`text-white text-xs px-2 py-1 rounded-full ${color} skill-badge`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function Project({ title, techs, link, description }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <p className="font-semibold">{title}</p>
        <a href={link} target="_blank" className="text-sm text-blue-600">
          Xem dự án
        </a>
      </div>
      <p className="text-xs text-purple-700 italic">Công nghệ: {techs}</p>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}
