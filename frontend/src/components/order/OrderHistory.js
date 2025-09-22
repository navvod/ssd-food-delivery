import { useContext, useEffect } from 'react';
import { OrderContext } from '../../context/OrderContext';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const { orderHistory, getOrderHistory, loading } = useContext(OrderContext);

  useEffect(() => {
    console.log('OrderHistory useEffect triggered');
    const fetchOrderHistory = async () => {
      try {
        console.log('Calling getOrderHistory...');
        await getOrderHistory();
        console.log('getOrderHistory completed');
      } catch (error) {
        console.error('Error fetching order history:', error.message);
        toast.error('Failed to fetch order history');
      }
    };
    fetchOrderHistory();
  }, [getOrderHistory]);

  console.log('OrderHistory rendering, loading:', loading, 'orderHistory:', orderHistory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm sm:text-base">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (!orderHistory || orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg sm:text-xl text-gray-600">No orders found in history.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
      Delicious Moments You’ve Had
      </h2>

      {/* Orders List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {orderHistory.map((order) => (
          <div
            key={order._id}
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${
              order.status.toLowerCase() === 'cancelled' ? 'bg-red-50' : ''
            }`}
          >
            {/* Order Details */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-medium">Create Date:</span>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Order ID: {order._id}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm sm:text-base text-gray-600">Status:</span>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                    order.status.toLowerCase() === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status.toLowerCase() === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-4">
              <h4 className="text-md sm:text-lg font-medium text-gray-700 mb-2">Items:</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.itemId}
                    className="flex justify-between text-sm sm:text-base text-gray-600"
                  >
                    <span>
                      {item.name} - ${item.price} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm sm:text-base text-gray-600">Total Amount:</span>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                ${order.totalAmount}
              </span>
            </div>

            {/* Address Details */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">Delivery Address:</span> {order.deliveryAddress}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">From Address:</span> {order.fromAddress}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-medium">Phone Number:</span> {order.phoneNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;