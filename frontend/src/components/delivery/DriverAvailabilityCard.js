import React, { useState, useEffect } from 'react';
import deliveryService from '../../services/deliveryService';

const DriverAvailabilityCard = () => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch driver details to get the initial availability status
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const data = await deliveryService.getDriverDetails();
        setIsAvailable(data.isAvailable);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchDriverDetails();
  }, []);

  const handleToggle = async () => {
    const newAvailability = !isAvailable;
    setError(null);
    setSuccess(null);

    try {
      const response = await deliveryService.updateAvailabilityStatus(newAvailability);
      setIsAvailable(newAvailability);
      setSuccess(response.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (isAvailable === null && !error) {
    return (
      <div className="bg-gray-100 flex items-center justify-center py-5">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center p-5 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 text-center">
          Driver Availability
        </h2>

        {/* Error and Success Messages */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-3 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm bg-green-50 p-2 rounded-md mb-3 text-center">
            {success}
          </p>
        )}

        {/* Availability Status */}
        <div className="flex items-center justify-center mb-5">
          <p className="text-sm text-gray-700 mr-2">
            <span className="font-semibold">Status:</span>
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center">
          <button
            onClick={handleToggle}
            className={`w-full sm:w-auto px-7 py-2 rounded-md text-sm text-white transition-colors duration-200 ${
              isAvailable
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Toggle Availability ({isAvailable ? 'Off' : 'On'})
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverAvailabilityCard;