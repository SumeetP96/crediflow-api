import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { AgentsService } from './agents.service';
import { CreateAgentDto, createAgentSchema } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createAgentSchema }))
  @UseFilters(AllExceptionsFilter)
  @Post()
  async create(@Body() createAgentDto: CreateAgentDto) {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.create(createAgentDto),
      'Agent created',
    );
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.findAll(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.findById(id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.update(id, updateAgentDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.remove(id),
    );
  }

  @Post('restore/:id')
  async restore(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.agentsService.restore(id),
    );
  }
}
