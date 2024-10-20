'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_invoice_status CASCADE;
            CREATE TYPE enum_invoice_status AS ENUM ('paid', 'unpaid', 'on_hold', 'cancelled');
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS invoices (
              id SERIAL PRIMARY KEY,
              invoice_category_id INTEGER NOT NULL,
              customer_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              date TIMESTAMP NOT NULL,
              invoice_number VARCHAR(50) NOT NULL,
              amount DOUBLE PRECISION NOT NULL DEFAULT 0,
              balance DOUBLE PRECISION NOT NULL DEFAULT 0,
              due_date TIMESTAMP,
              status enum_invoice_status NOT NULL DEFAULT 'unpaid',
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            ALTER TABLE invoices
            ADD CONSTRAINT fk_invoice_category_id
            FOREIGN KEY (invoice_category_id) 
            REFERENCES invoice_categories (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

            ALTER TABLE invoices
            ADD CONSTRAINT fk_customer_id
            FOREIGN KEY (customer_id) 
            REFERENCES customers (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

            ALTER TABLE invoices
            ADD CONSTRAINT fk_user_id
            FOREIGN KEY (user_id) 
            REFERENCES users (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating invoices table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TABLE IF EXISTS invoices;
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_invoice_status CASCADE
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping invoices table:', error.message);
      throw error;
    }
  },
};
