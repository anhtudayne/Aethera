'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');
    if (!tableInfo.status) {
      await queryInterface.addColumn('Courses', 'status', {
        type: Sequelize.ENUM('draft', 'published'),
        defaultValue: 'draft'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');
    if (tableInfo.status) {
      await queryInterface.removeColumn('Courses', 'status');
    }
  }
};
