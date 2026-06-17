'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            Course.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
            Course.hasMany(models.CourseImage, { foreignKey: 'courseId', as: 'images' });
            Course.hasMany(models.Section, { foreignKey: 'courseId', as: 'sections' });
            Course.hasMany(models.Cart, { foreignKey: 'courseId', as: 'cartItems' });
            Course.hasMany(models.OrderItem, { foreignKey: 'courseId', as: 'orderItems' });
            Course.hasMany(models.UserCourse, { foreignKey: 'courseId', as: 'userCourses' });
            Course.hasMany(models.LessonProgress, { foreignKey: 'courseId', as: 'lessonProgresses' });
            Course.hasMany(models.Certificate, { foreignKey: 'courseId', as: 'certificates' });
            Course.hasMany(models.Review, { foreignKey: 'courseId', as: 'reviews' });
            Course.hasMany(models.FavoriteCourse, { foreignKey: 'courseId', as: 'favoriteCourses' });
        }
    }
    Course.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            slug: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: DataTypes.TEXT,
            shortDescription: DataTypes.STRING,
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
            ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
            isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
            isNewArrival: { type: DataTypes.BOOLEAN, defaultValue: false },
            isBestSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
            status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
            categoryId: {
                type: DataTypes.INTEGER,
                references: { model: 'Categories', key: 'id' },
            },
            viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
            requirements: DataTypes.TEXT,           // JSON array string
            whatYouWillLearn: DataTypes.TEXT,        // JSON array string
            targetAudience: DataTypes.TEXT,          // JSON array string
        },
        { sequelize, modelName: 'Course' }
    );
    return Course;
};
