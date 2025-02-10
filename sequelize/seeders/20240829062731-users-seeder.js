/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function hash(plaintextPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plaintextPassword, salt);
}

const status = {
  active: 'active',
  in_active: 'in_active',
};

const roles = {
  super_admin: 'super_admin',
  admin: 'admin',
  employee: 'employee',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const users = [];
      for (let i = 0; i < 50; i++) {
        users.push({
          name: faker.person.fullName().replaceAll("'", ''),
          username: faker.internet.username().replaceAll("'", ''),
          password: await hash('password'),
          role: roles.admin,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      await queryInterface.bulkInsert('users', [
        {
          name: 'Super Admin',
          username: 'superadmin',
          password: await hash('password'),
          role: roles.super_admin,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Admin',
          username: 'admin',
          password: await hash('password'),
          role: roles.admin,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Employee',
          username: 'employee',
          password: await hash('password'),
          role: roles.employee,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...users,
      ]);
    } catch (error) {
      console.log('Error seeding users table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete('users', null);
    } catch (error) {
      console.log('Error reverting users seeder:', error.message);
      throw error;
    }
  },
};
