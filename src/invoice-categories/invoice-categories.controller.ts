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
  CreateInvoiceCategoryDto,
  createInvoiceCategorySchema,
} from './dto/create-invoice-category.dto';
import {
  UpdateInvoiceCategoryDto,
  updateInvoiceCategorySchema,
} from './dto/update-invoice-category.dto';
import { InvoiceCategoriesService } from './invoice-categories.service';

@Controller('invoice-categories')
export class InvoiceCategoriesController {
  constructor(
    private readonly invoiceCategoriesService: InvoiceCategoriesService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @UsePipes(new ZodValidationPipe({ body: createInvoiceCategorySchema }))
  @UseFilters(AllExceptionsFilter)
  @Post()
  async create(@Body() createInvoiceCategoryDto: CreateInvoiceCategoryDto) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.create(createInvoiceCategoryDto),
    );
  }

  @Get()
  async findAll() {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.findAll(),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.findById(id),
    );
  }

  @UsePipes(new ZodValidationPipe({ body: updateInvoiceCategorySchema }))
  @UseFilters(AllExceptionsFilter)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInvoiceCategoryDto: UpdateInvoiceCategoryDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.update(+id, updateInvoiceCategoryDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.remove(id),
    );
  }

  @Post('restore/:id')
  async restore(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.invoiceCategoriesService.restore(id),
    );
  }
}
