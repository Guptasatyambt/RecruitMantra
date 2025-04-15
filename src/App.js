import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import useDashboardRoute from "./hooks/useDashboardRoute";

function App() {
  // Use the custom hook to determine if we're on a dashboard route
  const isDashboardRoute = useDashboardRoute();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Conditionally render Navbar based on current route */}
      {!isDashboardRoute && <Navbar />}
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
