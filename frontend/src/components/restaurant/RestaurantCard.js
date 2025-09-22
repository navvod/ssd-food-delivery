import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300">
      {restaurant.image ? (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Cuisine:</strong> {restaurant.cuisineType}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Address:</strong> {restaurant.address}
        </p>
        <Link to={`/restaurants/${restaurant._id}/menu`}>
          <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">
            View Menu
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;