import OrderNavbar from '../../components/common/OrderNavbar';
import ActiveOrders from '../../components/order/ActiveOrders';

const ActiveOrderPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar (already styled in OrderNavbar.js) */}
      <OrderNavbar />

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <ActiveOrders />
      </div>
    </div>
  );
};

export default ActiveOrderPage;