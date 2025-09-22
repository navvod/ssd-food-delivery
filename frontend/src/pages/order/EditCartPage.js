import EditCartItem from '../../components/cart/EditCartItem';

const EditCartPage = () => (
  <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <p className="text-lg sm:text-xl text-accent font-semibold italic text-center mb-4">
        Ordering for a group? Increase quantities easily!
      </p>
      <EditCartItem />
      <div className="mt-6 text-xs sm:text-sm text-gray-600">
        <h4 className="font-semibold text-secondary mb-2">Info & Notes:</h4>
        <p className="flex items-center mb-2">
          <span className="mr-1 sm:mr-2 text-accent">✓</span>
          Your changes will update the total
        </p>
        <p className="flex items-center">
          <span className="mr-1 sm:mr-2 text-accent">✓</span>
          Price updates instantly
        </p>
      </div>
    </div>
  </div>
);

export default EditCartPage;