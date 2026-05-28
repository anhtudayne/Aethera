'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewedCourse extends Model {
        static associate(models) {
            ViewedCourse.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            ViewedCourse.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    ViewedCourse.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' }
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' }
            }
        },
        {
            sequelize,
            modelName: 'ViewedCourse',
            tableName: 'ViewedCourses',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'courseId'],
                    name: 'unique_user_course_viewed'
                }
            ]
        }
    );
    return ViewedCourse;
};
