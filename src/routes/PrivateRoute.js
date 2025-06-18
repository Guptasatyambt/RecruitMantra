import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isApproved, setIsApproved] = useState(true); // Default to true for non-college admins
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token || token === "null" || token === "undefined") {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        // Get user info to check role
        const response = await axios.get("http://localhost:5001/user/getinfo", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setUserRole(response.data.user.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requiredRole is specified, check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // For routes that require super_admin
    if (requiredRole === 'super_admin' && userRole !== 'super_admin') {
      return <Navigate to="/" replace />;
    }
    
    return <Navigate to="/" replace />;
  }
  
  // For college_admin, check if they're approved
  if (userRole === 'college_admin' && !isApproved) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
