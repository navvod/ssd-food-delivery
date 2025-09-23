import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const menuCategories = [
  'Main Course',
  'Appetizers',
  'Desserts',
  'Beverages',
  'Sides',
  'Snacks',
];

const AddMenuItemForm = ({ onSubmit, restaurantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && value.length > 100) {
      toast.error('Name must be 100 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (name === 'description' && value.length > 500) {
      toast.error('Description must be 500 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (name === 'price') {
      const parsedValue = parseFloat(value);
      if (value && (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 10000)) {
        toast.error('Price must be a number between 0 and 10,000', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
    }
    if (name === 'category' && !menuCategories.includes(value)) {
      toast.error('Invalid category selected', {
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
      toast.error('Name is required and must be 100 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!/^[a-zA-Z0-9\s&.,-]+$/.test(formData.name)) {
      toast.error('Name contains invalid characters', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (formData.description && formData.description.length > 500) {
      toast.error('Description must be 500 characters or less', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (formData.description && !/^[a-zA-Z0-9\s&.,-]+$/.test(formData.description)) {
      toast.error('Description contains invalid characters', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0 || priceValue > 10000) {
      toast.error('Price is required and must be a number between 0.01 and 10,000', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
    if (!menuCategories.includes(formData.category)) {
      toast.error('Invalid category selected', {
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
      formDataToSend.append('description', DOMPurify.sanitize(formData.description.trim()));
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', DOMPurify.sanitize(formData.category));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (restaurantId) {
        formDataToSend.append('restaurantId', DOMPurify.sanitize(restaurantId));
      }

      await onSubmit(formDataToSend);
      toast.success('Menu item added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setFormData({ name: '', description: '', price: '', category: 'Main Course' });
      setImageFile(null);
    } catch (err) {
      const errorMessage = DOMPurify.sanitize(err.message || 'Failed to add menu item');
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
      <h2 className="text-2xl font-semibold text-secondary mb-6">Add Menu Item</h2>
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
            placeholder="Enter menu item name"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            maxLength={500}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary placeholder-gray-400 transition-all duration-200"
            placeholder="Enter description (optional)"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-secondary mb-1">
            Price (LKR)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0.01"
            max="10000"
            step="0.01"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary placeholder-gray-400 transition-all duration-200"
            placeholder="Enter price"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-secondary mb-1">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-secondary transition-all duration-200"
          >
            {menuCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-secondary mb-1">
            Menu Item Image (optional)
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
          {uploadLoading ? 'Uploading...' : 'Add Menu Item'}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;