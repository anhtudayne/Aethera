'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'loyaltyPoints', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            after: 'otpExpires',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'loyaltyPoints');
    },
};
