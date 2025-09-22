import React, { useState } from 'react';
import { toast } from 'react-toastify';

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
    setFormData({ ...formData, [name]: value });
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await onSubmit(formDataToSend);
    } catch (err) {
      toast.error(err.message || 'Failed to add menu item', {
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
            min="0"
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
          {uploadLoading ? 'Uploading...' : 'Add Menu Item'}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;