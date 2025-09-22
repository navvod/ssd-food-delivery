// frontend/src/components/restaurant/MenuContent.js
import React from 'react';
import Navbar from '../common/RestaurantNavbar';
import MenuItem from './MenuItem';

const MenuContent = ({ loading, error, restaurant, menu }) => {
  const defaultImage = 'https://via.placeholder.com/300x200.png?text=Restaurant+Image';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-600 text-lg py-10">Loading...</div>
        ) : error ? (
          <p className="text-red-500 text-lg text-center py-10">{error}</p>
        ) : (
          <>
            {/* Restaurant Header with Banner Image */}
            <header className="relative">
              <img
                src={restaurant?.image || defaultImage}
                alt={restaurant?.name || 'Restaurant'}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h1 className="text-4xl font-bold text-white">
                  {restaurant?.name || 'Restaurant'} Menu
                </h1>
              </div>
            </header>

            {/* Restaurant Info Section */}
            <section className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-gray-700">
                    {restaurant?.address || 'Address not available'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-800">Cuisine:</strong>{' '}
                    {restaurant?.cuisineType || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-800">Delivery:</strong>{' '}
                    Free • 30-40 min
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300">
                    Delivery
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300">
                    Pickup
                  </button>
                </div>
              </div>
            </section>

            {/* Menu Items Section */}
            <section className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dishes</h2>
              {menu.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No menu items available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menu.map((item) => (
                    <MenuItem key={item._id} item={item} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default MenuContent;