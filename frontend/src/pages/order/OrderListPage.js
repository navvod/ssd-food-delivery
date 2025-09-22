import CustomerNavbar from '../../components/common/OrderNavbar';
import OrderList from '../../components/order/OrderList';

const OrderListPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar (already styled in CustomerNavbar.js) */}
      <CustomerNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Page Tagline */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            On the Way!
          </h2>
          <p className="text-md sm:text-lg text-gray-600 italic mt-1">
            Fresh, fast, and coming to you!
          </p>
        </div>

        {/* Order List */}
        <OrderList />

        {/* Tracking/Info Tips Section */}
        <div className="mt-6 text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-7.586 4.243l4.243 4.243M6.343 7.757l-4.243 4.243m0 0l4.243 4.243M6.343 12H3"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              📍 Tracking/Info Tips
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Need help?{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              Contact support
            </a>{' '}
            anytime.
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Double-check your delivery address for a smooth drop-off!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;