import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Edit, Download, BarChart, BookOpen, GraduationCap, Trophy, Briefcase } from 'lucide-react';

const StatCard = ({ value, label, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-blue-50">
        <Icon className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  </div>
);

const ProfileHeader = ({ user, imageLink, resumeLink }) => (
  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-gray-200">
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-lg opacity-50" />
      <img
        src={imageLink || '/assets/user.png'}
        alt={`${user.name}'s profile`}
        className="relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl z-10"
      />
    </div>
    
    <div className="text-center md:text-left space-y-3">
      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-700">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>{user.college}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>{user.branch}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>{user.email}</span>
        </div>
      </div>
      
      <a
        href={resumeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">Download Resume</span>
      </a>
    </div>
  </div>
);

const InterviewResults = ({ interviews,onClickInterview }) => (
  <div className="mt-10">
    <div className="flex items-center gap-3 mb-6">
      <BarChart className="w-7 h-7 text-blue-600" />
      <h3 className="text-2xl font-bold text-gray-900">Interview Analytics</h3>
    </div>
    {/* <div className="space-y-4">
      {interviews.slice().reverse().map((interview) => (
        <div key={interview.interview_id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-700">Interview #{interview.interview_id}</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Score: {interview.result}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(interview.result / 10) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div> */}
    <div className="space-y-4">
  {interviews.slice().reverse().map((interview) => (
    <div
      key={interview.interview_id}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClickInterview(interview.interview_id)} // Add your handler here
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-700">Interview #{interview.interview_id}</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Score: {interview.result}/10
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(interview.result / 10) * 100}%` }}
        />
      </div>
    </div>
  ))}
</div>

  </div>
);


const Profile = () => {
  const [user, setUser] = useState(null);
  const [resumeLink, setResumeLink] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signup');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get('https://api.recruitmantra.com/user/getinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setResumeLink(response.data.resume);
        setImageLink(response.data.image);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);
  const handleInterviewClick = (key) => {
  
  navigate(`/interview-details/${key || "123"}`, { replace: true });
  // console.log('Clicked interview:', key);
  // You can add navigation, open modal, fetch details, etc.
};
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <div className="mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{error || 'Profile Error'}</h3>
          <button
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <ProfileHeader user={user} imageLink={imageLink} resumeLink={resumeLink} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
              <StatCard 
                value={user.coins} 
                label="Coins Earned"
                icon={Trophy}
              />
              <StatCard 
                value={user.specialization} 
                label="Specialization"
                icon={Briefcase}
              />
              <StatCard 
                value={user.interest} 
                label="Interest"
                icon={BookOpen}
              />
            </div>
            
            <InterviewResults interviews={user.interview} 
              onClickInterview={handleInterviewClick}
              />
            
            <div className="flex justify-end mt-10">
              <button
                onClick={() => navigate('/edit-profile')}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span className="font-medium">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;