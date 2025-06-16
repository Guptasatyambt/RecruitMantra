import React, { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import axios from 'axios';
import { Upload } from 'lucide-react';

function AssetUpload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

   const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setPhoto(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setResume(file);
      } else {
        setError('Please select a PDF file');
      }
    }
  };

  const handleUpload = async (e) => {
    console.log(source)
    e.preventDefault();
    if(source=='default'){
    await handleImageUpload();
    await handleResumeUpload();
    navigate('/')
    }
    else if(source==='student'){
    await handleImageUpload();
    await handleResumeUpload();
    navigate('/')
    }
    else {
       console.log(" upload click")
      await handleImageUpload();
      navigate('/')
    }
  };
  const handleImageUpload=async ()=>{
    console.log("image upload click")
    if(!photo){
      setError('Please select a profile photo');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);
    try {
      // First API call to get upload URLs
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/user/updateimage',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      const imageBuffer = await photo.arrayBuffer();
      await axios.put(response.data.data.profile, imageBuffer, {
        headers: {
          'Content-Type': "image/jpg",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload=async ()=>{
    console.log("image upload click")
    if(!resume){
      setError('Please select a resume');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);
    try {
      // First API call to get upload URLs
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/user/updateresume',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      const resumeBuffer = await resume.arrayBuffer();
      await axios.put(response.data.data.resume, resumeBuffer, {
        headers: {
          'Content-Type': "application/pdf",
        },
        onUploadProgress: (progressEvent) => {
          const progress = 50 + Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Upload Your Documents
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please upload your profile photo and resume
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleUpload}>
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a photo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            {source === 'default'||source === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resume (PDF)
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a resume</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={handleResumeChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  {resume && (
                    <p className="text-sm text-gray-500">
                      Selected: {resume.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            )}
            {/* Upload Progress */}
            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                // disabled={loading || !photo || !resume}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssetUpload;
