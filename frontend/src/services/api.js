import axios from 'axios';

const BASE_URLS = {
  user: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:5000',
  payment: process.env.REACT_APP_PAYMENT_SERVICE_URL || 'http://localhost:5001',
  restaurant: process.env.REACT_APP_RESTAURANT_SERVICE_URL || 'http://localhost:5004',
  order: process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:5005',
  delivery: process.env.REACT_APP_DELIVERY_SERVICE_URL || 'http://localhost:5003',
  notification: process.env.REACT_APP_NOTIFICATION_SERVICE_URL || 'http://localhost:5002',
};

const api = {
  user: axios.create({ baseURL: BASE_URLS.user }),
  payment: axios.create({ baseURL: BASE_URLS.payment }),
  restaurant: axios.create({ baseURL: BASE_URLS.restaurant }),
  order: axios.create({ baseURL: BASE_URLS.order }),
  delivery: axios.create({ baseURL: BASE_URLS.delivery }),
  notification: axios.create({ baseURL: BASE_URLS.notification }),
};

const setAuthToken = (token) => {
  if (token) {
    api.user.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.payment.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.restaurant.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.order.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.delivery.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.notification.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  } else {
    delete api.user.defaults.headers.common['Authorization'];
    delete api.payment.defaults.headers.common['Authorization'];
    delete api.restaurant.defaults.headers.common['Authorization'];
    delete api.order.defaults.headers.common['Authorization'];
    delete api.delivery.defaults.headers.common['Authorization'];
    delete api.notification.defaults.headers.common['Authorization'];
    
  }
};

export { api, setAuthToken };



// import axios from 'axios';

// const BASE_URLS = {
//   gateway: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:5001',
// };

// const api = {
//   gateway: axios.create({ baseURL: BASE_URLS.gateway }),
// };

// const setAuthToken = (token) => {
//   if (token) {
//     api.gateway.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete api.gateway.defaults.headers.common['Authorization'];
//   }
// };

// export { api, setAuthToken };