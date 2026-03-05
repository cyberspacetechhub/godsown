const Settings = require('../models/Settings');

const defaultSettings = [
  { key: 'site_name', value: 'Prilink Currior Company', category: 'general', description: 'Website name', isPublic: true },
  { key: 'site_email', value: 'support@prilinkcurriorcompany.com', category: 'general', description: 'Contact email', isPublic: true },
  { key: 'site_phone', value: '+1 (555) 123-4567', category: 'general', description: 'Contact phone', isPublic: true },
  { key: 'currency', value: 'USD', category: 'general', description: 'Default currency', isPublic: true },
  { key: 'email_notifications', value: true, category: 'email', description: 'Enable email notifications', isPublic: false },
  { key: 'smtp_host', value: '', category: 'email', description: 'SMTP server host', isPublic: false },
  { key: 'smtp_port', value: 587, category: 'email', description: 'SMTP server port', isPublic: false },
  { key: 'payment_gateway', value: 'manual', category: 'payment', description: 'Payment gateway type', isPublic: false },
  { key: 'min_shipment_weight', value: 0.1, category: 'shipping', description: 'Minimum weight (kg)', isPublic: true },
  { key: 'max_shipment_weight', value: 1000, category: 'shipping', description: 'Maximum weight (kg)', isPublic: true },
  { key: 'standard_delivery_days', value: 5, category: 'shipping', description: 'Standard delivery time', isPublic: true },
  { key: 'express_delivery_days', value: 2, category: 'shipping', description: 'Express delivery time', isPublic: true },
  { key: 'push_notifications', value: true, category: 'notification', description: 'Enable push notifications', isPublic: false }
];

const seedSettings = async () => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      await Settings.insertMany(defaultSettings);
      // console.log('✓ Default settings seeded successfully');
    } else {
      console.log(`✓ Settings already exist (${count} settings found)`);
    }
  } catch (error) {
    console.error('Settings seed error:', error);
  }
};

module.exports = seedSettings;
