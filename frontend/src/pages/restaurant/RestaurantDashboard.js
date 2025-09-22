import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import restaurantService from '../../services/restaurantService';
import { toast } from 'react-toastify';
import RestaurantDashboardContent from '../../components/restaurant/RestaurantDashboardContent';

const RestaurantDashboard = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'restaurant_admin') {
      toast.error('You are not authorized to access this page.');
      navigate('/restaurants');
    }
  }, [user, authLoading, navigate]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await restaurantService.getRestaurantDetails();
      console.log('Fetched restaurant details:', response);
      const { restaurant: fetchedRestaurant, menu: fetchedMenu } = response;
      if (!fetchedRestaurant) {
        throw new Error('No restaurant found for this admin. Please register a restaurant.');
      }
      if (fetchedRestaurant._id.toString() !== restaurantId) {
        throw new Error('You are not authorized to access this restaurant.');
      }
      setRestaurant(fetchedRestaurant);
      setMenu(fetchedMenu || []); // Ensure menu is always an array
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setError(err.message || 'Failed to fetch restaurant details');
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleUpdateAvailability = async (isAvailable) => {
    try {
      await restaurantService.updateAvailability(isAvailable);
      setRestaurant({ ...restaurant, isAvailable });
      toast.success(`Restaurant is now ${isAvailable ? 'available' : 'unavailable'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update availability', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await restaurantService.deleteMenuItem(itemId);
      setMenu(menu.filter(item => item._id !== itemId));
      toast.success('Menu item deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to delete menu item', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchRestaurantDetails();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <RestaurantDashboardContent
      loading={loading}
      error={error}
      restaurant={restaurant}
      menu={menu}
      handleUpdateAvailability={handleUpdateAvailability}
      handleDeleteMenuItem={handleDeleteMenuItem}
      navigate={navigate}
      restaurantId={restaurantId}
    />
  );
};

export default RestaurantDashboard;