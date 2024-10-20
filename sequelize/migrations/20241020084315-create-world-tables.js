'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS countries (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              iso3 CHAR(10) NOT NULL,
              iso2 CHAR(10) NOT NULL,
              numeric_code CHAR(10) NOT NULL,
              phone_code CHAR(10) NOT NULL,
              currency CHAR(10) NOT NULL,
              currency_name VARCHAR(255) NOT NULL,
              emoji CHAR(10) NOT NULL,
              emoji_unicode VARCHAR(255) NOT NULL
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS states (
              id SERIAL PRIMARY KEY,
              country_id INTEGER NOT NULL,
              name VARCHAR(255) NOT NULL,
              state_code CHAR(10)
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            CREATE TABLE IF NOT EXISTS cities (
              id SERIAL PRIMARY KEY,
              country_id INTEGER NOT NULL,
              state_id INTEGER NOT NULL,
              name VARCHAR(255) NOT NULL
            );
          `,
          { transaction },
        );

        await queryInterface.sequelize.query(
          `
            ALTER TABLE states
            ADD CONSTRAINT fk_country_id
            FOREIGN KEY (country_id) 
            REFERENCES countries (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

            ALTER TABLE cities
            ADD CONSTRAINT fk_country_id
            FOREIGN KEY (country_id) 
            REFERENCES countries (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

            ALTER TABLE cities
            ADD CONSTRAINT fk_state_id
            FOREIGN KEY (state_id) 
            REFERENCES states (id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
          `,
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error creating world tables:', error.message);
      throw error;
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          'DROP TABLE IF EXISTS cities CASCADE;',
          { transaction },
        );

        await queryInterface.sequelize.query(
          'DROP TABLE IF EXISTS states CASCADE;',
          { transaction },
        );

        await queryInterface.sequelize.query(
          'DROP TABLE IF EXISTS countries CASCADE;',
          { transaction },
        );

        await queryInterface.sequelize.query(
          'DROP TABLE IF EXISTS subregions CASCADE;',
          { transaction },
        );

        await queryInterface.sequelize.query(
          'DROP TABLE IF EXISTS regions CASCADE;',
          { transaction },
        );
      });
    } catch (error) {
      console.error('Error dropping world tables:', error.message);
      throw error;
    }
  },
};
