'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        static associate(models) {
            Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Transaction.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
        }
    }
    Transaction.init(
        {
            transactionId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            transactionType: {
                type: DataTypes.ENUM('BUY_COURSE', 'PAYOUT'),
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Orders', key: 'id' },
            },
            totalAmount: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            platformFee: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            instructorEarnings: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
                defaultValue: 'PENDING',
            },
        },
        {
            sequelize,
            modelName: 'Transaction',
        }
    );
    return Transaction;
};
