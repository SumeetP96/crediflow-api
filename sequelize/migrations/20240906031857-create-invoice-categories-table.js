'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_invoice_category_status CASCADE;
            CREATE TYPE enum_invoice_category_status AS ENUM ('active', 'in_active');
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS invoice_categories (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              prefix VARCHAR(20),
              suffix VARCHAR(20),
              is_auto_increment BOOLEAN NOT NULL DEFAULT FALSE,
              next_number INTEGER,
              description TEXT,
              status enum_invoice_category_status NOT NULL DEFAULT 'active',
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating invoice_categories table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TABLE IF EXISTS invoice_categories;
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_invoice_category_status CASCADE
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping invoice_categories table:', error.message);
      throw error;
    }
  },
};
