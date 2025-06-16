import axios from 'axios';
import { studentAPI } from './studentAPI'
import { collegeadminAPI } from './collegeadminAPI'
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
  getAllCompanies: () => {
    return API.get(`/company/list`);
  },
  getOverAllCompanies: () => {
    return API.get(`/company/all-companies`);
  },
  // Get company details
  getCompanyDetails: (companyId) => {
    return API.get(`/company/details/${companyId}`);
  },
  getCompanytoCollegeDetails: (companyId) => {
    return API.get(`/company/details-to-college/${companyId}`);
  },
  
  // Get eligible companies for current user
  getEligibleCompanies: () => {
    return API.get('/dashboard/company/eligible');
  },

  // Add new company
  addCompany: (companyData) => {
    return API.post('/company/add-company-to-college', companyData);
  },

  // Update company
  updateCompany: (companyId, companyData) => {
    return API.post(`/dashboard/company/update/${companyId}`, companyData);
  },

  // Update company hiring status
  updateHiringStatus: (companyId, statusData) => {
    return API.post(`/dashboard/company/update-status/${companyId}`, statusData);
  },
// apply student for a company
applyToCompany: (id) => {
    return API.post(`/company/apply/${id}`);
  },

  // Delete company
  deleteCompany: (companyId) => {
    return API.delete(`/dashboard/delete/${companyId}`);
  },
};

// Dashboard specific API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getDashboardStats: async (collegeId) => {
    try {
      const response = await companyAPI.getAllCompanies(collegeId);
      const companies = response.data.data;


      const res = await collegeadminAPI.getRecentPlacements();
      const placementData = res.data.data
      const placedStudentIds = [];

      const uniqueIds = new Set();

res.data.data.forEach(item => {
  if (item.student_id && !uniqueIds.has(item.student_id._id)) {
    uniqueIds.add(item.student_id._id);
    placedStudentIds.push(item.student_id._id);
  }
});

      const allStudents = await studentAPI.getAllStudents()
    const total_students = allStudents?.data?.data?.length || 0;
      // Calculate stats with improved categorization
      const completedCompanies = companies.filter(company => company.placeId > 0);

      // Calculate actively recruiting (upcoming + ongoing)
      const activelyRecruiting = companies.length - completedCompanies;

      // Calculate average package with proper handling of missing values
      const validPackages = companies.filter(company => company.packageLPA && !isNaN(company.packageLPA));
      const totalAvgPackage = validPackages.length > 0
        ? validPackages.reduce((total, company) => total + parseFloat(company.packageLPA), 0) / validPackages.length
        : 0;

      // Calculate total students hired
      const totalStudentsHired = placedStudentIds.length
      const rate_placement=(totalStudentsHired/total_students)*100;



  // Calculate statistics
  const stats = {
    companiesVisited: companies.length,
    totalPlacements:placementData.length,
    studentsPlaced: totalStudentsHired,
    placementRate: rate_placement, // This would need additional data to calculate
    avgPackage: parseFloat(totalAvgPackage.toFixed(1)),
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
    const allStudents = await studentAPI.getAllStudents();
    const res = await collegeadminAPI.getRecentPlacements();
      const placementData = res.data.data
      const placedStudentIds = [];

      
      const uniqueIds = new Set();

res.data.data.forEach(item => {
  if (item.student_id && !uniqueIds.has(item.student_id._id)) {
    uniqueIds.add(item.student_id._id);
    placedStudentIds.push(item.student_id._id);
  }
});


    const total_students = allStudents?.data?.data?.length || 0;
    const companies = response.data.data;
    var total_placed_students = placedStudentIds.length;
    const validPackages = companies.filter(company => company.packageLPA && !isNaN(company.packageLPA));
    const totalAvgPackage = validPackages.length > 0
      ? validPackages.reduce((total, company) => total + parseFloat(company.packageLPA), 0) / validPackages.length
      : 0;
      const ongoingCompanies = companies.filter(company => {
        return new Date(company.applicationDeadline) > new Date();
      });
    const rate_placement=(total_placed_students/total_students)*100||0;
    // Calculate student-specific statistics
    const stats = {
      totalCompanies: companies.length,
      avgPackage: parseFloat(totalAvgPackage.toFixed(1)),
      placementRate: rate_placement, // Placeholder value - would need actual data from backend
      onGoing:ongoingCompanies
    };

    // Get trend data for chart
    // const trends = await dashboardAPI.getPlacementTrends();
    // stats.trendData = trends;

    return stats;
  } catch (error) {
    console.error('Error fetching student stats:', error);
    throw error;
  }
},

  // Get upcoming drives for student
  getUpcomingDrives: async () => {
    try {
      // Fetch upcoming drives for student's college
      const response = await companyAPI.getAllCompanies();
      let companiesData = response.data.data;
      const activeCompanies = companiesData.filter(company=>company.placeId.length==0);
      if (response.data && response.data.data) {
        return response.data.data.map(drive => ({
          companyId:drive.companyId,
          companyName: drive.companyName,
          date: drive.visitDate,
          location: drive.location || 'On Campus',
          position: drive.role,
          package: drive.packageLPA
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
        const response = await companyAPI.getAllCompanies();
        const companies = response.data.data;
        const responseplacement=await collegeadminAPI.getRecentPlacements();
        const placement=responseplacement.data.data; 
        // Group by month and calculate trends
        const trends = [];
        const monthMap = {};

        companies.forEach(company => {
          const date = new Date(company.visitDate);
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
          monthMap[month].totalPackage += company.packageLPA;
          monthMap[month].companyCount += 1;
        });
        // const month = date.toLocaleString('default', { month: 'short' });
        // monthMap[month].placements += placement.length;
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
            const response=await collegeadminAPI.getRecentPlacements();

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

                getRecentPlacementsStudents: async () => {
                  try {
                    // If college parameter is provided, use it to filter results
                    const response=await collegeadminAPI.getRecentPlacements();
                    const RecentPlacements=response.data.data;
                    let placements=[]
                    if (response.data && response.data.data) {
                       placements = response.data.data.map(placement => ({
                        studentName: `${placement.student_id.firstName} ${placement.student_id.lastName}`,
                        companyName: placement.company_name,
                        package: placement.package_lpa?.$numberDecimal || "N/A",
                        date: new Date(placement.placement_date).toLocaleDateString()
                      }));
                    }
                    

                      // Return the most recent placements (up to 10)
                      return placements.slice(0, 10);

                    return [];
                  } catch (error) {
                    console.error('Error fetching recent placements:', error);
                    throw error;
                  }
                }
};

export default API;

