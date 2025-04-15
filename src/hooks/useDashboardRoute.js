import { useLocation } from 'react-router-dom';

/**
 * Custom hook to check if the current route is a dashboard-related route
 * @returns {boolean} - True if current route is dashboard-related, false otherwise
 */
const useDashboardRoute = () => {
  const location = useLocation();
  const path = location.pathname;

  // List of dashboard-related routes where Navbar should be hidden
  const dashboardRoutes = [
    '/dashboard',
    '/admin-dashboard',
    '/student-dashboard',
    '/companies',
    '/students',
    '/all-students',
    '/admin-management',
    '/college-admins',
    '/analytics',
    '/settings',
    '/my-stats',
    '/student-companies'
  ];

  // Check if the current path starts with any of the dashboard routes
  return dashboardRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export default useDashboardRoute;