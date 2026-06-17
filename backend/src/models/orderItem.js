'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
            OrderItem.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    OrderItem.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Orders', key: 'id' },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            price: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
            },
        },
        { sequelize, modelName: 'OrderItem' }
    );
    return OrderItem;
};