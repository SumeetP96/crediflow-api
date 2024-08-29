'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: Sequelize.INTEGER,
      name: Sequelize.STRING,
      username: Sequelize.STRING,
      role: Sequelize.ENUM('admin', 'user'),
      status: Sequelize.ENUM('active', 'inactive'),
      createdAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
