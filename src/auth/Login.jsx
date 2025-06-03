import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.recruitmantra.com/user/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      const token = response.data.data.token;
      const role = response.data.data.role;
      
      localStorage.setItem("token", token);
      
      // Redirect based on role
      if (role === 'super_admin') {
        navigate("/admin-dashboard");
      } else if (role === 'college_admin') {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      
       window.location.reload(); // Adjust the route as per your app's flow
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.recruitmantra.com/user/forgot-password",
        {
          email: forgotPasswordEmail,
        }
      );

      console.log(response.data);
      alert("Password reset instructions have been sent to your email.");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 px-6 md:px-20 py-10">
      {/* Logo */}
      <div className="hidden md:flex justify-start mb-8 w-1/2">
        <motion.img
          className="w-80 lg:w-90"
          src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-transparent+(1).png"
          alt="Logo"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="relative bg-white shadow-lg rounded-2xl px-8 py-12 w-full max-w-md border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {showForgotPassword ? "Forgot Password" : "Login to Your Account"}
        </h2>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mt-4 bg-red-100 text-red-600 text-center py-2 px-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="mt-6 space-y-6">
            <div className="relative">
              <input
                type="email"
                id="forgotPasswordEmail"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your email"
                required
              />
              <label
                htmlFor="forgotPasswordEmail"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-md transition-all transform duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800 hover:scale-105 shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Remember your password?{" "}
              <button
                type="button"
                className="text-gray-700 hover:underline"
                onClick={() => setShowForgotPassword(false)}
              >
                Login
              </button>
            </p>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="mt-6 space-y-6">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                Email
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your password"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                Password
              </label>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center text-gray-600 mt-3">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="showPassword" className="text-sm cursor-pointer">
                Show Password
              </label>
            </div>

            {/* Forgot Password Link */}
            <button
              type="button"
              className="text-sm text-gray-700 hover:underline"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-md transition-all transform duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800 hover:scale-105 shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
        )}

        {/* SignUp Links */}
        {!showForgotPassword && (
          <div className="text-sm text-gray-600 mt-4 text-center space-y-2">
            <p>
              Don't have an account?{" "}
              <a className="text-gray-700 hover:underline" href="/signup">
                Sign Up as Student
              </a>
            </p>
            <p>
              Are you a college administrator?{" "}
              <a className="text-gray-700 hover:underline" href="/college-admin-signup">
                Register as College Admin
              </a>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;