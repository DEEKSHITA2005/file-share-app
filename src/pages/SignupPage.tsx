import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('https://n6aqvbq3qg.execute-api.ap-south-1.amazonaws.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Signup successful. Please sign in.');
        navigate('/signin');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
