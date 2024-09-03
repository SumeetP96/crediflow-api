import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Customer } from './customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    UtilsProvider,
  ],
})
export class CustomersModule {}
