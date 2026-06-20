'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        email: 'elena.r@example.com',
        firstName: 'Elena',
        lastName: 'Rostova',
        roleId: 'instructor',
        isActive: false,
        image: 'https://i.pravatar.cc/150?img=5',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'local'
      },
      {
        email: 'mj.dev@example.com',
        firstName: 'Marcus',
        lastName: 'Johnson',
        roleId: 'user',
        isActive: false,
        image: null,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'local'
      },
      {
        email: 'd.chen@enterprise.co',
        firstName: 'David',
        lastName: 'Chen',
        roleId: 'instructor',
        isActive: true,
        image: 'https://i.pravatar.cc/150?img=11',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'local'
      },
      {
        email: 'student.test@example.com',
        firstName: 'Anna',
        lastName: 'Smith',
        roleId: 'user',
        isActive: true,
        image: null,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'local'
      }
    ];

    // Check if users already exist before inserting to avoid duplicate errors during repeated seeding
    for (const user of users) {
      const exists = await queryInterface.rawSelect('Users', {
        where: { email: user.email },
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('Users', [user], {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: [
          'elena.r@example.com',
          'mj.dev@example.com',
          'd.chen@enterprise.co',
          'student.test@example.com'
        ]
      }
    }, {});
  }
};
