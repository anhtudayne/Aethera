'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Notification.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            type: {
                type: DataTypes.ENUM('order_created', 'order_paid', 'new_review', 'points_earned'),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSON,
                allowNull: true,
                // Extra metadata: { orderId, courseId, orderCode, points, etc. }
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isEmailSent: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'Notification',
        }
    );
    return Notification;
};
