'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_transaction_status CASCADE;
      CREATE TYPE enum_transaction_status AS ENUM ('completed', 'processing', 'on_hold', 'failed', 'cancelled');
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        transaction_type_id INTEGER NOT NULL,
        invoice_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        date TIMESTAMP NOT NULL,
        amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        display_index INTEGER NOT NULL DEFAULT 0,
        is_part_of_invoice BOOLEAN NOT NULL,
        remarks TEXT,
        status enum_transaction_status NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE transactions
      ADD CONSTRAINT fk_transaction_type_id
      FOREIGN KEY (transaction_type_id) 
      REFERENCES transaction_types (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;

      ALTER TABLE transactions
      ADD CONSTRAINT fk_invoice_id
      FOREIGN KEY (invoice_id) 
      REFERENCES invoices (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;

      ALTER TABLE transactions
      ADD CONSTRAINT fk_user_id
      FOREIGN KEY (user_id) 
      REFERENCES users (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS transactions;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_transaction_status CASCADE;
    `);
  },
};
