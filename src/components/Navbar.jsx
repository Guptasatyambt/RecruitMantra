import React, { useState } from "react";
import { BiCoinStack, BiEdit, BiLogOut, BiPhone } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { ImInfo } from "react-icons/im";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <header className="b-300 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="">
          <img
            className="size-10 md:size-14 cursor-pointer inline"
            alt=""
            src="/assets/logo_RM.png"
            onClick={() => navigate("/")}
          ></img>
          <span className="mx-2 font-medium text-lg md:text-xl cursor-pointer" onClick={() => navigate("/")}>RecruitMantra</span>
        </div>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10">
            <div className="fixed top-0 right-0 w-64 h-full bg-white text-black shadow-lg z-20">
              <button
                className="text-gray-700 absolute top-4 right-4 text-2xl"
                onClick={() => setSidebarOpen(false)}
              >
                &times;
              </button>
              <ul className="mt-16 space-y-6 px-6">
                <li>
                  <a
                    href="#profile"
                    className="block text-lg"
                    onClick={() => navigate("/profile")}
                  >
                    <CgProfile className="inline mr-2" />
                    Your Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#profile"
                    className="block text-lg"
                    onClick={() => navigate("/profile")}
                  >
                    <BiEdit className="inline mr-2" />
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#profile"
                    className="block text-lg"
                    onClick={() => navigate("/redeem-coins")}
                  >
                    <BiCoinStack className="inline mr-2" />
                    Redeem Coins
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="block text-lg"
                    onClick={() => navigate("/contact-us")}
                  >
                    <BiPhone className="inline mr-2" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="block text-lg"
                    onClick={() => navigate("/about-us")}
                  >
                    <ImInfo className="inline mr-2" />
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#logout"
                    className="block text-lg"
                    onClick={() => navigate("/about-us")}
                  >
                    <BiLogOut className="inline mr-2" />
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        <ul className="flex items-center text-lg font-medium space-x-10">
          <li
            className="hidden md:block rounded-lg px-3 py-1 hover:bg-gray-400"
            onClick={() => navigate("/feedback")}
          >
            <a href="#feedback">Feedback</a>
          </li>
          <li
            className="hidden md:block rounded-lg px-3 py-1 hover:bg-gray-400"
            onClick={() => navigate("/contact-us")}
          >
            <a href="#contact">Contact Us</a>
          </li>
          <li
            className="hidden md:block rounded-lg px-3 py-1 hover:bg-gray-400"
            onClick={() => navigate("/about-us")}
          >
            <a href="#about">About Us</a>
          </li>
          <div className="relative">
            <img
              src="/assets/user (1).png"
              alt="Profile"
              className="size-8 md:size-10 rounded-full cursor-pointer"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setSidebarOpen(!sidebarOpen);
              }}
            />

            {dropdownOpen && (
              <div className="hidden md:block absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <CgProfile className="inline mr-2" />
                    Your Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <BiEdit className="inline mr-2" />
                    Edit Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/redeem-coins")}
                  >
                    <BiCoinStack className="inline mr-2" />
                    Redeem Coins
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/contact-us")}
                  >
                    <BiPhone className="inline mr-2" />
                    Contact us
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/about-us")}
                  >
                    <ImInfo className="inline mr-2" />
                    About us
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <BiLogOut className="inline mr-2" />
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
