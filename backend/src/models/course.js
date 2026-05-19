'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            Course.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
            Course.hasMany(models.CourseImage, { foreignKey: 'courseId', as: 'images' });
        }
    }
    Course.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            slug: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: DataTypes.TEXT,
            thumbnail: DataTypes.STRING,
            price: { type: DataTypes.DECIMAL(12, 0), allowNull: false },
            salePrice: DataTypes.DECIMAL(12, 0),
            instructor: { type: DataTypes.STRING, allowNull: false },
            duration: DataTypes.STRING,
            level: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
            language: { type: DataTypes.STRING, defaultValue: 'Tiếng Việt' },
            totalLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
            totalStudents: { type: DataTypes.INTEGER, defaultValue: 0 },
            rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
            isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
            isNewArrival: { type: DataTypes.BOOLEAN, defaultValue: false },
            isBestSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
            categoryId: {
                type: DataTypes.INTEGER,
                references: { model: 'Categories', key: 'id' },
            },
            viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        },
        { sequelize, modelName: 'Course' }
    );
    return Course;
};
