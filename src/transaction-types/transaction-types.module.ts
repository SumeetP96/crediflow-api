import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionTypesController } from './transaction-types.controller';
import { TransactionTypesService } from './transaction-types.service';

@Module({
  imports: [
    TransactionsModule,
    SequelizeModule.forFeature([TransactionType, Transaction]),
  ],
  controllers: [TransactionTypesController],
  providers: [TransactionTypesService, UtilsProvider],
})
export class TransactionTypesModule {}
