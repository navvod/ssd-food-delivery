import { useNavigate } from 'react-router-dom';
import OrderNavbar from '../../components/common/OrderNavbar';
import OrderHistory from '../../components/order/OrderHistory';

const OrderHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar (already styled in OrderNavbar.js) */}
      <OrderNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Page Tagline */}
        <div className="text-center mb-4">
          <p className="text-md sm:text-lg text-gray-600 italic">
            Never forget a great meal.
          </p>
        </div>
        <OrderHistory />
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
    </div>
  );
};

export default OrderHistoryPage;