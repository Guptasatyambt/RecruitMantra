import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    confirmPassword: "",
    college: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  let finalCollegeId;
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [customCollege,setCustomCollege] = useState("");
  const [isOtherCollege,setIsOtherCollege] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
  const fetchColleges = async () => {
    try {
      const response = await API.get("/college/all"); // Replace with your actual endpoint
      setColleges(response.data); // Adjust based on API response
    } catch (err) {
      console.error("Error fetching colleges", err);
    }
  };

  fetchColleges();
}, []);

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
  };
const handleCollegeSelect = (collegeId, collegeName) => {
  if (collegeId === "other") {
    setFormData({
      ...formData,
      college: "",
      collegeName: "Other"
    });
    setSearchTerm("Other");
    setIsOtherCollege(true)
  } else {
    setFormData({
      ...formData,
      college: collegeId.id,
      collegeName: collegeName
    });
    setSelectedCollegeId(collegeId.id);
    setSearchTerm(collegeName); // show selected value in input
  }
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
    setLoading(true);
    setError("");
    try{
      finalCollegeId = selectedCollegeId;
      console.log(finalCollegeId, formData.otherCollegeName, isOtherCollege)
      if (isOtherCollege) {
      const collegeRes = await API.post("/college/", {
        name: formData.otherCollegeName
      });
      finalCollegeId = collegeRes.data._id; // Adjust based on your API
      // console.log(collegeRes)
      // setSelectedCollegeId(collegeRes.data._id);
      console.log(finalCollegeId)
    }
    }catch(e){
      console.error("Signup Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "An error occurred during sign-up."
      );
    }finally{
      setLoading(false);
    }
    // Validate other fields
    if (!formData.firstName||!formData.lastName || !formData.email || (!finalCollegeId && !formData.otherCollegeName)) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.post(
        "/user/register-default",
        {
          firstName: formData.firstName,
          lastName:formData.lastName,
          email: formData.email,
          password: formData.password,
          collegeId: finalCollegeId
        }
      );
      
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      navigate("/email-verification?source=default", { state: { token: token } });
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
          Create an Account
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

        <form onSubmit={handleSignUp} className="mt-6 space-y-6">
          {/* firstName Field */}
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
              placeholder="Enter your full name"
              required
            />
            <label
              htmlFor="firstName"
              className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
            >
              First Name
            </label>
        </div>

          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
              placeholder="Enter your full name"
              required
            />
            <label
              htmlFor="lastName"
              className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
            >
              Last Name
            </label>
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
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

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredColleges.length > 0 ? (
                  <>
                    {filteredColleges.map((college, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                        onClick={() =>
                          handleCollegeSelect({ id: college._id }, college.name)
                        }
                      >
                        {college.name}
                      </div>
                    ))}
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm font-medium border-t"
                      onClick={() => handleCollegeSelect("other", "Other")}
                    >
                      My college is not listed
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-gray-600 text-sm">
                      {searchTerm.trim() !== ""
                        ? "No colleges found"
                        : "Start typing to search colleges"}
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm font-medium border-t"
                      onClick={() => handleCollegeSelect("other", "Other")}
                    >
                      My college is not listed
                    </div>
                  </>
                )}
              </div>
            )}
          </div>


          {formData.collegeName === "Other" && (
            <div className="relative mt-4">
              <input
                type="text"
                name="otherCollegeName"
                value={formData.otherCollegeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, otherCollegeName: e.target.value })
                }
                className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-500 transition-all px-2 py-3"
                placeholder="Enter your college name"
                required
              />
              <label
                htmlFor="otherCollegeName"
                className="absolute left-2 top-3 text-gray-500 text-sm transition-all transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-gray-700"
              >
                Enter College Name
              </label>
            </div>
          )}
          
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-sm text-gray-600 mt-4 text-center space-y-2">
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a className="text-gray-700 hover:underline" href="/login">
            Login
          </a>
        </p>
        <p>
          Are you a college administrator?{" "}
          <a
            className="text-blue-700 hover:underline"
            href="/college-admin-signup"
          >
            Register as College Admin
          </a>
          </p>
          </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
