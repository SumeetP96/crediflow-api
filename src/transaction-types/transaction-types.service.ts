import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import { TransactionType } from './entities/transaction-type.entity';

@Injectable()
export class TransactionTypesService {
  constructor(
    @InjectModel(TransactionType)
    private transactionTypeModel: typeof TransactionType,
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

  async findAll(options?: FindOptions): Promise<TransactionType[]> {
    return await this.transactionTypeModel.findAll(options);
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
    const transactionType = await this.findById(id);
    await this.transactionTypeModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return transactionType;
  }

  async restore(
    id: number,
    options?: RestoreOptions,
  ): Promise<TransactionType> {
    await this.transactionTypeModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
