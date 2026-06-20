'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get instructor IDs
    const elena = await queryInterface.rawSelect('Users', {
      where: { email: 'elena.r@example.com' },
    }, ['id']);
    
    const david = await queryInterface.rawSelect('Users', {
      where: { email: 'd.chen@enterprise.co' },
    }, ['id']);

    const payouts = [];

    if (elena) {
      payouts.push({
        instructorId: elena,
        amount: 4250.00,
        bankName: 'CHASE',
        accountNumber: '4921',
        accountName: 'Elena Rostova',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (david) {
      payouts.push({
        instructorId: david,
        amount: 1840.50,
        bankName: 'Bank of America',
        accountNumber: '1108',
        accountName: 'David Chen',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (payouts.length > 0) {
      // Check if they already exist to avoid duplicates (assuming we just check by instructorId and PENDING status)
      for (const payout of payouts) {
        const exists = await queryInterface.rawSelect('PayoutRequests', {
          where: { 
            instructorId: payout.instructorId,
            status: 'PENDING'
          },
        }, ['id']);
        
        if (!exists) {
          await queryInterface.bulkInsert('PayoutRequests', [payout], {});
        }
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PayoutRequests', {
      status: 'PENDING'
    }, {});
  }
};
