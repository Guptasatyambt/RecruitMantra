import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, X, CheckCircle, User, Briefcase, School, Book } from 'lucide-react';
import axios from "axios";

const AnimatedProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
    <div 
      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const ProfileSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-blue-50 p-2 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const FileUploadPreview = ({ file, preview, onRemove, type }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
      <button
        onClick={onRemove}
        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
    {type === 'image' ? (
      <img
        src={preview}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
    ) : (
      <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <CheckCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
          <p className="text-xs text-blue-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    )}
  </div>
);

const Toast = ({ message, type = 'success', onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-100 text-green-800',
    error: 'bg-red-50 border-red-100 text-red-800',
    info: 'bg-blue-50 border-blue-100 text-blue-800'
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border shadow-lg ${colors[type]} animate-slide-up`}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({
    basic: false,
    education: false,
    documents: false
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    specialization: '',
    year: '',
    interest: '',
    profileimage: null,
    resume: null,
  });

  const [validation, setValidation] = useState({
    name: true,
    email: true,
    year: true,
  });

  const calculateProgress = useCallback(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should not exceed 5MB', 'error');
        return;
      }

      if (name === 'profileimage') {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    setProgress(calculateProgress());
    
    if (validation[name] === false) {
      setValidation(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const validateForm = () => {
    const newValidation = {
      name: formData.name.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      year: /^[1-6]$/.test(formData.year),
    };
    setValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };

  const handleRemoveFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    if (type === 'profileimage') {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the highlighted fields', 'error');
      return;
    }

    setIsLoading(true);
    let uploadProgress = 0;

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        uploadProgress += 5;
        if (uploadProgress <= 90) {
          setProgress(uploadProgress);
        }
      }, 100);

      if (formData.profileimage) {
        const response = await fetch(
          'http://localhost:5001/user/updateimage',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to get image upload URL');
        
        const { data: { profile: uploadUrl } } = await response.json();
        
        const imageBuffer = await formData.profileimage.arrayBuffer();
        
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpg' },
          body: imageBuffer
        });
      }

      if (formData.resume) {
        const response = await fetch(
          'http://localhost:5001/user/updateresume',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to get resume upload URL');
        
        const { data: { resume: uploadUrl } } = await response.json();
        const resumeBuffer = await formData.resume.arrayBuffer();
        console.log(uploadUrl);
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/pdf' },
          body: resumeBuffer
        });
      }

      const putres=await fetch(
        'http://localhost:5001/user/updateyear',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ year: formData.year })
        }
      );
      console.log(putres.status)
      clearInterval(progressInterval);
      setProgress(100);
      showToast('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      showToast(error.message || 'An error occurred while updating your profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
        <p className="text-blue-100">Build your professional presence</p>
        <AnimatedProgressBar progress={progress} />
        <div className="flex gap-4">
          {Object.entries(completionStatus).map(([section, isComplete]) => (
            <div key={section} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-400' : 'bg-blue-300'}`} />
              <span className="text-sm capitalize">{section}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileSection icon={User} title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${!validation.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="Enter your full name"
              />
              {!validation.name && (
                <p className="text-red-500 text-sm mt-1">Name should be at least 2 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${!validation.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="your.email@example.com"
              />
              {!validation.email && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
        </ProfileSection>

        <ProfileSection icon={School} title="Educational Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your college name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Your branch of study"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full p-3 border ${!validation.year ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="Current year (1-6)"
              />
              {!validation.year && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid year (1-6)</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
              <input
                type="text"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Your areas of interest"
              />
            </div>
          </div>
        </ProfileSection>

        <ProfileSection icon={Briefcase} title="Documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <div className="h-64">
                {imagePreview ? (
                  <FileUploadPreview
                    file={formData.profileimage}
                    preview={imagePreview}
                    onRemove={() => handleRemoveFile('profileimage')}
                    type="image/jpg"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      name="profileimage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
              <div className="h-64">
                {formData.resume ? (
                  <FileUploadPreview
                    file={formData.resume}
                    onRemove={() => handleRemoveFile('resume')}
                    type="application/pdf"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      name="resume"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </ProfileSection>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-6 -mx-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-gray-600">
                {isLoading ? 'Saving changes...' : 'All changes will be saved automatically'}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
