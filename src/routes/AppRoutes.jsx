// import { Routes, Route } from "react-router-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Advance from "../pages/Advance";
import Beginner from "../pages/Beginner";
import ContactUs from "../pages/ContactUs";
import RedeemCoins from "../pages/RedeemCoins";
import Intermediate from "../pages/Intermediate";
import Feedback from "../pages/Feedback";
import Interview from "../pages/Interview";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
import EmailVerification from "../auth/EmailVerification";
import Answer from "../components/SpeechToText";
import UserProfile from "../user/UserProfile";
import EditProfile from "../user/EditProfile";
import InterviewDetails from "../pages/InterviewDetails";
import SetupProfile from "../user/SetupProfile";
import AssetUpload from "../user/AssetUpload";
import Dashboard from "../components/Dashboard";
import Companies from "../components/Companies";
import Students from "../components/Student";

function AppRoutes() {
  return (
    <Router>
      <Routes>
      {/* Pages */}
      <Route exact path="/" element={<Home />} />
      <Route exact path="/about-us" element={<AboutUs />} />
      <Route exact path="/advance" element={<Advance />} />
      <Route exact path="/beginner" element={<Beginner />} />
      <Route exact path="/contact-us" element={<ContactUs />} />
{/*       <Route exact path="/redeem-coins" element={<RedeemCoins />} /> */}
      <Route exact path="/intermediate" element={<Intermediate />} />
      <Route exact path="/feedback" element={<Feedback />} />

      {/* Interview Routes */}
      <Route exact path="/interview/advanced/:id" element={<Interview />} />
      <Route exact path="/interview/intermediate/:id" element={<Interview />} />
      <Route exact path="/interview/beginner/:id" element={<Interview />} />
      <Route exact path="/feedback/:id" element={<Feedback />} />
      <Route exact path="/interview-details/:id" element={<InterviewDetails />} />

      {/* User Routes */}
      <Route path="/setup-profile" element={<SetupProfile />} />
      <Route path="/upload-documents" element={<AssetUpload />} />
      <Route exact path="/profile" element={<UserProfile />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      {/* Authorization Routes */}
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/email-verification" element={<EmailVerification />} />
      {/* Test Route */}
      <Route exact path="/test" element={<Answer />} />

      {/* TNP Routes */}
      <Route exact path = "/dashboard" element={<Dashboard/>}/>
      <Route exact path = "/companies" element={<Companies/>}/>
      <Route exact path = "/students" element={<Students/>}/>
      
      <Route element={<PrivateRoute />}>
          <Route path="/redeem-coins" element={<RedeemCoins />} />
        </Route>
      </Routes>
    </Router>
    
  );
}

export default AppRoutes;
