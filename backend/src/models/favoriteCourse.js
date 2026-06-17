'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FavoriteCourse extends Model {
        static associate(models) {
            FavoriteCourse.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            FavoriteCourse.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    FavoriteCourse.init(
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
            modelName: 'FavoriteCourse',
            indexes: [
                { unique: true, fields: ['userId', 'courseId'], name: 'favoritecourses_user_course_unique' },
            ],
        }
    );
    return FavoriteCourse;
};
