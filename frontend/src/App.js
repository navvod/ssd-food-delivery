import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Helmet } from 'react-helmet'; // Add react-helmet for CSP meta tags
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// akila
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import CustomerSignUp from './pages/user/CustomerSignUp';
import DeliverySignUp from './pages/user/DeliverySignUp';
import RestaurantAdminSignUp from './pages/user/RestaurantAdminSignUp';
import ActiveOrderPage from './pages/order/ActiveOrderPage';

// naduni
import Home from './pages/restaurant/Home';
import RestaurantsPage from './pages/restaurant/RestaurantsPage';
import MenuPage from './pages/restaurant/MenuPage';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RegisterRestaurantPage from './pages/restaurant/RegisterRestaurantPage';
import AddMenuItemPage from './pages/restaurant/AddMenuItemPage';
import EditMenuItemPage from './pages/restaurant/EditMenuItemPage';
import AdminDashboard from './pages/restaurant/AdminDashboard';

// lakna
import AddToCartPage from './pages/order/AddToCartPage';
import CartPage from './pages/order/CartPage';
import EditCartPage from './pages/order/EditCartPage';
import CreateOrderPage from './pages/order/CreateOrderPage';
import OrderListPage from './pages/order/OrderListPage';
import OrderDetailsPage from './pages/order/OrderDetailsPage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import AdminOrderPage from './pages/order/AdminOrderPage';

// veenadhi
import DriverMain from './pages/driver/DriverMain';
import DriverProfile from './pages/driver/DriverProfile';
import DriverRegistration from './pages/driver/DriverRegistration';

function App() {
  // Define a basic CSP for client-side rendering, aligned with server-side
  const cspPolicy = `
    default-src 'self';
    script-src 'self' 'nonce-random123' https://trustedcdn.com;
    style-src 'self' https://fonts.googleapis.com 'nonce-random123';
    img-src 'self' https://images.example.com data:;
    connect-src 'self' https://api.example.com http://localhost:5000;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    upgrade-insecure-requests;
  `.replace(/\n/g, '');

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Helmet>
            <meta httpEquiv="Content-Security-Policy" content={cspPolicy} />
          </Helmet>
          <Router>
            <Routes>
              {/* akila */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/customer-signup" element={<CustomerSignUp />} />
              <Route path="/delivery-signup" element={<DeliverySignUp />} />
              <Route path="/restaurant-admin-signup" element={<RestaurantAdminSignUp />} />

              {/* naduni */}
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurants/:restaurantId/menu" element={<MenuPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/register-restaurant" element={<RegisterRestaurantPage />} />
              <Route path="/restaurant/:restaurantId/dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant/:restaurantId/add-menu" element={<AddMenuItemPage />} />
              <Route path="/restaurant/:restaurantId/edit-menu/:itemId" element={<EditMenuItemPage />} />

              {/* lakna */}
              {/* Customer Routes */}
              <Route path="/add-to-cart" element={<AddToCartPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cart/edit/:itemId" element={<EditCartPage />} />
              <Route path="/create-order" element={<CreateOrderPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/order/:orderId" element={<OrderDetailsPage />} />
              <Route path="/history" element={<OrderHistoryPage />} />
              <Route path="/active-orders" element={<ActiveOrderPage />} />
              {/* Admin Routes */}
              <Route path="/admin-order" element={<AdminOrderPage />} />

              {/* veenadhi */}
              <Route path="/driver-main" element={<DriverMain />} />
              <Route path="/driver-profile" element={<DriverProfile />} />
              <Route path="/driver-registration" element={<DriverRegistration />} />
            </Routes>
          </Router>
          <ToastContainer />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;