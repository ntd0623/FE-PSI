import React, { useEffect, useRef } from "react";
import {
  Star,
  Heart,
  RefreshCcw,
  BookOpen,
  Users,
  Layers,
  Eye,
  Target,
  Rocket,
} from "lucide-react";
import Header from "../HomeHeader/HomeHeader";
import Footer from "../Footer/Footer";
const AboutPage = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Simplified animation - you can add GSAP back if needed
    const sections = sectionsRef.current;
    sections.forEach((section, index) => {
      if (section) {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        setTimeout(() => {
          section.style.transition = "all 0.8s ease";
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
        }, index * 200);
      }
    });
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header placeholder */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-20">
            {/* Section 1: Intro */}
            <section ref={addToRefs} className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Về Chúng Tôi
              </h1>
              <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-left space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    PLT Solutions - Nơi khởi đầu sự nghiệp IT
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Được thành lập vào năm 2020, PLT Solutions đã nhanh chóng
                    trở thành một trong những đơn vị hàng đầu trong việc cung
                    cấp chương trình thực tập chất lượng cao tại Việt Nam.
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                    Chúng tôi tự hào là cầu nối giữa sinh viên và doanh nghiệp,
                    mang đến cơ hội thực tập với các dự án thực tế, công nghệ
                    hiện đại và môi trường làm việc chuyên nghiệp.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center py-20 rounded-2xl shadow-xl">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-semibold">PLT Team Meeting</p>
                    <p className="text-blue-100">Đội ngũ chuyên nghiệp</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Giá trị cốt lõi */}
            <section ref={addToRefs}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Giá trị cốt lõi
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Những giá trị định hướng hoạt động của chúng tôi
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Star className="w-8 h-8 text-blue-600" />,
                    title: "Chất lượng",
                    desc: "Cam kết mang đến chương trình thực tập chất lượng cao với nội dung cập nhật và phù hợp với thị trường",
                  },
                  {
                    icon: <Heart className="w-8 h-8 text-red-500" />,
                    title: "Tận tâm",
                    desc: "Đồng hành cùng thực tập sinh trong suốt quá trình học tập và phát triển sự nghiệp",
                  },
                  {
                    icon: <RefreshCcw className="w-8 h-8 text-green-500" />,
                    title: "Đổi mới",
                    desc: "Không ngừng cập nhật công nghệ mới và phương pháp giảng dạy hiện đại nhất",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex justify-center mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Sứ mệnh & Tầm nhìn */}
            <section ref={addToRefs}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Sứ mệnh & Tầm nhìn
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Định hướng và mục tiêu phát triển của PLT Solutions trong việc
                  đào tạo nhân lực IT chất lượng cao
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 shadow-lg rounded-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-600 ml-4">
                      Sứ mệnh
                    </h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Đào tạo nhân lực IT chất lượng cao
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Kết nối sinh viên với doanh nghiệp
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Nâng cao khả năng việc làm cho sinh viên
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-8 shadow-lg rounded-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-600 ml-4">
                      Tầm nhìn
                    </h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Dẫn đầu về chất lượng thực tập
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Mở rộng ra các tỉnh thành khác
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Hợp tác với các tập đoàn công nghệ lớn
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Phương pháp đào tạo */}
            <section ref={addToRefs}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Phương pháp đào tạo
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Quy trình đào tạo bài bản và hiệu quả
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                    title: "Học lý thuyết",
                    desc: "Nắm vững kiến thức nền tảng",
                    step: "01",
                  },
                  {
                    icon: <Layers className="w-8 h-8 text-purple-600" />,
                    title: "Thực hành",
                    desc: "Áp dụng vào dự án thực tế",
                    step: "02",
                  },
                  {
                    icon: <Users className="w-8 h-8 text-green-600" />,
                    title: "Mentoring",
                    desc: "Hướng dẫn từ chuyên gia",
                    step: "03",
                  },
                  {
                    icon: <Eye className="w-8 h-8 text-orange-600" />,
                    title: "Đánh giá",
                    desc: "Feedback và cải thiện",
                    step: "04",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    <div className="text-right text-xs font-bold text-gray-300 mb-2">
                      {item.step}
                    </div>
                    <div className="flex justify-center mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-center mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Đội ngũ chuyên gia */}
            <section ref={addToRefs} className="py-20 bg-gray-50">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Hành trình phát triển
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Những cột mốc đáng nhớ trong hành trình khẳng định vị thế của
                  PLT Solutions
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100"></div>

                {[
                  {
                    year: "2019",
                    title:
                      "Từ hộ kinh doanh cá thể bắt đầu thành lập PLT Solution để khẳng định chất lượng uy tín và dịch vụ vượt trội",
                    icon: <Rocket className="w-6 h-6 text-white" />,
                    color: "bg-blue-600",
                  },
                  {
                    year: "2021",
                    title:
                      "Mở khóa học online giúp sinh viên không bị bỡ ngỡ khi bắt đầu quá trình làm việc tại doanh nghiệp",
                    icon: <Users className="w-6 h-6 text-white" />,
                    color: "bg-emerald-500",
                  },
                  {
                    year: "2022",
                    title:
                      "Triển khai chương trình mentoring chuyên sâu. Kết hợp với các giảng viên đại học và người có kinh nghiệm ngoài doanh nghiệp",
                    icon: <BookOpen className="w-6 h-6 text-white" />,
                    color: "bg-purple-500",
                  },
                  {
                    year: "2023",
                    title:
                      "Mở rộng chương trình đào tạo phù hợp với sinh viên và người đi làm",
                    icon: <Target className="w-6 h-6 text-white" />,
                    color: "bg-orange-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`mb-14 flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="md:w-1/2 px-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} shadow-lg mx-auto md:mx-0`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <div className="md:w-1/2 px-6 mt-6 md:mt-0">
                      <div className="bg-white shadow-md rounded-xl p-6">
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          {item.year}
                        </p>
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      <Footer />
    </div>
  );
};

export default AboutPage;
