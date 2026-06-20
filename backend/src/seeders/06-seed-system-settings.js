'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const settings = [
      {
        key: 'default_commission_rate',
        value: '15.00',
        description: 'Default platform commission rate (%) applied to course sales',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const setting of settings) {
      const exists = await queryInterface.rawSelect('SystemSettings', {
        where: { key: setting.key },
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('SystemSettings', [setting], {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SystemSettings', {
      key: 'default_commission_rate'
    }, {});
  }
};
