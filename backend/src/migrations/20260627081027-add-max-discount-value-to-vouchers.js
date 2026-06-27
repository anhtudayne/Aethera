'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vouchers', 'maxDiscountValue', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Maximum discount amount for percentage-based vouchers'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vouchers', 'maxDiscountValue');
  }
};
