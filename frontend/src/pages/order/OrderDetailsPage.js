import CustomerNavbar from '../../components/common/OrderNavbar';
import OrderDetails from '../../components/order/OrderDetails';

const OrderDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar (already styled in CustomerNavbar.js) */}
      <CustomerNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-3 px-4 sm:px-6 lg:px-8">
        {/* Page Tagline */}
        <div className="text-center">
          <p className="text-md sm:text-lg text-gray-600 italic mb-5">
            Here’s What You Ordered
          </p>
        </div>
        <OrderDetails />
      </div>
    </div>
  );
};

export default OrderDetailsPage;