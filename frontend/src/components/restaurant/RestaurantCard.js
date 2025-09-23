import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const RestaurantCard = ({ restaurant }) => {
  // Sanitize fields
  const sanitizedName = DOMPurify.sanitize(restaurant.name || '');
  const sanitizedCuisineType = DOMPurify.sanitize(restaurant.cuisineType || '');
  const sanitizedAddress = DOMPurify.sanitize(restaurant.address || '');
  const sanitizedId = DOMPurify.sanitize(restaurant._id || '');
  // Validate and sanitize image URL
  const sanitizedImage = restaurant.image && /^https?:\/\//.test(restaurant.image)
    ? DOMPurify.sanitize(restaurant.image)
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300">
      {sanitizedImage ? (
        <img
          src={sanitizedImage}
          alt={sanitizedName}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary">{sanitizedName}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Cuisine:</strong> {sanitizedCuisineType}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Address:</strong> {sanitizedAddress}
        </p>
        <Link to={`/restaurants/${sanitizedId}/menu`}>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">
            View Menu
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;