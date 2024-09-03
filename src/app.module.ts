import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtilsProvider } from './common/utils/utils.provider';
import appConfig, { appValidationSchema } from './config/app.config';
import authConfig, { authValidationSchema } from './config/auth.config';
import dbConfig, { dbValidationSchema } from './config/db.config';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';

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
    // Throttling
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    // Modules
    UsersModule,
    AuthModule,
    CustomersModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    UtilsProvider,
  ],
  exports: [UtilsProvider],
})
export class AppModule {}
