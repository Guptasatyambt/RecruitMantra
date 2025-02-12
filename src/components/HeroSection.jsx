// import CenteredCarousel from "./CenteredCarousel";
 /* <section className="py-4 md:py-6 px-4">
        <CenteredCarousel />
      </section> */

      import React, { useEffect } from "react";
      import "swiper/css";
      import "swiper/css/pagination";
      import "swiper/css/navigation";
      
      function HeroSection() {
        return (
          <section className="w-full bg-white py-8 md:py-12 lg:py-16 px-4 md:px-8">
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
                {/* Content Section */}
                <div className="lg:w-[45%] lg:pr-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black font-roboto leading-tight mb-6 text-center lg:text-left">
                    Master Your Interview with{' '}
                    <span className="text-gray-800">
                      AI-Powered Practice
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 font-roboto leading-relaxed mb-8 text-center lg:text-left">
                    Practice interviews with our AI platform. Get real-time feedback on your performance and earn Recruit coins for rewards.
                  </p>
                  {/* CTA Buttons */}
                  <div className="flex justify-center lg:justify-start space-x-4">
                    <button className="bg-black hover:bg-gray-800 text-white font-roboto font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Start Practice
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-black font-roboto font-medium px-8 py-3 rounded-lg border-2 border-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Learn More
                    </button>
                  </div>
                </div>
      
                {/* Image Section - Positioned directly to the right */}
                <div className="lg:w-[55%] mt-12 lg:mt-0">
                  <div className="relative w-full flex items-center justify-center lg:justify-end">
                    <div className="absolute inset-0 bg-gray-100 rounded-full opacity-20 transform scale-90 blur-2xl"></div>
                    <img
                      className="relative w-full max-w-lg lg:max-w-2xl object-contain transform transition-transform duration-500 hover:scale-105"
                      src="/assets/IMG@1x.png"
                      alt="Interview Practice Illustration"
                      style={{
                        filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }
      
      export default HeroSection;