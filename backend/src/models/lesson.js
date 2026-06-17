'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {
        static associate(models) {
            Lesson.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
            Lesson.hasMany(models.LessonProgress, { foreignKey: 'lessonId', as: 'progresses' });
        }
    }
    Lesson.init(
        {
            sectionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Sections', key: 'id' },
            },
            title: { type: DataTypes.STRING, allowNull: false },
            type: { type: DataTypes.ENUM('video', 'text'), defaultValue: 'video' },
            content: DataTypes.TEXT,
            videoUrl: DataTypes.STRING,
            duration: DataTypes.STRING,
            order: { type: DataTypes.INTEGER, defaultValue: 0 },
            isFreePreview: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        { sequelize, modelName: 'Lesson' }
    );
    return Lesson;
};