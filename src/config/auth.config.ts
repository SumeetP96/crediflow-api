import * as Joi from 'joi';

export interface IAuthConfig {
  jwtSecret: string;
  authExpiry: string | number;
  bcryptSaltRounds: number;
  authCookie: string;
}

export const authValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(12).required(),
  AUTH_EXPIRY: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  AUTH_COOKIE: Joi.string().required(),
};

const { env } = process;

export default (): IAuthConfig => ({
  jwtSecret: env.JWT_SECRET,
  bcryptSaltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10),
  authExpiry: env.AUTH_EXPIRY,
  authCookie: env.AUTH_COOKIE,
});
