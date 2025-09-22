import React from 'react';
import Navbar from '../../components/common/RestaurantNavbar';
import Login from '../../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow p-2">
        {/* Main Heading and Tagline Section */}
        <div className="text-center mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
            Sign In to Continue
          </h1>
          <p className="text-lg text-secondary">
            Hungry to serve? Hungry to eat? Log in first!
          </p>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md mb-0 mt-12">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;