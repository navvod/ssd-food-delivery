import React, { useState, useRef } from 'react';
import deliveryService from '../../services/deliveryService';

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    mainLocation: '',
    vehicleRegNumber: '',
    mobileNumber: '',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('mainLocation', formData.mainLocation);
    data.append('vehicleRegNumber', formData.vehicleRegNumber);
    data.append('mobileNumber', formData.mobileNumber);
    if (photo) {
      data.append('photo', photo);
    }

    try {
      const response = await deliveryService.registerDriver(data);
      setSuccess(response.message);
      setFormData({ mainLocation: '', vehicleRegNumber: '', mobileNumber: '' });
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          Register as a Driver
        </h2>

        {/* Error and Success Messages */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md mb-4 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm bg-green-50 p-2 rounded-md mb-4 text-center">
            {success}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mainLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Main Location:
            </label>
            <input
              type="text"
              id="mainLocation"
              name="mainLocation"
              value={formData.mainLocation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="vehicleRegNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vehicle Registration Number:
            </label>
            <input
              type="text"
              id="vehicleRegNumber"
              name="vehicleRegNumber"
              value={formData.vehicleRegNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number:
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (Optional):
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
            >
              Upload Photo
            </button>
            {photo && (
              <p className="mt-2 text-sm text-gray-600">Selected file: {photo.name}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;