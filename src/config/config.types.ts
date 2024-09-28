import { IAppConfig } from './app.config';
import { IAuthConfig } from './auth.config';
import { IDatabaseConfig } from './db.config';

export type TConfig = IAppConfig & IAuthConfig & IDatabaseConfig;
