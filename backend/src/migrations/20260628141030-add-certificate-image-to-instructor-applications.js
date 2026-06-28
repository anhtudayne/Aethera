'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('InstructorApplications', 'certificateImage', {
      type: Sequelize.STRING,
      allowNull: true, // It can be optional or required based on business logic. Let's make it optional for backward compatibility if any.
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('InstructorApplications', 'certificateImage');
  }
};
