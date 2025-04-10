import React from "react";
import Draggable from "react-draggable";
import Webcam from "react-webcam";
import RecordWebcamera from "./RecordWebcam";

function Webcamera() {
  return (
    <Draggable>
      <div className="">
        <Webcam className="border border-black rounded-xl" audio={false} height={420} width={380} mirrored={true}></Webcam>
      <RecordWebcamera />
      </div>
    </Draggable>
  );
}

export default Webcamera;
