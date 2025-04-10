import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

function LevelsSection() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const levels = [
    {
      name: "Beginner Level",
      indicator: "/assets/svg_beginner.png",
      points: [
        "Basic Data Structure",
        "Simple Algorithms",
        "Fundamental Concepts"
      ],
      link: "/beginner",
      checkColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      cardBg: "bg-green-50",
      buttonText: "Start Beginner Level"
    },
    {
      name: "Intermediate Level",
      indicator: "/assets/svg_intermediate.png",
      points: [
        "Advanced Data Structure",
        "Complex Algorithms",
        "System Design Basics"
      ],
      link: "/intermediate",
      checkColor: "text-yellow-500",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      cardBg: "bg-yellow-50",
      buttonText: "Start Intermediate Level"
    },
    {
      name: "Advanced Level",
      indicator: "/assets/svg_advanced.png",
      points: [
        "Complex System Design",
        "Optimization Problems",
        "Architectural Patterns"
      ],
      link: "/advance",
      checkColor: "text-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
      cardBg: "bg-red-50",
      buttonText: "Start Advanced Level"
    }
  ];

  return (
    <section className="py-6 md:py-12 bg-gray-50 font-roboto"> {/* Updated background color */}
      <div className="container mx-auto px-4 sm:px-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold text-center mb-2 font-roboto">
          Technical Levels
        </h3>
        <p className="text-center text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto font-roboto px-4">
          Choose your technical interview difficulty level
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-lg md:max-w-none mx-auto">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className="text-center transform transition-all duration-300 hover:scale-105"
            >
              <div 
                className={`
                  overflow-hidden shadow-lg hover:shadow-2xl 
                  transition-all duration-300 ${level.cardBg} 
                  h-full flex flex-col rounded-lg
                  hover:-translate-y-2
                  animate-fadeIn
                `}
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.2}s backwards`
                }}
              >
                {/* Header Section */}
                <div className="p-4 sm:p-5 pb-3 sm:pb-4 text-left border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={level.indicator}
                      alt={`${level.name} icon`}
                      className="w-5 sm:w-6 h-5 sm:h-6 object-contain transform transition-transform duration-300 hover:rotate-12"
                    />
                    <h4 className="text-lg sm:text-xl font-bold font-roboto">
                      {level.name}
                    </h4>
                  </div>
                </div>

                {/* Points and Button Section */}
                <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-5 text-left flex-grow">
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                    {level.points.map((point, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center space-x-2 transform transition-transform duration-300 hover:translate-x-2"
                      >
                        <Check className={`h-4 sm:h-5 w-4 sm:w-5 ${level.checkColor} flex-shrink-0 transition-transform duration-300 hover:scale-110`} />
                        <span className="text-sm sm:text-base text-gray-700 font-roboto">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (token) {
                        navigate(level.link);
                      } else {
                        navigate("/login");
                      }
                    }}
                    className={`
                      w-full ${level.buttonColor} text-white font-bold 
                      py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base
                      transition-all duration-300 
                      transform hover:scale-105 hover:shadow-lg
                      rounded-md font-roboto
                    `}
                  >
                    {level.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LevelsSection;