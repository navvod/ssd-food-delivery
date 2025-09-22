import React from 'react';
import RestaurantAdminSignUpForm from '../../components/auth/RestaurantAdminSignUpForm';

const RestaurantAdminSignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2">
      {/* Main Heading and Tagline Section */}
      <div className="text-center mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
          Join as a Restaurant Partner
        </h1>
        <p className="text-lg text-secondary">
          Reach more customers. Boost your orders.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md mb-5 mt-12">
        <RestaurantAdminSignUpForm />
      </div>

      {/* Trust/Privacy Messages Section */}
      <div className="text-center space-y-3 mt-4">
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">🔒</span>
          We value your trust. Your business details are secure with us.
        </p>
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">📈</span>
          No hidden fees. No hassles. Just growth.
        </p>
      </div>
    </div>
  );
};

export default RestaurantAdminSignUp;