// src/controllers/notificationController.js
const { sendEmail } = require('../config/email');
const { sendSMS } = require('../config/sms');
const Notification = require('../models/Notification');

// Send an email notification
const sendEmailNotification = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    // Validate input
    if (!to || !subject || !message) {
      return res.status(400).json({ message: 'Recipient, subject, and message are required' });
    }

    // Send email
    await sendEmail(to, subject, message);

    // Log the notification
    const notification = new Notification({
      type: 'email',
      recipient: to,
      subject,
      message,
      status: 'sent',
    });
    await notification.save();

    res.status(200).json({ message: 'Email notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending email notification:', error);

    // Log the failed notification
    const notification = new Notification({
      type: 'email',
      recipient: to,
      subject,
      message,
      status: 'failed',
    });
    await notification.save();

    res.status(500).json({ message: 'Failed to send email notification', error: error.message });
  }
};

// Send an SMS notification
const sendSMSNotification = async (req, res) => {
  const { to, message } = req.body;

  try {
    // Validate input
    if (!to || !message) {
      return res.status(400).json({ message: 'Recipient and message are required' });
    }

    // Send SMS
    await sendSMS(to, message);

    // Log the notification
    const notification = new Notification({
      type: 'sms',
      recipient: to,
      message,
      status: 'sent',
    });
    await notification.save();

    res.status(200).json({ message: 'SMS notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending SMS notification:', error);

    // Log the failed notification
    const notification = new Notification({
      type: 'sms',
      recipient: to,
      message,
      status: 'failed',
    });
    await notification.save();

    res.status(500).json({ message: 'Failed to send SMS notification', error: error.message });
  }
};

module.exports = { sendEmailNotification, sendSMSNotification };