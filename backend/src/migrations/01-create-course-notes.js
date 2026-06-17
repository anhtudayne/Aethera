'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CourseNotes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            lessonId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Lessons', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
        await queryInterface.addIndex('CourseNotes', ['userId', 'courseId']);
        await queryInterface.addIndex('CourseNotes', ['userId', 'lessonId']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('CourseNotes');
    },
};
