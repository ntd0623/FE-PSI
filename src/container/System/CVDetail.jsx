import { FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { getAvatarColor } from "../../utils/statusHelper";
import React, { useRef } from "react";
import "./CVDetail.scss";

const CVDetail = ({ cvData }) => {
  const skillGroups = groupSkillsByType(cvData?.skills || []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <React.Fragment>
      <div className="print-area w-full print:max-w-full print:shadow-none print:rounded-none print:p-0">
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
                className={`w-28 h-28 print:w-24 print:h-24 rounded-full ${getAvatarColor(
                  cvData.fullName
                )} text-white flex items-center justify-center text-3xl print:text-2xl font-bold`}
              >
                {cvData?.fullName
                  ? cvData?.fullName
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
              {cvData?.fullName || "Họ tên"}
            </h1>
            <div className="contact-grid grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 print:gap-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <span className="break-all">{cvData?.email || "Email"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-500 flex-shrink-0" />
                <span>{cvData?.phoneNumber || "Số điện thoại"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span>{cvData?.address || "Địa chỉ"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500 flex-shrink-0" />
                <span>{cvData?.birthDay || "Ngày sinh"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <Section title="MỤC TIÊU NGHỀ NGHIỆP">
          {cvData?.career_objective || "Chưa nhập mục tiêu"}
        </Section>

        <Section title="HỌC VẤN">
          <SubSection
            title={cvData?.schoolName || "Tên trường"}
            subtitle={`Tốt nghiệp: ${cvData?.graduationYear || "Năm"}`}
          >
            <div className="space-y-1">
              <div>Chuyên ngành: {cvData?.major || "Chuyên ngành"}</div>
              <div>Bằng cấp: {cvData?.degreeValue?.value_VI || "Bằng cấp"}</div>
              <div>GPA: {cvData?.gpa || "GPA"}</div>
            </div>
          </SubSection>
        </Section>

        <Section title="KINH NGHIỆM LÀM VIỆC">
          {cvData?.experiences?.length > 0
            ? cvData.experiences.map((item, index) => {
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
                    <div className="space-y-1">
                      <div>
                        <strong>Tên Công ty:</strong>{" "}
                        {item.nameCompany || "Tên công ty"}
                      </div>
                      <div>
                        <strong>Mô tả công việc:</strong>{" "}
                        {item.description || "Mô tả công việc"}
                      </div>
                    </div>
                  </SubSection>
                );
              })
            : "Chưa có kinh nghiệm làm việc"}
        </Section>

        <Section title="KỸ NĂNG">
          <div className="skills-container space-y-4 print:space-y-3">
            <SkillColumn
              title="Kỹ năng kỹ thuật"
              skills={skillGroups.programming}
              color="bg-purple-700"
            />
            <SkillColumn
              title="Kỹ năng mềm"
              skills={skillGroups.softSkills}
              color="bg-green-600"
            />
            <SkillColumn
              title="Ngôn ngữ"
              skills={skillGroups.languages}
              color="bg-yellow-500"
            />
          </div>
        </Section>

        <Section title="DỰ ÁN">
          {cvData?.projects?.length > 0
            ? cvData.projects.map((project, index) => (
                <Project
                  key={index}
                  title={project.name || "Tên dự án"}
                  techs={project.technologies || ""}
                  link={project.link || "#"}
                  description={project.description || ""}
                />
              ))
            : "Chưa có dự án"}
        </Section>

        <Section title="THÀNH TÍCH & GIẢI THƯỞNG">
          {cvData?.archivement || "Chưa có thành tích"}
        </Section>

        <Section title="NGƯỜI THAM KHẢO">
          {cvData?.references || "Chưa có người tham khảo"}
        </Section>
      </div>

      {/* Print Button */}
      <div className="flex justify-end mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md"
        >
          In hoặc Lưu PDF
        </button>
      </div>
    </React.Fragment>
  );
};

export default CVDetail;

// =================== COMPONENT SUPPORT ===================

function Section({ title, children }) {
  return (
    <div className="section mb-6 print:mb-4 print:break-inside-avoid">
      <h3 className="text-lg print:text-base font-bold uppercase border-b-2 border-purple-700 mb-3 print:mb-2 text-gray-800">
        {title}
      </h3>
      <div className="text-sm text-gray-700 leading-relaxed print:leading-normal">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, subtitle, children }) {
  return (
    <div className="subsection mb-3 print:mb-2 print:break-inside-avoid">
      <div className="flex flex-col print:flex-col gap-1 mb-2">
        <p className="font-semibold text-gray-800 text-sm print:text-sm">
          {title}
        </p>
        <p className="text-xs print:text-xs text-gray-600 italic">{subtitle}</p>
      </div>
      <div className="text-sm print:text-xs text-gray-700">{children}</div>
    </div>
  );
}

function SkillColumn({ title, skills, color }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="skill-column print:break-inside-avoid">
      <p className="font-semibold mb-2 print:mb-1 text-sm print:text-sm text-gray-800">
        {title}
      </p>
      <div className="flex flex-wrap gap-2 print:gap-1">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`text-white text-xs print:text-xs px-2 py-1 print:px-1 print:py-0.5 rounded-full ${color}`}
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
    <div className="project mb-4 print:mb-3 print:break-inside-avoid">
      <div className="flex flex-col print:flex-col gap-1 mb-1">
        <p className="font-semibold text-sm print:text-sm text-gray-800">
          {title}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs print:text-xs text-blue-600 hover:underline print:text-blue-800"
        >
          {link !== "#" ? "Xem dự án" : ""}
        </a>
      </div>
      <p className="text-xs print:text-xs text-purple-700 italic mb-1">
        Công nghệ: {techs}
      </p>
      <p className="text-sm print:text-xs text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

// Process skill
const groupSkillsByType = (skills) => {
  const grouped = {
    programming: [],
    softSkills: [],
    languages: [],
  };

  if (!Array.isArray(skills)) return grouped;

  skills.forEach((skill) => {
    if (grouped[skill.type]) {
      grouped[skill.type].push(skill.name);
    }
  });

  return grouped;
};
