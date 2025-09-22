import React from 'react';
import Navbar from '../common/RestaurantNavbar';

const RestaurantDashboardContent = ({
  loading,
  error,
  restaurant,
  menu,
  handleUpdateAvailability,
  handleDeleteMenuItem,
  navigate,
  restaurantId,
}) => {
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-lg py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          {error.includes('No restaurant found') && (
            <div>
              <button
                onClick={() => navigate('/admin/register-restaurant')}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
              >
                Register a Restaurant
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {/* Restaurant Dashboard Header */}
        <h2 className="text-3xl font-semibold text-secondary mb-6">
          {restaurant.name} Dashboard
        </h2>

        {/* Restaurant Details Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-2xl font-medium text-secondary mb-4">Restaurant Details</h3>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong className="font-semibold text-secondary">Name:</strong>{' '}
              {restaurant.name}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-secondary">Address:</strong>{' '}
              {restaurant.address}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-secondary">Contact:</strong>{' '}
              {restaurant.contact}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-secondary">Cuisine Type:</strong>{' '}
              {restaurant.cuisineType}
            </p>
            <div className="flex items-center gap-3">
              <p className="text-gray-700">
                <strong className="font-semibold text-secondary">Availability:</strong>{' '}
                <span
                  className={
                    restaurant.isAvailable ? 'text-accent' : 'text-red-500'
                  }
                >
                  {restaurant.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </p>
              <button
                onClick={() => handleUpdateAvailability(!restaurant.isAvailable)}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                  restaurant.isAvailable
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-accent hover:bg-green-600'
                }`}
              >
                {restaurant.isAvailable ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>
          </div>
        </section>

        {/* Menu Items Section */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-medium text-secondary">Menu Items</h3>
            <button
              onClick={() => navigate(`/restaurant/${restaurantId}/add-menu`)}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
            >
              Add Menu Item
            </button>
          </div>
          {menu.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No menu items available.</p>
          ) : (
            <ul className="space-y-4">
              {menu.map(item => (
                <li
                  key={item._id || item.id || Math.random()}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-start gap-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-secondary">{item.name}</h4>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <p className="text-gray-700 mt-1">
                      <strong>Price:</strong> {formatPrice(item.price)}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <strong>Category:</strong> {item.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const itemId = item._id || item.id;
                        if (!itemId) {
                          console.error('Item ID is undefined for item:', item);
                          return;
                        }
                        console.log('Navigating to edit menu item with ID:', itemId);
                        navigate(`/restaurant/${restaurantId}/edit-menu/${itemId}`);
                      }}
                      className="px-3 py-1 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id || item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default RestaurantDashboardContent;