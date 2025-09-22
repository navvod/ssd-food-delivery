import React, { useState } from 'react';
import { toast } from 'react-toastify';

const categories = [
  'Vegan',
  'Fusion',
  'Fast Food',
  'Healthy',
  'Chinese',
  'Japanese',
  'Thai',
  'Korean',
  'Indian',
  'Sri Lankan',
  'Desserts & Bakery',
  'Italian',
  'Street Food',
];

const RegisterRestaurantForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    cuisineType: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [contactError, setContactError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const phoneRegex = /^\+\d{1,3}\d{6,14}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'contact') {
      if (!phoneRegex.test(value)) {
        setContactError('Please enter a valid phone number (e.g., +94123456789)');
      } else {
        setContactError('');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (!phoneRegex.test(formData.contact)) {
      toast.error('Please fix the phone number format before submitting.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setUploadLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('cuisineType', formData.cuisineType);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await onSubmit(formDataToSend);
    } catch (err) {
      toast.error(err.message || 'Failed to register restaurant', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-secondary mb-6">Register Restaurant</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary placeholder-gray-400 transition-all duration-200"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-secondary mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary placeholder-gray-400 transition-all duration-200"
            placeholder="Enter address"
          />
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-secondary mb-1">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="+94123456789"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary placeholder-gray-400 transition-all duration-200"
          />
          {contactError && (
            <p className="text-red-500 text-sm mt-1">{contactError}</p>
          )}
        </div>

        {/* Cuisine Type */}
        <div>
          <label htmlFor="cuisineType" className="block text-sm font-medium text-secondary mb-1">
            Cuisine Type
          </label>
          <select
            name="cuisineType"
            id="cuisineType"
            value={formData.cuisineType}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary transition-all duration-200"
          >
            <option value="">Select Cuisine</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-secondary mb-1">
            Restaurant Image (optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploadLoading}
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
            uploadLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {uploadLoading ? 'Uploading...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterRestaurantForm;