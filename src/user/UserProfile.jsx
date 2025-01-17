import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const demoUser = {
    _id: "674224fa65abd747ee033a61",
    email: "guptasatyamml@gmail.com",
    name: "Satyam",
    password: "********",
    profileimage: "assets/user (1).png",
    college: "Ajay Kumar Garg Engineering College",
    branch: "CSE",
    specialization: "AI & ML",
    year: "4",
    resume: "resume/file-674224fa65abd747ee033a61-1735240195289.pdf",
    coins: 5683,
    interest: "Artificial Intelligence",
    interview: [
      { interview_id: "001", result: 7.5 },
      { interview_id: "002", result: 8.2 },
      { interview_id: "003", result: 6.8 },
    ],
  };

  const [user, setUser] = useState(demoUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signup");
        return;
      }
      try {
        const response = await axios.get("https://15.206.133.74/user/getinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden p-4 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6">
          <img
            src={`/${user.profileimage}`}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-blue-300 object-cover"
          />
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-base md:text-lg text-gray-600 mt-1">{user.college}</p>
            <p className="text-sm md:text-lg text-gray-600">{user.branch}</p>
            <a
              href={`/${user.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base mt-3 inline-block bg-blue-600 text-white px-2 md:px-4 py-2 rounded-md hover:bg-blue-700"
            >
              📄 Download Resume
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-6 px-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg md:text-2xl font-bold text-blue-600">{user.coins}</h4>
            <p className="text-gray-500">Coins Earned</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg md:text-2xl font-bold text-blue-600">
              {user.specialization}
            </h4>
            <p className="text-gray-500">Specialization</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg md:text-2xl font-bold text-blue-600">
              {user.interest}
            </h4>
            <p className="text-gray-500">Interest</p>
          </div>
        </div>

        {/* Interview Results */}
        <div className="mt-8">
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">
            📊 Interview Results
          </h3>
          <div className="overflow-hidden border rounded-lg shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-center">Interview ID</th>
                  <th className="px-2 md:px-4 py-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {user.interview.map((interview, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-1 md:px-4 text-xs md:text-base py-3 text-center font-medium">
                      {interview.interview_id}
                    </td>
                    <td className="px-1 md:px-4 text-sm md:text-base py-3 text-center">
                      {interview.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-right space-x-2 md:space-x-6 mt-8">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signup");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
