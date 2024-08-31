/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const bcrypt = require('bcrypt');

async function hash(plaintextPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plaintextPassword, salt);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Sumeet',
          username: 'sumeet',
          password: await hash('sumeet'),
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
