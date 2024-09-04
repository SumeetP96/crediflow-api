import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent)
    private agentModel: typeof Agent,
  ) {}

  async create(
    createAgentDto: CreateAgentDto,
    options?: CreateOptions,
  ): Promise<Agent> {
    return await this.agentModel.create(createAgentDto, options);
  }

  async findAll(options?: FindOptions): Promise<Agent[]> {
    return await this.agentModel.findAll(options);
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
