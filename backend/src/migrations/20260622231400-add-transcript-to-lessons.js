'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Lessons', 'transcript', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Lessons', 'transcriptStatus', {
      type: Sequelize.ENUM('pending', 'processing', 'ready', 'failed'),
      defaultValue: 'pending',
    });
    await queryInterface.addColumn('Lessons', 'transcriptJobId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Lessons', 'transcriptJobId');
    await queryInterface.removeColumn('Lessons', 'transcriptStatus');
    await queryInterface.removeColumn('Lessons', 'transcript');
  }
};
