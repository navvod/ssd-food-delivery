import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import LoadingSpinner from '../common/LoadingSpinner';

const AddToCartForm = () => {
  const { addToCart, loading } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    restaurantId: '',
    itemId: '',
    itemName: '',
    description: '',
    price: '',
    quantity: 1,
  });

  // Validate and sanitize navigation state
  useEffect(() => {
    const { restaurantId, itemId, itemName, description, price } = location.state || {};
    const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // MongoDB ObjectId format
    const isValidPrice = (p) => !isNaN(p) && p > 0;

    if (
      restaurantId &&
      itemId &&
      itemName &&
      price &&
      isValidObjectId(restaurantId) &&
      isValidObjectId(itemId) &&
      isValidPrice(price)
    ) {
      setFormData({
        restaurantId: DOMPurify.sanitize(restaurantId),
        itemId: DOMPurify.sanitize(itemId),
        itemName: DOMPurify.sanitize(itemName),
        description: DOMPurify.sanitize(description || ''),
        price: price.toString(),
        quantity: 1,
      });
    } else {
      toast.error(DOMPurify.sanitize('Missing or invalid item details. Please select an item to add to cart.'));
      navigate('/add-to-cart');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 100) {
        toast.error('Quantity must be an integer between 1 and 100');
        return;
      }
      setFormData({ ...formData, quantity: parsedValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { restaurantId, itemId, itemName, description, price, quantity } = formData;

    // Validate inputs
    if (!restaurantId || !itemId || !itemName || !price || !quantity) {
      toast.error(DOMPurify.sanitize('All fields are required'));
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error(DOMPurify.sanitize('Invalid price'));
      return;
    }
    if (itemName.length > 100 || description.length > 500) {
      toast.error(DOMPurify.sanitize('Item name or description too long'));
      return;
    }

    try {
      await addToCart({
        restaurantId: DOMPurify.sanitize(restaurantId),
        itemId: DOMPurify.sanitize(itemId),
        itemName: DOMPurify.sanitize(itemName),
        description: DOMPurify.sanitize(description),
        price: parsedPrice,
        quantity: parseInt(quantity),
      });
      toast.success(DOMPurify.sanitize('Item added to cart!'));
      navigate('/cart');
    } catch (error) {
      const errorMessage = DOMPurify.sanitize(error.response?.data?.error || 'Failed to add to cart');
      toast.error(errorMessage);
    }
  };

  // Format price in LKR
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
            {DOMPurify.sanitize(formData.itemName)}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-3">
            {DOMPurify.sanitize(formData.description || 'No description available')}
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
              max="100"
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