import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { Agent } from './entities/agent.entity';

@Module({
  imports: [SequelizeModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [AgentsService, UtilsProvider],
})
export class AgentsModule {}
