import React, { useEffect, useState } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Answer = ({ startListening = true }) => {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Handle starting the speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
      return;
    }

    // Only attempt to start listening if it should be started and isn't already active
    if (startListening && !listening) {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
    
    // Cleanup function
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, startListening, listening]);

  // Handle speech recognition recovery if it stops
  useEffect(() => {
    if (isListening && !listening && startListening) {
      // If we should be listening but we're not, restart it
      const restartTimeout = setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true });
      }, 300);
      
      return () => clearTimeout(restartTimeout);
    }
  }, [listening, isListening, startListening]);

  // Update state when listening changes
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (!isMicrophoneAvailable) {
    return <span>Microphone permission not allowed</span>;
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Answer</h2>
        <div className="flex items-center gap-2">
          {listening ? (
            <BiMicrophone className="w-6 h-6 text-green-500 animate-pulse" />
          ) : (
            <BiMicrophoneOff className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm text-gray-300">
            {listening ? 'Recording...' : 'Microphone off'}
          </span>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 min-h-[200px] relative">
        {transcript ? (
          <p className="text-lg text-gray-100 whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">Start speaking to record your answer...</p>
        )}
      </div>
    </div>
  );
};

export default Answer;