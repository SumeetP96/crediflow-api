import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { TransactionType } from 'src/transaction-types/entities/transaction-type.entity';
import {
  CreateTransactionDto,
  createTransactionSchema,
} from './dto/create-transaction.dto';
import {
  UpdateTransactionDto,
  updateTransactionSchema,
} from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@UseFilters(AllExceptionsFilter)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createTransactionSchema }))
  @Post()
  async create(@Req() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionsService.create(
        parseInt(req.user.id, 10),
        createTransactionDto,
      ),
    );
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionsService.findAll(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionsService.findById(parseInt(id, 10), {
        include: TransactionType,
      }),
    );
  }

  @UsePipes(new ZodValidationPipe({ body: updateTransactionSchema }))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionsService.update(
        parseInt(id, 10),
        updateTransactionDto,
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.transactionsService.remove(parseInt(id, 10)),
    );
  }
}
