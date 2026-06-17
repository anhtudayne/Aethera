'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseNote extends Model {
        static associate(models) {
            CourseNote.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            CourseNote.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            CourseNote.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
        }
    }
    CourseNote.init(
        {
            userId: { type: DataTypes.INTEGER, allowNull: false },
            courseId: { type: DataTypes.INTEGER, allowNull: false },
            lessonId: { type: DataTypes.INTEGER, allowNull: false },
            content: { type: DataTypes.TEXT, allowNull: false },
            timestamp: { type: DataTypes.INTEGER, allowNull: true },
        },
        { sequelize, modelName: 'CourseNote' }
    );
    return CourseNote;
};
