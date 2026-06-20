'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseStatusHistory extends Model {
        static associate(models) {
            CourseStatusHistory.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            // Admin could be tied to User table
            CourseStatusHistory.belongsTo(models.User, { foreignKey: 'adminId', as: 'admin' });
        }
    }
    CourseStatusHistory.init(
        {
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            adminId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Users', key: 'id' },
            },
            oldStatus: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            newStatus: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'CourseStatusHistory',
        }
    );
    return CourseStatusHistory;
};
