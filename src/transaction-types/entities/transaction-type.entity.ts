import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionTypeStatus } from '../transaction-types.interfaces';

@Table({
  tableName: 'transaction_types',
})
export class TransactionType extends Model {
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @Column
  isDeduction: boolean;

  @Default(TransactionTypeStatus.ACTIVE)
  @Column(
    DataType.ENUM(
      TransactionTypeStatus.ACTIVE,
      TransactionTypeStatus.IN_ACTIVE,
    ),
  )
  status: TransactionTypeStatus;

  // Relations

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
