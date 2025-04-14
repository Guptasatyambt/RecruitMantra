// NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404</h1>
      <p>Page Not Found</p>
      <button 
            onClick={() => navigate('/')}
            className="mt-12 inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Back to Home
            </button>
      {/* <a href="/">Back to Home</a> */}
    </div>
  );
}
