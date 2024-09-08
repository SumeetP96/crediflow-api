import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Op,
  UpdateOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InvoiceCategory } from 'src/invoice-categories/entities/invoice-category.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRelation } from './entities/invoice-relations.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceStatus } from './invoices.interfaces';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    @InjectModel(InvoiceRelation)
    private invoiceRelationModel: typeof InvoiceRelation,
    @InjectModel(InvoiceCategory)
    private invoiceCategoryModel: typeof InvoiceCategory,
    private sequelize: Sequelize,
  ) {}

  private generateInvoiceRelations(
    invoiceId: number,
    relatedCustomerIds = [],
    relatedAgentIds = [],
  ) {
    const customerRelations = relatedCustomerIds.map((id) => ({
      invoiceId,
      customerId: id,
      agentId: null,
    }));

    const agentRelations = relatedAgentIds.map((id) => ({
      invoiceId,
      agentId: id,
      customerId: null,
    }));

    return [].concat(customerRelations, agentRelations);
  }

  async create(
    userId: number,
    createInvoiceDto: CreateInvoiceDto,
    options?: CreateOptions,
  ): Promise<Invoice> {
    return await this.sequelize.transaction(async () => {
      const { relatedCustomerIds, relatedAgentIds, ...invoiceDtoData } =
        createInvoiceDto;

      // Create new invoice
      const newInvoice = await this.invoiceModel.create(
        {
          ...invoiceDtoData,
          userId,
          balance: invoiceDtoData.amount,
          status: InvoiceStatus.UNPAID,
        },
        options,
      );

      // Increment invoice counter if catogory has `isAutoIncrement` enabled
      const invoiceCategory = await this.invoiceCategoryModel.findByPk(
        invoiceDtoData.invoiceCategoryId,
      );

      if (invoiceCategory.isAutoIncrement && invoiceCategory.nextNumber) {
        await this.invoiceCategoryModel.update(
          {
            nextNumber: invoiceCategory.nextNumber + 1,
          },
          {
            where: {
              id: invoiceDtoData.invoiceCategoryId,
            },
          },
        );
      }

      // Create invoice relations
      const invoiceRelations = this.generateInvoiceRelations(
        newInvoice.id,
        relatedCustomerIds || [],
        relatedAgentIds || [],
      );

      await this.invoiceRelationModel.bulkCreate(invoiceRelations);

      return this.findById(newInvoice.id, {
        include: InvoiceRelation,
      });
    });
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
    await this.sequelize.transaction(async () => {
      const { relatedCustomerIds, relatedAgentIds, ...invoiceDtoData } =
        updateInvoiceDto;

      // Update invoice
      await this.invoiceModel.update(
        {
          ...invoiceDtoData,
          balance: updateInvoiceDto.amount,
          status: InvoiceStatus.UNPAID,
        },
        {
          where: { id },
          ...(options || {}),
        },
      );

      // Upsert Relations
      const invoiceRelations = this.generateInvoiceRelations(
        id,
        relatedCustomerIds || [],
        relatedAgentIds || [],
      );

      for (const invoiceRelation of invoiceRelations) {
        await this.invoiceRelationModel.upsert(invoiceRelation, {
          conflictFields: ['invoice_id', 'customer_id', 'agent_id'],
        });
      }

      // Remove obsolete relations
      const existingInvoiceRelation = await this.invoiceRelationModel.findAll({
        where: { invoiceId: id },
      });

      const removableInvoiceRelationIds = [];

      existingInvoiceRelation.forEach(({ id, customerId, agentId }) => {
        if (
          (customerId && !relatedCustomerIds.includes(customerId)) ||
          (agentId && !relatedAgentIds.includes(agentId))
        ) {
          removableInvoiceRelationIds.push(id);
        }
      });

      if (removableInvoiceRelationIds.length > 0) {
        await this.invoiceRelationModel.destroy({
          where: {
            id: {
              [Op.in]: removableInvoiceRelationIds,
            },
          },
        });
      }
    });

    return await this.findById(id, {
      include: InvoiceRelation,
    });
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
