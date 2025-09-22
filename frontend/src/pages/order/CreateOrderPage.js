import CreateOrder from '../../components/order/CreateOrder';

const CreateOrderPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <CreateOrder />
      </div>
    </div>
  );
};

export default CreateOrderPage;