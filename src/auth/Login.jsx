import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
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
      localStorage.setItem("token", token);
      navigate("/");
      window.location.reload(); // Adjust the route as per your app's flow
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 px-6 md:px-20 py-10">
      {/* Logo */}
      <div className="hidden md:flex justify-start mb-8 w-1/2">
        <img
          className="w-80 lg:w-90"
          src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-transparent+(1).png"
          alt="Logo"
        />
      </div>

      {/* Login Card */}
      <div className="relative bg-white bg-opacity-60 backdrop-blur-md shadow-xl rounded-3xl px-8 py-12 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Login to Your Account</h2>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-500 text-white text-center py-2 px-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-gray-600 text-black placeholder-transparent focus:outline-none focus:border-amber-500 transition-all px-2 py-3"
              placeholder="Enter your email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-2 top-3 text-gray-600 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-amber-500"
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
              className="peer w-full bg-transparent border-b-2 border-gray-600 text-black placeholder-transparent focus:outline-none focus:border-amber-500 transition-all px-2 py-3"
              placeholder="Enter your password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-2 top-3 text-gray-600 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-amber-500"
            >
              Password
            </label>
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center text-black mt-3">
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-md transition-all transform duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 hover:scale-105 shadow-lg"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* SignUp Link */}
        <p className="text-sm text-gray-700 mt-4 text-center">
          Don't have an account?{" "}
          <a className="text-amber-500 hover:underline" href="/signup">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
