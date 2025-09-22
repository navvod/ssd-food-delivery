import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/RestaurantNavbar';
import RegisterRestaurantForm from '../../components/restaurant/RegisterRestaurantForm';
import restaurantService from '../../services/restaurantService';
import { toast } from 'react-toastify';

const RegisterRestaurantPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await restaurantService.registerRestaurant(formData);
      console.log('Restaurant registration response:', response);
      toast.success('Restaurant registered successfully! Let’s add your first menu item.', {
        position: 'top-right',
        autoClose: 3000,
      });
      const targetUrl = `/restaurant/${response.restaurant._id}/add-menu`;
      console.log('Navigating to:', targetUrl);
      navigate(targetUrl);
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Let the form component handle the error
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <section>
          <h2>Register Restaurant</h2>
          <RegisterRestaurantForm onSubmit={handleSubmit} />
        </section>
      </main>
    </div>
  );
};

export default RegisterRestaurantPage;