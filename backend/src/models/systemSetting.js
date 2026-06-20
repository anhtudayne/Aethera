'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SystemSetting extends Model {
        static associate(models) {
            // No direct association needed right now
        }
    }
    SystemSetting.init({
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'SystemSetting',
        tableName: 'SystemSettings'
    });
    return SystemSetting;
};
