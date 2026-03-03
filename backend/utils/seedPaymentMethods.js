const PaymentMethod = require('../models/PaymentMethod');

const seedPaymentMethods = async () => {
  const methods = [
    {
      type: 'bank_transfer',
      name: 'Bank Transfer',
      active: true,
      bankAccounts: [
        {
          bankName: 'Example Bank',
          accountName: 'Prilink Currior Company Inc.',
          accountNumber: '1234567890',
          routingNumber: '987654321',
          swiftCode: 'EXAMPLEXXX'
        }
      ],
      cryptocurrencies: []
    },
    {
      type: 'crypto',
      name: 'Cryptocurrency',
      active: true,
      bankAccounts: [],
      cryptocurrencies: [
        {
          name: 'Bitcoin',
          network: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        },
        {
          name: 'Ethereum',
          network: 'ERC20',
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
        },
        {
          name: 'USDT',
          network: 'TRC20',
          address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
        }
      ]
    }
  ];

  for (const method of methods) {
    await PaymentMethod.findOneAndUpdate(
      { type: method.type },
      method,
      { upsert: true, new: true }
    );
  }
  
  console.log('Payment methods seeded');
};

module.exports = seedPaymentMethods;
