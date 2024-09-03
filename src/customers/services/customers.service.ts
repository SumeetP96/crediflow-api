import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    options?: CreateOptions,
  ): Promise<Customer> {
    return await this.customerModel.create(createCustomerDto, options);
  }

  async findAll(options?: FindOptions): Promise<Customer[]> {
    return await this.customerModel.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<Customer> {
    return await this.customerModel.findByPk(id, options);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    options?: UpdateOptions,
  ): Promise<Customer> {
    await this.customerModel.update(updateCustomerDto, {
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }

  async remove(id: number, options?: DestroyOptions) {
    const customer = await this.findById(id);
    await this.customerModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return customer;
  }

  async restore(id: number, options?: RestoreOptions): Promise<Customer> {
    await this.customerModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
