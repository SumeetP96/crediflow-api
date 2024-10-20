/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

require('dotenv').config();
const { faker } = require('@faker-js/faker');
const worldData = require('../data/world.json');

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
        const India = worldData.find((country) => Number(country.id) === 101);
        const state =
          India.states[
            faker.number.int({ min: 0, max: India.states.length - 1 })
          ];
        const city =
          state.cities[
            faker.number.int({ min: 0, max: state.cities.length - 1 })
          ];

        return JSON.stringify({
          isPrimary: primary,
          status: 'active',
          addressType: 'home',
          street1: faker.location.buildingNumber(),
          street2: faker.location.street(),
          area: faker.location.county(),
          city: city.id,
          state: state.id,
          country: India.id,
          pinCode: faker.string.numeric({
            length: 6,
            min: 100000,
            max: 999999,
          }),
        }).replaceAll('`', '');
      };

      await queryInterface.bulkInsert('customers', [
        {
          name: faker.person.fullName(),
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          is_reseller: false,
          balance: 10000,
          opening_balance: 2000,
          status: status.active,
        },
        {
          parent_id: 1,
          name: 'Customer Sub (One)',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          is_reseller: false,
          balance: 5000,
          opening_balance: 5000,
          status: status.active,
        },
        {
          name: 'Customer Two (Reseller)',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb]::jsonb[]`,
          ),
          is_reseller: true,
          balance: 20000,
          opening_balance: 4000,
          status: status.active,
        },
        {
          parent_id: 3,
          name: 'Customer Sub (Two)',
          contact_numbers: Sequelize.literal(
            `ARRAY['${contact(true)}'::jsonb, '${contact()}'::jsonb]::jsonb[]`,
          ),
          addresses: Sequelize.literal(
            `ARRAY['${address(true)}'::jsonb, '${address()}'::jsonb]::jsonb[]`,
          ),
          is_reseller: true,
          balance: 15000,
          opening_balance: 10000,
          status: status.active,
        },
      ]);
    } catch (error) {
      console.error('Error seeding customers table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      if (!isDevEnv) {
        return;
      }

      await queryInterface.bulkDelete('customers', null, { transaction });
    } catch (error) {
      console.error('Error reverting customers seeder:', error.message);
      throw error;
    }
  },
};
