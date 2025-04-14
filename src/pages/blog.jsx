import React from 'react';

const blogs = [
  {
    title: '10 AI Tools to Improve Your Interview Prep',
    category: 'Tech Tools',
    date: 'April 12, 2025',
    summary: 'Explore the top AI-powered tools that can help you enhance your interview skills, from mock interviews to resume review.',
    image: 'https://via.placeholder.com/600x300',
    link: '#'
  },
  {
    title: 'How to Structure STAR Answers',
    category: 'Interview Tips',
    date: 'March 30, 2025',
    summary: 'Learn how to use the STAR method (Situation, Task, Action, Result) to craft compelling responses during interviews.',
    image: 'https://via.placeholder.com/600x300',
    link: '#'
  },
  {
    title: 'From Nervous to Confident: How RecruitMantra Helped Me Get Hired',
    category: 'User Stories',
    date: 'March 20, 2025',
    summary: 'A real user story of how RecruitMantra helped someone overcome anxiety and land their dream job.',
    image: 'https://via.placeholder.com/600x300',
    link: '#'
  },
  {
    title: 'Will AI Replace Human Interviewers?',
    category: 'AI in Recruitment',
    date: 'February 18, 2025',
    summary: 'A thoughtful discussion on the role of AI in recruitment and whether it will replace traditional interviewers.',
    image: 'https://via.placeholder.com/600x300',
    link: '#'
  }
];

const BlogPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">RecruitMantra Blog</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <span className="text-sm text-blue-500 font-medium">{blog.category}</span>
              <h2 className="text-2xl font-semibold text-gray-800 mt-2">{blog.title}</h2>
              <p className="text-gray-600 mt-2 text-sm">{blog.date}</p>
              <p className="text-gray-700 mt-4">{blog.summary}</p>
              <a
                href={blog.link}
                className="inline-block mt-4 text-blue-600 hover:underline font-medium"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;