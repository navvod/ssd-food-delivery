import { Link } from 'react-router-dom';
import { useState } from 'react';

const CustomerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link to="/active-orders" className="text-xl sm:text-2xl font-bold">
              Order Portal
            </Link>
          </div>

          {/* Links - Hidden on Mobile */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link
              to="/active-orders"
              className="text-sm sm:text-base px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Ongoing Orders
            </Link>
            <Link
              to="/history"
              className="text-sm sm:text-base px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Order History
            </Link>
            <Link
              to="/profile"
              className="text-sm sm:text-base px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Profile
            </Link>
          </div>

          {/* Hamburger Menu - Visible on Mobile */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Visible when isOpen is true */}
      {isOpen && (
        <div className="sm:hidden bg-gray-800">
          <div className="flex flex-col space-y-2 px-4 pb-4">
            <Link
              to="/active-orders"
              className="text-sm px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Ongoing Orders
            </Link>
            <Link
              to="/history"
              className="text-sm px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Order History
            </Link>
            <Link
              to="/profile"
              className="text-sm px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;