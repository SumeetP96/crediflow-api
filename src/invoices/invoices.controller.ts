import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import {
  CreateInvoiceDto,
  createInvoiceSchema,
} from './dto/create-invoice.dto';
import {
  UpdateInvoiceDto,
  updateInvoiceSchema,
} from './dto/update-invoice.dto';
import { InvoiceRelation } from './entities/invoice-relations.entity';
import { InvoicesService } from './invoices.service';

@UseFilters(AllExceptionsFilter)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createInvoiceSchema }))
  @Post()
  async create(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoicesService.create(
      parseInt(req.user.id, 10),
      createInvoiceDto,
    );
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.findAll(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.findById(parseInt(id, 10), {
        include: InvoiceRelation,
      }),
    );
  }

  @UsePipes(new ZodValidationPipe({ body: updateInvoiceSchema }))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.update(Number(id), updateInvoiceDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(Number(id));
  }
}
