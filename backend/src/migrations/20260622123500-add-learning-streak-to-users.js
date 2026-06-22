'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'streakWeeks', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('Users', 'weeklyVisits', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('Users', 'weeklyMinutes', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('Users', 'lastActivityDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'weekStartDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'streakWeeks');
    await queryInterface.removeColumn('Users', 'weeklyVisits');
    await queryInterface.removeColumn('Users', 'weeklyMinutes');
    await queryInterface.removeColumn('Users', 'lastActivityDate');
    await queryInterface.removeColumn('Users', 'weekStartDate');
  }
};
