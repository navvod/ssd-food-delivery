import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const DeliverySignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = {
      ...formData,
      role: 'delivery_personnel', // Hardcode role as 'delivery_personnel'
    };

    try {
      const response = await authService.register(data);
      setSuccess(response.message);
      setFormData({ name: '', email: '', password: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Navigate to driver login page after successful signup
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1000); // Redirect after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [success, navigate]);

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-secondary mb-4 text-center">Delivery Personnel Sign Up</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      {success && (
        <p className="text-accent text-sm mb-4 text-center">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-secondary">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-secondary">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-secondary">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-200 mt-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default DeliverySignUpForm;