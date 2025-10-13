import React, { useRef, useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { upsertCV } from "../../services/studentService";
import { useSelector } from "react-redux";
import { CRUD_ACTIONS, path } from "../../utils/constant";
import toast from "react-hot-toast";
import moment from "moment";
import { getAvatarColor } from "../../utils/statusHelper";
import "./PreviewCV.scss";

export default function CVPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvData, setCvData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const user = useSelector((state) => state?.user?.userInfo);
  const componentRef = useRef();

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
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!cvData.formData.full_name.trim()) {
      errors.full_name = "Họ và tên không được để trống !";
    }
    if (!cvData.formData.email.trim()) {
      errors.email = "Email không được để trống !";
    }
    if (!cvData.formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống !";
    }
    if (!cvData.formData.address.trim()) {
      errors.address = "Địa chỉ không được để trống !";
    }
    if (!cvData.birthDay) {
      errors.birthDay = "Ngày sinh không được bỏ trống !";
    }
    if (!cvData.formData.major.trim()) {
      errors.major = "Chuyên ngành không được để trống !";
    }
    if (!cvData.formData.university.trim()) {
      errors.university = "Trường không được để trống !";
    }
    if (!cvData.formData.gender) {
      errors.gender = "Giới tính không được để trống";
    }
    if (!cvData.formData.degree) {
      errors.degree = "Vui lòng chọn bằng cấp !";
    }
    if (!cvData.formData.gpa) {
      errors.gpa =
        "Điểm số không được bỏ trống. Có thể lấy tổng điểm gần nhất!";
    }
    if (!cvData.formData.graduation_year) {
      errors.graduation_year =
        "Năm tốt nghiệp không được bỏ trống. Có thể để năm tốt nghiệp dự kiến";
    }
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
      userID: user.id,
      full_name: cvData.formData.full_name,
      email: cvData.formData.email,
      phone_number: cvData.formData.phone,
      birthDay: cvData.birthDay,
      genderID: cvData.formData.gender,
      degreeID: cvData.formData.degree,
      address: cvData.formData.address,
      school_name: cvData.formData.university,
      major: cvData.formData.major,
      gpa: cvData.formData.gpa,
      graduation_year: cvData.formData.graduation_year,
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
      navigate(path.FORM_CV);
    }
  };

  const handlePrint = () => {
    const printContent = componentRef.current.cloneNode(true);
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
  <html>
    <head>
      <title>CV Detail</title>
      <link href="https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        @page { 
          size: A4; 
          margin: 0; 
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body { 
          font-family: 'Times New Roman', Times, serif; 
          margin: 0; 
          padding: 0; 
          width: 210mm;
          height: 297mm;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print-area {
          display: grid !important;
          grid-template-columns: 1fr 2fr !important;
          width: 210mm !important;
          height: 297mm !important;
          max-width: 210mm !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
          background: linear-gradient(90deg, #e3ecfa 0%, #fff 100%) !important;
          overflow: hidden !important;
        }
        
        .cv-left {
          background: rgba(255, 255, 255, 0.6) !important;
          padding: 40px 32px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        
        .cv-right {
          background: #e3ecfa !important;
          padding: 40px !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        
        .cv-bg {
          background: linear-gradient(90deg, #e3ecfa 0%, #fff 100%) !important;
        }
        
        .cv-avatar {
          width: 160px !important;
          height: 160px !important;
          border-radius: 50% !important;
          border: 4px solid #fff !important;
          box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08) !important;
          object-fit: cover !important;
          margin-bottom: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 48px !important;
          font-weight: bold !important;
          color: white !important;
          background-color: #6366f1 !important;
        }
        
        /* Typography - Fixed font declarations */
        .cv-name {
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 24px !important;
          font-weight: bold !important;
          color: #1e3a8a !important;
          margin-bottom: 8px !important;
          letter-spacing: 0.05em !important;
          line-height: 1.1 !important;
        }
        
        .cv-title {
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 24px !important;
          font-style: italic !important;
          color: #1d4ed8 !important;
          margin-bottom: 32px !important;
          letter-spacing: 0.05em !important;
        }
        
        /* Section Headings */
        .cv-section-title {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.2em !important;
          margin: 16px 0 16px 0 !important;
          text-align: center !important;
        }
        
        .cv-section-heading {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
          margin: 24px 0 8px 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        .cv-section-heading span:last-child {
          border-top: 1px solid #93c5fd !important;
          display: block !important;
          flex: 1 !important;
        }
        
        /* Skills styling */
        .skills-section {
          width: 100% !important;
          margin-bottom: 24px !important;
        }

        .skills-title {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important; 
          font-size: 32px !important;
          font-weight: bold !important;
          text-align: center !important;
          margin-bottom: 16px !important;
        }

        .skills-categories {
          display: flex !important;
          justify-content: space-between !important;
          width: 100% !important;
          gap: 24px !important;
        }

        .skill-category {
          flex: 1 !important;
          text-align: center !important;
        }

        .skill-category-title {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          margin-bottom: 8px !important;
        }

        .skill-list {
          list-style-type: disc !important;
          margin: 0 !important;
          padding-left: 20px !important;
          text-align: left !important;
        }

          .cv-skill-content {
          font-family: 'Times New Roman', Times, serif;
          text-align: left !important;
          padding:10px !important;
          margin-left: 20px !important;
        }

        .cv-skill-content li {
          line-height: 1.6 !important;
        }

        .skill-item {
          font-family: 'Times New Roman', Times, serif !important;
          color: #374151 !important;
          font-size: 16px !important;
          margin-bottom: 4px !important;
          line-height: 1.4 !important;
        }
        
        /* Contact styling with icons */
        .contact-container {
          width: 100% !important;
        }

        
        
.contact-item {
  display: grid !important;
  grid-template-columns: auto 1fr !important;
  align-items: start !important;
  column-gap: 8px !important;
  margin-bottom: 12px !important;
  font-family: 'Times New Roman', Times, serif !important;
  font-size: 16px !important;
  color: #374151 !important;
  margin-left: 8px !important;
  overflow-wrap: break-word !important;
   whitespace-normal !important;
  word-break: break-word !important;
}
        
        .contact-icon {
          width: 16px !important;
          height: 16px !important;
          flex-shrink: 0 !important;
          margin-right: 8px !important;
        }
        
        /* Fallback icons using CSS symbols */
        .contact-phone:before {
          content: "📞" !important;
          margin-right: 10px !important;
        }
        
        .contact-email:before {
          content: "✉️" !important;
          margin-right: 10px !important;
        }
        
        .contact-location:before {
          content: "📍" !important;
          margin-right: 10px !important;
        }
        
        /* Content sections */
        .content-text {
          font-family: 'Times New Roman', Times, serif !important;
          color: #374151 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          margin-bottom: 32px !important;
        }
        
        .education-item, .experience-item {
          margin-bottom: 24px !important;
        }
        
        .education-header, .experience-header {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 16px !important;
          align-items: center !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #1e3a8a !important;
          font-family: 'Times New Roman', Times, serif !important;
          margin-bottom: 4px !important;
        }
        
        .education-details, .experience-position {
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 16px !important;
          font-style: italic !important;
          color: #1d4ed8 !important;
          margin-bottom: 4px !important;
        }
        
        .experience-list {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .experience-list li {
          display: flex !important;
          align-items: flex-start !important;
          margin-bottom: 4px !important;
          color: #374151 !important;
          font-size: 16px !important;
          font-family: 'Times New Roman', Times, serif !important;
        }
        
        .experience-list li:before {
          content: '•' !important;
          color: #1d4ed8 !important;
          margin-right: 8px !important;
          margin-top: 8px !important;
          font-size: 18px !important;
          flex-shrink: 0 !important;
        }
        
        /* Projects */
        .project-item {
          margin-bottom: 16px !important;
        }
        
        .project-title {
          font-weight: 600 !important;
          color: #1e3a8a !important;
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 18px !important;
          margin-bottom: 4px !important;
        }
        
        .project-tech {
          font-style: italic !important;
          color: #1d4ed8 !important;
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 16px !important;
          margin-bottom: 4px !important;
        }
        
        .cv-project-title {
          font-family: 'Times New Roman', Times, serif !important;
          font-weight: 600 !important;
          color: #1e3a8a !important;
          font-size: 1.125rem !important; /* 18px */
          margin-bottom: 4px !important;
        }

        .cv-project-content {
          font-family: 'Times New Roman', Times, serif !important;
          font-style: italic !important;
          color: #1a73e8 !important;
          font-size: 1rem !important; /* 16px */
          margin-bottom: 8px !important;
        }

        .cv-project-description {
          font-family: 'Times New Roman', Times, serif !important;
          color: #374151 !important;
          font-size: 1rem !important; /* 16px */
          line-height: 1.6 !important;
          margin-bottom: 8px !important;
        }

        .edu-school {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
        }
        
        .edu-graduation-year {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1d4ed8 !important;
          font-size: 16px !important;
          font-style: italic !important;
          margin-bottom: 4px !important;
          margin-left: 8px !important;
        }
        
        .edu-major-degree {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1d4ed8 !important;
          font-size: 16px !important;
          font-style: italic !important;
          margin-bottom: 4px !important;
        }
        
        .edu-gpa {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1d4ed8 !important;
          font-size: 16px !important;
          font-weight: bold !important;
          margin-bottom: 4px !important;
        }
        
        .exp-date {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1e3a8a !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
        }
        
        .exp-position {
          font-family: 'Times New Roman', Times, serif !important;
          color: #1d4ed8 !important;
          font-size: 16px !important;
          font-style: italic !important;
          margin-bottom: 4px !important;
        }
        
        .exp-description {
          font-family: 'Times New Roman', Times, serif !important;
          color: #374151 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          margin-bottom: 4px !important;
        }

        .exp-company {
          font-family: 'Times New Roman', Times, serif !important;
          margin-left: 8px !important;
        }
        
        .project-description {
          font-family: 'Times New Roman', Times, serif !important;
          color: #374151 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          margin-bottom: 4px !important;
        }
        
        .project-link {
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 12px !important;
          color: #1d4ed8 !important;
        }
        
        /* Dividers */
        .cv-divider {
          width: 100% !important;
          height: 1px !important;
          background-color: #93c5fd !important;
          margin: 24px 0 !important;
        }
        
        hr {
          border: none !important;
          border-top: 1px solid #93c5fd !important;
          margin: 24px 0 !important;
        }
        
        /* Hide elements that shouldn't print */
        .print\\:hidden {
          display: none !important;
        }
        
        /* Responsive adjustments for print */
        @media print {
          .print-area {
            width: 210mm !important;
            height: 297mm !important;
          }
        }
      </style>
    </head>
    <body>${printContent.outerHTML}</body>
  </html>`);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  // Transform skills data to match CVDetail format
  const skillGroups = {
    programming: cvData?.formData?.skills?.programming || [],
    softSkills: cvData?.formData?.skills?.softSkills || [],
    languages: cvData?.formData?.skills?.languages || [],
  };

  // Transform experience data to match CVDetail format
  const transformedExperiences = validExperience.map((exp) => ({
    start_date: exp.startDate,
    end_date: exp.endDate,
    company: exp.nameCompany,
    position: exp.position,
    description: exp.description,
  }));

  // Transform projects data to match CVDetail format
  const transformedProjects = validProjects.map((project) => ({
    name: project.name,
    technologies: project.technologies,
    start_date: project.start_date,
    end_date: project.end_date,
    github_url: project.link,
    description: project.description,
  }));

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6 print:hidden">
        <div className="flex justify-start">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            onClick={() => handleNavigate(cvData)}
          >
            <FaArrowLeft className="text-gray-700" />
            <span className="text-sm font-medium">Quay lại</span>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold">Xem trước CV</h1>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition text-sm font-medium"
          >
            In hoặc Lưu PDF
          </button>
        </div>
      </div>

      {/* CV Content using CVDetail Style */}
      <div
        ref={componentRef}
        className="print-area cv-bg w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr]"
      >
        {/* Left Panel */}
        <div className="cv-left bg-white bg-opacity-60 px-8 py-10 flex flex-col items-center print:bg-white print:break-inside-avoid">
          <div className="mb-6">
            {cvData?.avatar ? (
              <img
                src={cvData.avatar}
                alt="Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md cv-avatar"
              />
            ) : (
              <div
                className={`w-40 h-40 rounded-full text-white flex items-center justify-center text-4xl font-bold cv-avatar`}
              >
                {cvData?.formData?.full_name
                  ? cvData.formData.full_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                  : ""}
              </div>
            )}
          </div>
          <div className="mb-6">
            {cvData?.formData?.full_name && (
              <h1 className="cv-name text-3xl font-serif font-bold text-blue-900 mb-2 tracking-wide">
                {cvData.formData.full_name}
              </h1>
            )}
          </div>

          <div className="cv-divider mb-6"></div>

          {/* Skills Section */}
          {(skillGroups.programming.length > 0 ||
            skillGroups.softSkills.length > 0 ||
            skillGroups.languages.length > 0) && (
            <>
              <SectionTitle title="Kỹ Năng" />
              <SkillList
                programming={skillGroups.programming}
                softSkills={skillGroups.softSkills}
                languages={skillGroups.languages}
              />
              <div className="cv-divider my-6"></div>
            </>
          )}

          {/* Contact Section */}
          {(cvData?.formData?.phone ||
            cvData?.formData?.email ||
            cvData?.formData?.address) && (
            <>
              <SectionTitle title="Liên Hệ" />
              <div className="flex flex-col font-serif gap-3 text-gray-700 text-base mt-2 w-full">
                {cvData?.formData?.phone && (
                  <InfoRow icon={<FiPhone />} text={cvData.formData.phone} />
                )}
                {cvData?.formData?.email && (
                  <InfoRow icon={<FiMail />} text={cvData.formData.email} />
                )}
                {cvData?.formData?.address && (
                  <InfoRow icon={<FiMapPin />} text={cvData.formData.address} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="cv-right px-10 py-10 print:break-inside-avoid">
          {/* Profile/Career Objective */}
          {cvData?.formData?.careerGoal && (
            <>
              <SectionHeading title="Mục Tiêu Nghề Nghiệp" />
              <div className="text-gray-700 text-base mb-8">
                {cvData.formData.careerGoal}
              </div>
            </>
          )}

          {/* Education */}
          {(cvData?.formData?.university ||
            cvData?.formData?.graduation_year ||
            cvData?.formData?.major ||
            cvData?.degreeValue ||
            cvData?.formData?.gpa) && (
            <>
              <SectionHeading title="Học Vấn" />
              <div className="mb-8">
                <EduList
                  education={{
                    school_name: cvData?.formData?.university,
                    graduation_year: cvData?.formData?.graduation_year,
                    major: cvData?.formData?.major,
                    dataDegree: cvData?.degreeValue,
                    gpa: cvData?.formData?.gpa,
                  }}
                />
              </div>
            </>
          )}

          {/* Work Experience */}
          {transformedExperiences && transformedExperiences.length > 0 && (
            <>
              <SectionHeading title="Kinh Nghiệm Làm Việc" />
              <div>
                <ExpList experiences={transformedExperiences} />
              </div>
            </>
          )}

          {/* Projects */}
          {transformedProjects && transformedProjects.length > 0 && (
            <>
              <SectionHeading title="Dự Án Nổi Bật" />
              <div className="mb-8">
                {transformedProjects.map((p, i) => (
                  <Project
                    key={i}
                    title={p.name}
                    techs={p.technologies}
                    start_date={p.start_date}
                    end_date={p.end_date}
                    link={p.github_url}
                    description={p.description}
                  />
                ))}
              </div>
            </>
          )}

          {/* Achievements */}
          {cvData?.formData?.achievements?.trim() && (
            <>
              <SectionHeading title="Thành tựu" />
              <div className="text-gray-700 text-base mb-8">
                {cvData.formData.achievements}
              </div>
            </>
          )}

          {/* References */}
          {cvData?.formData?.references?.trim() && (
            <>
              <SectionHeading title="Người Tham Khảo" />
              <div className="text-gray-700 text-base mb-8">
                {cvData.formData.references}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar - Same as before */}
      <div className="lg:fixed lg:bottom-4 lg:right-4 w-full lg:w-1/4 z-50 mt-6 lg:mt-0 print:hidden">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Thao tác</h3>
          <p className="text-sm text-gray-500 mb-3">
            Kiểm tra thông tin và gửi CV cho admin
          </p>
          <div className="bg-gray-100 p-3 rounded mb-3">
            <p className="text-sm text-gray-700">
              {cvData?.formData?.full_name}
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

// Helper Components - Same as CVDetail
function SectionTitle({ title }) {
  return (
    <div className="cv-section-title text-3xl mb-3 text-blue-900">{title}</div>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="text-blue-900 text-xl mb-2 mt-6 font-semibold tracking-wide flex items-center gap-2 cv-section-heading">
      <span className="text-3xl">{title}</span>
      <span className="flex-1 border-t border-blue-200"></span>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div className="flex items-start gap-2 w-full break-words contact-item">
      <div className="w-5 h-5 text-blue-600 shrink-0 mt-[2px]">{icon}</div>
      <div className="text-sm text-gray-800 leading-snug break-words">
        {text}
      </div>
    </div>
  );
}

function SkillList({ programming, softSkills, languages }) {
  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Technical Skills */}
        {programming.length > 0 && (
          <div className="flex flex-col">
            <h3 className="cv-skill-title text-blue-900 font-semibold mb-2">
              Kỹ Năng Kỹ Thuật
            </h3>
            <ul className="cv-skill-content text-gray-700">
              {programming.map((skill, idx) => (
                <li key={idx} className="mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Soft Skills */}
        {softSkills.length > 0 && (
          <div className="flex flex-col">
            <h3 className="cv-skill-title text-blue-900 font-semibold mb-2">
              Kỹ Năng Mềm
            </h3>
            <ul className="cv-skill-content text-gray-700">
              {softSkills.map((skill, idx) => (
                <li key={idx} className="mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex flex-col">
            <h3 className="cv-skill-title text-blue-900 font-semibold mb-2">
              Ngôn Ngữ
            </h3>
            <ul className="cv-skill-content text-gray-700">
              {languages.map((skill, idx) => (
                <li key={idx} className="mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function EduList({ education }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex gap-4 items-center text-lg font-semibold text-blue-900">
          <span className="edu-school">
            {education?.school_name || "Tên trường"}
          </span>
          <span className="edu-graduation-year text-base text-blue-700 font-normal">
            Năm tốt nghiệp:
            {education?.graduation_year ? `${education.graduation_year}` : ""}
          </span>
        </div>
        <div className="edu-major-degree text-base text-blue-700 italic">
          {education?.major || "Chuyên ngành"}{" "}
          {education?.dataDegree?.value_VI
            ? ` | ${education.dataDegree.value_VI}`
            : ""}
        </div>
        <div className="edu-gpa text-base text-blue-700 font-semibold">
          GPA: {education?.gpa || "Chưa nhập GPA"}
        </div>
      </div>
    </div>
  );
}

function ExpList({ experiences }) {
  if (!experiences || experiences.length === 0)
    return <div className="text-gray-500">Chưa có kinh nghiệm làm việc</div>;
  return (
    <div className="space-y-6">
      {experiences.map((item, i) => (
        <div key={i}>
          <div className="exp-date flex gap-4 items-center text-lg font-semibold text-blue-900 print:break-inside-avoid">
            <span>
              {moment(item.start_date).format("DD/MM/YYYY") || "?"} -{" "}
              {moment(item.end_date).format("DD/MM/YYYY") || "?"}
            </span>
            <span className="exp-company">{item.company || "Tên công ty"}</span>
          </div>
          <div className="exp-position text-base text-blue-700 italic mb-1">
            Vị trí: {item.position || "Vị trí"}
          </div>
          <ul
            className="exp-description text-gray-700 text-base"
            style={{ listStyleType: "none" }}
          >
            {item.description ? (
              item.description
                .split("\n")
                .map((d, idx) => <li key={idx}>{d}</li>)
            ) : (
              <li>Chưa nhập mô tả công việc</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Project({ title, techs, link, description, start_date, end_date }) {
  return (
    <div className="project mb-4 print:mb-3 print:break-inside-avoid">
      <div className="cv-project-title font-semibold text-blue-900 text-lg mb-1">
        {title}
      </div>
      <div className="cv-project-content text-base text-blue-700 italic mb-1">
        Thời gian: {moment(start_date).format("DD/MM/YYYY")} -
        {moment(end_date).format("DD/MM/YYYY")}
      </div>
      <div className="cv-project-content text-base text-blue-700 italic mb-1">
        Công nghệ: {techs}
      </div>
      <div className="cv-project-description text-base text-gray-700 leading-relaxed mb-1">
        {description}
      </div>
      <div className="cv-project-description text-base text-gray-700 leading-relaxed mb-1">
        Link github:{" "}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-normal"
          >
            {link}
          </a>
        )}
      </div>
    </div>
  );
}

const groupSkillsByType = (skills) => {
  const grouped = { programming: [], softSkills: [], languages: [] };
  if (!Array.isArray(skills)) return grouped;
  skills.forEach((skill) => {
    if (grouped[skill.type]) grouped[skill.type].push(skill.name);
  });
  return grouped;
};
