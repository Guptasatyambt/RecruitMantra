import { useEffect, useState } from 'react';
import React from 'react';
import { Building2, Users, BarChart, Menu, Bell, Search, ChevronDown, Settings, LogOut, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';
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
      
      const response = await companyAPI.getAllCompanies();
      let companiesData = response.data.data;
      
      // Filter companies based on user role
      if (user && user.role === 'college_admin' && user.college) {
        // For college admin, only show companies that visited their college
        companiesData = companiesData.filter(company => 
          company.college?.toLowerCase() === user.college.toLowerCase() ||
          company.colleges?.some(c => c.toLowerCase() === user.college.toLowerCase())
        );
      }
      
      setCompanies(companiesData);
      
      // Calculate stats
      const activeCompanies = companiesData.filter(company => company.status === 'active' || company.status === 'recruiting');
      const totalAvgPackage = companiesData.length > 0 
        ? companiesData.reduce((total, company) => total + (company.package_lpa || 0), 0) / companiesData.length
        : 0;
        
      setStats({
        totalCompanies: companiesData.length,
        activelyRecruiting: activeCompanies.length,
        avgPackage: parseFloat(totalAvgPackage.toFixed(1))
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
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
            <h3 className="text-gray-700 text-3xl font-medium">Companies</h3>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading company data...</p>
              </div>
            ) : (
              <>
                {/* Company Stats */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default Companies;