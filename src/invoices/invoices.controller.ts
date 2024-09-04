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
  CreateInvoiceDto,
  createInvoiceSchema,
} from './dto/create-invoice.dto';
import {
  UpdateInvoiceDto,
  updateInvoiceSchema,
} from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createInvoiceSchema }))
  @UseFilters(AllExceptionsFilter)
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.findAll(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.findById(id),
    );
  }

  @UsePipes(new ZodValidationPipe({ body: updateInvoiceSchema }))
  @UseFilters(AllExceptionsFilter)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoicesService.update(id, updateInvoiceDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}
