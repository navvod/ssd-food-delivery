import React, { useState, useEffect } from 'react';
import deliveryService from '../../services/deliveryService';
import notificationService from '../../services/notificationService';
import useAuth from '../../hooks/useAuth';

const AssignedOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch assigned orders on mount
  const fetchAssignedOrders = async () => {
    try {
      const data = await deliveryService.getAssignedOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const handleResponse = async (orderId, action) => {
    setError(null);
    setSuccess(null);

    try {
      // Respond to the assignment (accept or decline)
      const response = await deliveryService.respondToAssignment(orderId, action);
      setSuccess(response.message);

      // If the action is 'accept', send an email to the delivery personnel
      if (action === 'accept') {
        if (!user || !user.email) {
          throw new Error('User email not available. Please ensure you are logged in.');
        }

        const emailPayload = {
          to: user.email,
          subject: 'Order Assignment Accepted',
          message: `Dear Delivery Personnel,\n\nYou have successfully accepted the order (ID: ${orderId}).\n\nOrder Details:\n- Restaurant Location: ${
            orders.find((order) => order.orderId === orderId)?.restaurantLocation || 'N/A'
          }\n- Delivery Location: ${
            orders.find((order) => order.orderId === orderId)?.deliveryLocation || 'N/A'
          }\n\nPlease proceed to pick up the order at your earliest convenience.\n\nBest regards,\nFood Delivery Team`,
        };

        const emailResponse = await notificationService.sendEmailNotification(emailPayload);
        setSuccess(`${response.message} Email notification sent to ${user.email}.`);
      }

      // Refresh the orders list
      fetchAssignedOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await deliveryService.updateDeliveryStatus(orderId, status);
      setSuccess(response.message);
      fetchAssignedOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-lg text-gray-800">
          Please log in to view assigned orders.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Assigned Orders
        </h2>

        {/* Error and Success Messages */}
        {error && (
          <p className="text-red-500 text-sm sm:text-base bg-red-50 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm sm:text-base bg-green-50 p-3 rounded-md mb-4 text-center">
            {success}
          </p>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base bg-white p-4 rounded-lg shadow-md text-center">
            No pending orders assigned.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Order Details */}
                  <div>
                    <p className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold">Order ID:</span> {order.orderId}
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 mt-1">
                      <span className="font-semibold">Restaurant Location:</span>{' '}
                      {order.restaurantLocation}
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 mt-1">
                      <span className="font-semibold">Delivery Location:</span>{' '}
                      {order.deliveryLocation}
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 mt-1">
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 mt-1">
                      <span className="font-semibold">Accept Status:</span>{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                          order.acceptStatus === 'Accepted'
                            ? 'bg-green-100 text-green-700'
                            : order.acceptStatus === 'Declined'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.acceptStatus}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
                    {order.acceptStatus === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleResponse(order.orderId, 'accept')}
                          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleResponse(order.orderId, 'decline')}
                          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {order.acceptStatus === 'Accepted' && !['Delivered', 'Cancelled'].includes(order.status) && (
                      <>
                        {order.status === 'Assigned' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Picked Up')}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            Mark as Picked Up
                          </button>
                        )}
                        {order.status === 'Picked Up' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Delivered')}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderId, 'Cancelled')}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            Cancel Order
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedOrders;