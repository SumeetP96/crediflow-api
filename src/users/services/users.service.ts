import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  Op,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllUsersQuery } from '../dto/find-all-users-query-dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    options?: CreateOptions,
  ): Promise<User> {
    createUserDto.password = await this.utilsProvider.bcrypt.hashPassword(
      createUserDto.password,
    );
    return await this.userModel.create(createUserDto, options);
  }

  async findAllWithCount(
    query: FindAllUsersQuery,
    options?: FindAndCountOptions,
  ): Promise<{ count: number; rows: User[] }> {
    const where = {};

    if (query.roles?.length) {
      where['role'] = { [Op.in]: query.roles };
    }

    if (query.status && query.status !== 'all') {
      where['status'] = query.status;
    }

    if (query.search) {
      where[Op.or] = ['name', 'username'].map((field) => ({
        [field]: { [Op.like]: `%${query.search}%` },
      }));
    }

    const order = [];

    if (
      query.sortBy &&
      ['asc', 'desc'].includes(query.sortOrder.toLowerCase())
    ) {
      order.push([query.sortBy, query.sortOrder]);
    } else {
      order.push(['username', 'asc']);
    }

    return await this.userModel.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order,
      offset: query.page * query.perPage,
      limit: query.perPage,
      ...(options || {}),
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: { username },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    options?: UpdateOptions,
  ): Promise<User> {
    await this.userModel.update(updateUserDto, {
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }

  async delete(id: number, options?: DestroyOptions): Promise<User> {
    const user = await this.findById(id);
    await this.userModel.destroy({
      where: { id },
      ...(options || {}),
    });
    return user;
  }

  async restore(id: number, options?: RestoreOptions): Promise<User> {
    await this.userModel.restore({
      where: { id },
      ...(options || {}),
    });
    return await this.findById(id);
  }
}
