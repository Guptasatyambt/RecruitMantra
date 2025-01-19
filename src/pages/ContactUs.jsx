import axios from "axios";
import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setSubmitted(true);

    try {
      const response = await axios.post(
        "https://api.recruitmantra.com/feedback/contact-us",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200 sm:p-6 md:p-8 lg:p-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 sm:text-2xl lg:text-4xl">
        Get in Touch
      </h2>
      <p className="text-center text-gray-500 mb-8 sm:text-sm md:text-base lg:text-lg">
        We'd love to hear from you. Please fill out the form below and we'll get
        back to you as soon as possible.
      </p>
      <img
        className="sm:w-20 sm:h-20 mx-auto my-5 w-0 h-0 md:w-24 md:h-24"
        alt="Recruit-Mantra-Logo"
        src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
      />
      {submitted ? (
        <p className="text-green-600 text-center font-medium text-lg sm:text-base lg:text-xl">
          Thank you for reaching out! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Contact no.
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:text-sm md:text-base">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here"
              rows="5"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-2 lg:p-4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1 sm:py-2 lg:py-4"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactUs;
