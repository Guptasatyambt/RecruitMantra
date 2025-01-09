import React from "react";
import { BiLogoInstagram, BiLogoLinkedin } from "react-icons/bi";

function AboutUs() {
  return (
    <div className="text-center mt-10 p-5">
      <h1 className="text-4xl font-semibold"> About Us</h1>
      <div className="flex flex-col md:flex-row justify-center py-10 text-center md:text-left">
        <div className="md:w-1/2 flex justify-center p-4">
          <img
            className="size-60 sm:size-64 lg:size-96 object-cover rounded-full"
            alt=""
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/RecruitMantra_with_black_BG.jpg"
          />
        </div>
        <div className="md:w-1/2 p-4 space-y-2">
          <h2 className="text-3xl font-medium">Our Aim</h2>
          <p className="text-base md:text-lg">
            At RecruitMantra, We are dedicated to preparing you for your
            upcoming interviews through our comprehensive levels of interview
            preparation. Our goal is to instill confidence in you and equip you
            with the skills and knowledge needed to excel in your interviews,
            ultimately making you job-ready. With our tailored approach and real
            time analysis of your interview, we ensure that you are fully
            prepared to tackle any interview scenario with confidence and
            success.
          </p>
        </div>
      </div>

      {/* Our Team */}
      <h1 className="text-4xl font-semibold mx-auto">Our Team</h1>
      <div className="flex flex-col md:flex-row justify-center my-16 text-left border-2">
        <div className="md:w-1/2 p-4">
          <div className="flex justify-center">
            <img
              className="size-60 sm:size-64 lg:size-96 object-cover rounded-full"
              alt=""
              src="https://internview-assets.s3.ap-south-1.amazonaws.com/satyam+(2).jpg"
            />
          </div>

          <div className="flex justify-center">
            <a href="#">
              <img
                className="w-10 m-4 inline"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/Linkedin+(1).png"
                alt="linkedin"
              />
            </a>
            <a href="#">
              <img
                className="w-10 m-4 inline"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/Instagram+(1).png"
                alt="instagram"
              />
            </a>
          </div>
        </div>
        <div className="md:w-1/2 p-4 space-y-10 md:space-y-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center">Our CEO's Message</h2>
          <p className="text-base sm:text-lg lg:text-xl text-center md:text-left">
            As the Founder and CEO of RecruitMantra, I firmly believe that
            preparation is the key to unlocking one's true potential. Our
            mission is to empower individuals to approach interviews with
            confidence, clarity, and the skills they need to succeed. Every mock
            interview is a step toward transforming dreams into reality, and we
            are proud to be part of that journey. Remember, success is not about
            luck; it's about being ready for the moment when opportunity knocks.{" "}
            <span className="font-semibold block">
              "Confidence is the product of preparation, and success is its
              reward."
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center my-16 text-left border-2">
        <div className="md:w-1/2 p-4">
          <div className="flex justify-center">
            <img
              className="size-60 sm:size-64 lg:size-96 object-cover rounded-full"
              alt=""
              src="https://internview-assets.s3.ap-south-1.amazonaws.com/upendra+(1).jpg"
            />
          </div>

          <div className="flex justify-center">
            <a href="#">
              <img
                className="w-10 m-4 inline"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/Linkedin+(1).png"
                alt="linkedin"
              />
            </a>
            <a href="#">
              <img
                className="w-10 m-4 inline"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/Instagram+(1).png"
                alt="instagram"
              />
            </a>
          </div>
        </div>
        <div className="md:w-1/2 p-4 space-y-10 md:space-y-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center">Our CTO's Message</h2>
          <p className="text-base sm:text-lg lg:text-xl text-center md:text-left">
            At RecruitMantra, technology is the backbone of our mission to
            empower individuals and transform aspirations into achievements. As
            the CTO, I focus on building innovative solutions that make
            preparation seamless and impactful. Our AI-driven platform ensures
            every candidate is equipped with the confidence and skills to excel
            when opportunity strikes. Together, we are redefining how people
            prepare for success.{" "}
            <span className="font-semibold block">
              "Through technology, we turn preparation into opportunity and
              dreams into reality."
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
