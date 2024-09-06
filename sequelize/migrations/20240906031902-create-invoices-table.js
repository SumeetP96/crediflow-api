'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_invoice_status CASCADE;
      CREATE TYPE enum_invoice_status AS ENUM ('paid', 'unpaid', 'on_hold', 'cancelled');
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_category_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        balance DOUBLE PRECISION NOT NULL DEFAULT 0,
        due_date TIMESTAMP NOT NULL,
        status enum_invoice_status NOT NULL DEFAULT 'unpaid',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryInterface.sequelize.query(`
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
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS invoices;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_invoice_status CASCADE
    `);
  },
};
