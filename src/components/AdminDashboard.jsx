import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Users, Briefcase, Menu, Bell, Search, ChevronDown, 
  Settings, LogOut, CheckCircle, XCircle, Filter, Home, Info,
  Building, GraduationCap, PieChart, Shield, Database, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API, { dashboardAPI } from '../services/api';
import { studentAPI } from '../services/studentAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('admin-dashboard');
  const [notifications, setNotifications] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [collegeAdmins, setCollegeAdmins] = useState([]);
  const [students,setStudents]=useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [systemStats, setSystemStats] = useState({
    totalColleges: 0,
    totalStudents: 0,
    totalCompanies: 0,
    activePlacements: 0,
    placementTrends: []
  });
  const [activeForm, setActiveForm] = useState(null);
  const [branchName, setBranchName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeLocation, setCollegeLocation] = useState('');
  useEffect(() => {
    fetchCollegeAdmins();
    fetchSystemStats();
    fetchStudents();
    fetchCompany();
  }, []);

  const fetchCollegeAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // const response = await axios.get('https://api.recruitmantra.com/user/college-admins', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      const response=await API.collegeAdmins();
      console.log(response.data.data)

      if (response.data && response.data.data) {
        setCollegeAdmins(response.data.data);
        const pendingCount = response.data.data.filter(admin => !admin.isApproved).length;
        setNotifications(pendingCount);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching college admins:', error);
      setError('Failed to load college administrators. Please try again.');
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await dashboardAPI.getAdminStats();
      setSystemStats(response.data);
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const fetchStudents= async()=>{
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // const response = await axios.get('https://api.recruitmantra.com/student/all', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      const response=await studentAPI.getAllStudents();
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students', error);
      setError('Failed to load students. Please try again.');
      setLoading(false);
    }
  };

  const fetchCompany= async()=>{
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('https://api.recruitmantra.com/company/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filterStatus !== 'all' ? { status: filterStatus } : {},
      });

      if (response.data && response.data.data) {
        setCompanies(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students', error);
      setError('Failed to load students. Please try again.');
      setLoading(false);
    }
  };

  const handleApproval = async (adminId, approved) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log(adminId,approved)

      await axios.post('https://api.recruitmantra.com/admin/approve-college-admin', 
        { adminId, approved },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchCollegeAdmins();
    } catch (error) {
      console.error('Error updating approval status:', error);
      setError('Failed to update approval status. Please try again.');
      setLoading(false);
    }
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://api.recruitmantra.com/branch/',
        { branchName: branchName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Branch added successfully');
      setBranchName('');
    } catch (err) {
      console.error(err);
      alert('Error adding branch');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://api.recruitmantra.com/college/',
        { name: collegeName, location: collegeLocation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('College added successfully');
      setCollegeName('');
      setCollegeLocation('');
    } catch (err) {
      console.error(err);
      alert('Error adding college');
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const paginatedStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredAdmins = collegeAdmins.filter(admin => {
    if (filterStatus === 'pending') return !admin.isApproved;
    if (filterStatus === 'approved') return admin.isApproved;
    return true;
  }).filter(admin => {
    if (!searchTerm) return true;
    return (
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.college.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const NavigationLink = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => {
        setActiveLink(id);
        // navigate(`/${id}`);
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
          <h1 className="text-white text-xl font-bold">Super Admin Portal</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1">
          <NavigationLink icon={Home} label="Dashboard" id="admin-dashboard" />
          <NavigationLink icon={Shield} label="Admin Management" id="admin-management" />
          <NavigationLink icon={GraduationCap} label="College Admins" id="college-admins" />
          <NavigationLink icon={Building} label="Companies" id="companies" />
          <NavigationLink icon={Users} label="Students" id="students" />
          <NavigationLink icon={Database} label="System Analytics" id="analytics" />
          <NavigationLink icon={Settings} label="Settings" id="settings" />
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button 
              onClick={()=>setActiveLink('college-admins')}
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    U
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
          {activeLink === 'admin-dashboard' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Colleges</p>
                      <p className="text-2xl font-bold text-gray-900">{collegeAdmins.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Students</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Placements</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.activePlacements}</p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Placement Trends</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={systemStats.placementTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="placements" stroke="#4f46e5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Info className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">System Update</h3>
                        <p className="text-sm text-gray-500">New features added to admin dashboard</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">New College Added</h3>
                        <p className="text-sm text-gray-500">IIT Bombay registered on the platform</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeLink === 'college-admins' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">College Admin Approvals</h1>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Admins</option>
                      <option value="pending">Pending Approval</option>
                      <option value="approved">Approved</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAdmins.map((admin) => (
                        <tr key={admin._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.firstName} {admin.secondName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.college}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {admin.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!admin.isApproved && (
                              <button
                                onClick={() => handleApproval(admin._id, true)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleApproval(admin._id, false)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {admin.isApproved ? 'Revoke' : 'Reject'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeLink === 'students' && (
            <>
               <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map((student, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.college}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.cgpa?.$numberDecimal
                                        ? parseFloat(student.cgpa.$numberDecimal).toFixed(1)
                                        : '-'}</td>
                  {/* <div><strong>CGPA:</strong> {student.cgpa?.$numberDecimal
                                        ? parseFloat(student.cgpa.$numberDecimal).toFixed(1)
                                        : '-'}</div> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="text-sm text-indigo-600 disabled:text-gray-400"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className="text-sm text-indigo-600 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
            </>
          )}
          {activeLink==='companies'&&(
            <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Visit Information</h1>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Company', 'Industry', 'College', 'Role', 'Package', 'Stipend', 'Branches', 'Years', 'Min CGPA', 'Visit Date', 'Deadline'].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.companyName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.industry}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.collegeName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.packageLPA || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.stipendDetails || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.allowedBranches.join(', ')}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.allowedYear.join(', ')}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.minCgpa || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.visitDate ? new Date(c.visitDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{c.applicationDeadline ? new Date(c.applicationDeadline).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
          )}

          {activeLink==='admin-management' &&(
             <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveForm('branch')}
          className={`px-4 py-2 rounded ${
            activeForm === 'branch' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Add Branch
        </button>
        <button
          onClick={() => setActiveForm('college')}
          className={`px-4 py-2 rounded ${
            activeForm === 'college' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Add College
        </button>
      </div>

      {activeForm === 'branch' && (
        <form onSubmit={handleBranchSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter branch name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Adding...' : 'Add Branch'}
          </button>
        </form>
      )}

      {activeForm === 'college' && (
        <form onSubmit={handleCollegeSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">College Name</label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter college name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={collegeLocation}
              onChange={(e) => setCollegeLocation(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter location"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Adding...' : 'Add College'}
          </button>
        </form>
      )}
    </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;