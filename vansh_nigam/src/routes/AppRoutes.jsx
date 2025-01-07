import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Advance from "../pages/Advance";
import Beginner from "../pages/Beginner";
import ContactUs from "../pages/ContactUs";
import RedeemCoins from "../pages/RedeemCoins";
import Intermediate from "../pages/Intermediate";
import Feedback from "../pages/Feedback";
import Profile from "../pages/Profile";
import Interview from "../pages/Interview";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
import EmailVerification from "../auth/EmailVerification";
import Answer from "../components/SpeechToText";
import UserProfile from "../user/UserProfile";
import EditProfile from "../user/EditProfile";
import InterviewDetails from "../pages/InterviewDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* Pages */}
      <Route exact path="/" element={<Home />} />
      <Route exact path="/about-us" element={<AboutUs />} />
      <Route exact path="/advance" element={<Advance />} />
      <Route exact path="/beginner" element={<Beginner />} />
      <Route exact path="/contact-us" element={<ContactUs />} />
      <Route exact path="/redeem-coins" element={<RedeemCoins />} />
      <Route exact path="/intermediate" element={<Intermediate />} />
      <Route exact path="/feedback" element={<Feedback />} />
      <Route exact path="/interview-details/:id" element={<InterviewDetails />} />


      {/* User Routes */}
      <Route exact path="/profile" element={<UserProfile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route exact path="/interview" element={<Interview />} />

      {/* Authorization Routes */}
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/email-verification" element={<EmailVerification />} />
      {/* Test Route */}
      <Route exact path="/test" element={<Answer />} />
    </Routes>
  );
}

export default AppRoutes;
