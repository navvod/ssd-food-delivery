import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DriverNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold">
              <Link to="/driver-main" className="hover:text-gray-300 transition-colors duration-200">
                Driver Portal
              </Link>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/driver-profile"
              className="text-sm sm:text-base hover:text-gray-300 transition-colors duration-200"
            >
              Driver Profile
            </Link>
            <Link
              to="/driver-registration"
              className="text-sm sm:text-base hover:text-gray-300 transition-colors duration-200"
            >
              Driver Registration
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none hover:text-gray-300 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col space-y-2 pb-4">
              <li>
                <Link
                  to="/driver-profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-sm sm:text-base hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Driver Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/driver-registration"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-sm sm:text-base hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Driver Registration
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DriverNavbar;