'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'aiCredits', {
      type: Sequelize.INTEGER,
      defaultValue: 25,
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'lastCreditReset', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'aiCredits');
    await queryInterface.removeColumn('Users', 'lastCreditReset');
  }
};
