const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  registerDriver,
  getMyDetails,
  updateMyDetails,
  deleteMyDetails,
  updateAvailabilityStatus,
} = require('../controllers/driverController');

// Register a new driver (driver or admin role)
router.post('/register-driver', protect, authorize('delivery_personnel'), registerDriver);

// Get logged-in driver's details (driver role)
router.get('/my-details', protect, authorize('delivery_personnel'), getMyDetails);

// Update logged-in driver's details (driver role)
router.put('/my-details', protect, authorize('delivery_personnel'), updateMyDetails);

// Delete logged-in driver's record (driver role)
router.delete('/my-details', protect, authorize('delivery_personnel'), deleteMyDetails);

// Update availability status (driver role)
router.put('/availability', protect, authorize('delivery_personnel'), updateAvailabilityStatus);

module.exports = router;