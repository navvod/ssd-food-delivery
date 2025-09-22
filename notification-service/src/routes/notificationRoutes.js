// src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmailNotification, sendSMSNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Send email notification
router.post('/email', protect, sendEmailNotification);

// Send SMS notification
router.post('/sms', protect, sendSMSNotification);

module.exports = router;