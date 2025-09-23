import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../../context/OrderContext';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const ActiveOrders = () => {
  const { activeOrders, getActiveOrders, loading } = useContext(OrderContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ActiveOrders useEffect triggered');
    const fetchActiveOrders = async () => {
      try {
        console.log('Calling getActiveOrders...');
        await getActiveOrders();
        console.log('getActiveOrders completed');
      } catch (error) {
        console.error('Error fetching active orders:', error.message);
        toast.error(DOMPurify.sanitize('Failed to fetch active orders')); // Sanitize toast message
      }
    };
    fetchActiveOrders();
  }, [getActiveOrders]);

  console.log('ActiveOrders rendering, loading:', loading, 'activeOrders:', activeOrders);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm sm:text-base">Loading active orders...</p>
        </div>
      </div>
    );
  }

  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg sm:text-xl text-gray-600 mb-4">No active orders found.</p>
          <button
            onClick={() => navigate('/add-to-cart')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Date and Title */}
      <div className="text-center mb-8">
        <p className="text-md sm:text-lg text-gray-500">{formattedDate}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
          Your Ongoing Orders
        </h2>
        <p className="text-md sm:text-lg text-gray-600 mt-2">
          Almost there — your cravings will be crushed soon!
        </p>
      </div>

      {/* Orders List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {activeOrders.map((order) => {
          // Sanitize all potentially unsafe fields
          const sanitizedOrderId = DOMPurify.sanitize(order._id || '');
          const sanitizedAddress = DOMPurify.sanitize(order.deliveryAddress || '');
          const sanitizedFromAddress = DOMPurify.sanitize(order.fromAddress || '');
          const sanitizedPhone = DOMPurify.sanitize(order.phoneNumber || '');
          const sanitizedStatus = DOMPurify.sanitize(order.status || '');
          const sanitizedItems = order.items.map((item) => ({
            ...item,
            name: DOMPurify.sanitize(item.name || '')
          }));

          return (
            <div
              key={sanitizedOrderId}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Order ID: {sanitizedOrderId}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm sm:text-base text-gray-600">Total Amount:</span>
                  <span className="text-sm sm:text-base font-medium text-gray-800">
                    ${order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-4">
                <h4 className="text-md sm:text-lg font-medium text-gray-700 mb-2">Items:</h4>
                <ul className="space-y-2">
                  {sanitizedItems.map((item) => (
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

              {/* Order Details */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Delivery Address:</span> {sanitizedAddress}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">From Address:</span> {sanitizedFromAddress}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Phone Number:</span> {sanitizedPhone}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                      sanitizedStatus === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {sanitizedStatus}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ActiveOrders;