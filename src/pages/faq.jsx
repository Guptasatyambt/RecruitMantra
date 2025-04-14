import React, { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'What is RecruitMantra?',
      answer:
        'RecruitMantra is an AI-powered platform designed to simulate mock interviews based on your resume. It helps improve communication, confidence, and readiness for real interviews.',
    },
    {
      question: 'How does RecruitMantra work?',
      answer:
        'You upload your resume, and our AI analyzes it to generate domain-specific interview questions. The platform then conducts a virtual mock interview and provides performance feedback on your confidence, accuracy, and body language.',
    },
    {
      question: 'Is RecruitMantra free to use?',
      answer:
        'We offer both free and premium plans. The free version includes limited mock interviews and basic feedback, while premium users get detailed analytics, unlimited sessions, and personalized insights.',
    },
    {
      question: 'What kind of feedback do I receive?',
      answer:
        'You’ll get insights into: Accuracy of your answers, Confidence level (based on tone and delivery), Eye contact and neck movement (via webcam analysis), Suggestions for improvement.',
    },
    {
      question: 'Is my video and personal data secure?',
      answer:
        'Absolutely. All interview videos and personal data are securely stored in AWS S3 with access control. We never share your data without your consent.',
    },
    {
      question: 'Can I choose the domain or job role for the mock interview?',
      answer:
        'Yes! Based on your resume, the AI suggests relevant roles, but you can also manually choose or change your target job domain.',
    },
    {
      question: 'Do I need to install any software?',
      answer:
        'No installation is needed. RecruitMantra works directly from your browser or our mobile app, available for Android and iOS.',
    },
    {
      question: 'Will the interview have a real interviewer?',
      answer:
        'RecruitMantra uses advanced AI to simulate interviewers with realistic prompts, follow-up questions, and voice interactions – no human interviewers involved.',
    },
    {
      question: 'Can I review my previous interviews?',
      answer:
        'Yes, you can access and replay your recorded interview sessions anytime through your dashboard.',
    },
    {
      question: 'Who can use RecruitMantra?',
      answer:
        'Anyone preparing for job interviews – students, freshers, professionals switching careers, or anyone who wants to boost their confidence and performance.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer transition"
            onClick={() => toggleFAQ(index)}
          >
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            {openIndex === index && (
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
