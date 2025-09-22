import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrder from '../../hooks/useOrder';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { getOrder, loading } = useOrder();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const fetchedOrder = await getOrder(orderId);
      console.log('Fetched order:', fetchedOrder);
      setOrder(fetchedOrder);
    };
    fetchOrder();
  }, [orderId, getOrder]);

  if (loading || !order) return <LoadingSpinner />;

  return (
    <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          Order Details
        </h2>

        {/* Order Summary */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base font-medium text-gray-600">Total Amount:</span>
              <span className="text-sm sm:text-base text-gray-800">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base font-medium text-gray-600">Status:</span>
              <span
                className={`text-sm sm:text-base px-2 py-1 rounded-full ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'out_for_delivery'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base text-gray-600">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left font-medium text-gray-700">Item Name</th>
                  <th className="p-3 text-left font-medium text-gray-700">Price</th>
                  <th className="p-3 text-left font-medium text-gray-700">Quantity</th>
                  <th className="p-3 text-left font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.itemId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{item.name || 'N/A'}</td>
                    <td className="p-3">${item.price.toFixed(2)}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">${(item.amount || item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Back to Order List
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;