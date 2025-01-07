import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InterviewDetails = () => {
  const interviewId = useParams().id;
  console.log(interviewId);

  const [details, setDetails] = useState();
  const [videos, setVideos] = useState();

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://15.206.133.74/interview/getdetail?interview_id=${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setDetails(response.data.interview);
      setVideos(response.data.videos);
      console.log(details);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);
  if (details === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-evenly items-center md:flex-row md:gap-6">
        <div className="flex-shrink-0">
          <img
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
            alt="RecruitMantra"
            className="rounded-full w-40 h-40"
          />
        </div>
        {/* Details Section */}
        <div className="mt-4 md:mt-0 text-center md:text-left">
          <h2 className="text-xl font-bold">Interview Details</h2>
          <div className="grid grid-cols-2 text-center gap-4 mt-4 text-gray-700">
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold w-40">Result</p>
              <p>{details.Result}</p>
            </div>
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold w-40">Confidence</p>
              <p>{details.overallConfidence}</p>
            </div>
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold w-40">Level</p>
              <p>{details.level}</p>
            </div>
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold w-40">Accuracy</p>
              <p>{details.overallAccuracy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accuracy Graph */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-semibold mb-2">Accuracy Graph</h3>
            <img
              src="https://via.placeholder.com/300x200"
              alt="Accuracy Graph"
              className="w-full"
            />
          </div>

          {/* Confidence Graph */}
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-semibold mb-2">Confidence Graph</h3>
            <img
              src="https://via.placeholder.com/300x200"
              alt="Confidence Graph"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div>
        {videos.map((video, index) => (
          <>
            <h2 className="text-xl font-bold my-4">Question-{parseInt(video.question) + 1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                <video controls>
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col justify-center items-center gap-4">
                <div className="border-2 w-40 border-black rounded-md p-2">
                  <p className="font-semibold">Confidence</p>
                  <p>2.1</p>
                </div>
                <div className="border-2 w-40 border-black rounded-md p-2">
                  <p className="font-semibold">Accuracy</p>
                  <p>2.1</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default InterviewDetails;
