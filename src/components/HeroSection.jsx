import React, { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Card } from "./Card";
import {
  ResponsiveContainer,
  StackedCarousel,
} from "react-stacked-center-carousel";

function HeroSection() {
  const slides = [
    {
      image: "assets/slider 1.png",
    },
    {
      image: "assets/slider 2.png",
    },
    {
      image: "assets/slider 3.png",
    },
  ];
  const ref = React.useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.goNext();
    }, 3000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <>
      <section className="py-4 md:py-6 px-4">
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            let currentVisibleSlide = 3;
            if (parentWidth <= 1440) currentVisibleSlide = 3;
            if (parentWidth <= 1080) currentVisibleSlide = 1;
            console.log(parentWidth);
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Card}
                slideWidth={parentWidth < 800 ? parentWidth - 40 : 750}
                carouselWidth={parentWidth}
                height={parentWidth < 500 ? parentWidth - 120 : 500}
                data={slides}
                currentVisibleSlide={currentVisibleSlide}
                maxVisibleSlide={5}
              />
            );
          }}
        />
      </section>

      <section className="w-full md:px-8 px-4 lg:flex gap-52 my-4 md:my-5 md:py-6">
        <div className="container lg:w-[50%] px-8 mx-auto flex flex-col items-center lg:text-left">
          <h2 className="text-4xl md:text-6xl py-8 md:mb-4 text-amber-950 font-serif">
            Welcome to RecruitMantra
          </h2>
          <p className="text-base md:text-lg">
            We are dedicated to preparing you for your upcoming interviews
            through our comprehensive levels of interview preparation. Our goal
            is to instill confidence in you and equip you with the skills and
            knowledge needed toexcel in your interviews, ultimately making you
            job-ready. With our tailored approach and real time analysis of your
            interview, we ensure that you are fully prepared to tackle any
            interview scenario with confidence and success.
          </p>
        </div>
        <div className="mt-10 lg:w-[50%] mx-auto text-center">
          <img
            className="h-40 mx-auto md:h-96"
            src="/assets/image1.png"
            alt=""
          />
        </div>
      </section>
    </>
  );
}

export default HeroSection;
