import React, { useRef, useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { upsertCV } from "../../services/studentService";
import { CRUD_ACTIONS, path } from "../../utils/constant";
import toast from "react-hot-toast";
import moment from "moment";
import "./PreviewCV.scss";
export default function CVPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvData, setCvData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleNavigate = (cvData) => {
    if (cvData.action === CRUD_ACTIONS.ADD) {
      navigate(path.FORM_CV);
    }

    if (cvData.action === CRUD_ACTIONS.EDIT) {
      navigate(path.VIEW_CV.replace(":id", cvData.cvID));
    }
  };

  const validProjects =
    cvData?.formData?.projects?.filter((project) =>
      [
        project.name,
        project.technologies,
        project.link,
        project.description,
      ].some((field) => field?.trim())
    ) || [];
  const validExperience =
    cvData?.formData?.experience?.filter((exp) =>
      [
        exp.nameCompany,
        exp.position,
        exp.startDate,
        exp.endDate,
        exp.description,
      ].some((field) => field?.trim())
    ) || [];

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

  const validateForm = () => {
    const errors = {};

    // Full Name
    if (!cvData.formData.fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống !";
    }

    // Email
    if (!cvData.formData.email.trim()) {
      errors.email = "Email không được để trống !";
    }

    // phone
    if (!cvData.formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống !";
    }
    // Address
    if (!cvData.formData.address.trim()) {
      errors.address = "Địa chỉ không được để trống !";
    }
    // birthDay
    if (!cvData.birthDay) {
      errors.birthDay = "Ngày sinh không được bỏ trống !";
    }

    // major
    if (!cvData.formData.major.trim()) {
      errors.major = "Chuyên ngành không được để trống !";
    }

    // school
    if (!cvData.formData.university.trim()) {
      errors.university = "Trường không được để trống !";
    }

    if (!cvData.formData.gender) {
      errors.gender = "Giới tính không được để trống";
    }

    // degree
    if (!cvData.formData.degree) {
      errors.degree = "Vui lòng chọn bằng cấp !";
    }

    // GPA
    if (!cvData.formData.gpa) {
      errors.gpa =
        "Điểm số không được bỏ trống. Có thể lấy tổng điểm gần nhất!";
    }

    // graduation Year
    if (!cvData.formData.graduationYear) {
      errors.graduationYear =
        "Năm tốt nghiệp không được bỏ trống. Có thể để năm tốt nghiệp dự kiến";
    }

    //Career objective
    if (!cvData.formData.careerGoal) {
      errors.careerGoal = "Mục tiêu không được bỏ trống !";
    }

    if (!cvData.formData.references) {
      errors.references = "Người hướng dẫn không được bỏ trống !";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Bạn không thể gửi form input đang lỗi !");
      return;
    }
    const cv = await upsertCV({
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
      action: CRUD_ACTIONS.ADD,
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
            onClick={() => handleNavigate(cvData)}
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
            className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition text-sm font-medium"
          >
            In CV
          </button>
        </div>
      </div>

      {/* CV Content & Sidebar */}

      <div className="print-area w-full lg:pr-[400px] print:w-full print:pr-0 print:max-w-full print:shadow-none print:rounded-none print:p-0">
        {/* Header Info */}
        <div className="header-section flex flex-col lg:flex-row print:flex-row items-center lg:items-start print:items-start gap-6 mb-6 text-center lg:text-left print:text-left">
          <div className="avatar-section flex-shrink-0">
            {cvData?.avatar ? (
              <img
                src={cvData.avatar}
                alt="Avatar"
                className="w-28 h-28 print:w-24 print:h-24 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-28 h-28 print:w-24 print:h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl print:text-2xl font-bold`}
              >
                {cvData?.formData?.fullName
                  ? cvData.formData.fullName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "N/A"}
              </div>
            )}
          </div>

          <div className="info-section flex-1 space-y-3 print:space-y-2">
            <h1 className="text-3xl print:text-2xl font-semibold text-gray-800">
              {cvData?.formData?.fullName || "Chưa nhập họ tên"}
            </h1>
            <div className="contact-grid grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 print:gap-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <span className="break-all">
                  {cvData?.formData?.email || "chưa nhập email"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-500 flex-shrink-0" />
                <span>
                  {cvData?.formData?.phone || "chưa nhập số điện thoại "}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span>{cvData?.formData?.address || "Chưa nhập địa chỉ"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500 flex-shrink-0" />
                <span>{cvData?.birthDay || "chưa nhập năm sinh"}</span>
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
            title={`Trường: ${
              cvData?.formData?.university || "Chưa nhập tên trường"
            } `}
            subtitle={`Tốt nghiệp: ${
              cvData?.formData?.graduationYear || "Chưa nhập năm tốt nghiệp"
            }`}
          >
            <div className="space-y-1">
              <div>
                Chuyên ngành:{" "}
                {cvData?.formData?.major || "Chưa nhập chuyên ngành"}
              </div>
              <div>
                Bằng cấp:{" "}
                {cvData?.degreeValue?.value_VI || "Chưa nhập bằng cấp"}
              </div>
              <div>GPA: {cvData?.formData?.gpa || "Chưa nhâp GPA"}</div>
            </div>
          </SubSection>
        </Section>
        {/* Experience */}
        {validExperience.length > 0 && (
          <Section title="KINH NGHIỆM LÀM VIỆC">
            {validExperience.map((item, index) => {
              const timeRange =
                item.startDate && item.endDate
                  ? `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
                      item.endDate
                    ).format("DD/MM/YYYY")}`
                  : "Chưa nhập thời gian";

              return (
                <SubSection
                  key={index}
                  title={item.position || "Chưa nhập vị trí"}
                  subtitle={timeRange}
                >
                  <div className="space-y-1">
                    <div>
                      <strong>Tên Công ty:</strong>{" "}
                      {item.nameCompany || "Chưa nhập tên công ty"}
                    </div>
                    <div>
                      <strong>Mô tả công việc:</strong>{" "}
                      {item.description || "Chưa nhập mô tả công việc"}
                    </div>
                  </div>
                </SubSection>
              );
            })}
          </Section>
        )}

        {/* Skill */}
        {(cvData?.formData?.skills?.programming?.length > 0 ||
          cvData?.formData?.skills?.softSkills?.length > 0 ||
          cvData?.formData?.skills?.languages?.length > 0) && (
          <Section title="KỸ NĂNG">
            <div className="skills-container space-y-4 print:space-y-3">
              <SkillColumn
                title="Kỹ năng kỹ thuật"
                skills={cvData?.formData?.skills?.programming || []}
                color="bg-blue-700"
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
        )}

        {/* Project */}
        {validProjects.length > 0 && (
          <Section title="DỰ ÁN">
            {validProjects.map((project, index) => (
              <Project
                key={index}
                title={project.name || "Chưa nhập tên dự án"}
                techs={project.technologies || "Chưa nhập công nghệ sử dụng"}
                link={project.link || "#"}
                description={project.description || "Chưa có mô tả"}
              />
            ))}
          </Section>
        )}
        {cvData?.formData?.achievements?.trim() && (
          <Section title="THÀNH TÍCH & GIẢI THƯỞNG">
            {cvData.formData.achievements}
          </Section>
        )}

        {cvData?.formData?.references?.trim() && (
          <Section title="NGƯỜI THAM KHẢO">
            {cvData.formData.references}
          </Section>
        )}
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
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Gửi CV cho Admin
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-2 w-full border border-blue-600 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded transition"
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
      <h3 className="text-md font-bold uppercase border-b-2 border-blue-700 mb-2">
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
      <p className="text-xs text-blue-700 italic">Công nghệ: {techs}</p>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}
