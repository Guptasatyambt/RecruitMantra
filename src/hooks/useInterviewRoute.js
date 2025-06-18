import { useLocation } from 'react-router-dom';

/**
 * Custom hook to check if the current route is an interview-related route
 * @returns {boolean} - True if current route is interview-related, false otherwise
 */
const useInterviewRoute = () => {
  const location = useLocation();
  const path = location.pathname;

  // List of interview-related routes where special handling is needed
  const interviewRoutes = [
    '/interview/advanced',
    '/interview/intermediate',
    '/interview/beginner',
    '/interview/hr-behavioral',
    '/interview-details',
    '/login',
    '/college-admin-signup',
    '/signup',
    '/email-verification'
  ];

  // Check if the current path starts with any of the interview routes
  return interviewRoutes.some(route => 
    path.startsWith(route)
  );
};

export default useInterviewRoute;