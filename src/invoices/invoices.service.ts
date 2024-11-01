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
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Customer } from 'src/customers/entities/customer.entity';
import { InvoiceCategory } from 'src/invoice-categories/entities/invoice-category.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FindAllInvoicesSchema } from './dto/find-all-invoices.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRelation } from './entities/invoice-relations.entity';
import { Invoice } from './entities/invoice.entity';
import { EInvoiceStatus } from './invoices.types';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    @InjectModel(InvoiceRelation)
    private invoiceRelationModel: typeof InvoiceRelation,
    @InjectModel(InvoiceCategory)
    private invoiceCategoryModel: typeof InvoiceCategory,
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    private sequelize: Sequelize,
    private readonly utilsProvider: UtilsProvider,
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
          status: EInvoiceStatus.UNPAID,
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

  async findAllWithCount(
    query: FindAllInvoicesSchema,
    options?: FindOptions,
  ): Promise<{ count: number; rows: Invoice[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<Invoice>(
        'Invoice',
        query,
        [
          { field: 'id', matchType: 'exact' },
          { field: 'status', matchType: 'exact' },
          { field: 'createdAt', matchType: 'date' },
          { field: 'updatedAt', matchType: 'date' },
        ],
      );

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<Invoice>(
        'Invoice',
        query.search,
        [
          {
            field: 'name' as keyof Invoice,
            queryKey: 'customerName',
            matchType: 'fuzzy',
            alias: 'customer',
          },
          { field: 'amount', matchType: 'fuzzy-from-number' },
        ],
      );

    const where = this.utilsProvider.queryBuilder.joinWhereClauses('and', [
      filterClauses,
      searchClauses,
    ]);

    const order = this.utilsProvider.queryBuilder.orderByField<Invoice>(
      ['createdAt', 'desc'],
      [query.sortBy as keyof Invoice, query.sortOrder],
    );

    const [offset, limit] = this.utilsProvider.queryBuilder.pagination(
      query.page,
      query.perPage,
    );

    return await this.invoiceModel.findAndCountAll({
      include: [
        {
          model: Customer,
          attributes: ['id', 'name'],
          as: 'customer',
        },
        {
          model: User,
          attributes: ['id', 'name'],
          as: 'user',
        },
      ],
      where,
      order,
      offset,
      limit,
      ...(options || {}),
    });
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
          status: EInvoiceStatus.UNPAID,
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
    const invoiceTransactionsCount = await this.transactionModel.count({
      where: {
        invoiceId: id,
      },
    });

    if (invoiceTransactionsCount > 0) {
      throw new Error('Transactions exist for this invoice.');
    }

    const invoice = await this.findById(id);

    await this.invoiceModel.destroy({
      where: { id },
      ...(options || {}),
    });

    return invoice;
  }
}
