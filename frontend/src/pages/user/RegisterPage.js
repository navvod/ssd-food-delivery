// src/pages/RegisterPage.js
import React from 'react';
import Navbar from '../../components/common/RestaurantNavbar';
import Register from '../../components/auth/Register';

const RegisterPage = () => {
  return (
    <div>
      <Navbar />
      <Register />
    </div>
  );
};

export default RegisterPage;