import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { token } = location.state || {};  
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
 
  // Function to verify OTP 
  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'https://api.recruitmantra.com:5001/user/varifyemail',
        { otp: otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setMessage(response.data.message);  // "OTP verified successfully"
        window.location.reload();
          navigate(`/upload-documents?source=${source}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>

        {message && (
          <div className={`mb-4 text-center ${message.includes("successfully") ? 'text-green-500' : 'text-red-500'}`}>
            <p>{message}</p>
          </div>
        )}
          <div>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              onClick={verifyOtp}
              className={`w-full bg-blue-500 text-white p-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default EmailVerification;
