import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const JobDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        resumeLink: ""
    });

    useEffect(() => {
        async function fetchJob() {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5001/job/career/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Typical format
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch jobs");
                }
                console.log(response)
                const responseData = await response.json();
                console.log(responseData)
                const jobsData = responseData.data;
                setJob(jobsData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        }
        
        fetchJob();
    }, [id]);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });


    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
    if (!job) return <div className="text-center py-20 text-red-500">Job not found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 py-16 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.Title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p><span className="font-semibold">Location:</span> {job.Location}</p>
                    <p><span className="font-semibold">Mode:</span> {job.Mode}</p>
                    <p><span className="font-semibold">Openings:</span> {job.NoOfOpenning}</p>
                </div>
                <div>
                    <p><span className="font-semibold">Experience:</span> {job.Experience} years</p>
                    <p><span className="font-semibold">Package:</span> ₹{job.Package} LPA</p>
                    <p><span className="font-semibold">Skills:</span> {Array.isArray(job.skills) ? job.skills.join(", ") : "N/A"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <p><span className="font-semibold">Release Date:</span> {formatDate(job.ReleaseDate)}</p>
                <p><span className="font-semibold">Last Date:</span> {formatDate(job.LasTDayofApplication)}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Job Description</h2>
                <p className="text-gray-700">{job.jd}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Key Responsibilities</h2>
                <p className="text-gray-700">{job.KeyResponcibility}</p>
            </div>

            <button
                onClick={()=>navigate(`/apply/${job._id}`)}
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full transition"
            >
                Apply Now
            </button>

        </div>
    );
};

export default JobDetails;
