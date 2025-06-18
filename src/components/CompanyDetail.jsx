import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import axios from 'axios';
import {
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Users2,
  Briefcase,
  GraduationCap,
  Clock
} from 'lucide-react';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getCompanytoCollegeDetails(id);
      const companyData = response.data.data;
      setCompany({
        companyName: companyData.companyId.company_name,
        packageLPA: companyData.package_lpa.$numberDecimal,
        location: companyData.location,
        role: companyData.role,
        visitDate: companyData.visitDate,
        description: companyData.jobDescription,
        requirements: `Minimum CGPA: ${companyData.minCgpa.$numberDecimal}\nAllowed Branches: ${companyData.allowedBranches.map(b => b.branchName).join(', ')}\nAllowed Years: ${companyData.allowedYear.join(', ')}\nStipend: ₹${companyData.stipendDetails}`,
        applicationDeadline: companyData.applicationDeadline,
        eligibility: `CGPA >= ${companyData.minCgpa.$numberDecimal}`
      });
    } catch (err) {
      setError('Failed to fetch company details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const userInfo = await axios.get('https://api.recruitmantra.com/user/getinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // if(userInfo.data.user.verified==false){
      //   navigate(`/email-verification?source=${userInfo.data.user.role}`, { state: { token: token } });
      // }
      if(userInfo.data.user.profileimage==""){
          navigate("/upload-documents");
          return;
      }

      const userData = userInfo.data;
      const currentDate = new Date();
      const deadlineDate = new Date(company.applicationDeadline);

      // Check if application deadline has passed
      if (currentDate > deadlineDate) {
        setFormError('Application deadline has passed.');
        setIsEligible(false);
        return;
      }

      // Check CGPA requirement
      if (parseFloat(userData.defaultOrStudent.cgpa.$numberDecimal) < parseFloat(company.packageLPA)) {
        setFormError(`Your CGPA (${userData.defaultOrStudent.cgpa.$numberDecimal}) does not meet the minimum requirement.`);
        setIsEligible(false);
        return;
      }

      // Check if user's branch is allowed
      const userBranch = userData.branch;
      const allowedBranches = company.requirements.split('\n')
        .find(line => line.startsWith('Allowed Branches:'))
        ?.split(': ')[1]
        .split(', ');

      if (!allowedBranches?.includes(userBranch)) {
        setFormError(`Your branch (${userBranch}) is not eligible for this position.`);
        setIsEligible(false);
        return;
      }

      // Check if user's year is allowed
      const userYear = userData.defaultOrStudent.year;
      const allowedYears = company.requirements.split('\n')
        .find(line => line.startsWith('Allowed Years:'))
        ?.split(': ')[1]
        .split(', ')
        .map(Number);

      if (!allowedYears?.includes(userYear)) {
        setFormError(`Your year (${userYear}) is not eligible for this position.`);
        setIsEligible(false);
        return;
      }

      // If all checks pass, proceed with application
      setIsEligible(true);
      setFormError(null);
      await companyAPI.applyToCompany(id);
      alert('Application submitted successfully!');
    } catch (err) {
      setFormError('Failed to submit application. Please try again.');
      console.error('Error:', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-500">
      {error}
    </div>
  );

  if (!company) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {formError}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              {company.logo ? (
                <img src={company.logo} alt={company.companyName} className="h-12 w-12 object-contain" />
              ) : (
                <Building className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
              <p className="text-gray-600">{company.industry}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="h-5 w-5" />
                <span>Package: ₹{company.packageLPA} LPA</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Location: {company.location || 'On Campus'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users2 className="h-5 w-5" />
                <span>Position: {company.role}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Drive Date: {company.visitDate ? new Date(company.visitDate).toLocaleDateString('en-IN') : 'To be announced'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="h-5 w-5" />
                <span>Experience Required: {company.experienceRequired || 'Fresher'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <GraduationCap className="h-5 w-5" />
                <span>Eligibility: {company.eligibility || 'All Streams'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Application Deadline: {company.applicationDeadline ? new Date(company.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{company.description || 'No description available'}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-line">{company.requirements || 'No specific requirements mentioned'}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleApply}
              disabled={!isEligible}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isEligible ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;