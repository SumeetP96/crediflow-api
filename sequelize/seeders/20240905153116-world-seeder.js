/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const worldData = require('../data/world.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const data = {
        countries: [],
        states: [],
        cities: [],
      };

      worldData.forEach((country) => {
        data.countries.push({
          id: country.id,
          name: country.name,
          iso3: country.iso3,
          iso2: country.iso2,
          numeric_code: country.numeric_code,
          phone_code: country.phone_code,
          currency: country.currency,
          currency_name: country.currency_name,
          emoji: country.emoji,
          emoji_unicode: country.emojiU,
        });

        country.states.forEach((state) => {
          data.states.push({
            id: state.id,
            country_id: country.id,
            name: state.name,
            state_code: state.state_code,
          });

          state.cities.forEach((city) => {
            data.cities.push({
              country_id: country.id,
              state_id: state.id,
              name: city.name,
            });
          });
        });
      });

      const countries = data.countries.sort((a, b) => {
        return Number(a.id) - Number(b.id);
      });
      const states = data.states.sort((a, b) => {
        return Number(a.id) - Number(b.id);
      });
      const cities = data.cities;

      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkInsert('countries', countries, {
          transaction,
        });

        await queryInterface.bulkInsert('states', states, { transaction });

        await queryInterface.bulkInsert('cities', cities, { transaction });
      });
    } catch (error) {
      console.error('Error seeding world tables:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('cities', null, { transaction });

        await queryInterface.bulkDelete('states', null, { transaction });

        await queryInterface.bulkDelete('countries', null, { transaction });
      });
    } catch (error) {
      console.error('Error reverting world tables:', error.message);
      throw error;
    }
  },
};
