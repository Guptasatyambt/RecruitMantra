import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: "5", // Default rating
  });

  const [submitted, setSubmitted] = useState(false);
  const [interviewId, setInterviewId] = useState(useParams().id);
  const navigate = useNavigate();
  console.log(interviewId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
    setSubmitted(true);
    try {
      const response = await axios.post(
        "https://15.206.133.74/feedback/uploadfeedback",
        {
          userFeedback: formData.feedback,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-4 p-6 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200 sm:p-6 md:p-8 lg:p-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 sm:text-3xl lg:text-4xl">
        We Value Your Feedback
      </h2>
      <p className="text-center text-gray-500 mb-8 sm:text-sm md:text-base lg:text-lg">
        Help us improve by sharing your thoughts!
      </p>
      <img
        className="sm:w-20 sm:h-20 mx-auto my-5 w-0 h-0 md:w-24 md:h-24"
        alt="Recruit-Mantra-Logo"
        src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
      />
      {submitted ? (
        <div className="flex flex-col items-center">
          <p className="text-green-600 text-center font-medium text-base sm:text-lg lg:text-xl">
            Thank you for your feedback! We appreciate your time.
          </p>
          {interviewId ? (
            <button
              type="button"
              className="text-center mt-6 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1 sm:py-2 lg:py-4"
              onClick={() => {
                navigate(`/interview-details/${interviewId}`);
              }}
            >
              Result
            </button>
          ) :
          <button
              type="button"
              className="text-center mt-6 px-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1 sm:py-2"
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home
            </button>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Your Feedback
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Share your thoughts"
              rows="4"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Rate Us
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1 sm:py-2 lg:py-4"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}

export default Feedback;
