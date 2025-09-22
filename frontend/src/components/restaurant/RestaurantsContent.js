import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../common/RestaurantNavbar';
import restaurantService from '../../services/restaurantService';
import { CartContext } from '../../context/CartContext'; // Import CartContext

const categories = [
  { name: 'Vegan', icon: '🥦' },
  { name: 'Fusion', icon: '🍱' },
  { name: 'Fast Food', icon: '🍔' },
  { name: 'Healthy', icon: '🥗' },
  { name: 'Chinese', icon: '🥡' },
  { name: 'Japanese', icon: '🍣' },
  { name: 'Thai', icon: '🍜' },
  { name: 'Korean', icon: '🍲' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Sri Lankan', icon: '🍚' },
  { name: 'Desserts & Bakery', icon: '🍰' },
  { name: 'Italian', icon: '🍝' },
  { name: 'Street Food', icon: '🌮' },
];

const RestaurantsContent = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  deliveryType,
  setDeliveryType,
  favorites,
  toggleFavorite,
  navigate,
}) => {
  const { cart, fetchCart } = React.useContext(CartContext); // Access CartContext
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getRestaurants();
        setRestaurants(response);
        setFilteredRestaurants(response);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast.error('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch cart data when the component mounts
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Filter restaurants based on search query and selected category
  useEffect(() => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (restaurant) => restaurant.cuisineType === selectedCategory
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, restaurants]);

  const groupedRestaurants = filteredRestaurants.reduce((acc, restaurant) => {
    const category = restaurant.cuisineType || 'Other';
    acc[category] = acc[category] || [];
    acc[category].push(restaurant);
    return acc;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleRestaurantClick = (restaurantId, available) => {
    if (!available) {
      toast.info('This restaurant is currently unavailable.');
      return;
    }
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  const handleOrderHistoryClick = () => {
    navigate('/history');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-lg py-10">Loading...</div>;
  }

  const defaultImage = 'https://via.placeholder.com/300x200.png?text=Restaurant+Image';

  // Calculate the number of items in the cart
  const cartItemCount = cart && cart.items ? cart.items.length : 0;

  return (
    <div className="min-h-screen bg-background font-sans">
      <ToastContainer />
      <Navbar />

      {/* Header Section */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200">
                <span>📍</span>
                <span>Location • Now</span>
                <span>▼</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeliveryType('Delivery')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    deliveryType === 'Delivery'
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setDeliveryType('Pickup')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    deliveryType === 'Pickup'
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Pickup
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOrderHistoryClick}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
              >
                Order History
              </button>
              <button onClick={handleCartClick} className="relative">
                <span className="text-xl">🛒</span>
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Restaurants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for restaurants or dishes"
              className="w-full p-3 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800 placeholder-gray-400 transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Categories Section */}
        <section className="mb-8 relative">
          <div className="flex items-center">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-200 to-transparent rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-300 z-10"
            >
              <span className="text-xl">←</span>
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex-shrink-0 flex items-center gap-2 p-3 rounded-full min-w-[120px] transition-colors duration-200 snap-center ${
                    selectedCategory === category.name
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-200 to-transparent rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-gray-300 z-10"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
        </section>

        {/* Restaurants Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Stores</h2>
          {Object.keys(groupedRestaurants).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No restaurants available.</p>
          ) : (
            Object.keys(groupedRestaurants).map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-3">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedRestaurants[category].map((restaurant) => (
                    <div
                      key={restaurant._id}
                      onClick={() => handleRestaurantClick(restaurant._id, restaurant.isAvailable)}
                      className={`bg-white rounded-xl shadow-sm overflow-hidden relative transition-all duration-300 ${
                        restaurant.isAvailable
                          ? 'cursor-pointer hover:shadow-md'
                          : 'opacity-50 grayscale cursor-not-allowed'
                      }`}
                    >
                      {!restaurant.isAvailable && (
                        <div className="absolute top-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-center py-2">
                          <span className="text-sm font-medium">Unavailable</span>
                        </div>
                      )}
                      <div className="relative">
                        <img
                          src={restaurant.image || defaultImage}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(restaurant._id);
                          }}
                          className={`absolute top-3 right-3 text-2xl transition-colors duration-200 ${
                            favorites.includes(restaurant._id) ? 'text-red-500' : 'text-gray-400'
                          } hover:text-red-600 ${!restaurant.isAvailable && 'pointer-events-none'}`}
                        >
                          {favorites.includes(restaurant._id) ? '♥' : '♡'}
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800">{restaurant.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{restaurant.cuisineType}</p>
                        <p className="text-sm text-gray-600 mt-1">⭐ 4.5 • 30-40 min • Free Delivery</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default RestaurantsContent;