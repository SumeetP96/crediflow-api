import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { CreateInvoiceCategoryDto } from './dto/create-invoice-category.dto';
import { FindAllInvoiceCategoriesQuery } from './dto/find-all-invoice-categories-query.dto';
import { UpdateInvoiceCategoryDto } from './dto/update-invoice-category.dto';
import { InvoiceCategory } from './entities/invoice-category.entity';

@Injectable()
export class InvoiceCategoriesService {
  constructor(
    @InjectModel(InvoiceCategory)
    private invoiceCategoryModel: typeof InvoiceCategory,
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    private readonly utilsProvider: UtilsProvider,
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

  async findAllWithCount(
    query: FindAllInvoiceCategoriesQuery,
    options?: FindOptions,
  ): Promise<{ count: number; rows: InvoiceCategory[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<InvoiceCategory>(
        'InvoiceCategory',
        query,
        [
          { field: 'id', matchType: 'exact' },
          { field: 'name', matchType: 'fuzzy' },
          { field: 'prefix', matchType: 'fuzzy' },
          { field: 'suffix', matchType: 'fuzzy' },
          { field: 'description', matchType: 'fuzzy' },
          { field: 'isAutoIncrement', matchType: 'yes-no-boolean' },
          { field: 'status', matchType: 'exact' },
          { field: 'createdAt', matchType: 'date' },
          { field: 'updatedAt', matchType: 'date' },
        ],
      );

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<InvoiceCategory>(
        'InvoiceCategory',
        query.search,
        [
          { field: 'name', matchType: 'fuzzy' },
          { field: 'prefix', matchType: 'fuzzy' },
          { field: 'suffix', matchType: 'fuzzy' },
          { field: 'description', matchType: 'fuzzy' },
        ],
      );

    const where = this.utilsProvider.queryBuilder.joinWhereClauses('and', [
      filterClauses,
      searchClauses,
    ]);

    const order = this.utilsProvider.queryBuilder.orderByField<InvoiceCategory>(
      ['createdAt', 'desc'],
      [query.sortBy as keyof InvoiceCategory, query.sortOrder],
    );

    const [offset, limit] = this.utilsProvider.queryBuilder.pagination(
      query.page,
      query.perPage,
    );

    return await this.invoiceCategoryModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
      ...(options || {}),
    });
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
    const invoicesWithCategory = await this.invoiceModel.findOne({
      where: { invoiceCategoryId: id },
    });

    if (invoicesWithCategory) {
      throw new Error('Cannot delete Invoice Category because it has Invoices');
    }

    const invoiceCategory = await this.findById(id);

    await this.invoiceCategoryModel.destroy({
      where: { id },
      ...(options || {}),
    });

    return invoiceCategory;
  }
}
