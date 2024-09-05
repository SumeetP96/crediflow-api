/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const bcrypt = require('bcrypt');

async function hash(plaintextPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plaintextPassword, salt);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Sumeet',
          username: 'sumeet',
          password: await hash('sumeet'),
          role: 'super_admin',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
