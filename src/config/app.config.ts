import * as Joi from 'joi';

export interface IAppConfig {
  env: string;
  port: number;
  clientOrigin: string;
}

export const appValidationSchema = {
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  NODE_PORT: Joi.number().port().required(),
  CLIENT_ORIGIN: Joi.string().required(),
};

const { env } = process;

export default (): IAppConfig => ({
  env: env.NODE_ENV,
  port: parseInt(env.NODE_PORT, 10) || 3000,
  clientOrigin: env.CLIENT_ORIGIN,
});
