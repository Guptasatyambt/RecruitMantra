import { useEffect, useState } from 'react';
import React from 'react';
import { Building2, Users, BarChart, Menu, Bell, Search, ChevronDown, Settings, LogOut, Briefcase, GraduationCap, TrendingUp, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import axios from 'axios';

const Companies = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('companies');
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activelyRecruiting: 0,
    avgPackage: 0
  });
  // Add state for company form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    industry: '',
    position: '',
    package_lpa: '',
    job_description: '',
    visit_date: '',
    application_deadline: '',
    eligibility_criteria: {
      min_cgpa: '',
      allowed_branches: [],
      allowed_batch_year: ''
    }
  });

  // Fetch user info on component mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('https://api.recruitmantra.com/user/getinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        fetchCompanies(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  const fetchCompanies = async (user) => {
    try {
      setLoading(true);
      
      // Check if we have a status filter
      const statusFilter = user?.filterStatus || '';
      const response = await companyAPI.getAllCompanies(statusFilter);
      let companiesData = response.data.data;
      
      // Filter companies based on user role
      if (user && user.role === 'college_admin' && user.college) {
        // For college admin, only show companies that visited their college
        companiesData = companiesData.filter(company => 
          company.college?.toLowerCase() === user.college.toLowerCase() ||
          company.colleges?.some(c => c.toLowerCase() === user.college.toLowerCase()) ||
          company.college_id === user.college
        );
      }
      
      setCompanies(companiesData);
      
      // Calculate stats with improved categorization
      const upcomingCompanies = companiesData.filter(company => company.status === 'upcoming');
      const ongoingCompanies = companiesData.filter(company => company.status === 'ongoing');
      const completedCompanies = companiesData.filter(company => company.status === 'completed');
      
      // Calculate actively recruiting (upcoming + ongoing)
      const activelyRecruiting = upcomingCompanies.length + ongoingCompanies.length;
      
      // Calculate average package with proper handling of missing values
      const validPackages = companiesData.filter(company => company.package_lpa && !isNaN(company.package_lpa));
      const totalAvgPackage = validPackages.length > 0 
        ? validPackages.reduce((total, company) => total + parseFloat(company.package_lpa), 0) / validPackages.length
        : 0;
      
      // Calculate total students hired
      const totalStudentsHired = companiesData.reduce((total, company) => {
        return total + (company.students_hired ? parseInt(company.students_hired) : 0);
      }, 0);
        
      setStats({
        totalCompanies: companiesData.length,
        activelyRecruiting: activelyRecruiting,
        avgPackage: parseFloat(totalAvgPackage.toFixed(1)),
        totalStudentsHired: totalStudentsHired
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (eligibility_criteria)
      const [parent, child] = name.split('.');
      setNewCompany({
        ...newCompany,
        [parent]: {
          ...newCompany[parent],
          [child]: value
        }
      });
    } else {
      setNewCompany({
        ...newCompany,
        [name]: value
      });
    }
  };

  // Handle branches selection (multi-select)
  const handleBranchesChange = (e) => {
    const options = e.target.options;
    const selectedBranches = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedBranches.push(options[i].value);
      }
    }
    
    setNewCompany({
      ...newCompany,
      eligibility_criteria: {
        ...newCompany.eligibility_criteria,
        allowed_branches: selectedBranches
      }
    });
  };

  // Handle add company form submission
  const handleAddCompany = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    if (!newCompany.company_name || !newCompany.industry || !newCompany.position || 
        !newCompany.package_lpa || !newCompany.job_description || !newCompany.visit_date || 
        !newCompany.application_deadline || !newCompany.eligibility_criteria.min_cgpa || 
        newCompany.eligibility_criteria.allowed_branches.length === 0 || 
        !newCompany.eligibility_criteria.allowed_batch_year) {
      setFormError('Please fill all required fields');
      return;
    }

    try {
      // Convert package_lpa to number
      const companyData = {
        ...newCompany,
        package_lpa: parseFloat(newCompany.package_lpa)
      };
      
      await companyAPI.addCompany(companyData);
      setShowAddModal(false);
      setNewCompany({
        company_name: '',
        industry: '',
        position: '',
        package_lpa: '',
        job_description: '',
        visit_date: '',
        application_deadline: '',
        eligibility_criteria: {
          min_cgpa: '',
          allowed_branches: [],
          allowed_batch_year: ''
        }
      });
      fetchCompanies(userInfo); // Refresh company list
    } catch (error) {
      console.error('Error adding company:', error);
      setFormError(error.response?.data?.message || 'Failed to add company');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const NavigationLink = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => {
        setActiveLink(id);
        navigate(`/${id}`);
      }}
      className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition duration-200 ${
        activeLink === id
          ? 'bg-indigo-700 text-white' 
          : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">RecruitMantra</span>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className={`relative ${searchFocused ? 'ring-2 ring-indigo-400' : ''} 
            bg-indigo-700/50 rounded-lg transition-all duration-200`}>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent py-2 pl-8 pr-4 text-white placeholder-indigo-300 focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-indigo-300" />
          </div>
        </div>

        <nav className="space-y-2 px-2">
          <NavigationLink icon={BarChart} label="Dashboard" id="dashboard" />
          <NavigationLink icon={Building2} label="Companies" id="companies" />
          <NavigationLink icon={GraduationCap} label="Students" id="students" />
          <NavigationLink icon={TrendingUp} label="Statistics" id="statistics" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Companies</h2>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                    bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center 
                    justify-center animate-bounce">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                    flex items-center justify-center text-white font-semibold">
                    {userInfo?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-gray-700">{userInfo?.name || 'Admin'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Companies Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 text-3xl font-medium">Companies</h3>
              <div className="flex space-x-4">
                {/* Status Filter Dropdown */}
                <select 
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => {
                    const status = e.target.value;
                    fetchCompanies({...userInfo, filterStatus: status});
                  }}
                >
                  <option value="">All Companies</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                
                {/* Add Company Button */}
                {userInfo?.role === 'college_admin' && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add Company
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading company data...</p>
              </div>
            ) : (
              <>
                {/* Company Stats */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                      <Building2 className="h-12 w-12 text-blue-500" />
                      <div className="ml-4">
                        <h4 className="text-2xl font-semibold text-gray-700">{stats.totalCompanies}</h4>
                        <p className="text-gray-500">Total Companies</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                      <Users className="h-12 w-12 text-green-500" />
                      <div className="ml-4">
                        <h4 className="text-2xl font-semibold text-gray-700">{stats.activelyRecruiting}</h4>
                        <p className="text-gray-500">Actively Recruiting</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                      <BarChart className="h-12 w-12 text-purple-500" />
                      <div className="ml-4">
                        <h4 className="text-2xl font-semibold text-gray-700">{stats.avgPackage} LPA</h4>
                        <p className="text-gray-500">Avg. Package Offered</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                      <GraduationCap className="h-12 w-12 text-orange-500" />
                      <div className="ml-4">
                        <h4 className="text-2xl font-semibold text-gray-700">{stats.totalStudentsHired || 0}</h4>
                        <p className="text-gray-500">Students Placed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company List */}
                <div className="mt-8">
                  <h4 className="text-gray-700 text-xl font-medium mb-4">Participating Companies</h4>
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {companies.length > 0 ? (
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Company Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Industry
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Positions Offered
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Avg. Package (LPA)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Visit Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Students Hired
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((company, index) => (
                            <tr key={company._id || index}>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{company.company_name}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{company.industry || 'N/A'}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{company.position || 'N/A'}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{company.package_lpa || 'N/A'}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {company.visit_date ? new Date(company.visit_date).toLocaleDateString() : 'N/A'}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {company.students_hired !== undefined ? company.students_hired : 'N/A'}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${company.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : company.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                  {company.status ? company.status.charAt(0).toUpperCase() + company.status.slice(1) : 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-5 text-center text-gray-500">
                        No companies found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Company</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddCompany}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={newCompany.company_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    value={newCompany.industry}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={newCompany.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA) *</label>
                  <input
                    type="number"
                    name="package_lpa"
                    value={newCompany.package_lpa}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                  <textarea
                    name="job_description"
                    value={newCompany.job_description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                  <input
                    type="date"
                    name="visit_date"
                    value={newCompany.visit_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    name="application_deadline"
                    value={newCompany.application_deadline}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum CGPA *</label>
                  <input
                    type="number"
                    name="eligibility_criteria.min_cgpa"
                    value={newCompany.eligibility_criteria.min_cgpa}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Branches *</label>
                  <select
                    name="eligibility_criteria.allowed_branches"
                    multiple
                    value={newCompany.eligibility_criteria.allowed_branches}
                    onChange={handleBranchesChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    size="4"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple branches</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Batch Year *</label>
                  <select
                    name="eligibility_criteria.allowed_batch_year"
                    value={newCompany.eligibility_criteria.allowed_batch_year}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Batch Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;