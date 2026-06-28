'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PayoutBatch extends Model {
        static associate(models) {
            PayoutBatch.hasMany(models.PayoutRequest, { foreignKey: 'batchId', as: 'payoutRequests' });
            PayoutBatch.belongsTo(models.User, { foreignKey: 'adminId', as: 'admin' });
        }
    }
    PayoutBatch.init({
        batchId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
            defaultValue: 'PENDING'
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'PayoutBatch',
        tableName: 'PayoutBatches'
    });
    return PayoutBatch;
};
