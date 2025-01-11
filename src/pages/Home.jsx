import React from "react";
import HeroSection from "../components/HeroSection";
import LevelsSection from "../components/LevelsSection";
import Carousel from "../components/xx";

function Home() {
  return (
    <>
      <main className="flex-grow">
        <HeroSection />
        <LevelsSection />
      </main>
    </>
  );
}

export default Home;
