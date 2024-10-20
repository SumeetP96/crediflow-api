'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_transaction_type_status CASCADE;
            CREATE TYPE enum_transaction_type_status AS ENUM ('active', 'in_active');
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS transaction_types (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              description TEXT,
              is_deduction BOOLEAN NOT NULL,
              status enum_transaction_type_status NOT NULL DEFAULT 'active',
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating transaction_types table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TABLE IF EXISTS transaction_types;
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_transaction_type_status CASCADE;
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping transaction_types table:', error.message);
      throw error;
    }
  },
};
