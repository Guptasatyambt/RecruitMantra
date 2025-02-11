import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Intermediate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.recruitmantra.com/interview/start",
        {
          level: "intermediate",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data.id);

      navigate(
        `/interview/intermediate/${response.data.data.id || "123"}`,
        { replace: true }
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row justify-center items-center gap-8 py-8 px-4 sm:px-8">
      {/* Left Section - Image and Title */}
      <motion.div
        className="w-full lg:w-1/2 max-w-2xl bg-white rounded-2xl shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
          variants={itemVariants}
        >
          Intermediate
        </motion.h2>
        <motion.img
          className="w-full h-auto rounded-lg"
          src="assets/beginnerPage.jpg"
          alt="Intermediate Page"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>

      {/* Right Section - Instructions and Button */}
      <motion.div
        className="w-full lg:w-1/2 max-w-2xl bg-white rounded-2xl shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl lg:text-4xl font-semibold text-gray-800 text-center mb-6"
          variants={itemVariants}
        >
          Key Instructions
        </motion.h2>
        <motion.ol
          className="space-y-4 text-gray-700 text-lg border-l-4 border-gray-300 pl-6"
          variants={containerVariants}
        >
          {[
            "Spend at least 10 seconds on each question.",
            "Ensure you have a stable and strong internet connection.",
            "Avoid pressing back or quitting the interview midway to prevent penalties.",
            "Try to answer every question for better results.",
            "Keep the camera focused on your face and speak clearly for better results.",
          ].map((instruction, index) => (
            <motion.li key={index} variants={itemVariants}>
              <span className="font-semibold">{index + 1}.</span> {instruction}
            </motion.li>
          ))}
        </motion.ol>
        <motion.button
          className="w-full mt-8 py-4 bg-gray-800 text-white text-xl md:text-2xl font-semibold rounded-xl shadow-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          onClick={handleStartInterview}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Starting...</span>
            </div>
          ) : (
            "Start Interview"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Intermediate;