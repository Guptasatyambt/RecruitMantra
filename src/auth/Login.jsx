import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://15.206.133.74/user/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      const token = response.data.data.token;  
      localStorage.setItem("token", token);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed!');
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-y-12 min-h-screen md:px-32 items-center justify-center bg-gray-100">
    <div className='md:w-1/2 md:mx-8 ml-16'>
      <img className='w-[70%] block' src='https://internview-assets.s3.ap-south-1.amazonaws.com/RecruitMantra_with_black_BG.jpg' alt='Login image' />
    </div>
      <div className="md:w-1/2 max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{' '}
          <a className="text-blue-500 hover:underline"  href='/signup'>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
