// frontend/src/components/common/RestaurantNavbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const RestaurantNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', {
      position: 'top-right',
      autoClose: 2000,
    });
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white p-4 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-black focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
          <Link
            to="/"
            className="text-xl font-bold text-black no-underline"
          >
            Food Delivery
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row items-center gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
        >
          {user ? (
            <>
              {user.role === 'restaurant_admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-black hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin-order"
                    className="text-black hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/admin/register-restaurant"
                    className="text-black hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register Restaurant
                  </Link>
                </>
              )}
              {user.role === 'customer' && (
                <Link
                  to="/restaurants"
                  className="text-black hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
              )}
              <Link
                to="/profile"
                className="text-black hover:text-gray-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-black rounded-full text-black no-underline hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/customer-signup"
                className="px-4 py-2 bg-black text-white rounded-full no-underline hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default RestaurantNavbar;