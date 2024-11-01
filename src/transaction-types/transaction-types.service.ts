import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { FindAllTransactionTypesQuery } from './dto/find-all-transaction-types.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import { TransactionType } from './entities/transaction-type.entity';

@Injectable()
export class TransactionTypesService {
  constructor(
    @InjectModel(TransactionType)
    private transactionTypeModel: typeof TransactionType,
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  async create(
    createTransactionTypeDto: CreateTransactionTypeDto,
    options?: CreateOptions,
  ): Promise<TransactionType> {
    return await this.transactionTypeModel.create(
      createTransactionTypeDto,
      options,
    );
  }

  async findAllWithCount(
    query: FindAllTransactionTypesQuery,
    options?: FindOptions,
  ): Promise<{ count: number; rows: TransactionType[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<TransactionType>(
        'TransactionType',
        query,
        [
          { field: 'id', matchType: 'exact' },
          { field: 'name', matchType: 'fuzzy' },
          { field: 'isDeduction', matchType: 'yes-no-boolean' },
          { field: 'description', matchType: 'fuzzy' },
          { field: 'status', matchType: 'exact' },
          { field: 'createdAt', matchType: 'date' },
          { field: 'updatedAt', matchType: 'date' },
        ],
      );

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<TransactionType>(
        'TransactionType',
        query.search,
        [
          { field: 'name', matchType: 'fuzzy' },
          { field: 'description', matchType: 'fuzzy' },
        ],
      );

    const where = this.utilsProvider.queryBuilder.joinWhereClauses('and', [
      filterClauses,
      searchClauses,
    ]);

    const order = this.utilsProvider.queryBuilder.orderByField<TransactionType>(
      ['createdAt', 'desc'],
      [query.sortBy as keyof TransactionType, query.sortOrder],
    );

    const [offset, limit] = this.utilsProvider.queryBuilder.pagination(
      query.page,
      query.perPage,
    );

    return await this.transactionTypeModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
      ...(options || {}),
    });
  }

  async findById(id: number, options?: FindOptions): Promise<TransactionType> {
    return await this.transactionTypeModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateTransactionTypeDto: UpdateTransactionTypeDto,
    options?: UpdateOptions,
  ): Promise<TransactionType> {
    await this.transactionTypeModel.update(updateTransactionTypeDto, {
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions): Promise<TransactionType> {
    const transactionsWithType = await this.transactionModel.findOne({
      where: { transactionTypeId: id },
    });

    if (transactionsWithType) {
      throw new Error(
        'Cannot  delete Transaction Type because it has Transactions',
      );
    }

    const transactionType = await this.findById(id);

    await this.transactionTypeModel.destroy({
      where: { id },
      ...(options || {}),
    });

    return transactionType;
  }
}
