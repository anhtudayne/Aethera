'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify ENUM in Courses table
    await queryInterface.sequelize.query(
      "ALTER TABLE Courses MODIFY COLUMN status ENUM('draft', 'pending', 'published', 'rejected', 'suspended') DEFAULT 'draft';"
    );

    await queryInterface.createTable('CourseStatusHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      oldStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },
      newStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CourseStatusHistories');
    // We'll leave the ENUM as is, because reverting might fail if there's data
  }
};
