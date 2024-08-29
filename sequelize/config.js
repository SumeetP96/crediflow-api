'use strict';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

module.exports = {
  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
  host: process.env.PG_DB_HOST,
  port: process.env.PG_DB_PORT,
  dialect: 'postgres',
};
