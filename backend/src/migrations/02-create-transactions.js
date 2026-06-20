'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            transactionId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            transactionType: {
                type: Sequelize.ENUM('BUY_COURSE', 'PAYOUT'),
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'Orders', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            totalAmount: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            platformFee: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            instructorEarnings: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'),
                defaultValue: 'PENDING',
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
            },
        });

        await queryInterface.addIndex('Transactions', ['userId']);
        await queryInterface.addIndex('Transactions', ['orderId']);
        await queryInterface.addIndex('Transactions', ['transactionType']);
        await queryInterface.addIndex('Transactions', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Transactions');
    }
};
