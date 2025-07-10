import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHeader from "./HomeHeader/HomeHeader";
import resume from "../../assets/img/resume.png";
import Footer from "./Footer/Footer";
import {
  FaHandshake,
  FaRegLightbulb,
  FaClipboardList,
  FaChartLine,
  FaUsersCog,
  FaCode,
  FaServer,
  FaBug,
  FaMobileAlt,
  FaCogs,
  FaChartBar,
} from "react-icons/fa";
import TestimonialSection from "../components/Section/TestimonialSection";
import { useNavigate } from "react-router-dom";
import { path } from "../../utils/constant";
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const sectionRefs = useRef([]);
  const heroTitleRef = useRef(null);
  const heroImageRef = useRef(null);
const navigate = useNavigate()
  useEffect(() => {
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Hero text animation
    gsap.fromTo(
      heroTitleRef.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    // Hero image animation
    gsap.fromTo(
      heroImageRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, delay: 0.6, ease: "power2.out" }
    );
  }, []);
  //position
  const positions = [
    {
      title: "Front-end Developer",
      skills: "React, HTML, CSS, Tailwind, Figma",
      icon: <FaCode className="text-blue-500 text-2xl mb-2 mx-auto " />,
    },
    {
      title: "Back-end Developer",
      skills: "Node.js, Express, MySQL, RESTful API",
      icon: <FaServer className="text-green-500 text-2xl mb-2 mx-auto" />,
    },
    {
      title: "Tester (QA/QC)",
      skills: "Manual, Automation, Selenium, Postman",
      icon: <FaBug className="text-red-500 text-2xl mb-2 mx-auto" />,
    },
    {
      title: "Mobile Developer",
      skills: "React Native, Flutter, Android",
      icon: <FaMobileAlt className="text-purple-500 text-2xl mb-2 mx-auto" />,
    },
    {
      title: "DevOps Intern",
      skills: "Docker, Jenkins, GitHub Actions, AWS",
      icon: <FaCogs className="text-yellow-500 text-2xl mb-2 mx-auto" />,
    },
    {
      title: "Data Analyst Intern",
      skills: "SQL, Excel, Power BI, Python",
      icon: <FaChartBar className="text-pink-500 text-2xl mb-2 mx-auto" />,
    },
  ];

  const businessBenefits = [
    {
      icon: <FaRegLightbulb className="text-purple-600 text-4xl mx-auto" />,
      title: "Tiết kiệm chi phí tuyển dụng",
      desc: "Không cần đăng tuyển phức tạp, dễ dàng tiếp cận thực tập sinh tiềm năng.",
    },
    {
      icon: <FaClipboardList className="text-blue-600 text-4xl mx-auto" />,
      title: "Quản lý hồ sơ dễ dàng",
      desc: "Xem và lọc hồ sơ sinh viên theo kỹ năng, ngành học và thời gian.",
    },
    {
      icon: <FaUsersCog className="text-green-600 text-4xl mx-auto" />,
      title: "Chủ động chọn ứng viên",
      desc: "Tự do phỏng vấn, đánh giá và quyết định ứng viên phù hợp.",
    },
    {
      icon: <FaChartLine className="text-yellow-500 text-4xl mx-auto" />,
      title: "Gia tăng nhận diện thương hiệu",
      desc: "Xuất hiện trên nền tảng của PLT Solutions, thu hút nhiều sinh viên quan tâm.",
    },
  ];

  return (
    <div className="font-sans text-gray-900 px-0 md:px-0 overflow-x-hidden">
      <HomeHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-24 mb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT */}
          <div className="w-full md:w-3/5 mt-12 md:mt-20" ref={heroTitleRef}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
              Nền Tảng Kết Nối <br />
              <span className="text-4xl md:text-5xl">
                Thực Tập Sinh &amp; Doanh Nghiệp
              </span>
            </h1>
            <p className="mb-6 text-base md:text-lg">
              PLT Solutions giúp sinh viên IT tìm được cơ hội thực tập phù hợp
              và hỗ trợ doanh nghiệp tuyển đúng người, đúng kỹ năng.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div
              className="w-72 md:w-96 h-72 md:h-96 rounded-xl overflow-hidden"
              ref={heroImageRef}
            >
              <img
                src={resume}
                alt="Ảnh minh họa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section
        className="px-16 gap-10 text-center py-10 bg-gray-50 section-scroll"
        ref={(el) => (sectionRefs.current[0] = el)}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">
          Lợi ích của doanh nghiệp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {businessBenefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md p-6 rounded-xl space-y-3 hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer"
            >
              {item.icon}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internship Positions */}
      <section
        className="px-16 md:px-10 py-10 section-scroll"
        ref={(el) => (sectionRefs.current[1] = el)}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">
          Vị Trí Thực Tập Phổ Biến
        </h2>
        <div className="grid md:grid-cols-3 gap-6 px-16">
          {positions.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded p-4 text-center hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer"
            >
              {item.icon}
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.skills}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefit */}
      <section
        className="px-4 md:px-10 py-10 bg-white text-center section-scroll"
        ref={(el) => (sectionRefs.current[2] = el)}
      >
        <h2 className="text-2xl font-semibold mb-10">
          Lợi ích khi thực tập tại doanh nghiệp vừa & nhỏ
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer">
            <h4 className="font-semibold mb-2">🎯 Được giao việc thực tế</h4>
            <p className="text-sm text-gray-600">
              Không phải chỉ đi pha trà, bạn sẽ được làm dự án thật, có người
              hướng dẫn cụ thể.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer">
            <h4 className="font-semibold mb-2">🤝 Học hỏi sát sao</h4>
            <p className="text-sm text-gray-600">
              Được tiếp cận trực tiếp với đội ngũ kỹ thuật và được feedback
              thường xuyên.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer">
            <h4 className="font-semibold mb-2">🚀 Cơ hội thử nhiều vai trò</h4>
            <p className="text-sm text-gray-600">
              Công ty nhỏ linh hoạt, bạn có thể thử front-end, back-end, devops
              trong cùng 1 dự án.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <TestimonialSection ref={(el) => (sectionRefs.current[3] = el)} />

      {/* Call to Action */}
      <section
        className="px-4 md:px-10 py-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center section-scroll"
        ref={(el) => (sectionRefs.current[4] = el)}
      >
        <h2 className="text-xl font-bold mb-4">Sẵn Sàng Tham Gia?</h2>
        <p className="mb-6">
          Sinh viên: Gửi hồ sơ ngay để được giới thiệu vào các vị trí thực tập.{" "}
          <br />
        </p>
        <div className="space-x-4">
          <button 
          onClick={() => navigate(path.FORM_CV)} 
          className="bg-white text-purple-700 font-semibold px-4 py-2 rounded">
            Gửi hồ sơ thực tập
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
