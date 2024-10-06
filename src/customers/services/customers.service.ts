import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { FindAllCustomersQuery } from '../dto/find-all-customers-query-dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    private readonly utilsProvider: UtilsProvider,
  ) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    options?: CreateOptions,
  ): Promise<Customer> {
    return await this.customerModel.create(createCustomerDto, options);
  }

  async findAllWithCount(
    query: FindAllCustomersQuery,
    options?: FindAndCountOptions,
  ): Promise<{ count: number; rows: Customer[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<Customer>(query, [
        { field: 'id', matchType: 'exact' },
        { field: 'name', matchType: 'fuzzy' },
        { field: 'contactNumbers', matchType: 'fuzzy-from-array' },
        { field: 'addresses', matchType: 'fuzzy-from-array' },
        { field: 'isReseller', matchType: 'exact' },
        { field: 'status', matchType: 'exact' },
        { field: 'createdAt', matchType: 'date' },
        { field: 'updatedAt', matchType: 'date' },
        { field: 'deletedAt', matchType: 'date' },
      ]);

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<Customer>(
        query.search,
        [
          { field: 'name', matchType: 'fuzzy' },
          { field: 'contactNumbers', matchType: 'fuzzy-from-array' },
          { field: 'addresses', matchType: 'fuzzy-from-array' },
        ],
      );

    const where = this.utilsProvider.queryBuilder.joinWhereClauses('and', [
      filterClauses,
      searchClauses,
    ]);

    const order = this.utilsProvider.queryBuilder.orderByField<Customer>(
      ['createdAt', 'desc'],
      [query.sortBy as keyof Customer, query.sortOrder],
    );

    const [offset, limit] = this.utilsProvider.queryBuilder.pagination(
      query.page,
      query.perPage,
    );

    return await this.customerModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
      ...(options || {}),
      paranoid: query.isDeletedShown === 'yes',
    });
  }

  async findById(id: number, options?: FindOptions): Promise<Customer> {
    return await this.customerModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    options?: UpdateOptions,
  ): Promise<Customer> {
    await this.customerModel.update(updateCustomerDto, {
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions) {
    const customer = await this.findById(id);
    await this.customerModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return customer;
  }

  async restore(id: number, options?: RestoreOptions): Promise<Customer> {
    await this.customerModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
