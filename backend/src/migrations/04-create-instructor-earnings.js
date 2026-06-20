'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('InstructorEarnings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            instructorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            orderItemId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'OrderItems', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            coursePrice: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0
            },
            platformFee: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0
            },
            netEarnings: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'AVAILABLE', 'REFUNDED'),
                defaultValue: 'PENDING'
            },
            availableAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
        
        await queryInterface.addIndex('InstructorEarnings', ['instructorId']);
        await queryInterface.addIndex('InstructorEarnings', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('InstructorEarnings');
    }
};
