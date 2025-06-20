import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API ,{userAPI} from '../services/api'; // Your custom API instance

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { token } = location.state || {};
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");

  // Auto-send OTP on component mount
  useEffect(() => {
    sendOtp();
  }, []);

  // Countdown for resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const sendOtp = async () => {
    setMessage('');
    setResending(true);
    try {
      await userAPI.sendOTP(); // replace with your actual OTP send API
      setMessage('OTP sent successfully.');
      setResendTimer(60);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setResending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await userAPI.verifyUser(otp);
      if (response.data.success) {
        setMessage(response.data.message);
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

        <div className="mt-4 text-center">
          <button
            onClick={sendOtp}
            disabled={resendTimer > 0 || resending}
            className={`text-sm ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
          >
            {resending ? 'Sending...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
