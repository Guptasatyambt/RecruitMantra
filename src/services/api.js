import axios from 'axios';
import {studentAPI} from './studentAPI'
// Create an axios instance with base URL
const API = axios.create({
  baseURL: 'https://api.recruitmantra.com',
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

// Company related API calls
export const companyAPI = {
  // Get all companies
  getAllCompanies: (status) => {
    return API.get(`/dashboard/company/list${status ? `?status=${status}` : ''}`);
  },

  // Get company details
  getCompanyDetails: (companyId) => {
    return API.get(`/company/details/${companyId}`);
  },

  // Get eligible companies for current user
  getEligibleCompanies: () => {
    return API.get('/dashboard/company/eligible');
  },

  // Add new company
  addCompany: (companyData) => {
    return API.post('/dashboard/company/add', companyData);
  },

  // Update company
  updateCompany: (companyId, companyData) => {
    return API.post(`/dashboard/company/update/${companyId}`, companyData);
  },

  // Update company hiring status
  updateHiringStatus: (companyId, statusData) => {
    return API.post(`/dashboard/company/update-status/${companyId}`, statusData);
  },

  // Delete company
  deleteCompany: (companyId) => {
    return API.delete(`/dashboard/delete/${companyId}`);
  },
};

// Dashboard specific API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await companyAPI.getAllCompanies();
      const companies = response.data.data;

      // Calculate statistics
      const stats = {
        companiesVisited: companies.length,
        studentsPlaced: companies.reduce((total, company) => total + company.students_hired, 0),
        placementRate: 0, // This would need additional data to calculate
        avgPackage: companies.length > 0
          ? companies.reduce((total, company) => total + company.package_lpa, 0) / companies.length
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get student-specific dashboard statistics
  getStudentStats: async () => {
    try {
      // Fetch companies data for student's college
      const response = await companyAPI.getAllCompanies();
      const allStudents = await studentAPI.getAllStudents()
      const total_students = allStudents?.data?.data?.length || 0;
      const companies = response.data.data;
      var total_placed_students = 0;
      for (var company in companies) {
        total_placed_students += companies[company].students_hired;
      }
      // Calculate student-specific statistics
      const stats = {
        totalCompanies: companies.length,
        avgPackage: companies.length > 0
          ? parseFloat((companies.reduce((total, company) => total + company.package_lpa, 0) / companies.length).toFixed(1))
          : 0,
        placementRate: ((total_placed_students / total_students) * 100) || 0, // Placeholder value - would need actual data from backend
        trendData: [] // Will be populated by getPlacementTrends
      };

      // Get trend data for chart
      const trends = await dashboardAPI.getPlacementTrends();
      stats.trendData = trends;

      return stats;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  },

  // Get upcoming drives for student
  getUpcomingDrives: async (params) => {
    try {
      // Fetch upcoming drives for student's college
      const response = await API.get(`/student/upcoming-drives?college=${params.college}`);

      if (response.data && response.data.data) {
        return response.data.data.map(drive => ({
          companyName: drive.company_name,
          date: new Date(drive.visit_date).toLocaleDateString(),
          location: drive.location || 'On Campus',
          position: drive.position,
          package: drive.package_lpa,
          eligibility: drive.eligibility || {}
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching upcoming drives:', error);
      throw error;
    }
  },

  // Get placement trends
  getPlacementTrends: async () => {
    try {
      const response = await companyAPI.getAllCompanies('completed');
      const companies = response.data.data;

      // Group by month and calculate trends
      const trends = [];
      const monthMap = {};

      companies.forEach(company => {
        const date = new Date(company.visit_date);
        const month = date.toLocaleString('default', { month: 'short' });

        if (!monthMap[month]) {
          monthMap[month] = {
            month,
            placements: 0,
            offers: 0,
            avgPackage: 0,
            totalPackage: 0,
            companyCount: 0
          };
        }

        monthMap[month].placements += company.students_hired;
        monthMap[month].offers += company.students_hired; // Assuming offers = placements for now
        monthMap[month].totalPackage += company.package_lpa;
        monthMap[month].companyCount += 1;
      });

      // Calculate averages and format data
      Object.values(monthMap).forEach(item => {
        if (item.companyCount > 0) {
          item.avgPackage = item.totalPackage / item.companyCount;
        }

        trends.push({
          month: item.month,
          placements: item.placements,
          offers: item.offers,
          avgPackage: parseFloat(item.avgPackage.toFixed(1))
        });
      });

      return trends.sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
    } catch (error) {
      console.error('Error fetching placement trends:', error);
      throw error;
    }
  },

  // Get top recruiting companies
  getTopCompanies: async () => {
    try {
      const response = await companyAPI.getAllCompanies();
      const companies = response.data.data;


      // Sort by students hired and get top 5
      const topCompanies = companies
        .sort((a, b) => b.students_hired - a.students_hired)
        .slice(0, 5)
        .map(company => ({
          name: company.company_name,
          hires: company.students_hired,
          avgPackage: company.package_lpa,
          college: company.college_id
        }));

      return topCompanies;
    } catch (error) {
      console.error('Error fetching top companies:', error);
      throw error;
    }
  },

  // Get recent placements
  getRecentPlacements: async (params) => {
    try {
      // If college parameter is provided, use it to filter results
      const endpoint = params && params.college
        ? `/collegeadmin/recent-placements?college=${params.college}`
        : '/collegeadmin/recent-placements';

      const response = await API.get(endpoint);

      if (response.data) {
        // Format the data from the backend to match the expected format in the frontend
        const placements = response.data.data.flatMap(placement => {
          return placement.hired_students.map(student => ({
            studentName: student.name,
            companyName: placement.company_name,
            position: placement.position,
            package: placement.package_lpa,
            date: new Date(placement.placement_date).toLocaleDateString(),
            status: 'Joined' // Default status for hired students
          }));
        });

        // Return the most recent placements (up to 10)
        return placements.slice(0, 10);
      }

      return [];
    } catch (error) {
      console.error('Error fetching recent placements:', error);
      throw error;
    }
  },

  // Get active companies for student's college
  getActiveCompanies: async (params) => {
    try {
      const response = await API.get(`/student/active-companies?college=${params.collegeId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active companies:', error);
      throw error;
    }
  },

  // Get upcoming companies for student's college
  getUpcomingCompanies: async (params) => {
    try {
      const response = await API.get(`/student/upcoming-companies?college=${params.collegeId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching upcoming companies:', error);
      throw error;
    }
  },

  // Get company statistics for student's college
  getCompanyStatistics: async (params) => {
    try {
      const response = await API.get(`/student/company-statistics?college=${params.collegeId}`);
      return {
        totalCompanies: response.data.totalCompanies || 0,
        averagePackage: response.data.averagePackage || 0,
        highestPackage: response.data.highestPackage || 0
      };
    } catch (error) {
      console.error('Error fetching company statistics:', error);
      throw error;
    }
  },

  getRecentPlacementsStudents: async (params) => {
    try {
      // If college parameter is provided, use it to filter results
      const endpoint = params && params.college
        ? `/student/recent-placements?college=${params.college}`
        : '/student/recent-placements';

      const response = await API.get(endpoint);

      if (response.data && response.data.data) {
        // Format the data from the backend to match the expected format in the frontend
        const placements = response.data.data.flatMap(placement => {
          return placement.hired_students.map(student => ({
            studentName: student.name,
            companyName: placement.company_name,
            position: placement.position,
            package: placement.package_lpa,
            date: new Date(placement.placement_date).toLocaleDateString(),
            status: 'Joined' // Default status for hired students
          }));
        });

        // Return the most recent placements (up to 10)
        return placements.slice(0, 10);
      }

      return [];
    } catch (error) {
      console.error('Error fetching recent placements:', error);
      throw error;
    }
  }
};

export default API;

