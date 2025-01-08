import React from "react";
import { BiLogoInstagram, BiLogoLinkedin } from "react-icons/bi";

function AboutUs() {
  return (
    <div className="relative text-center mt-10 p-5">
      <h1 className="text-3xl font-semibold mx-auto"> About Us</h1>
      <div className="flex justify-center h-[60vh] items-center text-left">
        <div className="w-1/2 p-4">
          <img
            className="h-64"
            alt=""
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
          />
        </div>
        <div className="w-1/2 p-4 space-y-2">
          <h2 className="text-4xl">Our Mission</h2>
          <p className="text-xl">
            Our mission is to create a welcoming and inclusive environment for
            people of all ages, abilities, and perspectives. We strive to create
            a safe space where everyone feels comfortable expressing themselves
            freely and safely.
          </p>
        </div>
      </div>

      {/* Our Team */}
      <h1 className="text-3xl font-semibold mx-auto">Our Team</h1>
      <div className="flex justify-center my-16 text-left border-2">
        <div className="w-1/2 p-4">
          <img
            className="w-80"
            alt=""
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/satyam+(2).jpg"
          />
          <img
            className="w-10 m-4 inline"
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/Linkedin+(1).png"
            alt="linkedin"
          />
          <img
            className="w-10 m-4 inline"
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/Instagram+(1).png"
            alt="instagram"
          />
        </div>
        <div className="w-1/2 p-4 space-y-16">
          <h2 className="text-4xl">CEO's Message</h2>
          <p className="text-xl">
            As the Founder and CEO of RecruitMantra, I firmly believe that
            preparation is the key to unlocking one's true potential. Our
            mission is to empower individuals to approach interviews with
            confidence, clarity, and the skills they need to succeed. Every mock
            interview is a step toward transforming dreams into reality, and we
            are proud to be part of that journey. Remember, success is not about
            luck; it's about being ready for the moment when opportunity knocks.{" "}
            <span className="font-semibold">
              "Confidence is the product of preparation, and success is its
              reward."
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-center my-16 text-left border-2">
        <div className="w-1/2 p-4">
          <img
            className="w-80"
            alt=""
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/upendra+(1).jpg"
          />
          <img
            className="w-10 m-4 inline"
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/Linkedin+(1).png"
            alt="linkedin"
          />

          <img
            className="w-10 m-4 inline"
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/Instagram+(1).png"
            alt="instagram"
          />
        </div>
        <div className="w-1/2 p-4 space-y-16">
          <h2 className="text-4xl">CTO's Message</h2>
          <p className="text-xl">
            At RecruitMantra, technology is the backbone of our mission to
            empower individuals and transform aspirations into achievements. As
            the CTO, I focus on building innovative solutions that make
            preparation seamless and impactful. Our AI-driven platform ensures
            every candidate is equipped with the confidence and skills to excel
            when opportunity strikes. Together, we are redefining how people
            prepare for success.{" "}
            <span className="font-semibold">
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
