import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrder from '../../hooks/useOrder';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import deliveryService from '../../services/deliveryService';
import restaurantService from '../../services/restaurantService';

const AdminOrderList = () => {
  const { orders, getAllOrders, updateOrder, loading } = useOrder();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [restaurantAddresses, setRestaurantAddresses] = useState({}); // Store restaurant addresses
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await getAllOrders();
      console.log('Orders in AdminOrderList:', response);

      // Check if orders already contain restaurantAddress
      const addressMap = {};
      response.forEach((order) => {
        if (order.restaurantAddress) {
          addressMap[order.restaurantId] = order.restaurantAddress;
        } else {
          addressMap[order.restaurantId] = 'Address unavailable';
        }
      });

      // If restaurantAddress is not in orders, fetch all restaurants and map addresses
      if (Object.values(addressMap).every(address => address === 'Address unavailable')) {
        try {
          const restaurants = await restaurantService.getRestaurants();
          console.log('Fetched restaurants:', restaurants);

          restaurants.forEach(restaurant => {
            addressMap[restaurant._id] = restaurant.address || 'Address not provided';
          });

          // Update addressMap for any restaurantId not found in the fetched restaurants
          response.forEach(order => {
            if (!addressMap[order.restaurantId]) {
              addressMap[order.restaurantId] = 'Restaurant not found';
            }
          });
        } catch (error) {
          console.error('Error fetching restaurants:', error);

          // Fallback to individual address fetching
          const addressPromises = response.map(async (order) => {
            if (order.restaurantId) {
              try {
                const address = await restaurantService.getRestaurantAddress(order.restaurantId);
                return { restaurantId: order.restaurantId, address };
              } catch (error) {
                console.error(`Failed to fetch address for restaurant ID ${order.restaurantId}:`, error);
                // Temporary mock address for testing
                return { restaurantId: order.restaurantId, address: `123 Restaurant St, Food City (ID: ${order.restaurantId})` };
              }
            }
            return { restaurantId: order.restaurantId || 'unknown', address: 'Restaurant ID missing' };
          });

          const addresses = await Promise.all(addressPromises);
          addresses.forEach(({ restaurantId, address }) => {
            addressMap[restaurantId] = address;
          });
        }
      }

      setRestaurantAddresses(addressMap);

    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.error || 'Failed to fetch orders. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getAllOrders]);

  const handleUpdateStatus = async (orderId, status, customerId, restaurantId, deliveryAddress) => {
    try {
      await updateOrder(orderId, status);
      toast.success('Order status updated successfully!');

      // If status is "Out for Delivery", assign a driver
      if (status === 'out_for_delivery') {
        try {
          if (!restaurantId || !deliveryAddress || !customerId) {
            throw new Error('Missing required data for driver assignment: restaurantId, deliveryAddress, or customerId');
          }

          const restaurantLocation = restaurantAddresses[restaurantId] || 'Unknown Restaurant Location';
          if (restaurantLocation === 'Address unavailable' || restaurantLocation === 'Restaurant ID missing' || restaurantLocation === 'Restaurant not found') {
            throw new Error('Restaurant address unavailable; cannot assign driver');
          }

          const deliveryLocation = deliveryAddress;

          const assignDriverData = {
            orderId,
            customerId,
            restaurantLocation,
            deliveryLocation,
          };

          console.log('Assigning driver with data:', assignDriverData);
          const response = await deliveryService.assignDriver(assignDriverData);
          toast.success(response.message || 'Driver assigned successfully!');
        } catch (error) {
          console.error('Assign driver error:', error);
          toast.error(error.message || 'Failed to assign driver');
        }
      }

      fetchOrders();
    } catch (error) {
      console.error('Update order error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to update order');
    }
  };

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-between w-full max-w-2xl mb-4">
          <h2 className="text-2xl font-bold text-secondary">All Orders</h2>
          <button
            onClick={fetchOrders}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-between w-full max-w-2xl mb-4">
          <h2 className="text-2xl font-bold text-secondary">All Orders</h2>
          <button
            onClick={fetchOrders}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
        <p className="text-lg text-secondary mb-4">No orders found. Try refreshing the list or place a test order as a customer.</p>
        <div>
          <button
            onClick={() => navigate('/add-to-cart')}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/80 transition-colors duration-200"
          >
            Place a Test Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">All Orders</h2>
          <button
            onClick={fetchOrders}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-secondary">Order ID: {order._id}</h3>
                  <div className="mt-2">
                    <span className="text-sm text-secondary font-medium">Customer ID:</span>
                    <span className="text-sm text-secondary ml-1">{order.customerId}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Restaurant ID:</span>
                    <span className="text-sm text-secondary ml-1">{order.restaurantId}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Restaurant Address:</span>
                    <span className="text-sm text-secondary ml-1">{restaurantAddresses[order.restaurantId] || 'Loading...'}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Total Amount:</span>
                    <span className="text-sm text-secondary ml-1">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Created At:</span>
                    <span className="text-sm text-secondary ml-1">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Delivery Address:</span>
                    <span className="text-sm text-secondary ml-1">{order.deliveryAddress}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-secondary font-medium">Phone Number:</span>
                    <span className="text-sm text-secondary ml-1">{order.phoneNumber}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary font-medium">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value, order.customerId, order.restaurantId, order.deliveryAddress)}
                      className="border border-secondary rounded-md px-2 py-1 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                    </select>
                  </div>
                  <h4 className="text-sm font-semibold text-secondary mt-4">Items:</h4>
                  <ul className="list-disc list-inside text-sm text-secondary mt-2">
                    {order.items.map((item) => (
                      <li key={item.itemId}>
                        {item.name} - ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;