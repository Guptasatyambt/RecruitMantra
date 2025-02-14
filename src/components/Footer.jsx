import React from 'react';
import { useNavigate } from "react-router-dom";//1
import { Github, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

function Footer() {
  const navigate = useNavigate();//2
  const token = localStorage.getItem("token");//3
  return (
    <footer className="bg-gray-900 text-white font-roboto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/assets/logo_RM.png" alt="Recruit Mantra Logo" className="h-10 w-10" />
              <h3 className="text-xl font-bold">Recruit Mantra</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Master your interview skills with AI-powered practice sessions and real-time feedback.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Practice</a>
              </li>
              <li>
                <button
                    onClick={() => {
                      if (token) {
                        navigate("/redeem-coins");
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Rewards
                  </button>
{/*                 <a href="/redeem-coins" className="text-gray-400 hover:text-white transition-colors">Rewards</a> */}
              </li>
              <li>
                <a href="about-us" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Interview Tips</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="/feedback" className="text-gray-400 hover:text-white transition-colors">Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href="mailto:support@interviewai.com" className="text-gray-400 hover:text-white transition-colors">
                  support@recruitmantra.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                  +91 XXXXXXXXXX
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 Recruit Mantra. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
