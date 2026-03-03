const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const loadTemplate = async (templateName) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
  return await fs.readFile(templatePath, 'utf-8');
};

const replaceTemplateVars = (template, vars) => {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return result;
};

const sendEmail = async (to, subject, templateName, vars) => {
  try {
    const template = await loadTemplate(templateName);
    const html = replaceTemplateVars(template, { ...vars, frontendUrl: process.env.FRONTEND_URL });
    
    await sgMail.send({
      from: process.env.EMAIL_FROM || 'noreply@shiptrack.com',
      to,
      subject,
      html
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendOrderConfirmationEmail = async (order, customer) => {
  return await sendEmail(
    customer.email,
    'Order Confirmation',
    'order-confirmation',
    {
      customerName: customer.name,
      orderId: order._id,
      totalAmount: order.totalAmount,
      orderDate: new Date(order.orderDate).toLocaleDateString()
    }
  );
};

const sendBookingConfirmationEmail = async (booking, guest, room) => {
  return await sendEmail(
    guest.email,
    'Booking Confirmation',
    'booking-confirmation',
    {
      guestName: guest.name,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      checkInDate: new Date(booking.checkInDate).toLocaleDateString(),
      checkOutDate: new Date(booking.checkOutDate).toLocaleDateString()
    }
  );
};

const sendInquiryReceivedEmail = async (inquiry, property) => {
  return await sendEmail(
    inquiry.customerEmail,
    'Inquiry Received',
    'inquiry-received',
    {
      customerName: inquiry.customerName,
      propertyTitle: property.title,
      propertyLocation: property.location
    }
  );
};

const sendPaymentSuccessEmail = async (payment, email, customerName) => {
  return await sendEmail(
    email,
    'Payment Successful',
    'payment-success',
    {
      customerName,
      amount: payment.amount,
      transactionId: payment.transactionId,
      paymentMethod: payment.paymentMethod
    }
  );
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendBookingConfirmationEmail,
  sendInquiryReceivedEmail,
  sendPaymentSuccessEmail
};
