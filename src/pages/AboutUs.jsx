import React from "react";
import { BiLogoInstagram, BiLogoLinkedin } from "react-icons/bi";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
        <h1 className="text-6xl font-bold tracking-tight leading-none transform transition-all duration-500 hover:scale-105">
          About Us
        </h1>
        <p className="mt-6 text-xl max-w-3xl text-gray-200">
          Empowering individuals with confidence through structured interview preparation.
        </p>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-24 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <img
            className="w-60 sm:w-72 md:w-96 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
            src="https://internview-assets.s3.ap-south-1.amazonaws.com/RecruitMantra_with_black_BG.jpg"
            alt="RecruitMantra"
          />
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-700">Our Mission</h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              At <span className="font-semibold text-gray-700">RecruitMantra</span>, our goal is to prepare you for your dream job
              by providing real-time interview analysis, structured training, and confidence-building techniques.
              We believe that every opportunity should be met with readiness and excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-700 mb-16">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* CEO Section */}
            <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition duration-500">
              <img
                className="w-56 h-56 rounded-full shadow-2xl object-cover border-4 border-gray-50"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/satyam+(2).jpg"
                alt="CEO"
              />
              <h3 className="text-2xl font-bold mt-6 text-gray-700">Satyam Upadhyay</h3>
              <p className="text-gray-500 text-lg">Founder & CEO</p>
              <p className="mt-4 text-center text-gray-600 text-lg italic">
                "Confidence is the product of preparation, and success is its reward."
              </p>
              <div className="flex mt-6 gap-6">
                <a href="https://www.linkedin.com/in/satyam-upadhyay-ba0582228/" className="text-gray-600 text-3xl transform hover:scale-110 transition duration-300 hover:text-gray-800">
                  <BiLogoLinkedin />
                </a>
                <a href="https://www.instagram.com/satya.am._/" className="text-gray-600 text-3xl transform hover:scale-110 transition duration-300 hover:text-gray-800">
                  <BiLogoInstagram />
                </a>
              </div>
            </div>

            {/* CTO Section */}
            <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition duration-500">
              <img
                className="w-56 h-56 rounded-full shadow-2xl object-cover border-4 border-gray-50"
                src="https://internview-assets.s3.ap-south-1.amazonaws.com/upendra+(1).jpg"
                alt="CTO"
              />
              <h3 className="text-2xl font-bold mt-6 text-gray-700">Upendra Singh</h3>
              <p className="text-gray-500 text-lg">Chief Technology Officer</p>
              <p className="mt-4 text-center text-gray-600 text-lg italic">
                "Through technology, we turn preparation into opportunity and dreams into reality."
              </p>
              <div className="flex mt-6 gap-6">
                <a href="https://www.linkedin.com/in/upendra-singh-68b94622a/" className="text-gray-600 text-3xl transform hover:scale-110 transition duration-300 hover:text-gray-800">
                  <BiLogoLinkedin />
                </a>
                <a href="https://www.instagram.com/mr_upen_/" className="text-gray-600 text-3xl transform hover:scale-110 transition duration-300 hover:text-gray-800">
                  <BiLogoInstagram />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-center py-16 px-6">
        <h3 className="text-4xl font-bold tracking-tight">Join Us in Building a Confident Future</h3>
        <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-200">
          We are committed to helping individuals excel in their interviews and career journeys.
          With RecruitMantra, success is not a dream—it's a preparation away.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;