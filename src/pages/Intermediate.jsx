import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiWifi, FiAlertTriangle, FiMic, FiVideo } from "react-icons/fi";

function Intermediate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const responseUser = await axios.get("http://localhost:5001/user/getinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(responseUser.data.user.profileimage===""){
          navigate("/upload-documents");
      }
      const resumeUrl = responseUser.data.resume;
      console.log("Resume URL:", resumeUrl);
      
      if (!resumeUrl && responseUser.data.user.role==='college_admin') {
        setError("This feature is only for students")
        console.error("No resume URL found");
        setIsLoading(false);
        return;
      }
      if (!resumeUrl) {
        setError("Upload resume first and then try again")
        console.error("No resume URL found");
        setIsLoading(false);
        return;
      }
      const response = await axios.post(
        "http://localhost:5001/interview/start",
        { level: "intermediate" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/interview/intermediate/${response.data.data.id || "123"}`, { replace: true });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-8">
      {/* Error Message */}
                    {error ? (
                      <motion.div
                        className="mt-4 bg-red-100 text-red-600 text-center py-2 px-4 rounded-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {error}
                      </motion.div>
                    ):(
                    <>
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8">
        {/* Left Section - Image Card */}
        <motion.div
          className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-xl transition-shadow duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="p-8 space-y-6">
            <motion.h1
              className="text-4xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Intermediate Interview Mode
            </motion.h1>
            <div className="relative overflow-hidden rounded-xl border-2 border-gray-100">
              <img
                src="/assets/intermediate.png" 
                alt="Intermediate Interview"
                className="w-full h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                Simulation Environment
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Instructions */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            <motion.h2
              className="text-3xl font-bold text-gray-900 text-center"
              variants={itemVariants}
            >
              Key Instructions
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 text-lg"
              variants={itemVariants}
            >
              Follow these guidelines for a seamless interview experience
            </motion.p>
          </div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
          >
            {[
              { icon: FiClock, text: "Spend at least 10 seconds on each question" },
              { icon: FiWifi, text: "Ensure a stable and strong internet connection" },
              { icon: FiAlertTriangle, text: "Avoid quitting the interview midway to prevent penalties" },
              { icon: FiMic, text: "Speak clearly and ensure good audio quality" },
              { icon: FiVideo, text: "Keep the camera focused on your face for better results" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                variants={itemVariants}
                whileHover={{ translateX: 5 }}
              >
                <item.icon className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="w-full max-w-md py-5 px-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-90 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  <span>Starting Interview...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span>Start Intermediate Interview</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </button>
          </motion.div>

          <motion.p
            className="text-center text-gray-500 text-sm"
            variants={itemVariants}
          >
            By continuing, you agree to our terms and conditions
          </motion.p>
        </motion.div>
      </div>
      </>
                    )}
    </div>
  );
}

export default Intermediate;