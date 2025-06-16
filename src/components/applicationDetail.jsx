import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI } from '../services/api';
import {studentAPI} from '../services/studentAPI';
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

const ApplicationDetail = () => {
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
      const response=await studentAPI.getApplicationDetail(id);
      const companyData = response.data.data;
      console.log(companyData)
      setCompany({
        companyName: companyData.companytoCollegeId.companyId.company_name,
        packageLPA: companyData.companytoCollegeId.package_lpa.$numberDecimal,
        location: companyData.companytoCollegeId.location,
        role: companyData.companytoCollegeId.role,
        visitDate: companyData.companytoCollegeId.visitDate||'',
        description: companyData.companytoCollegeId.jobDescription,
        requirements: `Minimum CGPA: ${companyData.companytoCollegeId.minCgpa.$numberDecimal}\nStipend: ₹${companyData.companytoCollegeId.stipendDetails}`,
        applicationDeadline: companyData.companytoCollegeId.applicationDeadline,
        eligibility: `CGPA >= ${companyData.companytoCollegeId.minCgpa.$numberDecimal}`
      });
      console.log(company)
    } catch (err) {
      setError('Failed to fetch company details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
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

          
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;