import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MenuItem = ({ item }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    toast.success(`${item.name} added to cart!`, {
      position: 'top-right',
      autoClose: 2000,
    });
    // Navigate to the AddToCartPage with item details
    navigate('/add-to-cart', {
      state: {
        restaurantId: item.restaurantId,
        itemId: item._id,
        itemName: item.name,
        description: item.description,
        price: item.price,
      },
    });
  };

  const handleClick = () => {
    // Navigate to a menu item details page (optional)
    navigate(`/restaurants/${item.restaurantId}/menu/${item._id}`);
  };

  // Format price in LKR
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
    >
      <div>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-700 font-medium">{formatPrice(item.price)}</p>
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;