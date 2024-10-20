'use strict';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const isDevEnv = process.env.NODE_ENV !== 'production';

const status = {
  active: 'active',
  in_active: 'in_active',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      if (!isDevEnv) {
        return;
      }

      await queryInterface.bulkInsert('agents', [
        {
          name: 'Agent One',
          contact_numbers: ['9898989898', '8787878787'],
          addresses: ['Ahmedabad, Gujarat', 'Mumbai, Maharashtra'],
          status: status.active,
        },
        {
          parent_id: 1,
          name: 'Agent Sub One',
          contact_numbers: ['7676767676'],
          addresses: ['Ahmedabad, Gujarat'],
          status: status.active,
        },
        {
          name: 'Agent Two',
          contact_numbers: ['6565656565', '5454545454'],
          addresses: ['Jodhpur, Rajasthan', 'Chennai, Tamil Nadu'],
          status: status.active,
        },
        {
          parent_id: 3,
          name: 'Agent Sub Two',
          contact_numbers: ['4343434343'],
          addresses: ['Jodhpur, Rajasthan'],
          status: status.active,
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
