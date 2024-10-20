'use strict';

const status = {
  active: 'active',
  in_active: 'in_active',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('invoice_categories', [
        {
          name: 'Default Category',
          description: 'Default invoice category',
          is_auto_increment: true,
          next_number: 1,
          status: status.active,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error seeding invoice_categories table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete('invoice_categories', null, {});
    } catch (error) {
      console.error(
        'Error reverting invoice_categories seeder:',
        error.message,
      );
      throw error;
    }
  },
};
