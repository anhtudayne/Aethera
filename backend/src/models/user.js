'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Cart, { foreignKey: 'userId', as: 'cartItems' });
            User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
            User.hasMany(models.UserCourse, { foreignKey: 'userId', as: 'userCourses' });
            User.hasMany(models.LessonProgress, { foreignKey: 'userId', as: 'lessonProgresses' });
            User.hasMany(models.Certificate, { foreignKey: 'userId', as: 'certificates' });
            User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
            User.hasMany(models.FavoriteCourse, { foreignKey: 'userId', as: 'favoriteCourses' });
            User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
            User.hasMany(models.Transaction, { foreignKey: 'userId', as: 'transactions' });
            User.hasMany(models.RefundRequest, { foreignKey: 'userId', as: 'refundRequests' });
            User.hasOne(models.InstructorApplication, { foreignKey: 'userId', as: 'instructorApplication' });
            User.hasMany(models.Course, { foreignKey: 'instructorId', as: 'courses' });
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
                allowNull: true, // null cho Google OAuth users
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
            bio: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
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
            googleId: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            provider: {
                type: DataTypes.ENUM('local', 'google'),
                defaultValue: 'local',
            },
            streakWeeks: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            weeklyVisits: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            weeklyMinutes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            lastActivityDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            weekStartDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            aiCredits: {
                type: DataTypes.INTEGER,
                defaultValue: 25,
            },
            lastCreditReset: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            creditBalance: {
                type: DataTypes.DECIMAL(12, 0),
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
