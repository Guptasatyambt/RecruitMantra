import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error message

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Simple validation for matching passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://15.206.133.74/user/signin", {
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
          src="https://internview-assets.s3.ap-south-1.amazonaws.com/RecruitMantra_with_black_BG.jpg"
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
              type="password"
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
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
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
