const Driver = require('../models/Driver');
const { upload } = require('../config/cloudinaryConfig');

const registerDriver = async (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Photo upload failed', error: err.message });
    }

    const { mainLocation, vehicleRegNumber, mobileNumber } = req.body;
    const userId = req.user.id;

    try {
      
      const existingDriver = await Driver.findOne({ userId });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver already registered' });
      }

      const driver = new Driver({
        userId,
        mainLocation,
        vehicleRegNumber,
        photo: req.file ? req.file.path : null,
        mobileNumber,
        isAvailable: true,
      });

      await driver.save();
      res.status(201).json({ message: 'Driver registered successfully', driver });
    } catch (error) {
      res.status(500).json({ message: 'Error registering driver', error: error.message });
    }
  });
};

const getMyDetails = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user.id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver details', error: error.message });
  }
};

const updateMyDetails = async (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Photo upload failed', error: err.message });
    }

    const { mainLocation, vehicleRegNumber, mobileNumber } = req.body;

    try {
      const driver = await Driver.findOne({ userId: req.user.id });
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }

      if (mainLocation) driver.mainLocation = mainLocation;
      if (vehicleRegNumber) driver.vehicleRegNumber = vehicleRegNumber;
      if (mobileNumber) driver.mobileNumber = mobileNumber;
      if (req.file) driver.photo = req.file.path;

      await driver.save();
      res.status(200).json({ message: 'Driver details updated', driver });
    } catch (error) {
      res.status(500).json({ message: 'Error updating driver details', error: error.message });
    }
  });
};

const deleteMyDetails = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ userId: req.user.id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting driver', error: error.message });
  }
};

const updateAvailabilityStatus = async (req, res) => {
  const { isAvailable } = req.body;

  try {
    const driver = await Driver.findOne({ userId: req.user.id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'isAvailable must be a boolean' });
    }

    driver.isAvailable = isAvailable;
    await driver.save();
    res.status(200).json({ message: 'Availability status updated', driver });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability status', error: error.message });
  }
};

module.exports = {
  registerDriver,
  getMyDetails,
  updateMyDetails,
  deleteMyDetails,
  updateAvailabilityStatus,
};