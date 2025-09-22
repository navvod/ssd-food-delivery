import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/RestaurantNavbar';
import EditMenuItemForm from '../../components/restaurant/EditMenuItemForm';

const EditMenuItemPage = () => {
  const { restaurantId, itemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('restaurantId:', restaurantId, 'itemId:', itemId);
    if (!restaurantId || !itemId || itemId === 'undefined') {
      setError('Invalid restaurant or menu item ID');
      setLoading(false);
      return;
    }

    const fetchMenuItem = async () => {
      try {
        const item = await restaurantService.getMenuItem(restaurantId, itemId);
        setFormData({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          image: item.image || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch menu item');
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [restaurantId, itemId]);

  const handleUpdateMenuItem = async (updatedItem) => {
    if (!itemId || itemId === 'undefined') {
      toast.error('Invalid menu item ID. Cannot update.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      await restaurantService.updateMenuItem(restaurantId, itemId, updatedItem);
      toast.success('Menu item updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate(`/restaurant/${restaurantId}/dashboard`);
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = () => {
    navigate(`/restaurant/${restaurantId}/dashboard`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section>
        
        <EditMenuItemForm
          item={formData}
          onUpdate={handleUpdateMenuItem}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
};

export default EditMenuItemPage;