'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'icon', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'category',
    });
    await queryInterface.addColumn('Categories', 'themeColor', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'primary',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'icon');
    await queryInterface.removeColumn('Categories', 'themeColor');
  }
};
