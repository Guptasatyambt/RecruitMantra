import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = ({ token, otp }) => {
  const [otpInput, setOtpInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://15.206.133.74/user/varifyemail',
        { otp: otpInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
        <p className="mb-4">Please enter the OTP sent to your email.</p>
        
        <input
          type="text"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          placeholder="Enter OTP"
          className="mb-4 p-2 w-full border border-gray-300 rounded-md"
        />
        
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full py-2 bg-green-500 text-white rounded-md"
        >
          {loading ? 'Verifying OTP...' : 'Verify OTP'}
        </button>
        
        {message && (
          <p className="mt-4 text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
