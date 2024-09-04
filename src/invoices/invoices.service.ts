import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  UpdateOptions,
} from 'sequelize';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    options?: CreateOptions,
  ): Promise<Invoice> {
    return await this.invoiceModel.create(createInvoiceDto, options);
  }

  async findAll(options?: FindOptions): Promise<Invoice[]> {
    return await this.invoiceModel.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<Invoice> {
    return await this.invoiceModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
    options?: UpdateOptions,
  ): Promise<Invoice> {
    await this.invoiceModel.update(updateInvoiceDto, {
      where: { id },
      ...(options || {}),
    });
    return this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions) {
    const invoice = await this.findById(id);
    await this.invoiceModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return invoice;
  }
}
