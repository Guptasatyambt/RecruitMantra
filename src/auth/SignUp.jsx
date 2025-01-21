import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters long.");
    //   return;
    // }

    // // Simple validation for matching passwords
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }
    const validationErrors = [];
    if (value.length < 8) {
      validationErrors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(value)) {
      validationErrors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(value)) {
      validationErrors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(value)) {
      validationErrors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      validationErrors.push("Password must contain at least one special character.");
    }
    setErrors(validationErrors);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://api.recruitmantra.com/user/signin", {
        email,
        password,
      });

      console.log(response.data);

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      navigate("/email-verification", { state: { token: token } });
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
    <div className="flex flex-col md:flex-row min-h-screen px-10 md:px-40 space-y-8 items-center justify-center bg-gray-100">
      <div className="md:w-1/2">
        <img
          className="w-[60%] hidden md:block ml-12"
          src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-transparent+(1).png"
          alt="Signup image"
        />
      </div>
      <div className="md:w-1/2 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Display error message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className={`w-full bg-amber-800 text-white p-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-900"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
