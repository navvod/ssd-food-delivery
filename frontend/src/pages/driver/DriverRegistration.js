import React from 'react';
import DriverRegistrationForm from '../../components/delivery/DriverRegistrationForm';
import DriverNavbar from '../../components/delivery/DriverNavbar';

const DriverRegistration = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar (already styled in DriverNavbar.js) */}
      <DriverNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-4 px-4 sm:px-6 lg:px-8">
        {/* Page Title and Tagline */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Driver Registration
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            Start Your Journey with Us.
          </p>
          <p className="text-md sm:text-lg text-gray-500">
            Deliver happiness. Get paid.
          </p>
        </div>

        {/* Driver Registration Form Section */}
        <div className="mb-1">
          <DriverRegistrationForm />
        </div>

        {/* Trust/Privacy Notes */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl">🛡️</span>
            <h2 className="text-md sm:text-lg font-semibold text-gray-800">
              Trust/Privacy Notes
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Your information is safe and secured with us.
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            We value your privacy and security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;