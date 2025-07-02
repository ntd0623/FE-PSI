import React, { useRef, useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";

const QuestionCard = ({ question, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const contentRef = useRef(null);
  const explanationRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.style.height = "auto";
    }
    if (showExplanation && explanationRef.current) {
      explanationRef.current.style.height = "auto";
    }
    if (iconRef.current) {
      gsap.set(iconRef.current, { rotate: -180 });
    }
  }, []);

  const toggleExpand = () => {
    const el = contentRef.current;
    const icon = iconRef.current;
    if (!el) return;

    if (isExpanded) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setIsExpanded(false),
      });
      gsap.to(icon, {
        rotate: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      el.style.height = "auto";
      const height = el.offsetHeight;
      el.style.height = "0px";
      gsap.to(el, {
        height,
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          el.style.height = "auto";
          setIsExpanded(true);
        },
      });
      gsap.to(icon, {
        rotate: -180,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const toggleExplanation = () => {
    const el = explanationRef.current;
    if (!el) return;

    if (showExplanation) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setShowExplanation(false),
      });
    } else {
      el.style.height = "auto";
      const height = el.offsetHeight;
      el.style.height = "0px";
      gsap.to(el, {
        height,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          el.style.height = "auto";
          setShowExplanation(true);
        },
      });
    }
  };

  return (
    <div className="border border-blue-300 rounded-lg p-6 mb-6 bg-white shadow-sm">
      <div
        className="flex justify-between items-start mb-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <p className="font-semibold text-gray-800 text-base sm:text-lg leading-snug">
          Câu {index + 1}: {question.content}
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 shrink-0 flex items-center gap-2">
          <ChevronDown ref={iconRef} className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: isExpanded ? "auto" : "0px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-5">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctAnswer;
            return (
              <div
                key={i}
                className={`border p-4 rounded text-sm sm:text-base ${
                  isCorrect
                    ? "bg-green-100 border-green-400 text-green-800 font-medium"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                }`}
              >
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </div>
            );
          })}
        </div>

        <button
          onClick={toggleExplanation}
          className="text-sm text-blue-500 hover:text-blue-700 mb-2"
        >
          {showExplanation ? "Ẩn giải thích" : "Xem giải thích"}
        </button>

        <div
          ref={explanationRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: showExplanation ? "auto" : "0px" }}
        >
          <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
            <div className="flex items-start gap-2 mb-2">
              <FaLightbulb className="text-lg mt-1 shrink-0" />
              <span className="font-medium">Giải thích:</span>
            </div>
            <div className="text-sm sm:text-base leading-relaxed">
              {question.explanation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
