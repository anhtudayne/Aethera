'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Cart.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    Cart.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Cart',
        }
    );
    return Cart;
};
