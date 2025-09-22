import React from 'react';
import DriverAvailabilityCard from '../../components/delivery/DriverAvailabilityCard';
import AssignedOrders from '../../components/delivery/AssignedOrders';
import DriverNavbar from '../../components/delivery/DriverNavbar';

const DriverMain = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar (already styled in DriverNavbar.js) */}
      <DriverNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-16 pb-4 px-4 sm:px-6">
        {/* Dashboard Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-3 text-center">
          Driver Dashboard
        </h1>

        {/* Driver Availability Card Section */}
        <div className="mb-10 mt-10">
          <DriverAvailabilityCard />
        </div>

        {/* Assigned Orders Section */}
        <div>
          <AssignedOrders />
        </div>
      </div>
    </div>
  );
};

export default DriverMain;