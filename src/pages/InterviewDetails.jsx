import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LineGraph from "../components/LineChart";  

const InterviewDetails = () => {
  const interviewId = useParams().id;
  const navigate = useNavigate();

  const [details, setDetails] = useState();
  const [videos, setVideos] = useState();
  const location = useLocation();
  const hasNavigated = useRef(false);

  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  console.log(source)

  const type=queryParams.get("type");
  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      let response;
      if(type==='Technical'){
        response = await axios.get(
        `https://api.recruitmantra.com/interview/getdetail?interview_id=${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true,
        }
        );
      }
      else if(type==='HR'){
        response = await axios.get(
        `https://api.recruitmantra.com/hrInterview/getdetail?interview_id=${interviewId}&&type=Hr`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true,
        }
        );
      }
      else if(type==='Managerial'){
        response = await axios.get(
        `https://api.recruitmantra.com/hrInterview/getdetail?interview_id=${interviewId}&&type=Managerial`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true,
        }
        );
      }
      else{
        response = await axios.get(
          `https://api.recruitmantra.com/series/getinfo?interview_id=${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // withCredentials: true,
          }
        );
      }
      setDetails(response.data.interview);
      setVideos(response.data.videos);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDetails();
  //   console.log(hasNavigated.current);
  //   if (source === "interview"&& !hasNavigated.current) {
  //     hasNavigated.current = !hasNavigated.current;
  //     const timer = setTimeout(() => {
  //     navigate("/overlay-feedback");
  //   }, 1000); // 1 second = 1000 ms

  //   return () => clearTimeout(timer); // cleanup if component unmounts
  // }
  }, [source, navigate]);
  if (details === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-gray-100 p-6 space-y-8">
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
              <p className="font-semibold">Result</p>
              <p>{details.Result.toFixed(2)}</p>
            </div>
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold">Confidence</p>
              <p>{details.overallConfidence.toFixed(2)}</p>
            </div>
            <div className="border-2 border-black rounded-md p-2 ">
              <p className="font-semibold">Level</p>
              <p>{details.level}</p>
            </div>
            {details.overallAccuracy !== undefined && details.overallAccuracy !== null && (
            <div className="border-2 border-black rounded-md p-2">
              <p className="font-semibold">Accuracy</p>
              <p>{details.overallAccuracy.toFixed(2)}</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accuracy Graph */}
          {details.accuracy !== undefined && details.accuracy !== null && (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-semibold mb-2">Accuracy Graph</h3>
            <LineGraph data={details?.accuracy} />
          </div>
          )}
          {/* Confidence Graph */}
          {details.confidence !== undefined && details.confidence !== null && (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-semibold mb-2">Confidence Graph</h3>
            <LineGraph data={details?.confidence} />
          </div>
          )}
        </div>
      </div>

      {/* Question Section */}
      <div>
        {videos.map((video, index) => (
          <>
            <h2 className="text-xl font-bold my-4">Question-{index+1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-100 p-6 rounded-lg shadow-md flex items-center justify-center">
                <video controls>
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col justify-center items-center gap-4">
                <div className="border-2 w-40 border-black rounded-md p-2">
                  <p className="font-semibold">Confidence</p>
                  <p>{details?.confidence[index]?.value}</p>
                </div>
                <div className="border-2 w-40 border-black rounded-md p-2">
                  <p className="font-semibold">Accuracy</p>
                  <p>{details?.accuracy[index]?.value}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="flex justify-center items-center">
      <button onClick={()=>{navigate('/')}} className="text-center mt-6 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1 sm:py-2 lg:py-4">Return to Home</button>
      </div>

    </div>
  );
};

export default InterviewDetails;










