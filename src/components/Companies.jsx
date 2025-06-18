import { useEffect, useState } from 'react';
import React from 'react';
import { Building2, Users, BarChart, Menu, Bell, Search, ChevronDown, Settings, LogOut, Briefcase, GraduationCap, TrendingUp, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import axios from 'axios';
import { collegeadminAPI } from '../services/collegeadminAPI';

const Companies = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('companies');
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHiredModalOpen, setIsHiredModalOpen]=useState(false);
  const [placementData,setPlacementData]=useState(null);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activelyRecruiting: 0,
    avgPackage: 0,
    totalStudentsHired: 0,
  });
  const [collegeId, setCollegeId] = useState('');
  const [branches, setBranches] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  // Add state for company form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    companyId: '',
    location: '',
    package: '',
    stipendDetails: '',
    role: '',
    jobDescription: '',
    visitDate: '',
    applicationDeadline: '',
    minCgpa: '',
    allowedBranches: [],
    allowedYear: [],
  });
  const [editCompanyFormData, setEditCompanyFormData] = useState({
    location: '',
    package_lpa: '',
    stipendDetails: '',
    role: '',
    jobDescription: '',
    visitDate: '',
    applicationDeadline: '',
    minCgpa: '',
    allowedBranches: [], // branch names
    allowedYear: [],
  });
  const [originalData, setOriginalData] = useState({});
  const [branchChanged, setBranchChanged] = useState(false);

  const [emailInput, setEmailInput] = useState('');
const [hiredFormError, setHiredFormError] = useState('');

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
      // if(response.data.user.verified==false){
      //   navigate(`/email-verification?source=${response.data.user.role}`, { state: { token: token } });
      // }
      if (response.data.user.profileimage == "") {
        navigate("/upload-documents");
      }
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        setCollegeId(response.data.defaultOrStudent.collegeId);
        fetchCompanies(response.data.user);
      }
      const branchRes = await axios.get('https://api.recruitmantra.com/branch/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(branchRes.data.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  const fetchCompanies = async (user) => {
    try {
      setLoading(true);

      // Check if we have a status filter
      // const collegeId = user?.defaultOrStudent?.collegeId || '';
      const response = await companyAPI.getAllCompanies({
        collegeId: collegeId
      });
      // const response = await companyAPI.getAllCompanies(collegeId);/
      let companiesData = response.data.data;

      // Filter companies based on user role
      // if (user && user.role === 'college_admin') {
      //   // For college admin, only show companies that visited their college
      //   companiesData = companiesData.filter(company => 
      //     company.college?.toLowerCase() === user.college.toLowerCase() ||
      //     company.colleges?.some(c => c.toLowerCase() === user.college.toLowerCase()) ||
      //     company.college_id === user.college
      //   );
      // }
      setCompanies(companiesData);
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
      // Calculate stats with improved categorization
      const completedCompanies = companiesData.filter(company => company.placeId > 0);

      // Calculate actively recruiting (upcoming + ongoing)
      const activelyRecruiting = companiesData.length - completedCompanies;

      // Calculate average package with proper handling of missing values
      const validPackages = companiesData.filter(company => company.packageLPA && !isNaN(company.packageLPA));
      const totalAvgPackage = validPackages.length > 0
        ? validPackages.reduce((total, company) => total + parseFloat(company.packageLPA), 0) / validPackages.length
        : 0;

      // Calculate total students hired
      
      const totalStudentsHired = res.data.data.length

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
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested properties (eligibility_criteria)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
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

    setFormData({
      ...formData,
      eligibility_criteria: {
        ...formData.eligibility_criteria,
        allowed_branches: selectedBranches
      }
    });
  };
  const handleMultiChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setEditCompanyFormData(prev => ({
      ...prev,
      [field]: field === 'allowedYear' ? selectedOptions.map(Number) : selectedOptions,
    }));

    if (field === 'allowedBranches') {
      const changed = JSON.stringify(selectedOptions.sort()) !== JSON.stringify(originalData.allowedBranches.sort());
      setBranchChanged(changed);
    }
  };

  const getChangedFields = () => {
    const changedFields = {};
    Object.entries(editCompanyFormData).forEach(([key, value]) => {
      if (JSON.stringify(value) !== JSON.stringify(originalData[key])) {
        changedFields[key] = value;
      }
    });

    // If branch names changed, map to IDs and override key
    if (branchChanged) {
      const branchIds = editCompanyFormData.allowedBranches.map(name =>
        branches.find(b => b.branchName === name)?._id
      ).filter(Boolean);
      changedFields.allowedBranches = branchIds;
    }

    return changedFields;
  };



  // Handle add company form submission
  const handleAddCompany = async (e) => {
    e.preventDefault();
    setFormError('');
    // Validate form
    try {
      const token = localStorage.getItem('token');
      const companyRes = await axios.post('https://api.recruitmantra.com/company/add', {
        company_name: companyName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const companyId = companyRes.data.data._id;
      // Convert package_lpa to number
      console.log(companyId, formData.location, formData.package, formData.stipendDetails, formData.role, formData.jobDescription, formData.applicationDeadline, formData.minCgpa,
        formData.allowedBranches.length, formData.allowedYear.length)
      if (!companyId || !formData.location || !formData.package ||
        !formData.stipendDetails || !formData.role || !formData.jobDescription ||
        !formData.applicationDeadline || !formData.minCgpa ||
        formData.allowedBranches.length === 0 ||
        !formData.allowedYear.length === 0) {
        setFormError('Please fill all required fields');
        return;
      }
      const companyData = {
        ...formData,
        package: parseFloat(formData.package),
        collegeId: collegeId,
        companyId: companyId
      };
      if (!formData.visitDate) delete companyData.visitDate;
      await companyAPI.addCompany(companyData);
      setShowAddModal(false);
      setFormData({
        companyId: '',
        location: '',
        package: '',
        stipendDetails: '',
        role: '',
        jobDescription: '',
        visitDate: '',
        applicationDeadline: '',
        minCgpa: '',
        allowedBranches: [],
        allowedYear: [],
      });
      fetchCompanies(userInfo); // Refresh company list
    } catch (error) {
      console.error('Error adding company:', error);
      setFormError(error.response?.data?.message || 'Failed to add company');
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (filterStatus === '') return company
    if (filterStatus === 'completed') return company.placeId.length > 0;
    if (filterStatus === 'ongoing') return new Date(company.applicationDeadline) > new Date();
    if (filterStatus === 'upcoming') {
      if (company.visitDate)
        return new Date(company.visitDate) > new Date()
      else
        return company
    }
    return true;
  }).filter(company => {
    if (!searchTerm) return true;
    return (
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleMarkHired = async (e) => {
    e.preventDefault();
    setHiredFormError('');
  
    const emails = emailInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  
    if (emails.length === 0 || !selectedCompany?.companyId) {
      setHiredFormError('Please enter valid student emails.');
      return;
    }
  
    try {
      const data = {
        emails,
        company_id: selectedCompany.companyId,
        ctc:selectedCompany.packageLPA
      }
      const response = await collegeadminAPI.markStudentsHired(data)
  
      const result = await response.status;
  
      if (result!=200) {
        throw new Error(result.message || 'Failed to mark students hired');
      }
  
      alert('Students marked as hired successfully!');
      setIsHiredModalOpen(false);
      setEmailInput('');
    } catch (error) {
      console.error(error);
      setHiredFormError(error.message);
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
      className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition duration-200 ${activeLink === id
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  useEffect(() => {
    if (selectedCompany && branches.length > 0) {
      const formattedData = {
        location: selectedCompany.location || '',
        package_lpa: selectedCompany.package || '',
        stipendDetails: selectedCompany.stipendDetails || '',
        role: selectedCompany.role || '',
        jobDescription: selectedCompany.jobDescription || '',
        visitDate: formatDateForInput(selectedCompany.visitDate),
        applicationDeadline: formatDateForInput(selectedCompany.applicationDeadline),
        minCgpa: selectedCompany.minCgpa || '',
        allowedBranches: selectedCompany.allowedBranches || [], // Names
        allowedYear: selectedCompany.allowedYear || [],
      };

      setEditCompanyFormData(formattedData);
      setOriginalData(formattedData); // Save to compare later
      setBranchChanged(false);
    }
  }, [selectedCompany, branches]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCompanyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleEditCompany = async (e) => {
    e.preventDefault();
    setFormError('');
    const updatePayload = getChangedFields();

    if (Object.keys(updatePayload).length === 0) {
      setFormError('No changes detected.');
      return;
    }

    try {
      const response = await collegeadminAPI.updateCompany(updatePayload, selectedCompany._id);
      setIsEditModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error during update:', error);
      setFormError(error.response?.data?.message || 'Failed to update');
    }
  };

  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };


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
              <h2 className="text-xl font-semibold text-gray-800 ml-4">Companies</h2>
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
              <div className="px-4 py-2">
                <div className={`relative ${searchFocused ? 'ring-2 black' : ''} 
            bg-black-200 rounded-lg transition-all duration-200`}>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-indigo-300" />
                </div>
              </div>
              <div className="flex space-x-4">
                {/* Status Filter Dropdown */}
                <select
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value)
                    const status = e.target.value;
                    fetchCompanies({ ...userInfo, filterStatus: status });
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
                              Cgpa
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Positions Offered
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Package (LPA)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Stipend
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Deadline
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
                          {filteredCompanies.map((company, index) => (
                            <React.Fragment key={company._id || index}>
                              <tr
                                onClick={() =>
                                  setExpandedCompanyId(expandedCompanyId === company._id ? null : company._id)
                                }
                                className="cursor-pointer hover:bg-gray-100 transition-all duration-200">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{company.companyName}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{company.minCgpa || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{company.role || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{company.packageLPA || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{company.stipendDetails || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {company.applicationDeadline ? new Date(company.applicationDeadline).toLocaleDateString() : 'N/A'}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {company.visit_date ? new Date(company.visit_date).toLocaleDateString() : 'N/A'}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {company.placeId?.length || 'N/A'}
                                  </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex justify-between items-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${company.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : company.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {company.status ? company.status.charAt(0).toUpperCase() + company.status.slice(1) : 'N/A'}
                                  </span>
                                </td>
                              </tr>

                              {expandedCompanyId === company._id && (
  <>
    <tr>
      <td colSpan="9" className="bg-gray-50 px-5 py-6 border-b text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><strong>📍 Location:</strong> {company.location || 'N/A'}</div>
          <div><strong>🎓 Allowed Branches:</strong> {(company.allowedBranches || []).join(', ') || 'N/A'}</div>
          <div><strong>📅 Allowed Years:</strong> {(company.allowedYear || []).join(', ') || 'N/A'}</div>
          <div><strong>📝 Job Description:</strong> {company.jobDescription || 'N/A'}</div>
          <div><strong>👨‍💼 Role:</strong> {company.role || 'N/A'}</div>
          <div><strong>⏳ Application Deadline:</strong> {company.applicationDeadline ? new Date(company.applicationDeadline).toLocaleDateString() : 'N/A'}</div>
          <div className="col-span-2">
  <strong>✅ Placed Students:</strong>{' '}
  {(company.placeId || []).length > 0
    ? company.placeId
        .map(p => `${p.studentId.firstName} ${p.studentId.lastName}`)
        .join(', ')
    : 'N/A'}
</div>
        </div>
      </td>
    </tr>
    <tr>
      <td colSpan="9" className="px-5 py-5 bg-white border-b text-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setSelectedCompany(company);
              setIsEditModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ✏️ Update Company Info
          </button>
          <button
            onClick={() => {
              setSelectedCompany(company);
              setIsHiredModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            🎯 Update Hired Students
          </button>
        </div>
      </td>
    </tr>
  </>
)}



                            </React.Fragment>
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
            <form
              onSubmit={handleAddCompany}
              className="max-w-3xl h-[80vh] overflow-y-auto mx-auto bg-white rounded shadow mt-10"
            >
              <h2 className="text-xl font-bold mb-4">Add Company to College</h2>

              <div>
                <label className="block mb-1">Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <div>
                <label className="block mb-1">Location</label>
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Package offering</label>
                <input
                  name="package"
                  placeholder="Package (LPA)"
                  type="number"
                  step="0.01"
                  value={formData.package}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Stipend</label>
                <input
                  name="stipendDetails"
                  placeholder="Stipend Details"
                  value={formData.stipendDetails}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Roll</label>
                <input
                  name="role"
                  placeholder="Role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Job Description</label>
                <textarea
                  name="jobDescription"
                  placeholder="Job Description"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Visit Date</label>
                <input
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>

                <label className="block mb-2">Application Deadline</label>
                <input
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Cgpa</label>
                <input
                  name="minCgpa"
                  placeholder="Minimum CGPA"
                  type="number"
                  step="0.01"
                  value={formData.minCgpa}
                  onChange={handleChange}
                  required
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Select allowed branches</label>
                <label className="block mb-2">Allowed Branches</label>
                <select
                  multiple
                  value={formData.allowedBranches}
                  onChange={(e) => handleMultiChange(e, 'allowedBranches')}
                  className="w-full mb-4 p-2 border rounded"
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>{b.branchName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Allowed Years</label>
                <select
                  multiple
                  value={formData.allowedYear}
                  onChange={(e) => handleMultiChange(e, 'allowedYear')}
                  className="w-full mb-4 p-2 border rounded"
                >
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Company
              </button>
            </form>
          </div>
        </div>
      )}

      {/* edit company model */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Update Company</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {formError}
              </div>
            )}
            <form
              onSubmit={handleEditCompany}
              className="max-w-3xl h-[80vh] overflow-y-auto mx-auto bg-white rounded shadow mt-10"
            >
              <h2 className="text-xl font-bold mb-4">Update {selectedCompany.companyName}</h2>

              <div>
                <label className="block mb-1">Location</label>
                <input
                  name="location"
                  placeholder={selectedCompany.location}
                  value={editCompanyFormData.location}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Package offering</label>
                <input
                  name="package"
                  placeholder={selectedCompany.package}
                  type="number"
                  step="0.01"
                  value={editCompanyFormData.package_lpa}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Stipend</label>
                <input
                  name="stipendDetails"
                  placeholder={selectedCompany.stipendDetails}
                  value={editCompanyFormData.stipendDetails}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Roll</label>
                <input
                  name="role"
                  placeholder={selectedCompany.role}
                  value={editCompanyFormData.role}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Job Description</label>
                <textarea
                  name="jobDescription"
                  placeholder={selectedCompany.jobDescription}
                  value={editCompanyFormData.jobDescription}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Visit Date</label>
                <input
                  name="visitDate"
                  type="date"
                  value={editCompanyFormData.visitDate}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>

                <label className="block mb-2">Application Deadline</label>
                <input
                  name="applicationDeadline"
                  type="date"
                  value={formatDateForInput(editCompanyFormData.applicationDeadline)}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Cgpa</label>
                <input
                  name="minCgpa"
                  placeholder={selectedCompany.minCgpa}
                  type="number"
                  step="0.01"
                  value={editCompanyFormData.minCgpa}
                  onChange={handleEditInputChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Select allowed branches</label>
                <select
                  multiple
                  value={editCompanyFormData.allowedBranches}
                  onChange={(e) => handleMultiChange(e, 'allowedBranches')}
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b.branchName}>{b.branchName}</option>
                  ))}
                </select>

              </div>
              <div>
                <label className="block mb-2">Allowed Years</label>
                <select
                  multiple
                  value={editCompanyFormData.allowedYear}
                  onChange={(e) => handleMultiChange(e, 'allowedYear')}
                  className="w-full mb-4 p-2 border rounded"
                >
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {isHiredModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Mark Students as Hired</h3>
        <button onClick={() => setIsHiredModalOpen(false)} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      {hiredFormError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {hiredFormError}
        </div>
      )}

      <form
        onSubmit={handleMarkHired}
        className="max-w-3xl mx-auto bg-white rounded shadow"
      >
        <div>
          <label className="block mb-2 font-medium">Enter Student Emails (comma separated)</label>
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full mb-4 p-2 border rounded h-32"
            placeholder="example1@gmail.com, example2@gmail.com"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Mark as Hired
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Companies;