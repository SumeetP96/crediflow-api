import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { InvoiceCategory } from './entities/invoice-category.entity';
import { InvoiceCategoriesController } from './invoice-categories.controller';
import { InvoiceCategoriesService } from './invoice-categories.service';

@Module({
  imports: [SequelizeModule.forFeature([InvoiceCategory])],
  controllers: [InvoiceCategoriesController],
  providers: [InvoiceCategoriesService, UtilsProvider],
})
export class InvoiceCategoriesModule {}
