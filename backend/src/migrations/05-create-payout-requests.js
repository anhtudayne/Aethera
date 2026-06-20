'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('PayoutRequests', {
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
            amount: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false
            },
            bankName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            accountNumber: {
                type: Sequelize.STRING,
                allowNull: false
            },
            accountName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'REJECTED'),
                defaultValue: 'PENDING'
            },
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            adminNote: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            receiptUrl: {
                type: Sequelize.STRING,
                allowNull: true
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
        
        await queryInterface.addIndex('PayoutRequests', ['instructorId']);
        await queryInterface.addIndex('PayoutRequests', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('PayoutRequests');
    }
};
