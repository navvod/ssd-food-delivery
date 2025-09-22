import React from 'react';
import Navbar from '../common/RestaurantNavbar';

const AdminDashboardContent = ({ loading, error, restaurant, navigate }) => {
  if (loading) {
    return <div className="text-center text-gray-600 text-lg py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/register-restaurant')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
          >
            Register a Restaurant
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-gray-700 text-lg mb-4">
          No restaurant found. Please register your restaurant.
        </p>
        <button
          onClick={() => navigate('/admin/register-restaurant')}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
        >
          Register a Restaurant
        </button>
      </main>
    </div>
  );
};

export default AdminDashboardContent;