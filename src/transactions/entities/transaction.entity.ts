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
import { TransactionStatus } from '../transactions.interfaces';

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

  @Column
  date: Date;

  @Column(DataType.FLOAT)
  amount: number;

  @Default(0)
  @Column
  displayIndex: number;

  @Column
  isPartOfInvoice: boolean;

  @AllowNull
  @Column(DataType.TEXT)
  remarks: string;

  @Column({
    type: DataType.ENUM(
      TransactionStatus.COMPLETE,
      TransactionStatus.PROCESSING,
      TransactionStatus.ON_HOLD,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELLED,
    ),
  })
  status: TransactionStatus;

  // Relations

  @BelongsTo(() => TransactionType, 'transactionTypeId')
  transactionType: TransactionType;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;

  @BelongsTo(() => User, 'userId')
  user: User;
}
