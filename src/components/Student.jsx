import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Search, ChevronLeft, ChevronRight, Menu, Bell, ChevronDown, Settings, LogOut, BarChart, TrendingUp, Building2, Users, Loader2, Plus, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/studentAPI';
import { collegeadminAPI } from '../services/collegeadminAPI';
import CompanyForm from './markPlaced';
import axios from 'axios';
// Remove mock data

const Students = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('students');
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [collegeUserInfo, setCollegeUserInfo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placedModalOpen, setPlacedModalOpen] = useState(false);
  const [placementData, setPlacementData] = useState(null);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    email: '',
    college: '',
    branch: '',
    cgpa: '',
    year: ''
  });
  const [formError, setFormError] = useState('');
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    email: '',
    branch: '',
    college: '',
    year: '',
    cgpa: '',
    cap: '',
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
      // if(response.data.user.verified==false){
      //   navigate(`/email-verification?source=${response.data.user.role}`, { state: { token: token } });
      // }
      if (response.data.user.profileimage === "") {
        navigate("/upload-documents");
      }
      if (response.data && response.data.user && response.data.defaultOrStudent) {
        setUserInfo(response.data.user);
        setCollegeUserInfo(response.data.defaultOrStudent)
        // setCollegeId(response.data.defaultOrStudent.collegeId)
      }
      const branchRes = await axios.get('https://api.recruitmantra.com/branch/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(branchRes.data.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      // navigate('/login');
    }
  };


  // Fetch students data on component mount
  useEffect(() => {
    if (collegeUserInfo && collegeUserInfo.collegeId) {
      fetchStudents();
    }
  }, [collegeUserInfo]);

  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAllStudents();
      if (response.data && response.data.data) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data); // Initialize filtered students with all students
        // Fetch companies to determine placed students
        const token = localStorage.getItem('token');
        const companiesResponse = await axios.get(`https://api.recruitmantra.com/company/list?collegeId=${collegeUserInfo.collegeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const res = await collegeadminAPI.getRecentPlacements();
        if (res.data && res.data.data) {
          setPlacementData(res.data.data)
          const placedStudentIds = [];

          res.data.data.forEach(item => {
            if (item.student_id) {
              placedStudentIds.push(item.student_id._id);
            }
          });
          setPlacedStudents(placedStudentIds);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students data');
      setLoading(false);
    }
  };

  // Filter students based on search term and status
  useEffect(() => {
    if (students.length === 0) return;

    const filtered = students.filter(student =>
      (
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
      ) &&
      (
        filterStatus === 'All' ||
        (filterStatus === 'Placed' && isStudentPlaced(student._id)) ||
        (filterStatus === 'Not Placed' && !isStudentPlaced(student._id))
      )
    );


    // Update the filtered students for display
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, students, placedStudents]);


  // Check if student is placed
  const isStudentPlaced = (studentId) => {
    return placedStudents.includes(studentId);
  };

  // Get student company and package
  const getStudentCompanyInfo = (studentId) => {
    // Filter all placements for the given student
    const placements = placementData.filter(
      (item) => item.student_id?._id?.toString() === studentId.toString()
    );
  
    if (placements.length === 0) return null;
  
    // Sort by highest package
    const highestPlacement = placements.reduce((max, current) => {
      const maxPackage = parseFloat(max.package_lpa?.$numberDecimal || max.package_lpa || 0);
      const currPackage = parseFloat(current.package_lpa?.$numberDecimal || current.package_lpa || 0);
      return currPackage > maxPackage ? current : max;
    });
  
    return {
      company: highestPlacement.company_name,
      package: parseFloat(highestPlacement.package_lpa?.$numberDecimal || highestPlacement.package_lpa || 0).toFixed(2),
      placementDate: new Date(highestPlacement.placement_date).toLocaleDateString(),
    };
  };
  

  const getHighestCTC = () => {
    if (!placementData || placementData.length === 0) return 0;

    return Math.max(
      ...placementData.map(item =>
        parseFloat(item.package_lpa?.$numberDecimal || 0)
      )
    );
  };




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

    const studentData = {
      ...newStudent,
      college: collegeUserInfo.collegeId,
    };
    if (!studentData.firstName || !studentData.lastName || !studentData.email || !studentData.rollNo || !studentData.branch || !studentData.year || !studentData.college || !studentData.cgpa) {
      setFormError('Please fill all required fields');
      return;
    }
    try {
      // Use collegeadminAPI instead of studentAPI
      await collegeadminAPI.addSingleStudent(studentData);
      setShowAddModal(false);
      setNewStudent({
        firstName: '',
        lastName: '',
        email: '',
        rollNo: '',
        college: '',
        branch: '',
        year: '',
        cgpa: '',
      });
      fetchStudents(); // Refresh student list
    } catch (error) {
      console.error('Error adding student:', error);
      setFormError(error.response?.data?.message || 'Failed to add student');
    }
  };


  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        firstName: selectedStudent.firstName || '',
        lastName: selectedStudent.lastName || '',
        email: selectedStudent.email || '',
        rollNo: selectedStudent.rollNo || '',
        branch: selectedStudent.branch || '',
        college: selectedStudent.college || '',
        year: selectedStudent.year || '',
        cgpa: selectedStudent.cgpa || '',
        cap: selectedStudent.cap || '',
      });
    }
  }, [selectedStudent]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    console.log(formData.branch)
    const updatedData = {
      firstName: formData.firstName.trim() || selectedStudent.firstName,
      lastName: formData.lastName.trim() || selectedStudent.lastName,
      email: formData.email.trim() || selectedStudent.email,
      rollNo: formData.rollNo || selectedStudent.rollNo,
      branch: formData.branch,
      year: formData.year || selectedStudent.year,
      cgpa: formData.cgpa || selectedStudent.cgpa,
      cap: formData.cap || selectedStudent.cap,
      college: collegeUserInfo.collegeId
      // handle other fields similarly
    };
    try {
      // Use collegeadminAPI instead of studentAPI
      console.log(updatedData.branch)
      const response = await collegeadminAPI.updateSingleStudent(updatedData, selectedStudent._id);
      setIsModalOpen(false);
      setFormData({
        firstName: selectedStudent.firstName || '',
        lastName: selectedStudent.lastName || '',
        rollNo: selectedStudent.rollNo || '',
        email: selectedStudent.email || '',
        branch: selectedStudent.branch || '',
        college: selectedStudent.college || '',
        year: selectedStudent.year || '',
        cgpa: selectedStudent.cgpa || '',
        cap: selectedStudent.cap || '',
      });
      fetchStudents(); // Refresh student list
    } catch (error) {
      console.error('Error adding student:', error);
      setFormError(error.response?.data?.message || 'Failed to add student');
    }
  };

  // Handle file input change for bulk upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBulkUploadFile(e.target.files[0]);
    }
  };

  // Handle bulk upload submission
  const handleBulkUpload = async (e) => {
    e.preventDefault();

    if (!bulkUploadFile) {
      setFormError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);

      // Import the utility function dynamically to parse the file
      const { parseStudentBulkUpload, formatValidationErrors } = await import('../utils/studentBulkUpload');

      // Parse the file
      const { data, errors } = await parseStudentBulkUpload(bulkUploadFile);

      // If there are validation errors, display them
      if (errors && errors.length > 0) {
        const errorMessage = formatValidationErrors(errors);
        setFormError(`Validation errors in file:\n${errorMessage}`);
        setLoading(false);
        return;
      }

      // If no data was parsed
      if (!data || data.length === 0) {
        setFormError('No valid student data found in the file');
        setLoading(false);
        return;
      }

      // Send data to API
      await collegeadminAPI.addStudentsBulk(data);

      // Close modal and refresh student list
      setShowBulkUploadModal(false);
      setBulkUploadFile(null);
      setFormError('');
      fetchStudents();

    } catch (error) {
      console.error('Error processing bulk upload:', error);
      setFormError(error.message || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };
  const handleMarkPlaced = (student) => {
    console.log('Edit student:', student);
    // You can:
    // - set selected student in state
    // - open modal with form
    // - navigate to an edit page
    // navigate(`/edit-student/${student._id}`);
  };

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const NavigationLink = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => {
        setActiveLink(id);
        navigate(`/${id}`);
      }}
      className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition duration-200 ${activeLink === id
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
        <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img
                className="h-12 w-12 transform transition-transform duration-300 "
                alt="RecruitMantra Logo"
                src="/assets/logo_RM.png"
              />
              <div className="absolute -inset-2 bg-black-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </div>
            <span className="text-1xl font-bold text-white">
              RecruitMantra
            </span>
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
          {/* <NavigationLink icon={TrendingUp} label="Statistics" id="statistics" /> */}
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
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Students</h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                    bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center 
                    justify-center animate-bounce">
                    {notifications}
                  </span>
                )}
              </button> */}

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                    flex items-center justify-center text-white font-semibold">
                    {userInfo?.firstName?.charAt(0) || 'A'}
                  </div>
                  <span className="text-gray-700">{userInfo?.firstName || 'Admin'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={handleLogout}
                    >
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
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" /> Upload CSV/Excel
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Student
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                <p>{error}</p>
              </div>
            ) : (
              <>
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
                          {placedStudents.length}
                        </h4>
                        <p className="text-gray-500">Placed Students</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                      <Award className="h-12 w-12 text-yellow-500" />
                      <div className="ml-4">
                        <h4 className="text-2xl font-semibold text-gray-700">
                          {/* This would ideally come from the API */}
                          {students.length > 0 ? `${getHighestCTC().toFixed(2)} LPA` : '0 LPA'}
                        </h4>
                        <p className="text-gray-500">Highest Package</p>
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
                  <div className="mt-4 sm:mt-0">
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded-lg ${filterStatus === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setFilterStatus('All')}
                      >
                        All Students
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg ${filterStatus === 'Placed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setFilterStatus('Placed')}
                      >
                        Placed
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg ${filterStatus === 'Not Placed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setFilterStatus('Not Placed')}
                      >
                        Not Placed
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="mt-8">
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Student Email
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Branch
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            CGPA
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Total Interview
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudents.map((student) => {
                          const isPlaced = isStudentPlaced(student._id);
                          // const { company, package: packageLPA ,placementDate} = getStudentCompanyInfo(student._id);
                          const {
                            company = 'N/A',
                            package: packageLPA = 'N/A',
                            placementDate = 'N/A',
                          } = getStudentCompanyInfo(studentId) || {};
                          const isExpanded = expandedStudentId === student._id;

                          return (
                            <React.Fragment key={student._id}>
                              <tr
                                onClick={() => {
                                  // console.log(student._id);
                                  setStudentId(student._id);
                                  setExpandedStudentId(expandedStudentId === student._id ? null : student._id)
                                }}
                                className="cursor-pointer hover:bg-gray-100 transition-all duration-200"
                              >
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {student.firstName + " " + student.lastName}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{student.email}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{student.branch || '-'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{student.year || '-'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {student.cgpa ? parseFloat(student.cgpa.$numberDecimal || 0).toFixed(1) : '-'}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isPlaced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {isPlaced ? 'Placed' : 'Not Placed'}
                                  </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {student.technicalInterview.length +
                                      student.hrInterview.length +
                                      student.managerialInterview.length}
                                  </p>
                                </td>
                              </tr>

                              {isExpanded && (
  <>
    <tr>
      <td colSpan="7" className="bg-gray-50 border-b px-5 py-6 text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><strong>🎓 Roll No:</strong> {student.rollNo || 'N/A'}</div>
          <div><strong>📅 Year:</strong> {student.year || 'N/A'}</div>
          <div><strong>🧠 Technical Interviews:</strong> {student.technicalInterview?.length || 0}</div>
          <div><strong>🗣️ HR Interviews:</strong> {student.hrInterview?.length || 0}</div>
          <div><strong>🧑‍💼 Managerial Interviews:</strong> {student.managerialInterview?.length || 0}</div>
          <div><strong>🏷️ Branch:</strong> {student.branch || 'N/A'}</div>
          <div><strong>📊 CGPA:</strong> {student.cgpa?.$numberDecimal
            ? parseFloat(student.cgpa.$numberDecimal).toFixed(1)
            : '-'}</div>
          <div className="col-span-2">
            <strong>🏢 Applied Companies:</strong> {(student.appliedCompanies?.name || []).join(', ') || 'N/A'}
          </div>
        </div>
      </td>
    </tr>

    {isPlaced && (
      <tr>
        <td colSpan="7" className="bg-gray-100 border-b px-5 py-6 text-sm text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong>✅ Company Name:</strong> {company || 'N/A'}</div>
            <div><strong>💰 CTC:</strong> {packageLPA || 'N/A'}</div>
            <div><strong>📆 Placement Date:</strong> {placementDate || 'N/A'}</div>
          </div>
        </td>
      </tr>
    )}

    <tr>
      <td colSpan="7" className="bg-white border-b px-5 py-5 text-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(student);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ✏️ Update Student Info
          </button>
          {!isPlaced && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStudent(student);
                setPlacedModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              🎯 Mark as Placed
            </button>
          )}
        </div>
      </td>
    </tr>
  </>
)}

                            </React.Fragment>
                          );
                        })}
                      </tbody>

                    </table>

                    {/* Pagination */}
                    <div className="px-5 py-5 bg-white border-t flex flex-row flex-wrap items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="p-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <span className="text-gray-600 whitespace-nowrap">
                          Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}
                        </span>

                        <button
                          onClick={() =>
                            paginate(Math.min(Math.ceil(filteredStudents.length / studentsPerPage), currentPage + 1))
                          }
                          disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
                          className="p-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          Total Students: {filteredStudents.length}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newStudent.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newStudent.lastName}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={newStudent.rollNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <select
                    name="branch"
                    value={newStudent.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cgpa *</label>
                  <input
                    type="text"
                    name="cgpa"
                    value={newStudent.cgpa}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Update Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditStudent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={selectedStudent.firstName}
                    value={formData.firstName}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cgpa *</label>
                  <input
                    type="text"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleEditInputChange}
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
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {placedModalOpen && selectedStudent && (
        <CompanyForm onClose={() => setPlacedModalOpen(false)} selectedStudent={studentId} />

      )}
      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Bulk Upload Students</h3>
              <button onClick={() => setShowBulkUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg whitespace-pre-line">
                {formError}
              </div>
            )}

            <form onSubmit={handleBulkUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV/Excel File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-500">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV, Excel up to 10MB
                      </p>
                      {bulkUploadFile && (
                        <p className="text-sm text-indigo-600">
                          Selected: {bulkUploadFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Please ensure your file has the following columns:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>firstName (required)</li>
                    <li>lastName (required)</li>
                    <li>RollNo (required)</li>
                    <li>Email (required)</li>
                    <li>Branch (required)</li>
                    <li>Cgpa (required)</li>
                    <li>Year (required)</li>
                  </ul>
                  <div className="mt-2">
                    <a
                      href="/assets/bulk_student_data.csv"
                      download
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Download CSV Template
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!bulkUploadFile}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Students;