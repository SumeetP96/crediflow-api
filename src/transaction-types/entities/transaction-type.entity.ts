import { AllowNull, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Table({
  tableName: 'transaction_types',
  paranoid: true,
})
export class TransactionType extends Model {
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @Column
  isDeduction: boolean;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
