import React from 'react';
import Navbar from '../../components/common/RestaurantNavbar';
import ResImg from '../../assets/homeres.jpg';
import DriImg from '../../assets/driver.jpg';
import MainImg from '../../assets/main.jpg';
import Res1Img from '../../assets/pasta.jpg';
import Res2Img from '../../assets/sushi.jpg';
import Res3Img from '../../assets/burger.jpg';

const Home = () => {
  return (
    <div className="font-sans bg-background">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="h-[500px] bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: `url(${MainImg})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Delicious Meals Delivered to Your Door
          </h1>
          <p className="text-lg sm:text-xl text-white mb-6 drop-shadow-md">
            Order from your favorite restaurants in just a few clicks!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="text"
              placeholder="Enter delivery address"
              className="p-3 text-base rounded-md border border-gray-300 w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary text-white rounded-md text-base font-semibold hover:bg-primary-dark transition-colors duration-200">
              Find Food
            </button>
          </div>
          <p className="mt-4 text-sm text-white">
            <a href="/login" className="underline hover:text-primary">
              Or sign in to your account
            </a>
          </p>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
          Featured Restaurants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={Res1Img}
              alt="Restaurant 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary">The Gourmet Bistro</h3>
              <p className="text-sm text-gray-600">Italian • $$$ • 4.8 ★</p>
              <p className="text-sm text-gray-600 mt-1">20-30 min delivery</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={Res2Img}
              alt="Restaurant 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary">Sushi Haven</h3>
              <p className="text-sm text-gray-600">Japanese • $$ • 4.7 ★</p>
              <p className="text-sm text-gray-600 mt-1">15-25 min delivery</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={Res3Img}
              alt="Restaurant 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary">Burger Bonanza</h3>
              <p className="text-sm text-gray-600">American • $ • 4.5 ★</p>
              <p className="text-sm text-gray-600 mt-1">10-20 min delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered in as little as 15 minutes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🍔</div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Wide Variety</h3>
              <p className="text-gray-600">
                Choose from hundreds of restaurants and cuisines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Easy Payments</h3>
              <p className="text-gray-600">
                Secure and seamless payment options at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">
              "Fastest delivery I’ve ever experienced! The food arrived hot and fresh."
            </p>
            <p className="mt-4 text-sm font-semibold text-secondary">— Sarah M.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">
              "I love the variety of restaurants available. There’s something for everyone!"
            </p>
            <p className="mt-4 text-sm font-semibold text-secondary">— John D.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">
              "The app is so easy to use, and the payment process is seamless."
            </p>
            <p className="mt-4 text-sm font-semibold text-secondary">— Emily R.</p>
          </div>
        </div>
      </div>

      {/* Register Your Restaurant Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          {/* Image on the Left */}
          <div className="h-64 md:h-auto">
            <img
              src={ResImg}
              alt="Pasta dish"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text and Buttons on the Right */}
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Register Your Restaurant with Us
            </h2>
            <p className="text-gray-600 mb-6">
              Join our platform and reach thousands of hungry customers. Grow your business with seamless delivery!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/restaurant-admin-signup"
                className="px-6 py-3 bg-primary text-white rounded-md text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-6 py-3 bg-gray-500 text-white rounded-md text-base font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us as a Driver Section */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          {/* Text and Buttons on the Left */}
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Join Us as a Driver
            </h2>
            <p className="text-gray-600 mb-6">
              Become a delivery driver and earn money on your own schedule. Join our team today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/delivery-signup"
                className="px-6 py-3 bg-primary text-white rounded-md text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-6 py-3 bg-gray-500 text-white rounded-md text-base font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Login
              </a>
            </div>
          </div>
          {/* Image on the Right */}
          <div className="h-64 md:h-auto">
            <img
              src={DriImg}
              alt="Delivery driver"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Food Delivery</h3>
            <p className="text-sm">
              Bringing your favorite meals right to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:underline">About Us</a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">Contact</a>
              </li>
              <li>
                <a href="/faq" className="hover:underline">FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: support@fooddelivery.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-6 text-center text-sm">
          © 2025 Food Delivery. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;