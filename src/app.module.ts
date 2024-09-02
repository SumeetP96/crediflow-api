import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtilsProvider } from './common/utils/utils.provider';
import appConfig, { appValidationSchema } from './config/app.config';
import authConfig, { authValidationSchema } from './config/auth.config';
import dbConfig, { dbValidationSchema } from './config/db.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ...appValidationSchema,
        ...dbValidationSchema,
        ...authValidationSchema,
      }),
      load: [appConfig, dbConfig, authConfig],
    }),
    // Databases
    SequelizeModule.forRoot({
      ...dbConfig().postgres,
      synchronize: true,
      autoLoadModels: true,
    }),
    // Modules
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtilsProvider],
  exports: [UtilsProvider],
})
export class AppModule {}
