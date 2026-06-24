'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SupportTicket extends Model {
        static associate(models) {
            SupportTicket.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            // Optionally link to course or transaction depending on targetId, 
            // but for simplicity we will just store targetId and targetType if needed.
            // Here targetId is generic (e.g., Course ID for reports, Transaction/Order ID for refunds)
        }
    }
    SupportTicket.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            ticketType: {
                type: DataTypes.ENUM('REFUND', 'REPORT', 'OTHER'),
                allowNull: false,
                defaultValue: 'OTHER',
            },
            status: {
                type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'),
                allowNull: false,
                defaultValue: 'OPEN',
            },
            priority: {
                type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
                allowNull: false,
                defaultValue: 'MEDIUM',
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            internalNotes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            adminResponse: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            requestedAmount: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: true,
            },
            targetId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            attachments: {
                type: DataTypes.JSON, // Array of image URLs
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'SupportTicket',
        }
    );
    return SupportTicket;
};
