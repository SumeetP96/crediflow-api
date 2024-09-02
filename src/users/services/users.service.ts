import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions, FindOptions, UpdateOptions } from 'sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';

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

  async findAll(options?: FindOptions): Promise<User[]> {
    return await this.userModel.findAll(options);
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

  async softDelete(id: number, options?: UpdateOptions): Promise<User> {
    await this.userModel.update(
      { status: 'deleted', deletedAt: new Date() },
      {
        where: { id },
        ...(options || {}),
      },
    );
    return await this.findById(id);
  }

  async restoreDeleted(id: number, options?: UpdateOptions): Promise<User> {
    await this.userModel.update(
      { status: 'active', deletedAt: null },
      {
        where: { id },
        ...(options || {}),
      },
    );
    return await this.findById(id);
  }
}
