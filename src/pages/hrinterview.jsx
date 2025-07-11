import React, { useEffect, useState } from "react";
import StopTimer from "../components/interview/StopTimer";
import Answer from "../components/SpeechToText";
import RecordWebcam from "../components/RecordWebcam";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HrInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [restartAgain, setRestartAgain] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRecording, setStartRecording] = useState(false);
  const [startListening, setStartListening] = useState(true);
  const [mediaRecorderRef, setMediaRecorderRef] = useState(null);
  const [videoProcessingError, setVideoProcessingError] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const interviewId = useParams().id;
  const navigate = useNavigate();

  const handleTimerExpired = () => {
    setIsExpired(true);
    setRestartAgain(false);
  };

  const handleNextQuestion = async () => {
    // Stop recording first
    setStartRecording(false);

    // Move to next question
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex < questions.length - 1 ? prevIndex + 1 : 0;
      // Update current question name
      setCurrentQuestion(`question-${newIndex}`);
      return newIndex;
    });

    // Reset UI states
    setRestartAgain(true);
    setIsExpired(false);
    setVideoProcessingError(false);
    setVideoUrl(null); // Reset videoUrl for next recording

    // Restart recording after a short delay
    setTimeout(() => {
      setStartRecording(true);
    }, 100);
  };

  const toggleCamera = async () => {
    try {
      if (!cameraEnabled) {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraEnabled(true);
        setPermissionDenied(false);
      } else {
        setCameraEnabled(false);
      }

      // Pass the camera state to recording component
      if (mediaRecorderRef && mediaRecorderRef.stream) {
        const videoTracks = mediaRecorderRef.stream.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks.forEach(track => track.enabled = !cameraEnabled);
        }
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setPermissionDenied(true);
    }
  };

  const toggleAudio = async () => {
    try {
      if (!audioEnabled) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioEnabled(true);
      } else {
        setAudioEnabled(false);
      }

      // Toggle audio tracks
      if (mediaRecorderRef && mediaRecorderRef.stream) {
        const audioTracks = mediaRecorderRef.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTracks.forEach(track => track.enabled = !audioEnabled);
        }
      }
    } catch (err) {
      console.error("Audio access denied:", err);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!screenSharing) {
        // Stop current recording before switching to screen sharing
        setStartRecording(false);

        // Request screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // Store screen sharing state
        setScreenSharing(true);

        // Need to update recording component with new stream
        // This would typically be handled by passing the stream to the RecordWebcam component

        // For demo purposes, we'll just toggle the state
        setTimeout(() => setStartRecording(true), 500);
      } else {
        // Stop screen sharing
        if (mediaRecorderRef && mediaRecorderRef.stream) {
          const tracks = mediaRecorderRef.stream.getTracks();
          tracks.forEach(track => track.stop());
        }

        setScreenSharing(false);
        setStartRecording(false);

        // Return to webcam
        setTimeout(() => setStartRecording(true), 500);
      }
    } catch (err) {
      console.error("Screen sharing error:", err);
      setScreenSharing(false);
    }
  };
  const handleRecordedVideo = async (videoBlob, question, mediaRecorderRefCurrent, duration) => {
    // Store the media recorder reference
    setMediaRecorderRef(mediaRecorderRefCurrent);

    if (!videoBlob) return null;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      // Determine the correct content type based on the video format
      let contentType = "video/webm"; // Default content type

      const response = await axios.post(
        "https://api.recruitmantra.com/hrInterview/uploadvideo",
        {
          interview_id: interviewId,
          question_number: currentQuestionIndex + 1,
          type: 'HR'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Video upload initiated:", response.data);


      // This is the URL that should be used for analysis
      const videoAnalysisUrl = response.data.video_url;

      // Upload the video blob directly to S3 using the key URL (for PUT operation)
      const uploadUrl = response.data.key;
      const uploadResponse = await axios.put(uploadUrl, videoBlob, {
        headers: {
          "Content-Type": contentType,
        },
      });

      console.log("Video uploaded successfully:", uploadResponse.data);
      await axios.post("http://localhost:5001/hrInterview/ackServer",
        {
          interview_id: interviewId,
          question_number: currentQuestionIndex + 1,
          question: question,
          videoUrl: videoAnalysisUrl,
          type: 'HR'
        },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Store the video_url for analysis APIs
      setVideoUrl(videoAnalysisUrl);

    } catch (error) {
      console.error("Failed in video upload process:", error);
      // Even if upload fails, keep the local URL for fallback
    }

  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await axios.get("https://api.recruitmantra.com/user/getinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if(response.data.user.verified==false){
      //   navigate(`/email-verification?source=${response.data.user.role}`, { state: { token: token } });
      // }
      if (response.data.user.profileimage === "") {
        navigate("/upload-documents");
      }
      const resumeUrl = response.data.resume;
      console.log("Resume URL:", resumeUrl);

      if (!resumeUrl) {
        console.error("No resume URL found");
        setLoading(false);
        return;
      }

      const skillsResponse = await axios.post(
        "https://ml.recruitmantra.com/hr/hr-question",
      );

      console.log("Skills Data:", skillsResponse.data.questions);

      // Set questions and update loading state
      const fetchedQuestions = skillsResponse.data.questions || [];
      setQuestions(fetchedQuestions);
      setLoading(false);

      // Set initial current question
      if (fetchedQuestions.length > 0) {
        setCurrentQuestion(`question-0`);
        // Start recording after questions are loaded
        setTimeout(() => setStartRecording(true), 1000);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    // Stop recording first
    setStartRecording(false);
    setIsProcessing(true);
    // Stop media tracks properly
    if (mediaRecorderRef) {
      try {
        // Check if mediaRecorderRef has a state property and is not inactive
        if (mediaRecorderRef.state && mediaRecorderRef.state !== "inactive") {
          mediaRecorderRef.stop();
        }

        // If there's a stream, stop all tracks
        if (mediaRecorderRef.stream) {
          mediaRecorderRef.stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error("Error stopping media recorder:", err);
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }

      const response = await axios.post(
        "https://api.recruitmantra.com/hrInterview/stop",
        {
          interview_id: interviewId,
          type: "HR",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(() => {
        setIsProcessing(false); // Hide loader (optional)
        navigate(`/interview-details/${interviewId}?type=HR&source=interview`);
      }, 10000);
      // console.log("Interview ended successfully");
      // navigate(`/interview-details/${interviewId}?type=HR&&source=interview`);
      // navigate(`/feedback/${interviewId}`, {replace: true});
    } catch (err) {
      setIsProcessing(false);
      console.error("Failed to end interview:", err);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Cleanup function for component unmount
    return () => {
      setStartRecording(false);
      setStartListening(false);

      // Clean up any media resources
      if (mediaRecorderRef) {
        try {
          if (mediaRecorderRef.state && mediaRecorderRef.state !== "inactive") {
            mediaRecorderRef.stop();
          }
          if (mediaRecorderRef.stream) {
            mediaRecorderRef.stream.getTracks().forEach(track => track.stop());
          }
        } catch (err) {
          console.error("Error in cleanup:", err);
        }
      }

      // Revoke any object URLs to prevent memory leaks
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  // Determine if we're on the last question
  const isLastQuestion = currentQuestionIndex === (questions.length - 1);

  return (
    <div className="bg-gray-100 min-h-screen">
      {isProcessing ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg font-semibold mb-2">Processing your interview...</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Error Message */}
          {error ? (
            <motion.div
              className="mt-4 bg-red-100 text-red-600 text-center py-2 px-4 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-white flex justify-between items-center px-6 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <img src="/assets/logo_RM.png" alt="Technical Interview" className="h-8" />
                  <span className="text-lg font-medium">HR Interview</span>
                </div>
                <div className="flex items-center gap-3">
                  <StopTimer handleTimerExpired={handleTimerExpired} />
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
                    onClick={handleEndInterview}
                  >
                    End Interview
                  </button>
                </div>
              </div>

              <div className="flex flex-col p-6 gap-6">
                <div className="flex gap-6">
                  {/* Left Side - Webcam */}
                  <div className="w-1/2">
                    <div className="bg-gray-200 h-96 md:h-[500px] rounded-md relative">
                      {/* <RecordWebcam
                        startRecording={startRecording && (cameraEnabled || screenSharing)}
                        handleRecordedVideo={handleRecordedVideo}
                        videoName={currentQuestion}
                        audioEnabled={audioEnabled}
                      /> */}
                      {questions[currentQuestionIndex] ? (
                        <RecordWebcam
                          startRecording={startRecording && (cameraEnabled || screenSharing)}
                          handleRecordedVideo={handleRecordedVideo}
                          question={questions[currentQuestionIndex]}
                          audioEnabled={audioEnabled}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-gray-700 text-lg font-medium">Loading question...</div>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <button
                          className={`${cameraEnabled ? 'bg-blue-600' : 'bg-gray-800'} text-white p-2 rounded`}
                          onClick={toggleCamera}
                          title={cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 7l-7 5 7 5V7z"></path>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                        </button>
                        <button
                          className={`${audioEnabled ? 'bg-blue-600' : 'bg-gray-800'} text-white p-2 rounded`}
                          onClick={toggleAudio}
                          title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                        >
                          {audioEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                              <line x1="12" y1="19" x2="12" y2="23"></line>
                              <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                              <line x1="12" y1="19" x2="12" y2="23"></line>
                              <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                          )}
                        </button>
                        <button
                          className={`${screenSharing ? 'bg-blue-600' : 'bg-gray-800'} text-white p-2 rounded`}
                          onClick={toggleScreenShare}
                          title={screenSharing ? "Stop Screen Sharing" : "Share Screen"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                        </button>
                      </div>

                      {/* Disabled/Camera Off Overlay */}
                      {!cameraEnabled && !screenSharing && (
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
                          <div className="text-white text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                            <p>Camera is turned off</p>
                            <button
                              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                              onClick={toggleCamera}
                            >
                              Turn Camera On
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - AI Interviewer */}
                  <div className="w-1/2">
                    <div className="bg-white rounded-md shadow-sm overflow-hidden">
                      <div className="relative">
                        <img
                          src="/assets/Interviewer.png"
                          alt="AI Interviewer"
                          className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="font-bold text-white text-lg">John Anderson</h3>
                          <p className="text-sm text-gray-200">Senior Technical Interviewer</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <p className="text-sm text-gray-700 italic">
                          "I'll be evaluating your technical skills today. Please explain your thought process clearly as you work through each problem."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Section */}
                <div className="bg-white rounded-md shadow-sm p-4">
                  <div className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {questions.length || 5}</div>
                  <h2 className="font-bold text-lg mb-3">
                    {loading ? "Loading question..." : questions[currentQuestionIndex]}
                  </h2>
                </div>

                {/* Answer Section */}
                <div className="bg-white rounded-md shadow-sm p-4">
                  <Answer startListening={startListening && audioEnabled} />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white px-6 py-4 border-t flex justify-between">

                <div className="flex gap-3">
                  <button
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-4 py-2 ${currentQuestionIndex > 0 ? "opacity-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex((prevIndex) => {
                          const newIndex = prevIndex - 1;
                          setCurrentQuestion(`question-${newIndex}`);
                          return newIndex;
                        });
                        setRestartAgain(true);
                        setIsExpired(false);
                        setVideoProcessingError(false);
                        setVideoUrl(null);
                        setTimeout(() => setStartRecording(true), 100);
                      }
                    }}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 ${!isExpired && !isLastQuestion ? "opacity-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    onClick={handleNextQuestion}
                    disabled={isExpired || isLastQuestion}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )
      }
    </div>
  );
}

export default HrInterview;