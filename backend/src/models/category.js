'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Course, { foreignKey: 'categoryId', as: 'courses' });
        }
    }
    Category.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            slug: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: DataTypes.STRING,
            image: DataTypes.STRING,
            isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
            icon: { type: DataTypes.STRING, defaultValue: 'category' },
            themeColor: { type: DataTypes.STRING, defaultValue: 'primary' },
        },
        { sequelize, modelName: 'Category' }
    );
    return Category;
};
