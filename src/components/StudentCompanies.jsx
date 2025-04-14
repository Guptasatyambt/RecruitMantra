import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Users, Briefcase, Menu, Bell, Search, ChevronDown, 
  Settings, LogOut, ArrowUpRight, ArrowDownRight, Loader2,
  Calendar, TrendingUp, Building, GraduationCap, DollarSign,
  Medal, CheckCircle, Clock, MapPin, Globe, Users2
} from 'lucide-react';
import { dashboardAPI } from '../services/api';

const StudentCompanies = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('companies');
  const [notifications, setNotifications] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [companiesData, setCompaniesData] = useState({
    activeCompanies: [],
    upcomingCompanies: [],
    stats: {
      totalCompanies: 0,
      averagePackage: 0,
      highestPackage: 0
    }
  });

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

      if (response.data) {
        setUserInfo(response.data.user);
        fetchCompaniesData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  const fetchCompaniesData = async (user) => {
    try {
      setIsLoading(true);
      
      // Fetch active companies
      const active = await dashboardAPI.getActiveCompanies({
        collegeId: user.college
      });
      
      // Fetch upcoming companies
      const upcoming = await dashboardAPI.getUpcomingCompanies({
        collegeId: user.college
      });
      
      // Fetch company statistics
      const statistics = await dashboardAPI.getCompanyStatistics({
        collegeId: user.college
      });
      
      setCompaniesData({
        activeCompanies: active,
        upcomingCompanies: upcoming,
        stats: statistics
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching companies data:', error);
      setIsLoading(false);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="flex items-center justify-between px-4">
          <h1 className="text-white text-xl font-bold">Student Portal</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1">
          <NavigationLink icon={BarChart} label="Dashboard" id="dashboard" />
          <NavigationLink icon={Briefcase} label="Placements" id="placements" />
          <NavigationLink icon={Building} label="Companies" id="companies" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full py-3 px-4 rounded-lg text-indigo-100 hover:bg-indigo-700 hover:text-white transition duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="relative flex-1 max-w-md mx-4">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${searchFocused ? 'opacity-0' : 'opacity-100'}`}>
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search companies"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {userInfo?.name?.charAt(0) || 'S'}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Your Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Companies Content */}
        <main className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{companiesData.stats.totalCompanies}</p>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Package</p>
                      <p className="text-2xl font-bold text-gray-900">₹{companiesData.stats.averagePackage} LPA</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Highest Package</p>
                      <p className="text-2xl font-bold text-gray-900">₹{companiesData.stats.highestPackage} LPA</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Active Companies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companiesData.activeCompanies.map((company, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain" />
                            ) : (
                              <Building className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                            <p className="text-sm text-gray-500">{company.industry}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>₹{company.package} LPA</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{company.location || 'On Campus'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Drive Date: {new Date(company.driveDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users2 className="h-4 w-4 mr-2" />
                          <span>Positions: {company.positions.join(', ')}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/companies/${company.id}`)}
                          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Companies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companiesData.upcomingCompanies.map((company, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain" />
                            ) : (
                              <Building className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                            <p className="text-sm text-gray-500">{company.industry}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>₹{company.package} LPA</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{company.location || 'On Campus'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Expected Drive: {new Date(company.expectedDriveDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users2 className="h-4 w-4 mr-2" />
                          <span>Positions: {company.positions.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentCompanies;