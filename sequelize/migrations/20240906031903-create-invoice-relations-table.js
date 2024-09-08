'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS invoice_relations (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        customer_id INTEGER,
        agent_id INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE invoice_relations
      ADD CONSTRAINT idx_invoice_customer_agent
      UNIQUE NULLS NOT DISTINCT (invoice_id, customer_id, agent_id);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE invoice_relations
      ADD CONSTRAINT fk_invoice_id
      FOREIGN KEY (invoice_id) 
      REFERENCES invoices (id) 
      ON DELETE CASCADE
      ON UPDATE CASCADE;

      ALTER TABLE invoice_relations
      ADD CONSTRAINT fk_customer_id
      FOREIGN KEY (customer_id) 
      REFERENCES customers (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;

      ALTER TABLE invoice_relations
      ADD CONSTRAINT fk_agent_id
      FOREIGN KEY (agent_id) 
      REFERENCES agents (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS invoice_relations;
    `);
  },
};
