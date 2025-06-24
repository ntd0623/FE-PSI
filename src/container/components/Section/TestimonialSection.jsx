import React, { useState, forwardRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import giangvien1 from "../../../assets/img/giangvien1.jpg";
import giangvien2 from "../../../assets/img/giangvien2.jpg";

const testimonials = [
  {
    image: giangvien1,
    name: "Phan Gia Phước",
    position: "Giảng viên kiểm thử",
    message:
      "Là một giảng viên hết sức có tâm với nghề. Sinh viên sẽ được đào tạo một cách bài bản qua các bài tập thực tế.",
  },
  {
    image: giangvien2,
    name: "Trần Minh Phúc",
    position: "Giảng viên lập trình web",
    message:
      "Sinh viên có thể học được cách thiết kế website từ phân chia bố cục tới gọi API.",
  },
];

const TestimonialSection = forwardRef((props, ref) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section ref={ref} className="py-16 px-4 text-center bg-white">
      <h2 className="text-2xl font-semibold mb-8">
        Đội ngũ nhân viên của chúng tôi
      </h2>

      <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
        <img
          src={testimonials[current].image}
          alt={testimonials[current].name}
          className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
        />
        <p className="font-semibold text-2xl">{testimonials[current].name}</p>
        <p className="text-lg text-gray-500 mb-4">
          {testimonials[current].position}
        </p>
        <p className="text-sm text-gray-700">{testimonials[current].message}</p>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === current ? "bg-purple-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-4 mt-4 text-gray-600">
          <button onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
});

export default TestimonialSection;
