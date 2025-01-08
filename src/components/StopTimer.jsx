import React from "react";
import { useTimer } from "react-timer-hook";

export default function StopTimer({ handleTimerExpired }) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 10);
  const expiryTimestamp = time;
  
  const { seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn("onExpire called");
      handleTimerExpired();
    },
  });

  return (
    <div className="relative flex justify-center items-center text-2xl border-4 w-16 h-16 border-black rounded-full bg-gray-100">
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"
        style={{
          animationDuration: "10s",
          animationTimingFunction: "linear",
          animationIterationCount: "1",
        }}
      ></div>
      <span className="z-10 text-4xl font-bold">{seconds}</span>
    </div>
  );
}
