'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
            Order.hasOne(models.Transaction, { foreignKey: 'orderId', as: 'transaction' });
            Order.belongsTo(models.Voucher, { foreignKey: 'voucherId', as: 'voucher' });
        }
    }
    Order.init(
        {
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            totalAmount: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
            },
            creditUsed: {
                type: DataTypes.DECIMAL(12, 0),
                defaultValue: 0,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            voucherId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: { model: 'Vouchers', key: 'id' },
            },
            voucherDiscount: {
                type: DataTypes.DECIMAL(12, 0),
                defaultValue: 0,
                allowNull: false,
            },
            momoTransId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Order',
        }
    );
    return Order;
};