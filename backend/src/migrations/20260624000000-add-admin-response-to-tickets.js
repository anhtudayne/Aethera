'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('SupportTickets', 'adminResponse', {
            type: Sequelize.TEXT,
            allowNull: true,
            after: 'internalNotes'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('SupportTickets', 'adminResponse');
    }
};
