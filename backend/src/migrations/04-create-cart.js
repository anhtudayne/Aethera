'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            courseId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });

        // Mỗi user chỉ thêm 1 khóa học 1 lần vào giỏ
        await queryInterface.addConstraint('Carts', {
            fields: ['userId', 'courseId'],
            type: 'unique',
            name: 'unique_user_course_cart',
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Carts');
    },
};
