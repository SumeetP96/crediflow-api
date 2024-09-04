import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { InvoiceRelation } from './entities/invoice-relations.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Invoice]),
    SequelizeModule.forFeature([InvoiceRelation]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, UtilsProvider],
})
export class InvoicesModule {}
