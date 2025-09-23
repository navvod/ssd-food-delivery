import React, { useState, useRef } from 'react';
import deliveryService from '../../services/deliveryService';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

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
    const { name, value } = e.target;
    if (name === 'mainLocation' && value.length > 200) {
      toast.error('Main location must be 200 characters or less');
      return;
    }
    if (name === 'vehicleRegNumber' && value.length > 20) {
      toast.error('Vehicle registration number must be 20 characters or less');
      return;
    }
    if (name === 'mobileNumber') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length > 10) {
        toast.error('Mobile number must be 10 digits');
        return;
      }
      setFormData({ ...formData, [name]: cleanedValue });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG or PNG images are allowed');
        setPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        setPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setPhoto(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const validateInputs = () => {
    if (!formData.mainLocation.trim() || formData.mainLocation.length > 200) {
      toast.error('Main location is required and must be 200 characters or less');
      return false;
    }
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.mainLocation)) {
      toast.error('Main location contains invalid characters');
      return false;
    }
    if (!formData.vehicleRegNumber.trim() || formData.vehicleRegNumber.length > 20) {
      toast.error('Vehicle registration number is required and must be 20 characters or less');
      return false;
    }
    if (!/^[A-Z0-9-]{2,20}$/.test(formData.vehicleRegNumber)) {
      toast.error('Vehicle registration number must be 2-20 characters (letters, numbers, or hyphens)');
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error('Mobile number must be exactly 10 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateInputs()) return;

    const data = new FormData();
    data.append('mainLocation', DOMPurify.sanitize(formData.mainLocation.trim()));
    data.append('vehicleRegNumber', DOMPurify.sanitize(formData.vehicleRegNumber.trim()));
    data.append('mobileNumber', DOMPurify.sanitize(formData.mobileNumber));
    if (photo) {
      data.append('photo', photo);
    }

    try {
      const response = await deliveryService.registerDriver(data);
      const successMessage = DOMPurify.sanitize(response.message);
      setSuccess(successMessage);
      toast.success(successMessage);
      setFormData({ mainLocation: '', vehicleRegNumber: '', mobileNumber: '' });
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = DOMPurify.sanitize(err.response?.data?.message || err.message);
      setError(errorMessage);
      toast.error(errorMessage);
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
              maxLength={200}
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
              maxLength={20}
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
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
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
              accept="image/jpeg,image/png"
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
              <p className="mt-2 text-sm text-gray-600">{DOMPurify.sanitize(photo.name)}</p>
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