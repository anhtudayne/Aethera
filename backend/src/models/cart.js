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
                references: { model: 'Users', key: 'id' },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            indexes: [
                { unique: true, fields: ['userId', 'courseId'], name: 'carts_user_course_unique' },
            ],
        }
    );
    return Cart;
};
