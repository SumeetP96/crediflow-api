import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { InvoiceRelation } from 'src/invoices/entities/invoice-relations.entity';
import { AgentsStatus } from '../agents.interfaces';

@Table({
  tableName: 'agents',
  paranoid: true,
})
export class Agent extends Model {
  @AllowNull
  @ForeignKey(() => Agent)
  @Column
  parentId: number;

  @Column
  name: string;

  @AllowNull
  @Column(DataType.ARRAY(DataType.STRING))
  contactNumbers: string[];

  @AllowNull
  @Column(DataType.ARRAY(DataType.TEXT))
  addresses: string[];

  @Default(AgentsStatus.ACTIVE)
  @Column(DataType.ENUM(AgentsStatus.ACTIVE, AgentsStatus.IN_ACTIVE))
  status: AgentsStatus;

  // Relations

  @BelongsTo(() => Agent, 'parentId')
  parent: Agent;

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
