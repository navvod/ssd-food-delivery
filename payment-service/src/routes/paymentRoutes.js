const express = require('express');
const router = express.Router();
const { processPayment, refundPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Process payment for an order
router.post('/pay', protect, processPayment);

// Refund a payment
router.post('/refund/:orderId', protect, refundPayment);

// Fetch payment status
router.get('/:orderId', protect, getPaymentStatus);

module.exports = router;