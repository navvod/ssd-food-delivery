import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import restaurantService from '../../services/restaurantService';
import RestaurantsContent from '../../components/restaurant/RestaurantsContent';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getRestaurants();
        console.log('Fetched Restaurants:', response);
        setRestaurants(response || []);
        setFilteredRestaurants(response || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch restaurants', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Search Query:', searchQuery, 'Filtered:', filtered);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.cuisineType === selectedCategory ||
          (restaurant.menu && restaurant.menu.some((item) => item.category === selectedCategory))
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, restaurants]);

  const toggleFavorite = (restaurantId) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  return (
    <RestaurantsContent
      loading={loading}
      restaurants={restaurants}
      filteredRestaurants={filteredRestaurants}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      deliveryType={deliveryType}
      setDeliveryType={setDeliveryType}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      navigate={navigate}
    />
  );
};

export default RestaurantsPage;