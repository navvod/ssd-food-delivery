import React, { useEffect , useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/RestaurantNavbar';
import useAuth from '../../hooks/useAuth';
import AddMenuItemForm from '../../components/restaurant/AddMenuItemForm';

const AddMenuItemPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'restaurant_admin') {
      toast.error('You are not authorized to access this page.', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/restaurants');
    } else {
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

  const handleAddMenuItem = async (formData) => {
    try {
      await restaurantService.addMenuItem(restaurantId, formData);
      toast.success('Menu item added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate(`/restaurant/${restaurantId}/dashboard`);
    } catch (err) {
      throw err; // Let the form component handle the error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <section>
        
        <AddMenuItemForm onSubmit={handleAddMenuItem} restaurantId={restaurantId} />
        <button onClick={() => navigate(`/restaurant/${restaurantId}/dashboard`)}>
          Back to Dashboard
        </button>
      </section>
    </div>
  );
};

export default AddMenuItemPage;