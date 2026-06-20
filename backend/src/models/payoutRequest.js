'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PayoutRequest extends Model {
        static associate(models) {
            PayoutRequest.belongsTo(models.User, { foreignKey: 'instructorId', as: 'instructor' });
            PayoutRequest.belongsTo(models.User, { foreignKey: 'adminId', as: 'admin' });
        }
    }
    PayoutRequest.init({
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        amount: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'COMPLETED', 'REJECTED'),
            defaultValue: 'PENDING'
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Users', key: 'id' }
        },
        adminNote: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        receiptUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'PayoutRequest',
        tableName: 'PayoutRequests'
    });
    return PayoutRequest;
};
