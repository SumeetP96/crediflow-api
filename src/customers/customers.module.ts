import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService, UtilsProvider],
})
export class CustomersModule {}
