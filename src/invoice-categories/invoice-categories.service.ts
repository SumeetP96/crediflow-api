import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { CreateInvoiceCategoryDto } from './dto/create-invoice-category.dto';
import { UpdateInvoiceCategoryDto } from './dto/update-invoice-category.dto';
import { InvoiceCategory } from './entities/invoice-category.entity';

@Injectable()
export class InvoiceCategoriesService {
  constructor(
    @InjectModel(InvoiceCategory)
    private invoiceCategoryModel: typeof InvoiceCategory,
  ) {}

  async create(
    createInvoiceCategoryDto: CreateInvoiceCategoryDto,
    options?: CreateOptions,
  ) {
    return await this.invoiceCategoryModel.create(
      createInvoiceCategoryDto,
      options,
    );
  }

  async findAll(options?: FindOptions): Promise<InvoiceCategory[]> {
    return await this.invoiceCategoryModel.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<InvoiceCategory> {
    return await this.invoiceCategoryModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateInvoiceCategoryDto: UpdateInvoiceCategoryDto,
    options?: UpdateOptions,
  ): Promise<InvoiceCategory> {
    await this.invoiceCategoryModel.update(updateInvoiceCategoryDto, {
      where: { id },
      ...(options || {}),
    });
    return this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions): Promise<InvoiceCategory> {
    const invoiceCategory = await this.findById(id);
    await this.invoiceCategoryModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return invoiceCategory;
  }

  async restore(
    id: number,
    options?: RestoreOptions,
  ): Promise<InvoiceCategory> {
    await this.invoiceCategoryModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
