'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserCourse extends Model {
        static associate(models) {
            UserCourse.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            UserCourse.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    UserCourse.init(
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
            status: {
                type: DataTypes.ENUM('active', 'suspended', 'completed'),
                defaultValue: 'active',
            },
            progressPercent: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            enrolledAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            lastAccessedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'UserCourse',
            indexes: [
                { unique: true, fields: ['userId', 'courseId'], name: 'usercourses_user_course_unique' },
            ],
        }
    );
    return UserCourse;
};