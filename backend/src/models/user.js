'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Cart, { foreignKey: 'userId', as: 'cartItems' });
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: DataTypes.STRING(10),
            address: DataTypes.STRING,
            gender: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            image: DataTypes.STRING,
            roleId: {
                type: DataTypes.STRING,
                defaultValue: 'user',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            otpExpires: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
