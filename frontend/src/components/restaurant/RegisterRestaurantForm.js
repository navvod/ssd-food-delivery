import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

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

  const phoneRegex = /^\+\d{1,3}\d{9}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && value.length > 100) {
      toast.error('Restaurant name must be 100 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (name === 'address' && value.length > 200) {
      toast.error('Address must be 200 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (name === 'contact') {
      const cleanedValue = value.replace(/[^+\d]/g, '');
      if (cleanedValue.length > 13) {
        toast.error('Contact number must be 13 characters or less (e.g., +94123456789)', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      setFormData({ ...formData, [name]: cleanedValue });
      if (!phoneRegex.test(cleanedValue)) {
        setContactError('Please enter a valid phone number (e.g., +94123456789)');
      } else {
        setContactError('');
      }
      return;
    }
    if (name === 'cuisineType' && value && !categories.includes(value)) {
      toast.error('Invalid cuisine type selected', {
        position: 'top-right',
        autoClose: 3000,
      });
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
        toast.error('Only JPEG or PNG images are allowed', {
          position: 'top-right',
          autoClose: 3000,
        });
        setImageFile(null);
        return;
      }
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB', {
          position: 'top-right',
          autoClose: 3000,
        });
        setImageFile(null);
        return;
      }
      setImageFile(file);
    }
  };

  const validateInputs = () => {
    if (!formData.name.trim() || formData.name.length > 100) {
      toast.error('Restaurant name is required and must be 100 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!/^[a-zA-Z0-9\s&.,-]+$/.test(formData.name)) {
      toast.error('Restaurant name contains invalid characters', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!formData.address.trim() || formData.address.length > 200) {
      toast.error('Address is required and must be 200 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.address)) {
      toast.error('Address contains invalid characters', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!phoneRegex.test(formData.contact)) {
      toast.error('Contact number must be a valid phone number (e.g., +94123456789)', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!formData.cuisineType || !categories.includes(formData.cuisineType)) {
      toast.error('Please select a valid cuisine type', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      setUploadLoading(false);
      return;
    }

    setUploadLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', DOMPurify.sanitize(formData.name.trim()));
      formDataToSend.append('address', DOMPurify.sanitize(formData.address.trim()));
      formDataToSend.append('contact', DOMPurify.sanitize(formData.contact));
      formDataToSend.append('cuisineType', DOMPurify.sanitize(formData.cuisineType));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await onSubmit(formDataToSend);
      toast.success('Restaurant registered successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setFormData({ name: '', address: '', contact: '', cuisineType: '' });
      setImageFile(null);
    } catch (err) {
      const errorMessage = DOMPurify.sanitize(err.message || 'Failed to register restaurant');
      toast.error(errorMessage, {
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
            maxLength={100}
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
            maxLength={200}
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
            type="tel"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            maxLength={13}
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
            accept="image/jpeg,image/png"
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