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
            transcript: DataTypes.JSON, // Lưu trữ mảng JSON transcript
            transcriptStatus: { type: DataTypes.ENUM('pending', 'processing', 'ready', 'failed'), defaultValue: 'pending' },
            transcriptJobId: DataTypes.STRING, // Lưu ID trả về từ AssemblyAI để webhook map lại
        },
        { sequelize, modelName: 'Lesson' }
    );
    return Lesson;
};