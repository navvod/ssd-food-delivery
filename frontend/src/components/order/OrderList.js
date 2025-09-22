import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useOrder from '../../hooks/useOrder';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderList = () => {
  const { activeOrders, getActiveOrders, loading } = useOrder();

  useEffect(() => {
    getActiveOrders();
  }, [getActiveOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-secondary mb-2">Active Orders</h2>
        <p className="text-lg text-secondary">No active orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">Active Orders</h2>
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-sm font-semibold text-secondary border-b border-gray-200">Order ID</th>
                <th className="px-4 py-2 text-sm font-semibold text-secondary border-b border-gray-200">Restaurant ID</th>
                <th className="px-4 py-2 text-sm font-semibold text-secondary border-b border-gray-200">Status</th>
                <th className="px-4 py-2 text-sm font-semibold text-secondary border-b border-gray-200">Total Amount</th>
                <th className="px-4 py-2 text-sm font-semibold text-secondary border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-4 py-2 text-sm text-secondary border-b border-gray-200">{order._id}</td>
                  <td className="px-4 py-2 text-sm text-secondary border-b border-gray-200">{order.restaurantId}</td>
                  <td className="px-4 py-2 text-sm text-secondary border-b border-gray-200">{order.status}</td>
                  <td className="px-4 py-2 text-sm text-secondary border-b border-gray-200">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm border-b border-gray-200">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors duration-200">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;