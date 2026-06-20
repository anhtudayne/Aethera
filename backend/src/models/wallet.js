'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wallet extends Model {
        static associate(models) {
            Wallet.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Wallet.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'Users', key: 'id' }
        },
        availableBalance: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        pendingBalance: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Wallet',
        tableName: 'Wallets'
    });
    return Wallet;
};
