import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig, { appValidationSchema } from './config/app.config';
import dbConfig, { dbValidationSchema } from './config/db.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ...appValidationSchema,
        ...dbValidationSchema,
      }),
      load: [appConfig, dbConfig],
    }),
    // Databases
    SequelizeModule.forRoot(dbConfig().postgres),
    // Modules
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
