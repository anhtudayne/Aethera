'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Coupon extends Model {
        static associate(models) {
            // define association here
        }
    }
    Coupon.init(
        {
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            discountType: {
                type: DataTypes.ENUM('percent', 'fixed'),
                allowNull: false,
            },
            discountValue: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: false,
            },
            minOrderValue: {
                type: DataTypes.DECIMAL(12, 0),
                defaultValue: 0,
            },
            maxDiscount: {
                type: DataTypes.DECIMAL(12, 0),
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            usageLimit: {
                type: DataTypes.INTEGER,
                allowNull: true, // null = unlimited
            },
            usedCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Coupon',
        }
    );
    return Coupon;
};
