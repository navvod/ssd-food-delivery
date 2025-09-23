// src/pages/user/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      toast.success('Logged in successfully!');

      const userRole = response.user?.role;
      if (userRole === 'customer') {
        navigate('/profile');
      } else if (userRole === 'delivery_personnel') {
        navigate('/driver-main');
      } else if (userRole === 'restaurant_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    try {
      const response = await googleLogin(credentialResponse.credential, role);
      toast.success('Logged in with Google successfully!');

      const userRole = response.user?.role;
      if (userRole === 'customer') {
        navigate('/profile');
      } else if (userRole === 'delivery_personnel') {
        navigate('/driver-main');
      } else if (userRole === 'restaurant_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition-colors duration-200 mt-4 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <label htmlFor="role" className="block text-sm font-medium text-secondary">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="restaurant_admin">Restaurant Admin</option>
            <option value="delivery_personnel">Delivery Personnel</option>
          </select>
        </div>

        <div className="mt-4 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error('Google login failed')}
            scope="email profile"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;