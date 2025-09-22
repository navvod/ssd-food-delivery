import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
  locale: 'en', // Optional: Set the locale for Stripe Elements
});

const PaymentMethods = () => {
  const { user, token } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [cards, setCards] = useState([]);
  const [loadingStripe, setLoadingStripe] = useState(true);

  // Check if Stripe has loaded
  useEffect(() => {
    if (stripe && elements) {
      setLoadingStripe(false);
    } else if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key is missing in .env file');
      toast.error('Payment system is unavailable. Please contact support.');
    }
  }, [stripe, elements]);

  // Fetch cards on mount
  useEffect(() => {
    if (user && token) {
      fetchCards();
    }
  }, [user, token]);

  const fetchCards = async () => {
    try {
      const fetchedCards = await paymentService.getCards();
      setCards(fetchedCards);
    } catch (error) {
      toast.error(error.message || 'Error fetching cards');
      console.error('Error fetching cards:', error);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe has not loaded. Please try again.');
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        console.error('Stripe error:', error);
        return;
      }

      await paymentService.addCard({ paymentMethodId: paymentMethod.id });
      toast.success('Card added successfully!');
      cardElement.clear();
      fetchCards();
    } catch (error) {
      toast.error(error.message || 'Error adding card');
      console.error('Error adding card:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await paymentService.deleteCard(cardId);
      toast.success('Card deleted successfully!');
      fetchCards();
    } catch (error) {
      toast.error(error.message || 'Error deleting card');
      console.error('Error deleting card:', error);
    }
  };

  if (!user) {
    return <div>Please log in to manage your payment methods.</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Add Payment Method Form */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Add Payment Method</h3>
        {loadingStripe ? (
          <p>Loading payment form...</p>
        ) : (
          <form onSubmit={handleAddCard}>
            <div
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Card Details
              </label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      padding: '10px',
                      lineHeight: '24px',
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || loadingStripe}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1d4ed8',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Add Card
            </button>
          </form>
        )}
      </div>

      {/* View Payment Methods */}
      <div>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>View Payment Methods</h3>
        {cards.length === 0 ? (
          <p>No payment methods added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cards.map((card) => (
              <li
                key={card._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <p>
                  {card.brand} ending in {card.last4} (Expires: {card.expiryMonth}/{card.expiryYear})
                </p>
                <button
                  onClick={() => handleDeleteCard(card._id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Wrap the component in Stripe Elements
const PaymentMethodsWrapper = () => (
  <Elements stripe={stripePromise}>
    <PaymentMethods />
  </Elements>
);

export default PaymentMethodsWrapper;