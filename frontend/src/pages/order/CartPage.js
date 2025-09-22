import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Cart from '../../components/cart/Cart';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, loading } = useContext(CartContext);

  console.log('CartPage rendering, loading:', loading, 'cart:', cart);

  useEffect(() => {
    if (!cart) {
      console.log('useEffect calling fetchCart');
      fetchCart();
    }
  }, [fetchCart]);

  const handleContinueShopping = () => {
    navigate('/restaurants');
  };

  const handleCheckout = () => {
    navigate('/create-order');
  };

  return (
    <div className="cart-page-container min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="cart-title text-3xl font-bold text-secondary text-center mb-1">
        Your Cart
      </h2>
      <p className="text-xl sm:text-2xl text-secondary text-center italic mb-7">
         Ready to satisfy your cravings?
      </p>
      {loading ? (
        <p className="cart-loading text-center text-secondary text-lg">Loading...</p>
      ) : (
        <>
          <Cart />
          {cart && cart.items.length > 0 && (
            <div className="cart-actions mt-8">
              <p className="text-lg sm:text-xl text-secondary text-center font-semibold mb-6">
                Done picking? Let’s feed you now
              </p>
              <div className="cart-buttons flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleContinueShopping}
                  className="btn-continue py-2 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="btn-checkout py-2 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;