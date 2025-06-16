import React from "react";
import { useNavigate } from "react-router-dom";

function InterviewTypes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const handleStartPractice = () => {
    const nextSection = document.getElementById("level-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cards = [
    {
      name: "Technical Interview",
      indicator: "/assets/svg_technical_interview.png",
      levels: [
        { name: "Beginner", color: "bg-green-100", textColor: "text-green-800" },
        { name: "Intermediate", color: "bg-yellow-100", textColor: "text-yellow-800" },
        { name: "Advanced", color: "bg-red-100", textColor: "text-red-800" },
      ],
      description: "Practice coding problems and system design questions with our AI interview",
      // link: "#",
      onClick: handleStartPractice,
      buttonText: "Start Technical Round",
    },
    {
      name: "HR Interview",
      indicator: "/assets/svg_hr_interview.png",
      tag: { name: "Behavioural", color: "bg-blue-100", textColor: "text-blue-800" },
      description: "Perfect your responses to common HR questions & behavioural scenarios",
      // link: "#",
      onClick: () => (token ? navigate("/hr-behavioral") : navigate("/login")),
      buttonText: "Start HR Interview",
    },
    {
      name: "Managerial Round",
      indicator: "/assets/svg_managerial_round.png",
      tag: { name: "Leadership", color: "bg-purple-100", textColor: "text-purple-800" },
      description: "Demonstrate your leadership potential and problem solving abilities",
      // link: "#",
      onClick: () => (token ? navigate("/managerial") : navigate("/login")),
      buttonText: "Start Managerial Round",
    },
  ];

  return (
    <section className="py-6 md:py-12 font-roboto bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold text-center mb-2 font-roboto">
          Interview Types
        </h3>
        <p className="text-center text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto font-roboto px-4">
          Choose from our comprehensive range of interview types to practice and master your skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-lg md:max-w-none mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="text-center transform transition-all duration-300 hover:scale-105"
            >
              <div
                className="
                  overflow-hidden shadow-lg hover:shadow-2xl 
                  transition-all duration-300 bg-white
                  h-full flex flex-col rounded-lg
                  hover:-translate-y-2
                  animate-fadeIn
                "
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.2}s backwards`,
                }}
              >
                {/* Header Section */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={card.indicator}
                          alt={`${card.name} icon`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold font-roboto">
                        {card.name}
                      </h4>
                    </div>
                    {/* Tags Section */}
                    <div className="flex gap-2 flex-wrap pl-[52px]">
                      {card.levels ? (
                        card.levels.map((level, idx) => (
                          <span
                            key={idx}
                            className={`${level.color} ${level.textColor} px-3 py-1 rounded-lg text-sm font-semibold`}
                          >
                            {level.name}
                          </span>
                        ))
                      ) : (
                        <span className={`${card.tag.color} ${card.tag.textColor} px-3 py-1 rounded-lg text-sm font-semibold`}>
                          {card.tag.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description and Button Section */}
                <div className="px-6 sm:px-6 pb-4 sm:pb-5 text-left flex-grow flex flex-col">
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {card.description}
                  </p>
                  <button
                    onClick={card.onClick}

                    className="
                      w-full bg-black hover:bg-gray-800 text-white font-bold 
                      py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base
                      transition-all duration-300 
                      transform hover:scale-105 hover:shadow-lg
                      rounded-md font-roboto
                    "
                  >
                    {card.buttonText}
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

export default InterviewTypes;
