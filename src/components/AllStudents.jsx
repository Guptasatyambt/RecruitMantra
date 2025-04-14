import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Search, ChevronLeft, ChevronRight, Menu, Bell, ChevronDown, Settings, LogOut, BarChart, TrendingUp, Building2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/studentAPI';
import axios from 'axios';

const AllStudents = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('students');
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    year: '',
    specialization: '',
    interest: ''
  });
  const [formError, setFormError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info and students on component mount
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

      if (response.data && response.data.data) {
        setUserInfo(response.data.data);
        fetchStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (user) => {
    try {
      setLoading(true);
      const response = await studentAPI.getAllStudents();
      
      // Filter students based on user role
      let filteredStudents = response.data.data;
      
      // If college admin, only show students from their college
      if (user.role === 'college_admin' && user.college) {
        filteredStudents = filteredStudents.filter(student => 
          student.college?.toLowerCase() === user.college.toLowerCase()
        );
      }
      
      setStudents(filteredStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  // Handle add student form submission
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    if (!newStudent.name || !newStudent.email || !newStudent.branch || !newStudent.year) {
      setFormError('Please fill all required fields');
      return;
    }

    try {
      // For college admin, automatically set the college
      if (userInfo && userInfo.role === 'college_admin' && userInfo.college) {
        newStudent.college = userInfo.college;
      }
      
      await studentAPI.addStudent(newStudent);
      setShowAddModal(false);
      setNewStudent({
        name: '',
        email: '',
        college: '',
        branch: '',
        year: '',
        specialization: '',
        interest: ''
      });
      fetchStudents(userInfo); // Refresh student list
    } catch (error) {
      console.error('Error adding student:', error);
      setFormError(error.response?.data?.message || 'Failed to add student');
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
              <h2 className="text-xl font-semibold text-gray-800 ml-4">All Students</h2>
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
                    A
                  </div>
                  <span className="text-gray-700">Admin</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Students Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 text-3xl font-medium">Students</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Student
              </button>
            </div>

            {/* Student Stats */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-12 w-12 text-blue-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">{students.length}</h4>
                    <p className="text-gray-500">Total Students</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <Briefcase className="h-12 w-12 text-green-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {students.filter(s => s.interview && s.interview.length > 0).length}
                    </h4>
                    <p className="text-gray-500">Interviewed Students</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <Award className="h-12 w-12 text-yellow-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {students.filter(s => s.year === '4').length}
                    </h4>
                    <p className="text-gray-500">Final Year Students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="w-full sm:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full p-2 pl-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Student List */}
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Loading students...</p>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  {currentStudents.length > 0 ? (
                    <>
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Student Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              College
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Branch
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Interest
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudents.map((student) => (
                            <tr key={student._id}>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.name}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.email}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.college}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.branch}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.year}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{student.interest}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => paginate(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="w-full p-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="mx-2 text-gray-600">
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="w-full p-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-5 text-center text-gray-500">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddStudent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                  <input
                    type="text"
                    name="college"
                    value={newStudent.college}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <input
                    type="text"
                    name="branch"
                    value={newStudent.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    name="year"
                    value={newStudent.year}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={newStudent.specialization}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
                  <input
                    type="text"
                    name="interest"
                    value={newStudent.interest}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents;