'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_agent_status CASCADE;
            CREATE TYPE enum_agent_status AS ENUM ('active', 'in_active');
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS agents (
              id SERIAL PRIMARY KEY,
              parent_id INTEGER,
              name VARCHAR(255) NOT NULL,
              contact_numbers VARCHAR[],
              addresses TEXT[],
              status enum_agent_status NOT NULL DEFAULT 'active',
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            ALTER TABLE agents
            ADD CONSTRAINT fk_parent_id
            FOREIGN KEY (parent_id) 
            REFERENCES agents (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating agents table:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            DROP TABLE IF EXISTS agents;
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            DROP TYPE IF EXISTS enum_agent_status CASCADE
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping agents table:', error.message);
      throw error;
    }
  },
};
