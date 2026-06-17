'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Review.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    Review.init(
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
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1, max: 5 },
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Review',
            indexes: [
                { unique: true, fields: ['userId', 'courseId'], name: 'reviews_user_course_unique' },
            ],
        }
    );
    return Review;
};
