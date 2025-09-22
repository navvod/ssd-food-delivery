import React from 'react';
import Navbar from '../../components/common/RestaurantNavbar';
import Profile from '../../components/auth/Profile';
import PaymentMethods from '../../components/payment/PaymentMethods';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
          Profile Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section (Left) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Profile />
          </div>
          {/* Payment Methods Section (Right) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;