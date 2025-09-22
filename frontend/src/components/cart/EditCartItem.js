import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';

const EditCartItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { cart, updateCartItem, fetchCart } = useContext(CartContext);

  const item = cart?.items?.find((i) => i.itemId === itemId);
  const [quantity, setQuantity] = useState(item ? item.quantity : 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('EditCartItem handleSubmit, quantity:', quantity, 'type:', typeof quantity);
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      toast.error('Please enter a valid quantity (minimum 1)');
      return;
    }
    try {
      await updateCartItem({ itemId, quantity: parsedQuantity });
      toast.success('Cart item updated successfully!');
      await fetchCart();
      navigate('/cart');
    } catch (error) {
      console.log('Update cart item error:', error.message);
      toast.error(error.message || 'Failed to update cart item');
    }
  };

  if (!item) {
    return <p className="text-center text-secondary text-lg">Item not found in cart.</p>;
  }

  const total = item.price * (Number(quantity) || 1);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-secondary mb-4">Make Changes Before Checkout!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-secondary font-medium mb-1">Item:</label>
          <span className="text-gray-600">{item.itemName}</span>
        </div>
        <div className="mb-4">
          <label className="block text-secondary font-medium mb-1">Price:</label>
          <span className="text-gray-600">
            LKR {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mb-4">
          <label className="block text-secondary font-medium mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={(e) => {
              const value = e.target.value;
              setQuantity(value === '' ? '' : Number(value) || 1);
            }}
            min="1"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-11">
          <label className="block text-secondary font-medium mb-1">Total:</label>
          <span className="text-gray-600">
            LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCartItem;