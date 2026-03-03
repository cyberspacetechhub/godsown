const notificationService = require('../services/notificationService');
const { sendEmail } = require('./emailService');

const notifyUser = async (userId, type, title, message, emailSubject, emailTemplate, emailVars) => {
  await notificationService.createNotification({
    user: userId,
    type,
    title,
    message
  });
  
  if (emailVars.email) {
    await sendEmail(emailVars.email, emailSubject, emailTemplate, emailVars);
  }
};

const notifyWelcome = async (user) => {
  await notifyUser(
    user._id,
    'general',
    'Welcome to Shipment App',
    `Welcome ${user.firstName}! Your account has been created successfully.`,
    'Welcome to Shipment App',
    'welcome',
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type
    }
  );
};

const notifyShipmentCreated = async (shipment, customer) => {
  await notifyUser(
    customer._id,
    'status_update',
    'Shipment Created',
    `Your shipment ${shipment.trackingNumber} has been created.`,
    'Shipment Created Successfully',
    'shipmentCreated',
    {
      email: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      trackingNumber: shipment.trackingNumber,
      origin: `${shipment.origin.city}, ${shipment.origin.country}`,
      destination: `${shipment.destination.city}, ${shipment.destination.country}`,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery?.toDateString() || 'TBD'
    }
  );
};

const notifyShipmentStatusUpdate = async (shipment, customer, tracking) => {
  await notifyUser(
    customer._id,
    'status_update',
    'Shipment Status Updated',
    `Your shipment ${shipment.trackingNumber} is now ${tracking.status}.`,
    'Shipment Status Update',
    'shipmentStatusUpdate',
    {
      email: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      trackingNumber: shipment.trackingNumber,
      status: tracking.status,
      location: tracking.location?.city || 'In transit',
      timestamp: tracking.timestamp.toLocaleString(),
      description: tracking.description || ''
    }
  );
};

const notifyShipmentDelivered = async (shipment, customer) => {
  await notifyUser(
    customer._id,
    'delivery',
    'Shipment Delivered',
    `Your shipment ${shipment.trackingNumber} has been delivered.`,
    'Shipment Delivered Successfully',
    'shipmentDelivered',
    {
      email: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      trackingNumber: shipment.trackingNumber,
      deliveredAt: shipment.actualDelivery?.toLocaleString() || new Date().toLocaleString(),
      location: `${shipment.destination.city}, ${shipment.destination.country}`
    }
  );
};

const notifyPaymentConfirmed = async (payment, customer, shipment) => {
  await notifyUser(
    customer._id,
    'payment',
    'Payment Confirmed',
    `Payment of $${payment.amount} has been confirmed.`,
    'Payment Confirmation',
    'paymentConfirmation',
    {
      email: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      transactionId: payment.transactionId || payment._id,
      amount: payment.amount,
      method: payment.method,
      trackingNumber: shipment.trackingNumber,
      paidAt: payment.paidAt?.toLocaleString() || new Date().toLocaleString()
    }
  );
};

const notifyDriverAssigned = async (shipment, customer, driver, vehicle) => {
  await notifyUser(
    customer._id,
    'status_update',
    'Driver Assigned',
    `Driver ${driver.firstName} has been assigned to your shipment.`,
    'Driver Assigned to Your Shipment',
    'driverAssigned',
    {
      email: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      trackingNumber: shipment.trackingNumber,
      driverName: `${driver.firstName} ${driver.lastName}`,
      driverPhone: driver.phone || 'N/A',
      vehicleType: vehicle?.type || 'N/A',
      vehicleNumber: vehicle?.vehicleNumber || 'N/A'
    }
  );
};

module.exports = {
  notifyWelcome,
  notifyShipmentCreated,
  notifyShipmentStatusUpdate,
  notifyShipmentDelivered,
  notifyPaymentConfirmed,
  notifyDriverAssigned
};
