import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "satyam",
    email: "guptasatyamml@gmail.com",
    college: "Ajay Kumar Garg Engineering College",
    branch: "CSE",
    specialization: "None",
    year: "4",
    interest: "none",
    profileimage: null,
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the profile image upload URL
      const profileImageUrlResponse = await axios.post(
        "https://api.recruitmantra.com/user/updateimage",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Upload profile image
      if (formData.profileimage) {
        const profileImageUploadUrl = profileImageUrlResponse.data.data.profile;
        const imageFormData = new FormData();
        imageFormData.append("file", formData.profileimage);

        await axios.put(profileImageUploadUrl, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Get the resume upload URL
      const resumeUrlResponse = await axios.post(
        "https://api.recruitmantra.com/user/updateresume",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Upload resume
      if (formData.resume) {
        const resumeUploadUrl = resumeUrlResponse.data.data.resume;

        const fileBytesResume = await formData.resume.arrayBuffer(); // Convert file to ArrayBuffer
        await axios.put(resumeUploadUrl, fileBytesResume, {
          headers: {
            "Content-Type": "application/pdf", // Correct MIME type for resume
          },
        });
      }

      // Update year
      await axios.post(
        "https://api.recruitmantra.com/user/updateyear",
        { year: formData.year },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-12 mb-10 border-t-4 border-blue-600">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div className="form-group">
          <label className="text-gray-800 text-lg font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
          />
        </div>

        {/* Add other input fields as per your code */}
        {/* Profile Image */}
        <div className="form-group">
          <label className="text-gray-800 text-lg font-semibold">Profile Image</label>
          <input
            type="file"
            name="profileimage"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Resume */}
        <div className="form-group">
          <label className="text-gray-800 text-lg font-semibold">Resume</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
