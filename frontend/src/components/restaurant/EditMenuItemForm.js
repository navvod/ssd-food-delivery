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

const EditMenuItemForm = ({ item, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || '',
    price: item.price,
    category: item.category,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

      await onUpdate(formDataToSend);
    } catch (err) {
      toast.error(err.message || 'Failed to update menu item', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Menu Item</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="edit-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter menu item name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter description (optional)"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (LKR)
          </label>
          <input
            id="edit-price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter price"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="edit-category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="edit-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-200"
          >
            {menuCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Current Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
          {item.image ? (
            <div className="mb-2">
              <img
                src={item.image}
                alt="Current menu item"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          ) : (
            <p className="text-gray-500">No image uploaded</p>
          )}
        </div>

        {/* New Image Upload */}
        <div>
          <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
            Upload New Image (Optional)
          </label>
          <input
            id="edit-image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploadLoading}
            className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
              uploadLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploadLoading ? 'Uploading...' : 'Update Menu Item'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuItemForm;