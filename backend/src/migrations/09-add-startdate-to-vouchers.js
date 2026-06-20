'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Vouchers');
    // Chỉ thêm cột nếu chưa tồn tại
    if (!tableDescription.startDate) {
      await queryInterface.addColumn('Vouchers', 'startDate', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'expiryDate',
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Vouchers', 'startDate');
  },
};
