import React from "react";

const AIInterviewer = ({ currentQuestion }) => {
  return (
    <div className="ai-interviewer relative h-[400px] rounded-lg overflow-hidden shadow-lg">
      <img
        src="/assets/ai-interviewer.jpg"
        alt="AI Interviewer"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div className="text-white text-lg font-medium">AI Interviewer</div>
        </div>
        <div className="text-gray-200 text-base">
          {currentQuestion ? `Asking: ${currentQuestion}` : "Ready to begin the interview"}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;