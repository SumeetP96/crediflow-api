'use strict';

const status = {
  active: 'active',
  in_active: 'in_active',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'invoice_categories',
      [
        {
          name: 'Default Category',
          description: 'Default invoice category',
          is_auto_increment: true,
          next_number: 1,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('invoice_categories', null, {});
  },
};
