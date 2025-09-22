import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const AddToCartForm = () => {
  const { addToCart, loading } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with default values
  const [formData, setFormData] = useState({
    restaurantId: '',
    itemId: '',
    itemName: '',
    description: '',
    price: '',
    quantity: 1,
  });

  // Populate formData with data from navigation state
  useEffect(() => {
    const { restaurantId, itemId, itemName, description, price } = location.state || {};
    if (restaurantId && itemId && itemName && price) {
      setFormData({
        restaurantId: restaurantId || '',
        itemId: itemId || '',
        itemName: itemName || '',
        description: description || '',
        price: price ? price.toString() : '',
        quantity: 1,
      });
    } else {
      toast.error('Missing item details. Please select an item to add to cart.');
      navigate('/'); // Redirect to home or menu page if data is missing
    }
  }, [location.state, navigate]);

  // Only allow quantity to be changed
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addToCart({
        restaurantId: formData.restaurantId,
        itemId: formData.itemId,
        itemName: formData.itemName,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      toast.success('Item added to cart!');
      navigate('/cart'); // Redirect to cart view page
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  // Format price in LKR (similar to MenuItem.js)
  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center bg-white font-sans w-full max-w-full mx-0 px-0 py-6 sm:py-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      
        <form onSubmit={handleSubmit}>
          {/* Item Name as Header */}
          <h2 className="text-2xl sm:text-2xl font-bold text-secondary mb-2 sm:mb-4">
            {formData.itemName}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-3">
            {formData.description || 'No description available'}
          </p>

          {/* Price */}
          <p className="text-lg sm:text-xl font-semibold text-secondary mb-5 sm:mb-4">
            {formData.price ? formatPrice(formData.price) : 'Price not available'}
          </p>

          {/* Quantity Input */}
          <div className="mb-6 sm:mb-4">
            <label className="block text-secondary font-medium text-sm sm:text-base mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              placeholder="Quantity"
              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-5 rounded-lg text-white text-base sm:text-lg font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {loading ? 'Adding...' : `Add ${formData.quantity} to cart`}
          </button>
        </form>

        {/* Notes Section */}
        <div className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="flex items-center mb-2">
            <span className="mr-1 sm:mr-2 text-accent">✓</span>
            Freshly prepared after you order
          </p>
          <p className="flex items-center mb-2">
            <span className="mr-1 sm:mr-2 text-accent">✓</span>
            You can edit this later in your cart
          </p>
          <p className="flex items-center font-semibold text-accent">
            <span className="mr-1 sm:mr-2">★</span>
            Popular choice!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddToCartForm;