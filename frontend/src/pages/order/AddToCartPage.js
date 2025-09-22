import AddToCartForm from '../../components/cart/AddToCartForm';

const AddToCartPage = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto p-4 sm:p-6 bg-white">
        <p className="text-base sm:text-lg md:text-xl text-secondary font-semibold italic text-center mb-4 whitespace-nowrap">
        You’ve Got Great Taste!
        </p>
        <AddToCartForm />
        <p className="text-sm sm:text-base text-accent font-medium text-center mt-4">
          Make changes or add more items.
        </p>
      </div>
    </div>
  );
};

export default AddToCartPage;