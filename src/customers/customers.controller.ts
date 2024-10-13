import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import {
  CreateCustomerDto,
  createCustomerSchema,
} from './dto/create-customer.dto';
import {
  FindAllCustomersQuery,
  findAllCustomersSchema,
} from './dto/find-all-customers-query-dto';
import {
  UpdateCustomerDto,
  updateCustomerSchema,
} from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';

@UseFilters(AllExceptionsFilter)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe({ body: createCustomerSchema }))
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.create(createCustomerDto),
      'Customer created',
    );
  }

  @Get()
  @UsePipes(new ZodValidationPipe({ query: findAllCustomersSchema }))
  async findAll(@Query() query: FindAllCustomersQuery) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.findAllWithCount(query),
    );
  }

  @Get('/options')
  async options() {
    console.log('here');
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.options(),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.findById(id, {
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'contactNumbers', 'addresses'],
          },
        ],
      }),
    );
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe({ body: updateCustomerSchema }))
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.update(id, updateCustomerDto),
      'Customer updated',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.remove(id),
    );
  }

  @Post('restore/:id')
  async restore(@Param('id') id: number) {
    return this.utilsProvider.responseBuilder.success(
      await this.customersService.restore(id),
    );
  }
}
