const Card = require('../models/Card');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Add a new debit card using Stripe payment method ID
const addCard = async (req, res) => {
  const { paymentMethodId } = req.body; // Stripe payment method ID (pm_xxx) from frontend
  const userId = req.user.id; // From JWT token via protect middleware

  try {
    // Validate payment method with Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const card = new Card({
      userId,
      stripePaymentMethodId: paymentMethodId,
      last4: paymentMethod.card.last4,
      brand: paymentMethod.card.brand,
      expiryMonth: paymentMethod.card.exp_month.toString().padStart(2, '0'),
      expiryYear: paymentMethod.card.exp_year.toString(),
    });

    await card.save();
    res.status(201).json({ message: 'Card added successfully', card });
  } catch (error) {
    res.status(400).json({ error: 'Error adding card', details: error.message });
  }
};

// Get all debit cards for the user
const getCards = async (req, res) => {
  const userId = req.user.id;

  try {
    const cards = await Card.find({ userId });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cards', details: error.message });
  }
};

// Update a debit card (only metadata, not the Stripe payment method itself)
const updateCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user.id;

  try {
    const card = await Card.findOne({ _id: cardId, userId });
    if (!card) {
      return res.status(404).json({ error: 'Card not found or not authorized' });
    }

    // In a real app, you might not allow updating card details directly
    // Instead, delete the old card and add a new one via Stripe
    res.json({ message: 'Card update not supported. Please delete and add a new card.' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating card', details: error.message });
  }
};

// Delete a debit card
const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user.id;

  try {
    const card = await Card.findOneAndDelete({ _id: cardId, userId });
    if (!card) {
      return res.status(404).json({ error: 'Card not found or not authorized' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting card', details: error.message });
  }
};

module.exports = { addCard, getCards, updateCard, deleteCard };