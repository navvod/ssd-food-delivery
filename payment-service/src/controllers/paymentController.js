const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Card = require('../models/Card');

// Ensure the Stripe key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Process payment for an order
const processPayment = async (req, res) => {
  const { orderId, amount, cardId } = req.body; // Changed from paymentMethod to cardId
  const userId = req.user.id;

  try {
    // Validate input
    if (!orderId || !amount || !cardId) {
      return res.status(400).json({ message: 'Order ID, amount, and card ID are required' });
    }

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    // Find the card to get the Stripe payment method ID
    const card = await Card.findOne({ _id: cardId, userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found or not authorized' });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: 'usd', // Use 'lkr' if supported and configured
      payment_method: card.stripePaymentMethodId, // Use the stored Stripe payment method ID
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: { orderId },
    });

    // Create a payment record in the database
    const payment = new Payment({
      orderId,
      amount,
      paymentMethod: paymentIntent.payment_method_types[0] || 'card',
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
      transactionId: paymentIntent.id,
    });

    await payment.save();

    res.status(200).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    console.error('Payment processing error:', error);
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ message: 'Payment failed: Card error', error: error.message });
    }
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

// Refund a payment
const refundPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the payment record
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund a payment that is not completed' });
    }

    if (!payment.transactionId) {
      return res.status(400).json({ message: 'No transaction ID found for this payment' });
    }

    // Issue a refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
    });

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund processing failed', error: error.message });
  }
};

// Fetch payment status
const getPaymentStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment status retrieved', payment });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to retrieve payment status', error: error.message });
  }
};

module.exports = { processPayment, refundPayment, getPaymentStatus };