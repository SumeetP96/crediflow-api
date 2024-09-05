'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_user_status CASCADE;
      CREATE TYPE enum_user_status AS ENUM('active', 'in_active');
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_user_role CASCADE;
      CREATE TYPE enum_user_role AS ENUM('super_admin', 'admin', 'employee');
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role enum_user_role NOT NULL,
        status enum_user_status NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS users;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_user_role CASCADE;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_user_status CASCADE;
    `);
  },
};
