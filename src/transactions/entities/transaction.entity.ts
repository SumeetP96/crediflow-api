import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { TransactionType } from 'src/transaction-types/entities/transaction-type.entity';
import { User } from 'src/users/entities/user.entity';
import { ETransactionStatus } from '../transactions.types';

@Table({
  tableName: 'transactions',
})
export class Transaction extends Model {
  @ForeignKey(() => TransactionType)
  @Column
  transactionTypeId: number;

  @ForeignKey(() => Invoice)
  @Column
  invoiceId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.DATE)
  date: Date;

  @Column(DataType.FLOAT)
  amount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  displayIndex: number;

  @Column(DataType.BOOLEAN)
  isPartOfInvoice: boolean;

  @AllowNull
  @Column(DataType.TEXT)
  remarks: string;

  @Column(
    DataType.ENUM(
      ETransactionStatus.COMPLETED,
      ETransactionStatus.PROCESSING,
      ETransactionStatus.ON_HOLD,
      ETransactionStatus.FAILED,
      ETransactionStatus.CANCELLED,
    ),
  )
  status: ETransactionStatus;

  // Relations

  @BelongsTo(() => TransactionType, 'transactionTypeId')
  transactionType: TransactionType;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;

  @BelongsTo(() => User, 'userId')
  user: User;
}
