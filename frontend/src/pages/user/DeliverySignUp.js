import React from 'react';
import DeliverySignUpForm from '../../components/auth/DeliverySignUpForm';

const DeliverySignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2">
      {/* Main Heading and Tagline Section */}
      <div className="text-center mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          Become a Delivery Partner
        </h1>
        <p className="text-lg text-secondary">
          Sign up, deliver food, and earn on your own schedule.
        </p>
      </div>

      {/* Requirements Note Section */}
      <div className="w-full max-w-md mb-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-secondary mb-2">Requirements</h3>
        <ul className="text-sm text-secondary space-y-2">
          <li className="flex items-center">
            <span className="mr-2">📜</span>
            You’ll need a valid driving license and a smartphone.
          </li>
          <li className="flex items-center">
            <span className="mr-2">🚗</span>
            Must be 18+ with a vehicle and basic smartphone skills.
          </li>
          <li className="flex items-center">
            <span className="mr-2">🎓</span>
            Training provided – no prior experience needed!
          </li>
        </ul>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md mb-5 mt-8">
        <DeliverySignUpForm />
      </div>

      {/* Trust Messages Section */}
      <div className="text-center space-y-3 mt-4">
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">🔒</span>
          We keep your information secure and private.
        </p>
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">💰</span>
          No hidden fees, just fair pay and real support.
        </p>
      </div>
    </div>
  );
};

export default DeliverySignUp;