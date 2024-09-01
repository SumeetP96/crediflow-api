import * as Joi from 'joi';

interface AuthConfig {
  jwtSecret: string;
  jwtExpiry: string | number;
  bcryptSaltRounds: number;
}

export const authValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(12).required(),
};

const { env } = process;

export default (): AuthConfig => ({
  jwtSecret: env.JWT_SECRET,
  jwtExpiry: env.JWT_EXPIRY,
  bcryptSaltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10),
});
