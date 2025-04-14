import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Users, Briefcase, Menu, Bell, Search, ChevronDown, 
  Settings, LogOut, ArrowUpRight, ArrowDownRight, Loader2,
  Calendar, TrendingUp, Building, GraduationCap, DollarSign,
  Medal, CheckCircle, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6M');
  const [selectedChart, setSelectedChart] = useState('line');
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    companiesVisited: 0,
    studentsPlaced: 0,
    placementRate: 0,
    avgPackage: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);

  const timeRanges = [
    { id: '1M', label: '1 Month' },
    { id: '3M', label: '3 Months' },
    { id: '6M', label: '6 Months' },
    { id: '1Y', label: 'Year' }
  ];

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
        fetchDashboardData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // navigate('/login');
    }
  };

  const fetchDashboardData = async (user) => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard statistics
      const stats = await dashboardAPI.getDashboardStats();
      
      // Filter stats based on user role if needed
      if (user && user.role === 'college_admin' && user.college) {
        // Here you would filter the stats based on the college
        // This depends on how your API is structured
      }
      
      setDashboardStats(stats);
      
      // Fetch placement trends
      const trends = await dashboardAPI.getPlacementTrends();
      setTrendData(trends);
      
      // Fetch top companies
      const companies = await dashboardAPI.getTopCompanies();
      
      // Filter companies based on user role
      let filteredCompanies = companies;
      console.log(filteredCompanies)
      if (user && user.role === 'college_admin' && user.college) {
        filteredCompanies = companies.filter(company => 
          company.college?.toLowerCase() === user.college.toLowerCase() ||
          company.colleges?.some(c => c.toLowerCase() === user.college.toLowerCase())
        );
      }
      console.log(user);
      
      console.log(filteredCompanies)
      
      setTopCompanies(filteredCompanies);
      
      // Fetch recent placements
      const placements = await dashboardAPI.getRecentPlacements();
      setRecentPlacements(placements);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
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

  const StatCard = ({ icon: Icon, label, value, trend, trendValue, bgColor }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-3xl font-bold text-gray-700">{value}</h4>
          <p className="text-gray-500">{label}</p>
        </div>
        {trend === 'up' ? (
          <ArrowUpRight className="w-6 h-6 text-green-500" />
        ) : (
          <ArrowDownRight className="w-6 h-6 text-red-500" />
        )}
      </div>
      <div className="mt-4">
        <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
          {trend === 'up' ? '+' : '-'}{trendValue}%
        </span>
        <span className="text-gray-400 ml-2">from last month</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
          <NavigationLink icon={Building} label="Companies" id="companies" />
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
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Placement Analytics</h2>
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-4 mb-8">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex space-x-2">
                {timeRanges.map(range => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedTimeRange(range.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                      ${selectedTimeRange === range.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                icon={Briefcase}
                label="Companies Visited"
                value={dashboardStats.companiesVisited}
                trend="up"
                trendValue="12"
                bgColor="bg-indigo-100 text-indigo-600"
              />
              <StatCard 
                icon={Users}
                label="Students Placed"
                value={dashboardStats.studentsPlaced}
                trend="up"
                trendValue="8"
                bgColor="bg-green-100 text-green-600"
              />
              <StatCard 
                icon={BarChart}
                label="Placement Rate"
                value={`${dashboardStats.placementRate}%`}
                trend="down"
                trendValue="2"
                bgColor="bg-yellow-100 text-yellow-600"
              />
              <StatCard 
                icon={DollarSign}
                label="Avg Package (LPA)"
                value={dashboardStats.avgPackage.toFixed(1)}
                trend="up"
                trendValue="15"
                bgColor="bg-purple-100 text-purple-600"
              />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Placement Trends */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-700">Placement Trends</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedChart('line')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        selectedChart === 'line' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setSelectedChart('bar')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        selectedChart === 'bar' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedChart === 'line' ? (
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="placements" 
                          stroke="#4F46E5" 
                          strokeWidth={2}
                          dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="offers" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ fill: '#10B981', strokeWidth: 2 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    ) : (
                      <RechartsBarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Bar dataKey="placements" fill="#4F46E5" />
                        <Bar dataKey="offers" fill="#10B981" />
                      </RechartsBarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Recruiting Companies */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-6">Top Recruiting Companies</h4>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <div key={company.name} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                            ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            <Medal className={`w-6 h-6 
                              ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-blue-600'}`} />
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{company.name}</h5>
                          <p className="text-sm text-gray-500">{company.hires} {company.hires>1?'students':'student'} hired</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{company.avgPackage} LPA</p>
                        {/* <p className="text-sm text-gray-500">Avg. Package</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Placements Table */}
            <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-700">Recent Placements</h4>
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors duration-200">
                    View All
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package (LPA)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPlacements.map((placement, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              {placement?.name?.charAt(0) || "P"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{placement.name}</div>
                              <div className="text-sm text-gray-500">{placement.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.package}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            placement.status === 'Joined' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {placement.status === 'Joined' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {placement.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;