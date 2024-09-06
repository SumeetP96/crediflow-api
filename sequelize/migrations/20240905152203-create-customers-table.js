'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_customer_status CASCADE;
      CREATE TYPE enum_customer_status AS ENUM ('active', 'in_active');
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER,
        name VARCHAR(255) NOT NULL,
        contact_numbers VARCHAR[],
        addresses TEXT[],
        is_reseller BOOLEAN NOT NULL DEFAULT FALSE,
        status enum_customer_status NOT NULL DEFAULT 'active',
        balance DOUBLE PRECISION NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE customers
      ADD CONSTRAINT fk_parent_id
      FOREIGN KEY (parent_id) 
      REFERENCES customers (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS customers;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_customers_status CASCADE
    `);
  },
};
