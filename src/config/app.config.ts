import * as Joi from 'joi';

interface AppConfig {
  env: string;
  port: number;
}

export const appValidationSchema = {
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  NODE_PORT: Joi.number().port().required(),
};

const { env } = process;

export default (): AppConfig => ({
  env: env.NODE_ENV,
  port: parseInt(env.NODE_PORT, 10) || 3000,
});
