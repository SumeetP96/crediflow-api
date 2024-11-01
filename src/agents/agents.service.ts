import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { Customer } from 'src/customers/entities/customer.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { FindAllAgentsQuery } from './dto/find-all-agents-query-dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent)
    private agentModel: typeof Agent,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  async create(
    createAgentDto: CreateAgentDto,
    options?: CreateOptions,
  ): Promise<Agent> {
    return await this.agentModel.create(createAgentDto, options);
  }

  async findAllWithCount(
    query: FindAllAgentsQuery,
    options?: FindOptions,
  ): Promise<{ count: number; rows: Agent[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<Agent>(
        'Agent',
        query,
        [
          { field: 'id', matchType: 'exact' },
          { field: 'name', matchType: 'fuzzy' },
          {
            field: 'name',
            matchType: 'fuzzy',
            queryKey: 'parentName',
            alias: 'parent',
          },
          { field: 'contactNumbers', matchType: 'fuzzy-from-array' },
          { field: 'addresses', matchType: 'fuzzy-from-array' },
          { field: 'status', matchType: 'exact' },
          { field: 'createdAt', matchType: 'date' },
          { field: 'updatedAt', matchType: 'date' },
          { field: 'deletedAt', matchType: 'date' },
        ],
      );

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<Agent>(
        'Agent',
        query.search,
        [
          { field: 'name', matchType: 'fuzzy', alias: 'parent' },
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

    return await this.agentModel.findAndCountAll({
      include: {
        model: Agent,
        attributes: ['id', 'name'],
        required: false,
      },
      where,
      order,
      offset,
      limit,
      ...(options || {}),
      paranoid: query.isDeletedShown !== 'yes',
    });
  }

  async findById(id: number, options?: FindOptions): Promise<Agent> {
    return await this.agentModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateAgentDto: UpdateAgentDto,
    options?: UpdateOptions,
  ): Promise<Agent> {
    await this.agentModel.update(updateAgentDto, {
      where: { id },
      ...(options || {}),
    });
    return this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions): Promise<Agent> {
    const agent = await this.findById(id);
    await this.agentModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return agent;
  }

  async restore(id: number, options?: RestoreOptions): Promise<Agent> {
    await this.agentModel.restore({
      where: { id },
      ...(options || {}),
    });
    return this.findById(id);
  }
}
