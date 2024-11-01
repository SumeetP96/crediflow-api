import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { InvoiceCategory } from './entities/invoice-category.entity';
import { InvoiceCategoriesController } from './invoice-categories.controller';
import { InvoiceCategoriesService } from './invoice-categories.service';

@Module({
  imports: [
    InvoicesModule,
    SequelizeModule.forFeature([InvoiceCategory, Invoice]),
  ],
  controllers: [InvoiceCategoriesController],
  providers: [InvoiceCategoriesService, UtilsProvider],
})
export class InvoiceCategoriesModule {}
