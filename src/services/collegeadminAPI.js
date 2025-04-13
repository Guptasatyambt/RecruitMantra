import axios from 'axios';

// Create an axios instance with base URL
const API = axios.create({
  baseURL: 'https://api.recruitmantra.com', // Assuming server runs on port 5001
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// College Admin related API calls
export const collegeadminAPI = {
  // Add a single student
  addSingleStudent: (studentData) => {
    return API.post('/collegeadmin/student/add', studentData);
  },
  
  // Add multiple students in bulk
  addStudentsBulk: (studentsData) => {
    return API.post('/collegeadmin/students/bulk', studentsData);
  },
  
  // Mark students as hired
  markStudentsHired: (data) => {
    return API.post('/collegeadmin/mark-hired', data);
  },
  
  // Get recent placements
  getRecentPlacements: () => {
    return API.get('/collegeadmin/recent-placements');
  },
};