'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create FavoriteCourses table
        await queryInterface.createTable('FavoriteCourses', {
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
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Unique constraint for FavoriteCourses (one user can only favorite a course once)
        await queryInterface.addConstraint('FavoriteCourses', {
            fields: ['userId', 'courseId'],
            type: 'unique',
            name: 'unique_user_course_favorite',
        });

        // Create ViewedCourses table
        await queryInterface.createTable('ViewedCourses', {
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
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Unique constraint for ViewedCourses (one user has one recently viewed record per course)
        await queryInterface.addConstraint('ViewedCourses', {
            fields: ['userId', 'courseId'],
            type: 'unique',
            name: 'unique_user_course_viewed',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('FavoriteCourses');
        await queryInterface.dropTable('ViewedCourses');
    },
};
