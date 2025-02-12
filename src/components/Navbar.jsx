import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { BiEdit, BiCoinStack, BiLogOut } from "react-icons/bi";
import { FaUniversity } from "react-icons/fa";
import { Menu, X, Home, Info, Phone, Briefcase, MessageSquare } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
      
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About Us", path: "/about-us", icon: Info },
    { name: "Contact", path: "/contact-us", icon: Phone },
    { name: "Careers", path: "/careers", icon: Briefcase },
    ...(token ? [{ name: "Feedback", path: "/feedback", icon: MessageSquare }] : []),
  ];

  return (
    <header 
      className={`bg-white sticky top-0 z-50 shadow-sm transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img
                className="h-12 w-12 transform transition-transform duration-300 group-hover:scale-110"
                alt="RecruitMantra Logo"
                src="/assets/logo_RM.png"
              />
              <div className="absolute -inset-2 bg-gray-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </div>
            <span className="text-1xl font-bold text-gray-800">
              RecruitMantra
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative px-2">
                <button
                  onClick={() => {
                    navigate(link.path);
                    setActiveLink(link.path);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative
                    ${activeLink === link.path 
                      ? 'text-gray-900' 
                      : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {link.name}
                  {activeLink === link.path && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 rounded-full"></div>
                  )}
                  <div className="absolute inset-0 bg-gray-100 rounded-full scale-0 opacity-0 transition-all duration-300 hover:scale-100 hover:opacity-100 -z-10"></div>
                </button>
              </div>
            ))}
          </div>

          {/* Mobile Menu and Auth Section */}
          <div className="flex items-center space-x-2">
            {/* Auth Section */}
            <div className="hidden md:flex items-center">
              {!token && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 text-sm font-medium text-gray-600 rounded-full transition-all duration-300 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-5 py-2 text-sm font-medium text-white rounded-full bg-gray-800 transition-all duration-300 hover:bg-gray-900 transform hover:scale-105 hover:shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {token && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative group"
                >
                  <img
                    src="/assets/user (1).png"
                    alt="Profile"
                    className="h-10 w-10 rounded-full ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-4"
                  />
                  <div className="absolute inset-0 bg-gray-200 rounded-full scale-110 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </button>

                <div
                  className={`absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-lg transform transition-all duration-300 origin-top-right overflow-hidden border border-gray-100
                    ${dropdownOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}
                >
                  <div className="p-2">
                    {[
                      { icon: CgProfile, label: "Your Profile", path: "/profile" },
                      { icon: BiEdit, label: "Edit Profile", path: "/edit-profile" },
                      { icon: FaUniversity, label: "Your College", path: "/dashboard" },
                      { icon: BiCoinStack, label: "Redeem Coins", path: "/redeem-coins" },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="w-full px-4 py-3 text-sm text-gray-700 rounded-xl flex items-center transition-all duration-200 group hover:bg-gray-50"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                        <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                          {item.label}
                        </span>
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-sm rounded-xl flex items-center transition-all duration-200 group hover:bg-red-50"
                    >
                      <BiLogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                      <span className="text-gray-700 group-hover:text-red-600 transform group-hover:translate-x-1 transition-all duration-200">
                        Log Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden fixed right-4 top-[73px] w-64 bg-white rounded-2xl shadow-lg transform transition-all duration-300 origin-top-right overflow-hidden border border-gray-100
            ${mobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
            }`}
        >
          <div className="p-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setActiveLink(link.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm text-gray-700 rounded-xl flex items-center transition-all duration-200 group hover:bg-gray-50"
              >
                <link.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                  {link.name}
                </span>
              </button>
            ))}
            {!token && (
              <>
                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-gray-700 rounded-xl flex items-center transition-all duration-200 group hover:bg-gray-50"
                >
                  <CgProfile className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    Sign In
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-gray-700 rounded-xl flex items-center transition-all duration-200 group hover:bg-gray-50"
                >
                  <BiEdit className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    Sign Up
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;