import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const JobApplicationForm = () => {
  const { id } = useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    state: "",
    city: "",
    address: "",
    high_school_board: "",
    high_school_percentage: "",
    intermidiate_board: "",
    intermidiate_percentage: "",
    UG_percentage: "",
    college: "",
    branch: "",
    passing_year: "",
    specialization: "",
    skills: "",
    position: "",
  });

  useEffect(() => {

      async function fetchJob() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch(`https://api.recruitmantra.com/job/career/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Typical format
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }
            const responseData = await response.json();
            const jobsData = responseData.data;
            setJobTitle(jobsData.Title);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
    }
    
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setResumeFile(file);
    } else {
      alert("Please upload a valid resume file (PDF, DOC, DOCX)");
      setResumeFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const token = localStorage.getItem('token');
    // POST to your backend uploadresume
    fetch("https://api.recruitmantra.com/carrer/apply", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, // Typical format
        "Content-Type": "application/json"
        },
      body: JSON.stringify({ ...formData, id }),
    })
      .then(res => res.json())
      .then(data => {
        alert("Application submitted!");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Apply for {jobTitle || "this position"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} required className="border p-2 rounded" />
        <select name="gender" onChange={handleChange} required className="border p-2 rounded">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input type="text" name="state" placeholder="State" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="city" placeholder="City" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="border p-2 rounded col-span-full" />

        {/* Academic Info */}
        <input type="text" name="high_school_board" placeholder="High School Board" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="high_school_percentage" placeholder="High School %" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="intermidiate_board" placeholder="Intermediate Board" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="intermidiate_percentage" placeholder="Intermediate %" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="UG_percentage" placeholder="UG %" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="college" placeholder="College Name" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="branch" placeholder="Branch" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="passing_year" placeholder="Passing Year" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} className="border p-2 rounded" />

        {/* Job Info */}
        <input type="text" name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className="border p-2 rounded col-span-full" />
        <input type="text" name="position" placeholder="Position Applying For" onChange={handleChange} className="border p-2 rounded col-span-full" />
        {/* Resume Upload */}
        <div className="col-span-full">
          <label className="block text-gray-700 font-medium mb-2">Upload Resume (PDF/DOC/DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {resumeFile && <p className="mt-2 text-sm text-gray-600">Selected: {resumeFile.name}</p>}
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white py-2 px-4 rounded col-span-full hover:bg-amber-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
