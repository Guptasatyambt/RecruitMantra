import { BrowserRouter } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
