'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InstructorEarning extends Model {
        static associate(models) {
            InstructorEarning.belongsTo(models.User, { foreignKey: 'instructorId', as: 'instructor' });
            InstructorEarning.belongsTo(models.OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });
        }
    }
    InstructorEarning.init({
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        orderItemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'OrderItems', key: 'id' }
        },
        coursePrice: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        platformFee: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        netEarnings: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'AVAILABLE', 'REFUNDED'),
            defaultValue: 'PENDING'
        },
        availableAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'InstructorEarning',
        tableName: 'InstructorEarnings'
    });
    return InstructorEarning;
};
