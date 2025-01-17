import { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import Draggable from "react-draggable";

export default function RecordWebcam({ startRecording, handleRecordedVideo, videoName = "question" }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data && data.size > 0) {
        setRecordedChunks((prevChunks) => [...prevChunks, data]);
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current?.video?.srcObject) {
      setRecording(true);
      const stream = webcamRef.current.video.srcObject; // Ensure the stream is valid
      if(stream) {
        if (!stream.getAudioTracks().length) {
          console.warn("No audio tracks found, recording video only.");
        }
        mediaRecorderRef.current = new RecordRTC(stream, {
          type: "video",
        });
        mediaRecorderRef.current.startRecording();
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      }
      else {
        console.error("Webcam stream is not ready.");
      }
      
    } else {
      console.error("Webcam stream is not ready.");
    }
  }, [handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        
        setRecordedChunks([blob]);

        // Send the video blob to the parent component
        // if (handleRecordedVideo) {
          // console.log("Video sent to parent", blob);
          
          handleRecordedVideo(blob, videoName);
        // }
      });
    }
  }, [handleRecordedVideo]);

  const convertWebMToMP4 = async (blob, videoName) => {
    
  };


  const handleDownload = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "my-video.webm";
      a.click();
      // console.log("Video url",url);
      // window.URL.revokeObjectURL(url);

    }
  }, [recordedChunks]);

  useEffect(() => {
    if (startRecording) {
      handleStartCaptureClick();
    } else {
      handleStopCaptureClick();
      // handleDownload();
    }
  }, [startRecording, handleStartCaptureClick, handleStopCaptureClick, handleDownload]);

  return (
    <Draggable>
      <div className="w-60 md:w-80">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1280, height: 720 }}
          audio={false}
          height={1420}
          width={1380}
          mirrored={true}
          className="border border-black rounded-xl"
        />
        <div>
          {/* {recording ? (
            <button onClick={handleStopCaptureClick}>Stop</button>
          ) : (
            <button onClick={handleStartCaptureClick}>Start</button>
          )}
          {recordedChunks.length > 0 && (
            <button onClick={handleDownload}>Download</button>
          )} */}
        </div>
      </div>
    </Draggable>
  );
}
