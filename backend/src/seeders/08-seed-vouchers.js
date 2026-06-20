'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const vouchers = [
      {
        id: uuidv4(),
        code: 'SUMMER2024',
        discountPercent: 20.00,
        expiryDate: new Date('2024-08-31'),
        usageCount: 450,
        maxUsage: 1000,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        code: 'WELCOME50',
        discountPercent: 50.00,
        expiryDate: new Date('2024-12-31'),
        usageCount: 1204,
        maxUsage: 1500,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        code: 'FLASH10',
        discountPercent: 10.00,
        expiryDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
        usageCount: 89,
        maxUsage: 89,
        status: 'EXPIRED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Avoid duplicate key errors if already seeded
    for (const voucher of vouchers) {
      const exists = await queryInterface.rawSelect('Vouchers', {
        where: { code: voucher.code },
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('Vouchers', [voucher], {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Vouchers', null, {});
  }
};
