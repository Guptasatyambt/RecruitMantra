import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Users, Briefcase, Menu, Bell, Search, ChevronDown, 
  Settings, LogOut, ArrowUpRight, ArrowDownRight, Loader2,
  Calendar, TrendingUp, Building, GraduationCap, DollarSign,
  Medal, CheckCircle, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('dashboard');
  const [notifications, setNotifications] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [placementStats, setPlacementStats] = useState({
    totalCompanies: 0,
    avgPackage: 0,
    placementRate: 0
  });
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);

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
        fetchDashboardData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  const fetchDashboardData = async (user) => {
    try {
      setIsLoading(true);
      
      // Fetch student-specific dashboard data
      const stats = await dashboardAPI.getStudentStats();
      setPlacementStats(stats);
      
      // Fetch upcoming drives for student's college
      const drives = await dashboardAPI.getUpcomingDrives({
        college: user.college
      });
      setUpcomingDrives(drives);
      
      // Fetch recent placements for student's college
      const placements = await dashboardAPI.getRecentPlacementsStudents({
        college: user.college
      });
      setRecentPlacements(placements);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          <NavigationLink icon={BarChart} label="Dashboard" id="student-dashboard" />
          <NavigationLink icon={Briefcase} label="My Stats" id="my-stats" />
          <NavigationLink icon={Building} label="Companies" id="student-companies" />
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
                placeholder="Search"
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

        {/* Dashboard Content */}
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
                      <p className="text-sm font-medium text-gray-500">Total Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{placementStats.totalCompanies}</p>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Package</p>
                      <p className="text-2xl font-bold text-gray-900">₹{placementStats.avgPackage} LPA</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Placement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{placementStats.placementRate}%</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Drives</h2>
                  <div className="space-y-4">
                    {upcomingDrives.length > 0 ? (
                      upcomingDrives.slice(0, 3).map((drive, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{drive.companyName}</h3>
                            <p className="text-sm text-gray-500">{drive.date} • {drive.location}</p>
                          </div>
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            View
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming drives</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Placements</h2>
                  <div className="space-y-4">
                    {recentPlacements.length > 0 ? (
                      recentPlacements.slice(0, 3).map((placement, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{placement.studentName}</h3>
                            <p className="text-sm text-gray-500">{placement.companyName} • ₹{placement.package} LPA</p>
                          </div>
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            View
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent placements</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Placement Trends</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={placementStats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="placements" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;