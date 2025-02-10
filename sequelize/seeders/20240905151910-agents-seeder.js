/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

require('dotenv').config();
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const isDevEnv = process.env.NODE_ENV !== 'production';

      if (!isDevEnv) {
        return;
      }

      const status = {
        active: 'active',
        in_active: 'in_active',
      };

      const contact = (primary = false) => {
        return JSON.stringify({
          number: faker.string.numeric({
            length: 10,
            min: 7111111111,
            max: 9999999999,
          }),
          status: 'active',
          isPrimary: primary,
        });
      };

      const address = (primary = false) => {
        return JSON.stringify({
          address: `${faker.location.streetAddress()}, ${faker.location.country()}`,
          isPrimary: primary,
          status: 'active',
        })
          .replaceAll('`', '')
          .replaceAll("'", '');
      };

      await queryInterface.bulkInsert('agents', [
        {
          name: 'Agent One',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          status: status.active,
          remarks: 'Agent One',
        },
        {
          parent_id: 1,
          name: 'Agent Sub One',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          status: status.active,
          remarks: 'Agent Sub One',
        },
        {
          name: 'Agent Two',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          status: status.active,
          remarks: 'Agent Two',
        },
        {
          parent_id: 3,
          name: 'Agent Sub Two',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          status: status.active,
          remarks: 'Agent Sub Two',
        },
      ]);
    } catch (error) {
      console.error('Error seeding agents table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      if (!isDevEnv) {
        return;
      }

      await queryInterface.bulkDelete('agents', null);
    } catch (error) {
      console.error('Error reverting users seeder:', error.message);
      throw error;
    }
  },
};
