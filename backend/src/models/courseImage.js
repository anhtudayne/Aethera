'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseImage extends Model {
        static associate(models) {
            CourseImage.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    CourseImage.init(
        {
            imageUrl: { type: DataTypes.STRING, allowNull: false },
            isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
            sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
            courseId: {
                type: DataTypes.INTEGER,
                references: { model: 'Courses', key: 'id' },
            },
        },
        { sequelize, modelName: 'CourseImage' }
    );
    return CourseImage;
};
