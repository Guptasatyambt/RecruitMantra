import React, { useState } from 'react';

function InterviewSeries() {
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    { id: 'T1', name: 'Technical 1' },
    { id: 'T2', name: 'Technical 2' },
    { id: 'HR', name: 'HR Round' },
    { id: 'M', name: 'Managerial' }
  ];

  const scrollToNextSection = () => {
    // Get the parent element that contains this section
    const currentSection = document.querySelector('[data-section="interview-series"]');
    
    if (currentSection) {
      // Find the next section after the interview series
      const nextSection = currentSection.nextElementSibling;
      
      if (nextSection) {
        const scrollOptions = {
          behavior: 'smooth',
          block: 'start',
        };
        
        // Add a slight delay before scrolling
        setTimeout(() => {
          nextSection.scrollIntoView(scrollOptions);
        }, 200);
      }
    }
  };

  const handleStageClick = (stageId) => {
    setActiveStage(stageId);
  };

  return (
    <section className="py-12 bg-white font-roboto" data-section="interview-series">
      <div className="container mx-auto px-4">
        {/* Heading Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-2">
          Interview Series
        </h2>
        <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          Complete the full interview process to maximize your preparation
        </p>

        {/* Timeline Section */}
        <div className="relative max-w-4xl mx-auto mb-12">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2">
            {/* Progress Line */}
            <div 
              className="h-full bg-gray-400 transition-all duration-300"
              style={{
                width: activeStage ? 
                  `${(stages.findIndex(s => s.id === activeStage) + 1) * (100 / stages.length)}%` : 
                  '0%'
              }}
            />
          </div>

          {/* Timeline Points */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => {
              const isActive = activeStage === stage.id;
              const isPast = activeStage && stages.findIndex(s => s.id === activeStage) >= index;

              return (
                <div key={stage.id} className="flex flex-col items-center">
                  {/* Circle with Stage Number */}
                  <div
                    onClick={() => handleStageClick(stage.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 mb-4 cursor-pointer transform transition-all duration-300 ${
                      isActive 
                        ? 'bg-gray-600 scale-110' 
                        : isPast 
                          ? 'bg-gray-400' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    } border-2 ${
                      isActive 
                        ? 'border-gray-700' 
                        : isPast 
                          ? 'border-gray-400' 
                          : 'border-gray-300'
                    }`}
                  >
                    <span className={`font-bold ${
                      isActive || isPast ? 'text-white' : 'text-gray-600'
                    }`}>
                      {stage.id}
                    </span>
                  </div>
                  
                  {/* Stage Name */}
                  <span className={`text-center font-medium transition-colors duration-300 ${
                    isActive ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button Section */}
        <div className="text-center">
          <button
            onClick={scrollToNextSection}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            Start Interview Series
          </button>
        </div>
      </div>
    </section>
  );
}

export default InterviewSeries;