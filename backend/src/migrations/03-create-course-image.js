'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CourseImages', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            imageUrl: { type: Sequelize.STRING, allowNull: false },
            isPrimary: { type: Sequelize.BOOLEAN, defaultValue: false },
            sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
            courseId: {
                type: Sequelize.INTEGER,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('CourseImages');
    },
};
