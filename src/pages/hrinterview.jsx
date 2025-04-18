import React, { useEffect, useState } from "react";
import StopTimer from "../components/StopTimer";
import Answer from "../components/SpeechToText";
import RecordWebcam from "../components/RecordWebcam";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


function HrInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    `question-${currentQuestionIndex}`
  );
  // eslint-disable-next-line
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  var [videoUrl, setVideoUrl] = useState();
  const [isExpired, setIsExpired] = useState(false);
  const [restartAgain, setRestartAgain] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRecording, setStartRecording] = useState(true);
  const [startListening, setStartListening] = useState(true);
  const [mediaRecorderRef, setMediaRecorderRef] = useState();

  const interviewId = useParams().id;
  const navigate = useNavigate();
  
 const params = useParams();
 console.log(params);
 
  const handleTimerExpired = () => {
    setIsExpired(true);
    setRestartAgain(false);
  };

  const handleNextQuestion = () => {
    setStartRecording(false);
    audioAnalyse();
    videoAnalyse();
    // answerAccuracy();
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
    setCurrentQuestion(`question-${currentQuestionIndex}`);
    setRestartAgain(true);
    setIsExpired(false);
    setTimeout(() => {
      setStartRecording(true);
    }, 100);
  };

  const handleCameraAccess = async () => {
    try {
      if (!cameraEnabled) {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraEnabled(true);
        setPermissionDenied(false);
      } else {
        setCameraEnabled(false);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setPermissionDenied(true);
    }
  };

  const handleRecordedVideo = async (videoBlob, currentQuestion, mediaRecorderRefCurrent) => {
    setMediaRecorderRef(mediaRecorderRefCurrent);
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);

      console.log("Downloadable URL generated:", videoUrl);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            "https://api.recruitmantra.com/hrInterview/uploadvideo",
        //   "https://api.recruitmantra.com/hrInterview/uploadvideo",
          {
            interview_id: interviewId,
            question_number: currentQuestionIndex,
            type:"HR",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("responce",response);
        const videoKey = response.data.key;
        videoUrl=response.data.video_url
        console.log("responce",videoUrl);
        console.log("blob",videoBlob);
        const file = new File([videoBlob], `${currentQuestion}.mp4`, { type: "video/mp4" });
      const formData = new FormData();
      formData.append("video/mp4", file);
        
        try {
          const response = await axios.put(videoKey, formData, {
            headers: {
              "Content-Type": "video/mp4",
            },
          });
          console.log(response.data);
        } catch (error) {
          console.error("Failed to upload video to S3", error);
        }
      } catch (error) {
        console.error("Failed to retract upload link", error);
      }
    }
  };
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }
      const response = await axios.get(
        "https://api.recruitmantra.com/user/getinfo",{
        // "https://api.recruitmantra.com/user/getinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.resume);
      const resumeUrl = response.data.resume;
      const skillsResponse = await axios.post(
        "https://ml.recruitmantra.com/skills/extract_skills",
        {
          resume_url: resumeUrl,
        }
      );

      console.log("Skills Data:", skillsResponse.data.questions);
      setQuestions(skillsResponse.data.questions);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };
  const audioAnalyse = async () => {
    try {
      await axios.post("https://ml.recruitmantra.com/audio_emotion/process_video", {
        video_url:videoUrl,
        //   "https://commondatastorage.googleapis.com/gtvvideosbucket/sample/ForBiggerFun.mp4",
      });
    } catch (error) {
      console.error("Failed to analyse audio:", error);
    }
  };
  const videoAnalyse = async () => {
    try {
      await axios.post("https://ml.recruitmantra.com/video_emotion/upload", {
        video_url:videoUrl,
        //   "https://commondatastorage.googleapis.com/gtvvideosbucket/sample/ForBiggerFun.mp4",
      });
    } catch (error) {
      console.error("Failed to analyse video:", error);
    }
  };

  const handleEndInterview = async () => {

    if(mediaRecorderRef) {
      mediaRecorderRef.destroy();
    }
    setStartRecording(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }
      const response = await axios.post(
        "https://api.recruitmantra.com/hrInterview/stop",
        // "https://api.recruitmantra.com/hrInterview/stop",
        {
          interview_id: interviewId,
          type:"HR",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Interview ended successfully");

      navigate(`/feedback/${interviewId}`, {replace: true});
    } catch (err) {
      console.error("Failed to end interview:", err);
    }
  }
  // useEffect(() => {
  //   audioAnalyse();
  //   videoAnalyse();
  //   answerAccuracy();
  // }, [currentQuestionIndex]);
  useEffect(() => {
 
      fetchUserData();
 
  }, []);

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden justify-center gap-4 py-5 px-4 md:px-10">
      <div className="py-5 px-5 w-full md:w-[50%]">
        <h2 className="text-2xl md:text-3xl font-bold">Beginner</h2>
        <p className="md:text-lg py-6 md:pr-6">
          Get started with our beginner-friendly courses, designed to help you
          develop essential skills and knowledge for your job search.
        </p>
        <div className="flex flex-col items-center md:flex-row my-5 md:my-10">
          <video
            className="size-80 md:size-96"
            src="assets/beginnerGif.mp4"
            alt="Beginner Page Gif"
          ></video>
          <div className="md:mx-4">
            <RecordWebcam
              startRecording={startRecording}
              handleRecordedVideo={handleRecordedVideo}
            />
          </div>
        </div>
        {/* <button
          onClick={handleCameraAccess}
          className="text-base md:text-xl bg-green-600 text-white p-3 rounded-md"
        >
          {!cameraEnabled ? "Enable Camera" : "Disable Camera"}
        </button> */}
      </div>
      <div className="md:mx-10 py-5 md:px-5 md:w-[50%]">
        <div className="md:flex md:justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Question</h2>
          {/* Timer */}
          {restartAgain ? (
            <StopTimer handleTimerExpired={handleTimerExpired} />
          ) : (
            <span className="text-lg md:text-xl text-red-600 font-semibold">
              You can go to next question!!
            </span>
          )}
        </div>
        <div className="border p-4 my-4 border-orange-950">
          <p className="">{questions[currentQuestionIndex]}</p>
        </div>
        <Answer startListening={startListening} />
        <div className="flex justify-between space-x-10">
          <button className="text-2xl w-40 bg-red-800 rounded-full p-2 text-slate-200" onClick={handleEndInterview}>
            End
          </button>
          {isExpired ? (
            <button
              className="text-xl md:text-2xl w-40 bg-orange-950 rounded-full p-2 text-slate-200"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          ) : (
            <button
              className="text-xl md:text-2xl w-40 opacity-25 bg-orange-950 rounded-full p-2 text-slate-200"
              disabled={true}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HrInterview;