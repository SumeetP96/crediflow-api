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
import { EAgentStatus } from '../agents.types';

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

  @Default(EAgentStatus.ACTIVE)
  @Column(DataType.ENUM(EAgentStatus.ACTIVE, EAgentStatus.IN_ACTIVE))
  status: EAgentStatus;

  // Relations

  @BelongsTo(() => Agent, 'parentId')
  parent: Agent;

  @HasMany(() => InvoiceRelation)
  invoiceRelations: InvoiceRelation[];
}
