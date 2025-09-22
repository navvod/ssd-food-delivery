import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import RestaurantNavbar from '../../components/common/RestaurantNavbar';
import AdminOrderList from '../../components/order/AdminOrderList';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'restaurant_admin');

  return (
    <div className="container" style={{ backgroundColor: 'lightgray', padding: '20px' }}>
      <RestaurantNavbar />
      <AdminOrderList />
    </div>
  );
};

export default AdminDashboardPage;