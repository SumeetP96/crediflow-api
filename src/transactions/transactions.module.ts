import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction]),
    SequelizeModule.forFeature([Invoice]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, UtilsProvider],
})
export class TransactionsModule {}
