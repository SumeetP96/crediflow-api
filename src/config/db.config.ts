import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as Joi from 'joi';

export interface IDatabaseConfig {
  postgres: SequelizeModuleOptions;
}

export const dbValidationSchema = {
  PG_DB_HOST: Joi.string().required(),
  PG_DB_PORT: Joi.number().required(),
  PG_DB_USERNAME: Joi.string().required(),
  PG_DB_PASSWORD: Joi.string().allow(''),
  PG_DB_NAME: Joi.string().required(),
};

const { env } = process;
export default (): IDatabaseConfig => ({
  postgres: {
    dialect: 'postgres',
    host: env.PG_DB_HOST,
    port: parseInt(env.PG_DB_PORT, 10) || 5432,
    username: env.PG_DB_USERNAME,
    password: env.PG_DB_PASSWORD,
    database: env.PG_DB_NAME,
  },
});
