import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Career = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedRange, setSelectedRange] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const salaryFilters = [
    { label: "All", range: null },
    { label: "< ₹5L", range: [0, 5] },
    { label: "₹5L – ₹10L", range: [5, 10] },
    { label: "> ₹10L", range: [10, Infinity] },
  ];

  // Mock API call
  useEffect(() => {
    async function fetchJobs() {
      try {
        const token = localStorage.getItem('token'); // or however you store your token
    
        const response = await fetch("http://localhost:5001/job/career", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Typical format
            "Content-Type": "application/json"
          }
        });
        // console.log(await response.json())
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        
        const responseData = await response.json();
        const jobsData = responseData.data;
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    

    fetchJobs();
  }, []);

  // Filtering logic
  useEffect(() => {
    if (selectedRange === "All") {
      setFilteredJobs(jobs);
    } else {
      const [min, max] = salaryFilters.find(f => f.label === selectedRange).range;
      const filtered = jobs.filter(job => job.package >= min && job.package < max);
      setFilteredJobs(filtered);
    }
  }, [selectedRange, jobs]);

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Parallax Hero Section */}
    <motion.section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?auto=format&fit=crop&w=1920')] bg-cover bg-center"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Grow
            </span>
            <br />
            With RecruitMantra
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          Join us to power and protect life online by solving the toughest challenges together.
          </p>
        </motion.div>
      </div>
    </motion.section>


    <div className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Filter Sidebar */}
        <div className="col-span-1">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Filter by Salary</h3>
          <ul className="space-y-4">
            {salaryFilters.map((filter) => (
              <li
                key={filter.label}
                onClick={() => setSelectedRange(filter.label)}
                className={`cursor-pointer px-4 py-2 rounded-lg ${
                  selectedRange === filter.label
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-amber-500 hover:text-white transition`}
              >
                {filter.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Job Cards */}
        <div className="col-span-1 md:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 rounded-2xl border-2 border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-amber-600 text-xl font-semibold mb-2">{job.title}</div>
              <div className="text-gray-800 font-medium mb-2">Experience: {job.experience}</div>
              <div className="text-sm text-gray-600 mb-2">Location: {job.location}</div>
              <div className="text-sm text-gray-500 mb-1">Salary: ₹{job.package}LPA</div>
              <div className="text-sm text-gray-500 mb-1">Release Date: {new Date(job.release_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}</div>
              <div className="text-sm text-gray-500 mb-1">Responcibility: {job.Responcibility}</div>
              <div className="mt-4">
              <button
              onClick={() =>{
                navigate(`/job/${job.id}`);
                // fetchJobDetails(job.id)
              }}
              className="mt-12 inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Apply Now →
            </button>
            
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
    </div>
  );
};

export default Career;
