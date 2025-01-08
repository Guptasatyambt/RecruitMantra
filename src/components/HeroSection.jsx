import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

  return (
    <>
    <section className="w-full px-8 lg:flex gap-52 my-10 py-12">
        <div className="container lg:w-[50%] px-8 mx-auto flex flex-col items-center lg:text-left">
          <h2 className="text-7xl py-8 mb-4">Welcome to <span className="text-[#8D0B41]">RecruitMantra</span></h2>
          <p className="text-lg">
            We are dedicated to preparing you for your upcoming interviews
            through our comprehensive levels of interview preparation. Our goal
            is to instill confidence in you and equip you with the skills and
            knowledge needed to <span className="bg-pink-400 rounded px-2">excel in your interviews </span>, ultimately making you
            job-ready. With our tailored approach and real time analysis of your
            interview, we ensure that you are fully prepared to tackle any
            interview scenario with <span className="bg-pink-400 rounded px-2">confidence and success</span>.
          </p>
        </div>
        <div className="container mt-10 lg:w-[50%] mx-auto text-center">
          <img className="h-96" src="/assets/image1.png" alt=""/>
        </div>
      </section>
      <section className="bg-[#FFF8E6] py-12">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          height={400}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="h-[30rem] flex flex-col justify-center items-center">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="h-full object-center rounded-md mb-4"
                />
                <p className="text-lg">{slide.caption}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      
    </>
  );
}

export default HeroSection;
