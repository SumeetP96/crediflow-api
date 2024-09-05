'use strict';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const isDevEnv = process.env.NODE_ENV !== 'production';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (!isDevEnv) {
      return;
    }

    await queryInterface.bulkInsert(
      'customers',
      [
        {
          name: 'Customer One',
          contact_numbers: ['9898989898', '8787878787'],
          addresses: ['Ahmedabad, Gujarat', 'Mumbai, Maharashtra'],
          is_reseller: false,
          balance: 10000,
          status: 'active',
        },
        {
          parent_id: 1,
          name: 'Customer Sub (One)',
          contact_numbers: ['7676767676'],
          addresses: ['Ahmedabad, Gujarat'],
          is_reseller: false,
          balance: 5000,
          status: 'active',
        },
        {
          name: 'Customer Two (Reseller)',
          contact_numbers: ['6565656565', '5454545454'],
          addresses: ['Jodhpur, Rajasthan', 'Chennai, Tamil Nadu'],
          is_reseller: true,
          balance: 20000,
          status: 'active',
        },
        {
          parent_id: 3,
          name: 'Customer Sub (Two) (Reseller)',
          contact_numbers: ['4343434343'],
          addresses: ['Jodhpur, Rajasthan', 'Chennai, Tamil Nadu'],
          is_reseller: true,
          balance: 15000,
          status: 'active',
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    if (!isDevEnv) {
      return;
    }

    await queryInterface.bulkDelete('customers', null, {});
  },
};
