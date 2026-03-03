const { getIO } = require('../config/socket');

const emitShipmentUpdate = (shipmentId, data) => {
  try {
    const io = getIO();
    io.to(`shipment-${shipmentId}`).emit('shipment-update', data);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

const emitTrackingUpdate = (shipmentId, tracking) => {
  try {
    const io = getIO();
    io.to(`shipment-${shipmentId}`).emit('tracking-update', tracking);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

const emitNotification = (userId, notification) => {
  try {
    const io = getIO();
    io.to(`user-${userId}`).emit('notification', notification);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

const emitPaymentUpdate = (userId, payment) => {
  try {
    const io = getIO();
    io.to(`user-${userId}`).emit('payment-update', payment);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

const emitMessage = (userId, message) => {
  try {
    const io = getIO();
    io.to(`user-${userId}`).emit('new-message', message);
  } catch (error) {
    console.error('Socket emit error:', error);
  }
};

module.exports = {
  emitShipmentUpdate,
  emitTrackingUpdate,
  emitNotification,
  emitPaymentUpdate,
  emitMessage
};
