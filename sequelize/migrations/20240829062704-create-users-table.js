'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: Sequelize.STRING,
      role: Sequelize.ENUM('super_admin', 'admin', 'employee'),
      status: Sequelize.ENUM('active', 'inactive', 'deleted'),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE enum_users_role');
    await queryInterface.sequelize.query('DROP TYPE enum_users_status');
  },
};
