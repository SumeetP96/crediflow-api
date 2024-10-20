'use strict';

const status = {
  active: 'active',
  in_active: 'in_active',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('transaction_types', [
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
      ]);
    } catch (error) {
      console.error('Error seeding transaction_types table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete('transaction_types', null);
    } catch (error) {
      console.error('Error reverting transaction_types seeder:', error.message);
      throw error;
    }
  },
};
