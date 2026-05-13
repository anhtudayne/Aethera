'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Courses', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: Sequelize.TEXT,
            thumbnail: Sequelize.STRING,
            price: { type: Sequelize.DECIMAL(12, 0), allowNull: false },
            salePrice: Sequelize.DECIMAL(12, 0),
            instructor: { type: Sequelize.STRING, allowNull: false },
            duration: Sequelize.STRING,
            level: { type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
            language: { type: Sequelize.STRING, defaultValue: 'Tiếng Việt' },
            totalLessons: { type: Sequelize.INTEGER, defaultValue: 0 },
            totalStudents: { type: Sequelize.INTEGER, defaultValue: 0 },
            rating: { type: Sequelize.DECIMAL(2, 1), defaultValue: 0 },
            isFeatured: { type: Sequelize.BOOLEAN, defaultValue: false },
            isNewArrival: { type: Sequelize.BOOLEAN, defaultValue: false },
            isBestSeller: { type: Sequelize.BOOLEAN, defaultValue: false },
            categoryId: {
                type: Sequelize.INTEGER,
                references: { model: 'Categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Courses');
    },
};
