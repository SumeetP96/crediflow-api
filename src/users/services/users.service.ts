import { BadRequestException, Injectable } from '@nestjs/common';
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
    const existingCount = await this.userModel.count({
      where: { username: createUserDto.username },
    });

    if (existingCount) {
      throw new BadRequestException(
        this.utilsProvider.zod.customFieldIssue<User>(
          'username',
          'Username already in use',
          'Validation Error',
        ),
      );
    }

    createUserDto.password = await this.utilsProvider.bcrypt.hashPassword(
      createUserDto.password,
    );
    return await this.userModel.create(createUserDto, options);
  }

  async findAllWithCount(
    query: FindAllUsersQuery,
    options?: FindAndCountOptions,
  ): Promise<{ count: number; rows: User[] }> {
    const filterClauses =
      this.utilsProvider.queryBuilder.whereClausesFromFilters<User>(query, [
        { field: 'id', matchType: 'exact' },
        { field: 'name', matchType: 'fuzzy' },
        { field: 'username', matchType: 'fuzzy' },
        { field: 'role', matchType: 'multiple' },
        { field: 'status', matchType: 'exact' },
        { field: 'createdAt', matchType: 'date' },
        { field: 'updatedAt', matchType: 'date' },
        { field: 'deletedAt', matchType: 'date' },
      ]);

    const searchClauses =
      this.utilsProvider.queryBuilder.whereClausesFromSearch<User>(
        query.search,
        ['name', 'username'],
      );

    const where = this.utilsProvider.queryBuilder.joinWhereClauses('and', [
      filterClauses,
      searchClauses,
    ]);

    const order = this.utilsProvider.queryBuilder.orderByField<User>(
      ['createdAt', 'desc'],
      [query.sortBy as keyof User, query.sortOrder],
    );

    const [offset, limit] = this.utilsProvider.queryBuilder.pagination(
      query.page,
      query.perPage,
    );

    return await this.userModel.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order,
      offset,
      limit,
      ...(options || {}),
      paranoid: query.isDeletedShown === 'yes',
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findByPk(id, { paranoid: false });
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
    const existingCount = await this.userModel.count({
      where: { id: { [Op.ne]: id }, username: updateUserDto.username },
    });

    if (existingCount) {
      throw new BadRequestException(
        this.utilsProvider.zod.customFieldIssue<User>(
          'username',
          'Username already in use',
          'Validation Error',
        ),
      );
    }

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
