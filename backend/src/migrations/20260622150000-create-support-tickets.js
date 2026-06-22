'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SupportTickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            ticketType: {
                type: Sequelize.ENUM('REFUND', 'REPORT', 'OTHER'),
                allowNull: false,
                defaultValue: 'OTHER'
            },
            status: {
                type: Sequelize.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'),
                allowNull: false,
                defaultValue: 'OPEN'
            },
            priority: {
                type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
                allowNull: false,
                defaultValue: 'MEDIUM'
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            internalNotes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            requestedAmount: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: true
            },
            targetId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            attachments: {
                type: Sequelize.JSON,
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('SupportTickets');
    }
};
