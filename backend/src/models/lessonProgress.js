'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LessonProgress extends Model {
        static associate(models) {
            LessonProgress.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            LessonProgress.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
            LessonProgress.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    LessonProgress.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            lessonId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Lessons', key: 'id' },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            isCompleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            lastWatchedPosition: {
                type: DataTypes.INTEGER,
                defaultValue: 0, // Giây
            },
        },
        {
            sequelize,
            modelName: 'LessonProgress',
            indexes: [
                { unique: true, fields: ['userId', 'lessonId'], name: 'lessonprogresses_user_lesson_unique' },
                { fields: ['userId', 'courseId'], name: 'lessonprogresses_user_course_idx' },
            ],
        }
    );
    return LessonProgress;
};
