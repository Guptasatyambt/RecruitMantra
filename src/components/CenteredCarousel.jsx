import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectCoverflow } from "swiper/modules";

const CenteredCarousel = () => {
  const slides = [
    "assets/slider 1.png",
    "assets/slider 2.png",
    "assets/slider 3.png",
    "assets/slider 1.png",
    "assets/slider 2.png",
    "assets/slider 3.png",
  ];

  return (
    <div className="w-full mx-auto pt-12 px-4 sm:px-8 md:px-16 lg:px-32">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1.5, // Small screens (mobile)
          },
          768: {
            slidesPerView: 2.5, // Medium screens (tablet)
          },
          1024: {
            slidesPerView: 2.5, // Large screens (desktop)
          },
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[Autoplay, EffectCoverflow]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center rounded-lg"
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CenteredCarousel;
