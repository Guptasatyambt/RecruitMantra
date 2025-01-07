import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    contact: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setSubmitted(true);
    // Add API call here if needed
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Get in Touch</h2>
      <p className="text-center text-gray-500 mb-8">
        We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
      </p>
      <img className="size-24 mx-auto my-5" alt="Recruit-Mantra-Logo" src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png" />
      {submitted ? (
        <p className="text-green-600 text-center font-medium text-lg">
          Thank you for reaching out! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Field */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Contact Field */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Contact no.</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here"
              rows="5"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:-translate-y-1"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactUs;
