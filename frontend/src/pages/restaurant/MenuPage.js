import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import { toast } from 'react-toastify';
import MenuContent from '../../components/restaurant/MenuContent';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await restaurantService.getRestaurantMenu(restaurantId);
        setRestaurant(data.restaurant);
        setMenu(data.menu || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch menu');
        toast.error(err.message || 'Failed to load restaurant menu', {
          position: 'top-right',
          autoClose: 3000,
        });
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  return (
    <MenuContent
      loading={loading}
      error={error}
      restaurant={restaurant}
      menu={menu}
    />
  );
};

export default MenuPage;