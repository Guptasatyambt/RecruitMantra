import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
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
    <section className="py-4 md:py-12 px-4">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          height={400}
          autoplay={{
          delay: 2500, 
          disableOnInteraction: false, 
        }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="md:h-[30rem] flex flex-col justify-center items-center">
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
    <section className="w-full px-8 lg:flex gap-52 my-4 md:my-10 md:py-12">
        <div className="container lg:w-[50%] px-8 mx-auto flex flex-col items-center lg:text-left">
          <h2 className="text-4xl md:text-7xl py-8 md:mb-4 text-amber-950 font-serif">Welcome to RecruitMantra</h2>
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
          <img className="h-40 mx-auto md:h-96" src="/assets/image1.png" alt=""/>
        </div>
      </section>
      
      
    </>
  );
}

export default HeroSection;
