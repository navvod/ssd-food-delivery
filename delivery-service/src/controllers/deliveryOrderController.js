const Driver = require('../models/Driver');
const Delivery = require('../models/Delivery');

const assignDriver = async (req, res) => {
  const { orderId, customerId, restaurantLocation, deliveryLocation } = req.body;

  try {
    // Validate required fields
    if (!orderId || !customerId || !restaurantLocation || !deliveryLocation) {
      return res.status(400).json({ message: 'orderId, customerId, restaurantLocation, and deliveryLocation are required' });
    }

    const driver = await Driver.findOne({
      isAvailable: true,
      mainLocation: restaurantLocation,
    });

    if (!driver) {
      return res.status(404).json({ message: 'No available drivers in this area' });
    }

    let delivery = await Delivery.findOne({ orderId });
    if (!delivery) {
      delivery = new Delivery({
        orderId,
        customerId,
        restaurantLocation,
        deliveryLocation,
        status: 'Pending',
        acceptStatus: 'Pending',
      });
    }

    delivery.driverId = driver._id;
    delivery.status = 'Assigned';
    delivery.acceptStatus = 'Pending';
    await delivery.save();

    driver.isAvailable = false;
    await driver.save();

    res.status(200).json({ message: 'Driver assigned successfully', delivery });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning driver', error: error.message });
  }
};

const respondToAssignment = async (req, res) => {
  const { orderId, action } = req.body;

  try {
    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const driver = await Driver.findById(delivery.driverId);
    if (!driver || driver.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this assignment' });
    }

    if (delivery.acceptStatus !== 'Pending') {
      return res.status(400).json({ message: 'Assignment response already processed' });
    }

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "accept" or "decline"' });
    }

    if (action === 'accept') {
      delivery.acceptStatus = 'Accepted';
      await delivery.save();
      res.status(200).json({ message: 'Assignment accepted', delivery });
    } else {
      delivery.driverId = null;
      delivery.acceptStatus = 'Declined';
      delivery.status = 'Pending';
      await delivery.save();

      driver.isAvailable = true;
      await driver.save();

      const newDriver = await Driver.findOne({
        isAvailable: true,
        mainLocation: delivery.restaurantLocation,
      });

      if (newDriver) {
        delivery.driverId = newDriver._id;
        delivery.acceptStatus = 'Pending';
        delivery.status = 'Assigned';
        await delivery.save();

        newDriver.isAvailable = false;
        await newDriver.save();
      }

      res.status(200).json({ message: 'Assignment declined, order reassigned if possible', delivery });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error responding to assignment', error: error.message });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user.id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const deliveries = await Delivery.find({ driverId: driver._id, acceptStatus: 'Pending' });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned orders', error: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    // Validate required fields
    if (!orderId || !status) {
      return res.status(400).json({ message: 'orderId and status are required' });
    }

    // Validate status value
    const allowedStatuses = ['Picked Up', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be one of: Picked Up, Delivered, Cancelled' });
    }

    // Find the delivery
    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Find the driver and verify authorization
    const driver = await Driver.findById(delivery.driverId);
    if (!driver || driver.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this delivery' });
    }

    // Check if the driver has accepted the assignment
    if (delivery.acceptStatus !== 'Accepted') {
      return res.status(400).json({ message: 'Delivery must be accepted before updating status' });
    }

    // Check if the delivery is already in a final state
    if (['Delivered', 'Cancelled'].includes(delivery.status)) {
      return res.status(400).json({ message: 'Delivery status cannot be updated after being Delivered or Cancelled' });
    }

    // Update the delivery status
    delivery.status = status;
    await delivery.save();

    // If the status is "Delivered" or "Cancelled", make the driver available again
    if (['Delivered', 'Cancelled'].includes(status)) {
      driver.isAvailable = true;
      await driver.save();
    }

    res.status(200).json({ message: 'Delivery status updated successfully', delivery });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error: error.message });
  }
};

module.exports = {
  assignDriver,
  respondToAssignment,
  getAssignedOrders,
  updateDeliveryStatus,
};