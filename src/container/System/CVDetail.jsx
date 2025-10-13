import React, { useEffect, useRef } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { getAvatarColor } from "../../utils/statusHelper";
import "./CVDetail.scss";
import moment from "moment";

const CVDetail = ({ cvData }) => {
  const skillGroups = groupSkillsByType(cvData?.skills || []);
  const componentRef = useRef();

  useEffect(() => {
    console.log("CVData updated:", cvData);
  }, [cvData]);

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

  return (
    <>
      <div
        ref={componentRef}
        className="print-area cv-bg w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr]"
      >
        <div className="cv-left bg-white bg-opacity-60 px-8 py-10 flex flex-col items-center print:bg-white print:break-inside-avoid">
          <div className="mb-6">
            {cvData.image ? (
              <img
                src={cvData.image}
                alt="Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md cv-avatar"
              />
            ) : (
              <div
                className={`w-40 h-40 rounded-full ${getAvatarColor(
                  cvData.full_name
                )} text-white flex items-center justify-center text-4xl font-bold cv-avatar`}
              >
                {cvData?.full_name
                  ? cvData.full_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                  : ""}
              </div>
            )}
          </div>
          {cvData.full_name && (
            <h1 className="cv-name text-3xl font-bold text-blue-900 mb-2 tracking-wide">
              {cvData.full_name}
            </h1>
          )}
          <div className="cv-divider mb-6"></div>
          {skillGroups.programming.length > 0 ||
          skillGroups.softSkills.length > 0 ||
          skillGroups.languages.length > 0 ? (
            <>
              <SectionTitle title="Kỹ Năng" />
              <SkillList
                programming={skillGroups.programming}
                softSkills={skillGroups.softSkills}
                languages={skillGroups.languages}
              />
              <div className="cv-divider my-6"></div>
            </>
          ) : null}
          {(cvData.phone_number || cvData.email || cvData.address) && (
            <>
              <SectionTitle title="Liên Hệ" />
              <div className="flex flex-col gap-3 text-gray-700 text-base mt-2 w-full">
                {cvData.phone_number && (
                  <InfoRow icon={<FiPhone />} text={cvData.phone_number} />
                )}
                {cvData.email && (
                  <InfoRow icon={<FiMail />} text={cvData.email} />
                )}
                {cvData.address && (
                  <InfoRow icon={<FiMapPin />} text={cvData.address} />
                )}
              </div>
            </>
          )}
        </div>
        <div className="cv-right px-10 py-10 print:break-inside-avoid">
          {cvData.career_title && (
            <div className="cv-title text-2xl italic text-blue-700 mb-8 tracking-wide">
              {cvData.career_title}
            </div>
          )}
          {cvData.career_objective && (
            <>
              <SectionHeading title="Mục Tiêu Nghề Nghiệp" />
              <div className="text-gray-700 text-base mb-8">
                {cvData.career_objective}
              </div>
            </>
          )}
          {(cvData.school_name ||
            cvData.graduation_year ||
            cvData.major ||
            cvData.dataDegree ||
            cvData.gpa) && (
            <>
              <SectionHeading title="Học Vấn" />
              <div className="mb-8">
                <EduList education={cvData} />
              </div>
            </>
          )}
          {cvData.experiences && cvData.experiences.length > 0 && (
            <>
              <SectionHeading title="Kinh Nghiệm Làm Việc" />
              <div>
                <ExpList experiences={cvData.experiences} />
              </div>
            </>
          )}
          {cvData.projects && cvData.projects.length > 0 && (
            <>
              <SectionHeading title="Dự Án" />
              <div className="mb-8">
                {cvData.projects.map((p, i) => (
                  <Project
                    key={i}
                    title={p.name}
                    techs={p.technologies}
                    link={p.github_url}
                    description={p.description}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end w-full mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md"
        >
          In hoặc Lưu PDF
        </button>
      </div>
    </>
  );
};

export default CVDetail;

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
              {item.start_date && item.end_date
                ? `${moment(item.start_date).format("DD/MM/YYYY")} - ${moment(
                    item.end_date
                  ).format("DD/MM/YYYY")}`
                : ""}
            </span>
            <span className="exp-company">
              {item.company ? `Công ty: ${item.company}` : ""}
            </span>
          </div>
          <div className="exp-position text-base text-blue-700 italic mb-1">
            {item.position ? `Vị trí: ${item.position}` : ""}
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
