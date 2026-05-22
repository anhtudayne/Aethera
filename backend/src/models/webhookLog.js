'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WebhookLog extends Model {
        static associate(models) {
            // Không nhất thiết phải liên kết, đây là bảng log
        }
    }
    WebhookLog.init(
        {
            referenceCode: {
                type: DataTypes.STRING,
            },
            gateway: {
                type: DataTypes.STRING,
            },
            transactionDate: {
                type: DataTypes.DATE,
            },
            accountNumber: {
                type: DataTypes.STRING,
            },
            subAccount: {
                type: DataTypes.STRING,
            },
            content: {
                type: DataTypes.TEXT,
            },
            transferType: {
                type: DataTypes.STRING,
            },
            transferAmount: {
                type: DataTypes.DECIMAL(12, 0),
            },
            accumulated: {
                type: DataTypes.DECIMAL(12, 0),
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'received', // processed, failed, duplicate
            },
            errorMessage: {
                type: DataTypes.TEXT,
            },
            payload: {
                type: DataTypes.JSON,
            }
        },
        {
            sequelize,
            modelName: 'WebhookLog',
        }
    );
    return WebhookLog;
};
