import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CollegeAdminSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", 
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    collegeName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // New state variables for college dropdown
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Fetch colleges from API on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("https://api.recruitmantra.com/college");
        setColleges(response.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  // Filter colleges based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredColleges(colleges.slice(0, 10)); // Show first 10 colleges when no search term
    } else {
      const filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredColleges(filtered.slice(0, 10)); // Limit to 10 results
    }
  }, [searchTerm, colleges]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Handle college search
    if (name === "college") {
      setSearchTerm(value);
      setShowDropdown(true);
    }
  };

  const handleCollegeSelect = (collegeId, collegeName) => {
    setFormData({
      ...formData,
      college: collegeId,
      collegeName: collegeName
    });
    setShowDropdown(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate password
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain at least one special character.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate other fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.college) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.recruitmantra.com/user/register-college-admin", 
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          collegeId: formData.college
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "An error occurred during sign-up."
      );
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

      {/* Signup Card */}
      <motion.div
        className="relative bg-white shadow-lg rounded-2xl px-8 py-12 w-full max-w-md border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register as College Admin
        </h2>

        {/* Success Message */}
        {success && (
          <motion.div
            className="mt-4 bg-green-100 text-green-600 text-center py-2 px-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Registration successful! Your account is pending approval from super admin. You will be redirected to login page.
          </motion.div>
        )}

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

        <form onSubmit={handleSignUp} className="mt-6 space-y-6">
          {/* Name Fields - Horizontal Layout */}
          <div className="flex space-x-4">
            {/* First Name Field */}
            <div className="relative flex-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your first name"
                required
              />
              <label
                htmlFor="firstName"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                First Name
              </label>
            </div>
            
            {/* Last Name Field */}
            <div className="relative flex-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your last name"
                required
              />
              <label
                htmlFor="lastName"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                Last Name
              </label>
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          {/* College Field with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.collegeName}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
              className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
              placeholder="Search for your college"
              autoComplete="off"
              required
            />
            <label
              htmlFor="college"
              className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
            >
              College Name
            </label>
            
            {/* College Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                      onClick={() => handleCollegeSelect(college._id, college.name)}
                    >
                      {college.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    {searchTerm.trim() !== "" ? "No colleges found" : "Start typing to search colleges"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
              placeholder="Confirm your password"
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
            >
              Confirm Password
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
            {loading ? "Signing Up..." : "Register as College Admin"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a className="text-gray-700 hover:underline" href="/login">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default CollegeAdminSignUp;