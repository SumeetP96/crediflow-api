import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionTypesController } from './transaction-types.controller';
import { TransactionTypesService } from './transaction-types.service';

@Module({
  imports: [SequelizeModule.forFeature([TransactionType])],
  controllers: [TransactionTypesController],
  providers: [TransactionTypesService, UtilsProvider],
})
export class TransactionTypesModule {}
