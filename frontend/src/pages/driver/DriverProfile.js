import React from 'react';
import DriverDetails from '../../components/delivery/DriverDetails';
import DriverNavbar from '../../components/delivery/DriverNavbar';

const DriverProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar (already styled in DriverNavbar.js) */}
      <DriverNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1 text-center">
          Driver Profile
        </h1>

        {/* Driver Details Section */}
        <div>
          <DriverDetails />
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;