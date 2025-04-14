import { Routes, Route } from "react-router-dom";
import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Advance from "../pages/Advance";
import Beginner from "../pages/Beginner";
import ContactUs from "../pages/ContactUs";
import Career from "../pages/career";
import RedeemCoins from "../pages/RedeemCoins";
import Intermediate from "../pages/Intermediate";
import Feedback from "../pages/Feedback";
import Interview from "../pages/Interview";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
import CollegeAdminSignUp from "../auth/CollegeAdminSignUp";
import EmailVerification from "../auth/EmailVerification";
import Answer from "../components/SpeechToText";
import UserProfile from "../user/UserProfile";
import EditProfile from "../user/EditProfile";
import InterviewDetails from "../pages/InterviewDetails";
import SetupProfile from "../user/SetupProfile";
import AssetUpload from "../user/AssetUpload";
import Dashboard from "../components/Dashboard";
import AdminDashboard from "../components/AdminDashboard";
import Companies from "../components/Companies";
import Students from "../components/Student";
import AllStudents from "../components/AllStudents";
import StudentDashboard from '../components/StudentDashboard';
import NotFound from "../pages/notFound";
import JobDetails from "../pages/jobDetails";
import JobApplicationForm from "../pages/jobApplicationForm";
import Faq from "../pages/faq";
import Tips from "../pages/tips";
import Blog from "../pages/blog";
import StudentPlacements from "../components/StudentPlacements";

function AppRoutes() {
  return (
    <Routes>
      {/* Pages */}
      <Route exact path="/" element={<Home />} />
      <Route exact path="/about-us" element={<AboutUs />} />
      <Route exact path="/advance" element={<Advance />} />
      <Route exact path="/beginner" element={<Beginner />} />
      <Route exact path="/contact-us" element={<ContactUs />} />
      {/*       <Route exact path="/redeem-coins" element={<RedeemCoins />} /> */}
      <Route exact path="/careers" element={<Career />} />
{/*       <Route exact path="/redeem-coins" element={<RedeemCoins />} /> */}
      <Route exact path="/intermediate" element={<Intermediate />} />
      <Route exact path="/feedback" element={<Feedback />} />

      {/* Interview Routes */}
      <Route exact path="/interview/advanced/:id" element={<Interview />} />
      <Route exact path="/interview/intermediate/:id" element={<Interview />} />
      <Route exact path="/interview/beginner/:id" element={<Interview />} />
      <Route exact path="/feedback/:id" element={<Feedback />} />
      <Route
        exact
        path="/interview-details/:id"
        element={<InterviewDetails />}
      />

      {/* User Routes */}
      <Route path="/setup-profile" element={<SetupProfile />} />
      <Route path="/upload-documents" element={<AssetUpload />} />
      <Route exact path="/profile" element={<UserProfile />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      {/* Authorization Routes */}
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/login" element={<Login />} />
      <Route
        exact
        path="/college-admin-signup"
        element={<CollegeAdminSignUp />}
      />
      <Route exact path="/email-verification" element={<EmailVerification />} />
      {/* Test Route */}
      <Route exact path="/test" element={<Answer />} />

      {/* TNP Routes */}
      <Route element={<PrivateRoute requiredRole="college_admin" />}>
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/students" element={<Students />} />
          <Route path="/all-students" element={<AllStudents />} />
        </>
      </Route>

      <Route element={<PrivateRoute requiredRole="super_admin" />}>
        <>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </>
      </Route>

      
      <Route exact path = "*" element={<NotFound/>}/>

      <Route exact path="/job/:id" element={<JobDetails />} />
      <Route exact path="/apply/:id" element={<JobApplicationForm />} />

      <Route exact path = "/f-a-q" element={<Faq/>}/>
      <Route exact path = "/interview-tips" element={<Tips/>}/>
      <Route exact path = "/blog" element={<Blog/>}/>

      <Route element={<PrivateRoute />}>
        <>
          <Route path="/redeem-coins" element={<RedeemCoins />} />
        </>
      </Route>
      <Route path="/student-dashboard" element={<PrivateRoute />}>
        <Route index element={<StudentDashboard />} />
      </Route>
      <Route path="/my-stats" element={<StudentPlacements />} />
    </Routes>
  );
}

export default AppRoutes;
