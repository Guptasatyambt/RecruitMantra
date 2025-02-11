import axios from "axios";
import React, { useState } from "react";
import { Send, Mail, User, Phone, MessageSquare, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Left Side - Contact Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <img
                    className="w-32 h-32 mx-auto mb-8"
                    alt="Recruit-Mantra-Logo"
                    src="https://internview-assets.s3.ap-south-1.amazonaws.com/batch-13---originals-8-high-resolution-logo-grayscale-transparent+(1).png"
                  />
                  <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5" />
                      <span>support@recruitmantra.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5" />
                      <span>+91 XXX XXX XXXX</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-gray-300 text-sm">
                  Working Hours: Monday - Friday, 9:00 AM - 6:00 PM IST
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-8">
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-semibold text-green-600 mb-2">Message Sent!</p>
                    <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject */}
                    <div className="md:col-span-2 relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                      </div>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                        required
                      />
                    </div>

                    {/* Name */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                        required
                      />
                    </div>

                    {/* Contact */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                      </div>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2 relative group">
                      <div className="absolute top-3 left-4 pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" />
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows="4"
                        className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-200 focus:border-gray-600 outline-none transition-colors bg-gray-50 rounded-lg resize-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <span>Send Message</span>
                    <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;