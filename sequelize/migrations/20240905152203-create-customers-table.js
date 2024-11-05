'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_customer_status CASCADE;
            CREATE TYPE enum_customer_status AS ENUM ('active', 'in_active');
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS customers (
              id SERIAL PRIMARY KEY,
              parent_id INTEGER,
              name VARCHAR(255) NOT NULL,
              contact_numbers JSONB[],
              addresses JSONB[],
              is_reseller BOOLEAN NOT NULL DEFAULT FALSE,
              status enum_customer_status NOT NULL DEFAULT 'active',
              remarks TEXT,
              balance DOUBLE PRECISION NOT NULL DEFAULT 0,
              opening_balance DOUBLE PRECISION NOT NULL DEFAULT 0,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            ALTER TABLE customers
            ADD CONSTRAINT fk_parent_id
            FOREIGN KEY (parent_id) 
            REFERENCES customers (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating customers table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TABLE IF EXISTS customers;
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_customers_status CASCADE
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping customers table:', error.message);
      throw error;
    }
  },
};
