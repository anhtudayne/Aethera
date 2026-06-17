'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Section extends Model {
        static associate(models) {
            Section.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            Section.hasMany(models.Lesson, { foreignKey: 'sectionId', as: 'lessons' });
        }
    }
    Section.init(
        {
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            title: { type: DataTypes.STRING, allowNull: false },
            order: { type: DataTypes.INTEGER, defaultValue: 0 },
        },
        { sequelize, modelName: 'Section' }
    );
    return Section;
};