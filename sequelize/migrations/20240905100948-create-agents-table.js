'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_agent_status CASCADE;
      CREATE TYPE enum_agent_status AS ENUM ('active', 'in_active');
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER,
        name VARCHAR(255),
        contact_numbers VARCHAR[],
        addresses TEXT[],
        status enum_agent_status,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE agents
      ADD CONSTRAINT fk_parent_id
      FOREIGN KEY (parent_id) 
      REFERENCES agents (id) 
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE agents;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_agent_status CASCADE
    `);
  },
};
