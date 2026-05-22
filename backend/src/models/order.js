'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
        }
    }
    Order.init(
        {
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                // Mã này sẽ dùng làm nội dung chuyển khoản, VD: DH17163812
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
            status: {
                type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.STRING,
                defaultValue: 'bank_transfer', // Hoặc 'sepay', 'cod'
            },
        },
        {
            sequelize,
            modelName: 'Order',
        }
    );
    return Order;
};