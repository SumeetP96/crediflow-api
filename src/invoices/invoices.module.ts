import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { InvoiceCategory } from 'src/invoice-categories/entities/invoice-category.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { InvoiceRelation } from './entities/invoice-relations.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Invoice]),
    SequelizeModule.forFeature([InvoiceRelation]),
    SequelizeModule.forFeature([InvoiceCategory]),
    SequelizeModule.forFeature([Transaction]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, UtilsProvider],
})
export class InvoicesModule {}
