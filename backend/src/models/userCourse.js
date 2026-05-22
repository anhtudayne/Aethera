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
                type: DataTypes.ENUM('active', 'suspended'),
                defaultValue: 'active', // Trạng thái để sau này bạn có thể khóa quyền truy cập nếu cần
            },
        },
        {
            sequelize,
            modelName: 'UserCourse',
        }
    );
    return UserCourse;
};