import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, deleteCartItem, fetchCart } = useContext(CartContext);

  console.log('Cart.js rendering, cart:', cart);

  const handleUpdate = async (itemId, newQuantity) => {
    try {
      await updateCartItem({ itemId, quantity: newQuantity });
      toast.success('Cart updated successfully!');
      await fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      toast.success('Item removed from cart!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <p className="text-center text-secondary text-lg">Your cart is empty.</p>;
  }

  const calculatedTotalAmount = cart.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5">
      {cart.items.map((item) => (
        <div key={item.itemId} className="max-w-md sm:max-w-lg md:max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white shadow-md rounded-lg">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary">{item.itemName}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="mt-2 text-secondary space-y-1">
                <div className="flex items-center">
                  <span className="w-24 font-medium">Price:</span>
                  <span>LKR {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-medium">Quantity:</span>
                  <span>{item.quantity}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-medium">Total:</span>
                  <span>LKR {item.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => navigate(`/cart/edit/${item.itemId}`)}
                className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Change
              </button>
              <button
                onClick={() => handleDelete(item.itemId)}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      <h3 className="text-xl font-bold text-secondary text-right">
        Total Amount: LKR {(cart.totalAmount || calculatedTotalAmount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
      </h3>
    </div>
  );
};

export default Cart;