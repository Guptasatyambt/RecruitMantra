import React from 'react';

const InterviewTips = () => {
  const tips = [
    {
      title: 'Know Your Resume Inside Out',
      description:
        'Be prepared to explain every line on your resume. Be honest—don’t fake projects or skills. If asked, you should confidently talk about the tech stack, challenges, and your contributions.'
    },
    {
      title: 'Research the Company & Role',
      description:
        'Understand the company’s mission, values, and products. Read the job description carefully and connect your skills to the role.'
    },
    {
      title: 'Practice Common Questions',
      description:
        'Prepare for: “Tell me about yourself.”, “What are your strengths and weaknesses?”, “Why do you want to work here?” Use STAR Method (Situation, Task, Action, Result) for behavioral questions.'
    },
    {
      title: 'Use Mock Interviews (like RecruitMantra!)',
      description:
        'Practice in a simulated environment. Focus on: Eye contact, Clarity in speech, Structured answers.'
    },
    {
      title: 'Communicate Clearly',
      description:
        'Avoid filler words like “uh,” “um,” or “you know.” Be confident but not arrogant. Smile and stay calm.'
    },
    {
      title: 'Know the Fundamentals',
      description:
        'For tech roles: Focus on DSA, core CS concepts (OOP, DBMS, OS, Networks). For non-tech: Know your field basics and industry trends.'
    },
    {
      title: 'Watch Your Body Language',
      description:
        'Sit upright and maintain a confident posture. Nod occasionally to show you\'re engaged.'
    },
    {
      title: 'Prepare Questions to Ask',
      description:
        '“What does a typical day look like?”, “What are the team’s goals for this year?” It shows you\'re interested and proactive.'
    },
    {
      title: 'Be Ready for Practical Tests',
      description:
        'Some interviews may include live coding, aptitude, or task-based assessments. Practice under pressure.'
    },
    {
      title: 'Follow Up',
      description:
        'Send a polite thank-you email or message after the interview. It leaves a lasting impression.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Top Interview Tips</h1>
      <div className="space-y-6">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-5 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-blue-600">{index + 1}. {tip.title}</h2>
            <p className="text-gray-700 mt-2">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewTips;