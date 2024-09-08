import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Transaction as SequelizeTransaction,
  UpdateOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoiceStatus } from 'src/invoices/invoices.interfaces';
import { TransactionType } from 'src/transaction-types/entities/transaction-type.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    private sequelize: Sequelize,
  ) {}

  async settleTransactionWithInovice(
    invoiceId: number,
    amount: number,
    transaction: SequelizeTransaction,
  ): Promise<void> {
    const invoice = await this.invoiceModel.findByPk(invoiceId, {
      transaction,
    });

    const balance = invoice.balance - amount;

    const isFullyPaid = balance === 0;

    const status = isFullyPaid
      ? InvoiceStatus.PAID
      : invoice.status === InvoiceStatus.PAID
        ? InvoiceStatus.UNPAID
        : invoice.status;

    await this.invoiceModel.update(
      { balance, status },
      {
        where: {
          id: invoiceId,
        },
        transaction,
      },
    );
  }

  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto,
    options?: CreateOptions,
  ): Promise<Transaction> {
    return this.sequelize.transaction(async (transaction) => {
      const { invoiceId, amount } = createTransactionDto;

      await this.settleTransactionWithInovice(invoiceId, amount, transaction);

      const newTransaction = await this.transactionModel.create<Transaction>(
        {
          userId,
          isPartOfInvoice: false,
          ...createTransactionDto,
        },
        options,
      );

      return newTransaction;
    });
  }

  async findAll(options?: FindOptions): Promise<Transaction[]> {
    return await this.transactionModel.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<Transaction> {
    return await this.transactionModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    options?: UpdateOptions,
  ): Promise<Transaction> {
    return this.sequelize.transaction(async (transaction) => {
      const { invoiceId, amount } = updateTransactionDto;

      await this.settleTransactionWithInovice(invoiceId, amount, transaction);

      await this.transactionModel.update<Transaction>(updateTransactionDto, {
        where: {
          id,
        },
        ...(options || {}),
      });

      return this.findById(id, {
        include: TransactionType,
      });
    });
  }

  async remove(id: number, options?: DestroyOptions): Promise<Transaction> {
    const transaction = await this.findById(id);
    await this.transactionModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return transaction;
  }
}
