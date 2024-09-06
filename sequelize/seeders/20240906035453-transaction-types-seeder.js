'use strict';

const status = {
  active: 'active',
  in_active: 'in_active',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'transaction_types',
      [
        {
          name: 'Deposit',
          description: 'Money received',
          is_deduction: false,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Discount',
          description: 'Discount given',
          is_deduction: true,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transaction_types', null, {});
  },
};
