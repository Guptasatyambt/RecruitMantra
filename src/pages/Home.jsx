import React from "react";
import HeroSection from "../components/HeroSection";
import LevelsSection from "../components/LevelsSection";
import InterviewTypes from "../components/InterviewTypes";
import InterviewSeries from "../components/InterviewSeries";


function Home() {
  return (
    <>
      <main className="flex-grow">
        <HeroSection />
        <InterviewTypes/>
        <InterviewSeries/>
        <LevelsSection />
      </main>
    </>
  );
}

export default Home;
