import React, { useEffect } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Answer = ({startListening}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition.");
      return;
    }

    if (!isMicrophoneAvailable) {
      alert("Microphone permission not allowed");
      return;
    }

    if (browserSupportsContinuousListening && startListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.startListening();
    }

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition, browserSupportsContinuousListening, isMicrophoneAvailable, startListening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (!isMicrophoneAvailable) {
    return <span>Microphone permission not allowed</span>;
  }


  return (
    <div className="my-4">
      <div className="border h-80 p-4 my-4 border-orange-950">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Answer</h2>
          <p>
            {listening ? (
              <BiMicrophone className="size-6" />
            ) : (
              <BiMicrophoneOff className="size-6" />
            )}
          </p>
        </div>

        <p className="text-2xl">{transcript}</p>
      </div>
      <div className="flex w-36 justify-between">
        {/* <button className="bg-green-600 px-3 py-1 rounded-md text-base" onClick={SpeechRecognition.startListening}>Start</button> */}
        {/* <button className="bg-red-600 px-3 py-1 rounded-md text-base" onClick={SpeechRecognition.stopListening}>Stop</button> */}
        {/* <button className="bg-orange-600 px-3 py-1 rounded-md text-base" onClick={resetTranscript}>Reset</button> */}
      </div>
    </div>
  );
};
export default Answer;
