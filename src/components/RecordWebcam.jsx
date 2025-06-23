import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function RecordWebcam({
  startRecording ,
  handleRecordedVideo ,
  question,
  audioEnabled
}) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const streamRef = useRef(null);
// console.log(question);
  // Initialize webcam when component mounts
  useEffect(() => {
    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error initializing webcam:", err);
      }
    };

    initializeWebcam();

    // Cleanup function
    return () => {
      stopAllMediaTracks();
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopAllMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    if (webcamRef.current && webcamRef.current.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleStartCaptureClick = async () => {
    setRecordedChunks([]);
    try {
      let stream = streamRef.current;
      if (!stream || stream.getTracks().some(track => !track.enabled)) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      }

      let options = { mimeType: "video/mp4; codecs=avc1,mp4a.40.2" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm;codecs=vp8,opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: "video/webm" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = {};
          }
        }
      }
      
      
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        (async () => {
        try {
          if (chunks.length > 0) {
            const mimeType = recorder.mimeType || "video/mp4";
            const blob = new Blob(chunks, { type: mimeType });
            const finalDuration = recordingStartTimeRef.current 
              ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
              : duration;
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            
            const fileExtension = mimeType.includes("mp4") ? "mp4" : "webm";
            // a.download = `${videoName}.${fileExtension}`;
            // a.click();
            
            setTimeout(() => {
              URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);
            if (typeof handleRecordedVideo === 'function')  {
              console.log(question)

               await handleRecordedVideo(blob, question, recorder, finalDuration);

            }
          } else {
            console.error("No recorded chunks available");
          }
        } catch (err) {
          console.error("Error in onstop handler:", err);
        }
      })();
      };
      
      recorder.start(1000);
      setRecording(true);
      recordingStartTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - recordingStartTimeRef.current) / 1000
        );
        setDuration(elapsedSeconds);
      }, 1000);
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setRecording(false);
    }
  };

  const handleStopCaptureClick = () => {
    if (!recording) {
      console.warn("No active recording to stop");
      return;
    }
    
    setRecording(false);
    clearTimers();
    
    const finalDuration = recordingStartTimeRef.current
      ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
      : duration;
    setDuration(finalDuration);
    
    
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error("Error stopping media recorder:", err);
    }
  };

  useEffect(() => {
    // console.log(startRecording, recording);
    if (startRecording && !recording) {
      handleStartCaptureClick();
    } else if (!startRecording && recording) {
      handleStopCaptureClick();
    }
  }, [startRecording]);

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number') seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full relative">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        audio={true}
        muted={true}
        mirrored={true}
        className="w-full h-full object-cover rounded-md"
        onUserMediaError={(err) => console.error("Webcam error:", err)}
        onUserMedia={(stream) => {
          streamRef.current = stream;
        }}
      />
      {recording && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
          <span className="animate-pulse mr-2">⚫</span>
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
}