'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Courses', 'viewCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Courses', 'viewCount');
    }
};
