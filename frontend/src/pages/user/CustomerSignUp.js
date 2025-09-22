import React from 'react';
import CustomerSignUpForm from '../../components/auth/CustomerSignUpForm';

const CustomerSignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2">
      {/* Main Heading and Tagline Section */}
      <div className="text-center mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
          Create Your Account
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Join the Feast!
        </h2>
        <p className="text-lg text-secondary">
          Fresh meals, fast delivery — just a few steps away!
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md mb-10 mt-12">
        <CustomerSignUpForm />
      </div>

      {/* Trust/Privacy Messages Section */}
      <div className="text-center space-y-3">
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">🔒</span>
          We respect your privacy. Your information is safe with us.
        </p>
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">❤️</span>
          No spam, just food love.
        </p>
        <p className="text-sm text-secondary flex items-center justify-center">
          <span className="mr-2">✅</span>
          Secure sign-up, happy tummy!
        </p>
      </div>
    </div>
  );
};

export default CustomerSignUp;