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

// Student related API calls
export const studentAPI = {
  // Get all students
  getAllStudents: () => {
    return API.get('/student/all')
  },
  
  // Get student details
  getStudentById: (studentId) => {
    return API.get(`/student/${studentId}`);
  },
  
  // Add new student
  addStudent: (studentData) => {
    return API.post('/student/add', studentData);
  },
  
  // Update student
  updateStudent: (studentId, studentData) => {
    return API.put(`/student/update/${studentId}`, studentData);
  },
  
  // Delete student
  deleteStudent: (studentId) => {
    return API.delete(`/student/delete/${studentId}`);
  },

  getAppliedCompanies: () => {
    return API.get('/student/upcoming-drives');
  },
  getPlacementDetail: () => {
    return API.get('/student/recent-placements');
  },
  getApplicationDetail: (id) => {
    return API.get(`/student/application/${id}`);
  }
};