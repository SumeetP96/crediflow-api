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
import {
  CreateTransactionTypeDto,
  createTransactionTypeSchema,
} from './dto/create-transaction-type.dto';
import {
  UpdateTransactionTypeDto,
  updateTransactionTypeSchema,
} from './dto/update-transaction-type.dto';
import { TransactionTypesService } from './transaction-types.service';

@UseFilters(AllExceptionsFilter)
@Controller('transaction-types')
export class TransactionTypesController {
  constructor(
    private readonly transactionTypesService: TransactionTypesService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createTransactionTypeSchema }))
  @Post()
  async create(@Body() createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.create(createTransactionTypeDto),
    );
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.findAll(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.findById(id),
    );
  }

  @UsePipes(new ZodValidationPipe({ body: updateTransactionTypeSchema }))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTransactionTypeDto: UpdateTransactionTypeDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.update(id, updateTransactionTypeDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.remove(id),
    );
  }

  @Post('restore/:id')
  async restore(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionTypesService.restore(id),
    );
  }
}
