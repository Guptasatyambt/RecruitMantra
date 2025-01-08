import React, { useState } from 'react'

function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: '5', // Default rating
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback Submitted:', formData);
    setSubmitted(true);
    // Add API call here if needed
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">We Value Your Feedback</h2>
      <p className="text-center text-gray-500 mb-8">
        Help us improve by sharing your thoughts!
      </p>
      <img className="size-24 mx-auto my-5" alt="Recruit-Mantra-Logo" src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png" />
      {submitted ? (
        <p className="text-green-600 text-center font-medium text-lg">
          Thank you for your feedback! We appreciate your time.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Feedback Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Feedback</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Share your thoughts"
              rows="4"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Rating Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rate Us</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback