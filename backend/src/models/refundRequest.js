'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RefundRequest extends Model {
        static associate(models) {
            RefundRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            RefundRequest.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            RefundRequest.belongsTo(models.OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });
        }
    }
    RefundRequest.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            orderItemId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'OrderItems', key: 'id' },
            },
            refundAmount: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
            },
            method: {
                type: DataTypes.ENUM('credit', 'momo', 'bank_transfer'),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PROCESSING', 'COMPLETED'),
                allowNull: false,
                defaultValue: 'PROCESSING',
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            adminNote: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'RefundRequest',
        }
    );
    return RefundRequest;
};
