'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            image: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.STRING,
                defaultValue: 'user',
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            otp: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            otpExpires: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
