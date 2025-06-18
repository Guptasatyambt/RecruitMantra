import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, User, Mail, MessageSquare, Star } from "lucide-react";
import { FaStar } from "react-icons/fa"; // For star rating

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: 0, // Default rating (0 means no stars selected)
  });

  const [submitted, setSubmitted] = useState(false);
  const [interviewId, setInterviewId] = useState(useParams().id);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
    setSubmitted(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.recruitmantra.com/feedback/uploadfeedback",
        {
          userFeedback: formData.feedback,
          // rating: formData.rating, // Include the rating in the API call
        },
        { headers: { Authorization: `Bearer ${token}` } }

      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer text-3xl ${
            i <= formData.rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };

  // Function to display rating text
  const getRatingText = () => {
    switch (formData.rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate Us";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            We Value Your Feedback
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us improve by sharing your thoughts!
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Left Side - Logo and Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <img
                    className="w-32 h-32 mx-auto mb-8"
                    alt="Recruit-Mantra-Logo"
                    src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
                  />
                  <h3 className="text-2xl font-semibold mb-6">Your Opinion Matters</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5" />
                      <span>support@recruitmantra.com</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-gray-300 text-sm">
                  We appreciate your time and feedback.
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-8">
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-semibold text-green-600 mb-2">Thank You!</p>
                    <p className="text-gray-600">Your feedback has been submitted successfully.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                      required
                    />
                  </div>

                  {/* Feedback */}
                  <div className="relative group">
                    <div className="absolute top-3 left-4 pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                    </div>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      placeholder="Your Feedback"
                      rows="4"
                      className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg resize-none"
                      required
                    />
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Rate Us</label>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars()}</div>
                      <span className="text-lg font-semibold text-gray-700">
                        {getRatingText()}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <span>Submit Feedback</span>
                    <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;