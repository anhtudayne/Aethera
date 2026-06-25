'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RefundRequests', {
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
            orderItemId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'OrderItems',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            refundAmount: {
                type: Sequelize.DECIMAL(12, 0),
                allowNull: false
            },
            method: {
                type: Sequelize.ENUM('credit', 'momo', 'bank_transfer'),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('PROCESSING', 'COMPLETED'),
                allowNull: false,
                defaultValue: 'PROCESSING'
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            adminNote: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            completedAt: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('RefundRequests');
    }
};
